import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import { MeetingsService } from '../meetings/meetings.service';
import { AgentsService } from '../agents/agents.service';
import { TranslationsService } from '../translations/translations.service';
import { buildSystemPrompt } from './chatbot.prompts';
import { getToolDefinitions } from './chatbot.tools';
import { handleFunctionCall, FunctionServices } from './chatbot.functions';
import { GEMINI_CONFIG, validateGeminiConfig } from './chatbot.config';
import {
  retryWithBackoff,
  parseRetryDelay,
  isRateLimitError,
} from './chatbot.utils';

interface ChatSession {
  sessionId: string;
  history: Array<{
    role: 'user' | 'model' | 'function';
    parts: Array<{ text?: string; functionCall?: any; functionResponse?: any }>;
  }>;
  createdAt: Date;
  lastActivity: Date;
}

@Injectable()
export class ChatbotService implements OnModuleInit {
  private genAI: GoogleGenAI;
  private sessions: Map<string, ChatSession> = new Map();
  private ragContext: string = '';
  private requestQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
    fn: () => Promise<any>;
  }> = [];
  private isProcessingQueue = false;
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = GEMINI_CONFIG.MIN_REQUEST_INTERVAL;

  constructor(
    @Inject(forwardRef(() => MeetingsService))
    private meetingsService: MeetingsService,
    @Inject(forwardRef(() => AgentsService))
    private agentsService: AgentsService,
    private translationsService: TranslationsService,
  ) {
    validateGeminiConfig();

    if (!GEMINI_CONFIG.API_KEY) {
      console.warn('GEMINI_API_KEY not found in environment variables');
      // Don't throw error, just log warning - service will throw when used
    } else {
      try {
        this.genAI = new GoogleGenAI({ apiKey: GEMINI_CONFIG.API_KEY });
      } catch (error) {
        console.error('Failed to initialize GoogleGenAI:', error);
        // Don't throw, will be handled in sendMessage
      }
    }
  }

  async onModuleInit() {
    await this.loadRAGContext();
  }

  /**
   * Load RAG context from MD file
   */
  private async loadRAGContext(): Promise<void> {
    try {
      // In serverless environments, file paths might be different
      const possiblePaths = [
        path.join(process.cwd(), 'src', 'chatbot', 'context.md'),
        path.join(process.cwd(), 'context.md'),
        path.join(process.cwd(), 'data', 'context.md'),
        path.join(__dirname, 'context.md'), // Add __dirname as fallback
      ];

      let contextPath: string | null = null;
      for (const possiblePath of possiblePaths) {
        try {
          if (fs.existsSync(possiblePath)) {
            contextPath = possiblePath;
            break;
          }
        } catch (err) {
          // Continue to next path if this one fails
          continue;
        }
      }

      if (contextPath) {
        try {
          this.ragContext = fs.readFileSync(contextPath, 'utf-8');
          console.log(`RAG context loaded from: ${contextPath}`);
        } catch (readError) {
          console.warn(
            `Failed to read context file from ${contextPath}:`,
            readError,
          );
          this.ragContext = '';
        }
      } else {
        console.warn('No context.md file found. RAG will not be available.');
        this.ragContext = '';
      }
    } catch (error) {
      console.error('Error loading RAG context:', error);
      // Don't fail the service if RAG context can't be loaded
      this.ragContext = '';
    }
  }

  /**
   * Create or get a chat session
   */
  private getOrCreateSession(sessionId?: string): ChatSession {
    if (sessionId && this.sessions.has(sessionId)) {
      const session = this.sessions.get(sessionId)!;
      session.lastActivity = new Date();
      return session;
    }

    const newSessionId = sessionId || this.generateSessionId();
    const newSession: ChatSession = {
      sessionId: newSessionId,
      history: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.sessions.set(newSessionId, newSession);
    return newSession;
  }

  /**
   * Get a human-readable display name for a function
   */
  private getFunctionDisplayName(functionName: string): string {
    const displayNames: Record<string, string> = {
      list_agents: 'Listing available agents',
      check_agent_availability: 'Checking agent availability',
      schedule_meeting: 'Scheduling meeting',
      set_locale: 'Updating language preference',
    };
    return displayNames[functionName] || functionName;
  }

  /**
   * Process response recursively, handling function calls until we get a text response
   */
  private async processResponseRecursively(
    session: ChatSession,
    systemPrompt: string,
    tools: any[],
    maxIterations: number = GEMINI_CONFIG.SESSION.MAX_ITERATIONS,
  ): Promise<string | null> {
    if (maxIterations <= 0) {
      console.warn('Max iterations reached in processResponseRecursively');
      return null; // Prevent infinite loops
    }

    // Use throttling + retry logic for API calls
    const response = await this.throttleRequest(() =>
      retryWithBackoff(
        () =>
          this.genAI.models.generateContent({
            model: GEMINI_CONFIG.MODEL,
            config: {
              systemInstruction: {
                parts: [{ text: systemPrompt }],
              },
              tools,
            },
            contents: session.history,
          }),
        {
          maxRetries: GEMINI_CONFIG.RETRY.MAX_RETRIES,
          initialDelay: GEMINI_CONFIG.RETRY.INITIAL_DELAY,
          maxDelay: GEMINI_CONFIG.RETRY.MAX_DELAY,
          context: 'Chat',
        },
      ),
    );

    // Extract text from response
    let responseText: string | null = null;

    // Try different ways to get text
    if (response?.text) {
      responseText = response.text.trim() || null;
    } else if (response?.candidates?.[0]?.content?.parts) {
      const parts = response.candidates[0].content.parts;
      // Extract text parts only (ignore function calls)
      const textParts = parts
        .filter((part: any) => part.text && !part.functionCall)
        .map((part: any) => part.text);
      if (textParts.length > 0) {
        responseText = textParts.join('').trim() || null;
      }
    }

    // Check for function calls in the response
    let functionCalls: any[] = [];
    if ((response as any).functionCalls) {
      functionCalls = (response as any).functionCalls;
    } else if (response?.candidates?.[0]?.content?.parts) {
      const parts = response.candidates[0].content.parts;
      functionCalls = parts
        .filter((part: any) => part.functionCall)
        .map((part: any) => part.functionCall);
    }

    // Log if we have function calls but no text (this is expected in some cases)
    if (!responseText && functionCalls && functionCalls.length > 0) {
      console.log(
        `Response has ${functionCalls.length} function call(s) but no text. Processing function calls...`,
      );
    }

    // Log if we have function calls but no text (this is expected in some cases)
    if (!responseText && functionCalls && functionCalls.length > 0) {
      console.log(
        `Response has ${functionCalls.length} function call(s) but no text. Processing function calls...`,
      );
    }

    // If we have function calls, process them
    if (functionCalls && functionCalls.length > 0) {
      const services: FunctionServices = {
        agentsService: this.agentsService,
        meetingsService: this.meetingsService,
        translationsService: this.translationsService,
      };

      const functionResults: any[] = [];

      for (const funcCall of functionCalls) {
        const functionName = funcCall.name;
        const args = funcCall.args || {};

        const result = await handleFunctionCall(
          functionName,
          args,
          services,
          this.genAI,
        );

        functionResults.push({
          functionResponse: {
            name: functionName,
            response: { result },
          },
        });
      }

      // Add function call to history
      session.history.push({
        role: 'model',
        parts: functionCalls.map((fc: any) => ({
          functionCall: {
            name: fc.name,
            args: fc.args || {},
          },
        })),
      });

      // Add function results to history
      session.history.push({
        role: 'function' as any,
        parts: functionResults,
      });

      // Recursively process the next response
      const nextResponseText = await this.processResponseRecursively(
        session,
        systemPrompt,
        tools,
        maxIterations - 1,
      );

      // If we got text from the recursive call, return it
      if (nextResponseText) {
        return nextResponseText;
      }

      // If no text but we have function results, use them as the response
      const functionResultsText = functionResults
        .map((fr: any) => fr.functionResponse?.response?.result || '')
        .filter((text: string) => text)
        .join('\n\n');

      if (functionResultsText) {
        return functionResultsText;
      }

      // If we had text in this response before function calls, return it
      if (responseText) {
        return responseText;
      }

      return null;
    }

    // If we have text, return it
    return responseText;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Throttle API requests to prevent quota exhaustion
   * Ensures minimum interval between requests
   */
  private async throttleRequest<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ resolve, reject, fn });
      this.processQueue();
    });
  }

  /**
   * Process request queue with throttling
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (!request) break;

      try {
        // Calculate delay needed to maintain minimum interval
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const delayNeeded = Math.max(
          0,
          this.MIN_REQUEST_INTERVAL - timeSinceLastRequest,
        );

        if (delayNeeded > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayNeeded));
        }

        // Execute the request
        const result = await request.fn();
        this.lastRequestTime = Date.now();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }

    this.isProcessingQueue = false;
  }

  async sendMessage(
    message: string,
    sessionId?: string,
  ): Promise<{ response: string; sessionId: string }> {
    if (!this.genAI) {
      throw new Error(
        'Gemini API is not configured. Please set GEMINI_API_KEY environment variable.',
      );
    }

    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length === 0
    ) {
      throw new Error('Message cannot be empty');
    }

    const session = this.getOrCreateSession(sessionId);

    try {
      const systemPrompt = buildSystemPrompt(this.ragContext);
      const tools = getToolDefinitions();

      // Prepare contents: history + current message
      const contents = [
        ...session.history,
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ] as any[];

      // Use throttling + retry logic for API calls
      const response = await this.throttleRequest(() =>
        retryWithBackoff(() =>
          this.genAI.models.generateContent({
            model: GEMINI_CONFIG.MODEL,
            config: {
              systemInstruction: {
                parts: [{ text: systemPrompt }],
              },
              tools,
            },
            contents,
          }),
        ),
      );

      // Check if response has function calls
      // The response might have functionCalls property or functionCalls in parts
      let functionCalls: any[] = [];

      // Try different ways to access function calls
      if ((response as any).functionCalls) {
        functionCalls = (response as any).functionCalls;
      } else if (
        response.candidates &&
        response.candidates[0]?.content?.parts
      ) {
        // Check parts for function calls
        const parts = response.candidates[0].content.parts;
        functionCalls = parts
          .filter((part: any) => part.functionCall)
          .map((part: any) => part.functionCall);
      }

      if (functionCalls && functionCalls.length > 0) {
        // Handle function calls
        const functionResults: any[] = [];
        const services: FunctionServices = {
          agentsService: this.agentsService,
          meetingsService: this.meetingsService,
          translationsService: this.translationsService,
        };

        for (const funcCall of functionCalls) {
          const functionName = funcCall.name;
          const args = funcCall.args || {};

          const result = await handleFunctionCall(
            functionName,
            args,
            services,
            this.genAI,
          );

          functionResults.push({
            functionResponse: {
              name: functionName,
              response: { result },
            },
          });
        }

        // Add user message to history
        session.history.push({ role: 'user', parts: [{ text: message }] });

        // Add function call to history
        session.history.push({
          role: 'model',
          parts: functionCalls.map((fc: any) => ({
            functionCall: {
              name: fc.name,
              args: fc.args || {},
            },
          })),
        });

        // Add function results to history
        session.history.push({
          role: 'function' as any,
          parts: functionResults,
        });

        // Call the model again with function results
        // This may result in more function calls, so we need to handle recursively
        let finalResponseText = await this.processResponseRecursively(
          session,
          systemPrompt,
          tools,
          GEMINI_CONFIG.SESSION.MAX_ITERATIONS,
        );

        if (finalResponseText) {
          // Add final response to history
          session.history.push({
            role: 'model',
            parts: [{ text: finalResponseText }],
          });
          session.lastActivity = new Date();

          // Limit history
          if (
            session.history.length > GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH
          ) {
            session.history = session.history.slice(
              -GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH,
            );
          }

          return {
            response: finalResponseText,
            sessionId: session.sessionId,
          };
        }

        // If no text response, use the function call results as the response
        const functionResultsText = functionResults
          .map((fr: any) => fr.functionResponse?.response?.result || '')
          .filter((text: string) => text)
          .join('\n\n');

        if (functionResultsText) {
          // Add a summary response to history
          session.history.push({
            role: 'model',
            parts: [{ text: functionResultsText }],
          });
          session.lastActivity = new Date();

          // Limit history
          if (
            session.history.length > GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH
          ) {
            session.history = session.history.slice(
              -GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH,
            );
          }

          return {
            response: functionResultsText,
            sessionId: session.sessionId,
          };
        }
      } else {
        // No function calls, normal response
        let responseText = response?.text;

        // If no text in response.text, try extracting from parts
        if (!responseText && response?.candidates?.[0]?.content?.parts) {
          const parts = response.candidates[0].content.parts;
          const textParts = parts
            .filter((part: any) => part.text)
            .map((part: any) => part.text);
          if (textParts.length > 0) {
            responseText = textParts.join('');
          }
        }

        if (responseText) {
          // Update history
          session.history.push({ role: 'user', parts: [{ text: message }] });
          session.history.push({
            role: 'model',
            parts: [{ text: responseText }],
          });
          session.lastActivity = new Date();

          // Limit history
          if (
            session.history.length > GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH
          ) {
            session.history = session.history.slice(
              -GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH,
            );
          }

          return {
            response: responseText,
            sessionId: session.sessionId,
          };
        }
      }

      throw new Error('No response text generated');
    } catch (error) {
      // Enhanced error handling with better categorization
      let errorMessage = 'Failed to get response from AI';
      let userFriendlyMessage =
        'Sorry, I encountered an error. Please try again.';

      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();

        // Network errors
        if (
          errorMsg.includes('fetch failed') ||
          errorMsg.includes('econnrefused') ||
          errorMsg.includes('etimedout') ||
          errorMsg.includes('enotfound') ||
          errorMsg.includes('network')
        ) {
          errorMessage = 'Network error: Unable to connect to AI service';
          userFriendlyMessage =
            "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
        }
        // Model not found errors
        else if (
          errorMsg.includes('not found') ||
          errorMsg.includes('404') ||
          errorMsg.includes('not supported')
        ) {
          errorMessage = `Model not found: ${GEMINI_CONFIG.MODEL}`;
          userFriendlyMessage = `The AI model "${GEMINI_CONFIG.MODEL}" is not available. Please check your GEMINI_MODEL environment variable. Valid models: gemini-pro, gemini-1.5-pro, gemini-1.5-flash`;
        }
        // Authentication errors
        else if (
          errorMsg.includes('api key') ||
          errorMsg.includes('unauthorized') ||
          errorMsg.includes('401') ||
          errorMsg.includes('403')
        ) {
          errorMessage = 'Authentication error: Invalid API key';
          userFriendlyMessage =
            'AI service authentication failed. Please contact support.';
        }
        // Rate limiting / Quota exceeded
        else if (
          errorMsg.includes('rate limit') ||
          errorMsg.includes('429') ||
          errorMsg.includes('quota') ||
          errorMsg.includes('resource_exhausted')
        ) {
          errorMessage = 'Rate limit or quota exceeded';

          // Try to extract retry delay from error
          const retryDelay = parseRetryDelay(error);
          if (retryDelay) {
            const retrySeconds = Math.ceil(retryDelay / 1000);
            userFriendlyMessage = `The AI service has reached its rate limit. Please wait ${retrySeconds} seconds and try again. If this persists, the daily quota may have been exceeded.`;
          } else {
            userFriendlyMessage =
              'The AI service has reached its rate limit or daily quota. Please wait a few minutes and try again. If this issue persists, please contact support.';
          }
        }
        // Other errors
        else {
          errorMessage = `AI service error: ${error.message}`;
          userFriendlyMessage =
            'I encountered an unexpected error. Please try again in a moment.';
        }

        console.error('Error calling Gemini API:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          category: errorMessage,
        });
      } else {
        console.error('Unknown error calling Gemini API:', error);
      }

      throw new Error(userFriendlyMessage);
    }
  }

  getSessionHistory(
    sessionId: string,
  ): Array<{ role: string; message: string }> | null {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    return session.history.map((msg) => ({
      role: msg.role,
      message: msg.parts[0]?.text || '',
    }));
  }

  clearSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  getAllSessions(): Array<{
    sessionId: string;
    messageCount: number;
    createdAt: Date;
    lastActivity: Date;
  }> {
    return Array.from(this.sessions.values()).map((session) => ({
      sessionId: session.sessionId,
      messageCount: session.history.length,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
    }));
  }
}
