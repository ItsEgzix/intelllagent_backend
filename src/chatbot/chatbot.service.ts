import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import { MeetingsService } from '../meetings/meetings.service';
import { AgentsService } from '../agents/agents.service';

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

  constructor(
    @Inject(forwardRef(() => MeetingsService))
    private meetingsService: MeetingsService,
    @Inject(forwardRef(() => AgentsService))
    private agentsService: AgentsService,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found in environment variables');
      // Don't throw error, just log warning - service will throw when used
    } else {
      try {
        this.genAI = new GoogleGenAI({ apiKey });
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

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private buildSystemPrompt(): string {
    const basePrompt = `You are a helpful AI assistant for IntellAgent. You can help users with:
- Answering questions about IntellAgent services
- Scheduling calls/meetings with agents
- Finding available agents

When users want to schedule a call, use the schedule_meeting tool. IMPORTANT: You MUST always:
1. First use list_agents to show available agents
2. Ask the user to select an agent by name or email
3. Collect all required information:
   - Customer name
   - Email
   - Phone number
   - Preferred date (YYYY-MM-DD format, weekdays only, no weekends)
   - Preferred time (HH:mm format, between 8:30 and 17:30 in their timezone)
   - Timezone (IANA format like Asia/Kuala_Lumpur)
   - Agent name or email (REQUIRED - must select from available agents)

Working hours are 8:30 AM to 5:30 PM (17:30) in the customer's timezone. Meetings cannot be scheduled on weekends.

You can use the list_agents tool to show available agents when users ask about scheduling or want to choose an agent.`;

    if (!this.ragContext) {
      return basePrompt;
    }

    return `${basePrompt}

Use the following context to answer questions accurately:

${this.ragContext}

Based on the context above, answer the user's questions. If the question is not related to the context, you can still answer using your general knowledge, but prioritize the context when relevant.`;
  }

  /**
   * Get available agents for scheduling
   */
  private async getAvailableAgents(): Promise<string> {
    try {
      if (!this.agentsService) {
        return 'Agent service is not available. Please try again later.';
      }

      const agents = await this.agentsService.findActive();
      if (agents.length === 0) {
        return 'No agents are currently available.';
      }

      const agentsList = agents
        .map(
          (agent, index) =>
            `${index + 1}. ${agent.name || agent.email} - Timezone: ${agent.timezone || 'Not set'}`,
        )
        .join('\n');

      return `Available agents:\n${agentsList}\n\nWhen scheduling, you can specify the agent by name or email.`;
    } catch (error) {
      console.error('Error fetching agents:', error);
      return 'Unable to fetch available agents at this time. Please try again later.';
    }
  }

  /**
   * Validate working hours (8:30 to 17:30) in the given timezone
   */
  private validateWorkingHours(
    date: string,
    time: string,
    timezone: string,
  ): { valid: boolean; message?: string } {
    try {
      // Parse time
      const [hours, minutes] = time.split(':').map(Number);

      // Validate time components
      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        return {
          valid: false,
          message:
            'Invalid time format. Please use HH:mm format (e.g., 14:30).',
        };
      }

      const totalMinutes = hours * 60 + minutes;

      // Working hours: 8:30 (510 minutes) to 17:30 (1050 minutes)
      const startMinutes = 8 * 60 + 30; // 8:30
      const endMinutes = 17 * 60 + 30; // 17:30

      if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
        return {
          valid: false,
          message: `The selected time ${time} is outside working hours (8:30 - 17:30) in ${timezone}. Please select a time between 8:30 and 17:30.`,
        };
      }

      // Check if it's a weekend (Saturday or Sunday) in the customer's timezone
      // Create a date string in ISO format and parse it
      const dateTimeString = `${date}T${time}:00`;

      // Use Intl.DateTimeFormat to get the day of week in the customer's timezone
      const dateObj = new Date(dateTimeString);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
      });
      const dayName = formatter.format(dateObj).toLowerCase();

      if (dayName === 'saturday' || dayName === 'sunday') {
        return {
          valid: false,
          message:
            'Meetings cannot be scheduled on weekends (Saturday or Sunday). Please select a weekday.',
        };
      }

      return { valid: true };
    } catch (error) {
      console.error('Error validating working hours:', error);
      return {
        valid: false,
        message:
          'Error validating working hours. Please check the date and time format.',
      };
    }
  }

  /**
   * Find agent by name or email
   */
  private async findAgentByNameOrEmail(
    nameOrEmail: string,
  ): Promise<string | null> {
    try {
      if (!this.agentsService) {
        return null;
      }

      const agents = await this.agentsService.findActive();
      const agent = agents.find(
        (a) =>
          a.name?.toLowerCase() === nameOrEmail.toLowerCase() ||
          a.email.toLowerCase() === nameOrEmail.toLowerCase(),
      );
      return agent ? agent.id : null;
    } catch (error) {
      console.error('Error finding agent:', error);
      return null;
    }
  }

  /**
   * Schedule a meeting
   */
  private async scheduleMeeting(params: {
    customerName: string;
    email: string;
    phone: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    timezone: string;
    agentId?: string;
    agentName?: string; // Allow agent selection by name/email
  }): Promise<string> {
    try {
      if (!this.meetingsService || !this.agentsService) {
        return 'Meeting service is not available. Please try again later.';
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(params.date)) {
        return 'Invalid date format. Please use YYYY-MM-DD format (e.g., 2024-12-25).';
      }

      // Validate time format
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(params.time)) {
        return 'Invalid time format. Please use HH:mm format (e.g., 14:30).';
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(params.email)) {
        return 'Invalid email format.';
      }

      // Validate working hours
      const workingHoursValidation = this.validateWorkingHours(
        params.date,
        params.time,
        params.timezone,
      );
      if (!workingHoursValidation.valid) {
        return workingHoursValidation.message || 'Invalid working hours.';
      }

      // Resolve agent ID - prioritize agentId, then agentName
      let agentId: string | undefined = params.agentId;

      if (!agentId && params.agentName) {
        const foundAgentId = await this.findAgentByNameOrEmail(
          params.agentName,
        );
        if (!foundAgentId) {
          return `Agent "${params.agentName}" not found. Please use list_agents to see available agents.`;
        }
        agentId = foundAgentId;
      }

      // Require agent selection
      if (!agentId) {
        return 'An agent must be selected for the meeting. Please use list_agents to see available agents and specify which agent you want to schedule with.';
      }

      // Verify agent exists
      try {
        await this.agentsService.findOne(agentId);
      } catch (error) {
        return `Agent not found. Please use list_agents to see available agents.`;
      }

      const meeting = await this.meetingsService.create({
        customerName: params.customerName,
        email: params.email,
        phone: params.phone,
        date: params.date,
        time: params.time,
        timezone: params.timezone,
        agentId: agentId,
      });

      const agentInfo = meeting.agent
        ? ` with ${meeting.agent.name || meeting.agent.email}`
        : '';

      return `Meeting scheduled successfully${agentInfo}!\n\nDetails:\n- Date: ${meeting.customerDate}\n- Time: ${meeting.customerTime} (${meeting.customerTimezone})\n- Confirmation email sent to ${params.email}`;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return `Failed to schedule meeting: ${errorMessage}`;
    }
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
      const systemPrompt = this.buildSystemPrompt();

      // Prepare contents: history + current message
      const contents = [
        ...session.history,
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ] as any[];

      // Define tools for function calling
      const tools = [
        {
          functionDeclarations: [
            {
              name: 'list_agents',
              description:
                'Get a list of available agents that can be scheduled for meetings. Use this when the user asks about available agents or wants to see who they can schedule with.',
              parameters: {
                type: 'object',
                properties: {},
                required: [],
              },
            },
            {
              name: 'schedule_meeting',
              description:
                'Schedule a call/meeting with an agent. Use this when the user wants to book a meeting or schedule a call.',
              parameters: {
                type: 'object',
                properties: {
                  customerName: {
                    type: 'string',
                    description: 'Full name of the customer',
                  },
                  email: {
                    type: 'string',
                    description: 'Email address of the customer',
                  },
                  phone: {
                    type: 'string',
                    description: 'Phone number of the customer',
                  },
                  date: {
                    type: 'string',
                    description:
                      'Date in YYYY-MM-DD format (e.g., 2024-12-25). Must be a weekday (Monday-Friday), not a weekend.',
                  },
                  time: {
                    type: 'string',
                    description:
                      "Time in HH:mm format (e.g., 14:30). Must be between 8:30 and 17:30 (5:30 PM) in the customer's timezone.",
                  },
                  timezone: {
                    type: 'string',
                    description:
                      'IANA timezone string (e.g., Asia/Kuala_Lumpur, America/New_York)',
                  },
                  agentId: {
                    type: 'string',
                    description:
                      'Optional: ID of the agent to schedule with. Prefer using agentName instead.',
                  },
                  agentName: {
                    type: 'string',
                    description:
                      'Required if agentId not provided: Name or email of the agent to schedule with. Use list_agents to see available agents.',
                  },
                },
                required: [
                  'customerName',
                  'email',
                  'phone',
                  'date',
                  'time',
                  'timezone',
                  'agentName',
                ],
              },
            },
          ],
        },
      ] as any;

      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        config: {
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          tools,
        },
        contents,
      });

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

        for (const funcCall of functionCalls) {
          const functionName = funcCall.name;
          const args = funcCall.args || {};

          let result: string;

          switch (functionName) {
            case 'list_agents':
              result = await this.getAvailableAgents();
              break;
            case 'schedule_meeting':
              result = await this.scheduleMeeting({
                customerName: args.customerName as string,
                email: args.email as string,
                phone: args.phone as string,
                date: args.date as string,
                time: args.time as string,
                timezone: args.timezone as string,
                agentId: args.agentId as string | undefined,
                agentName: args.agentName as string | undefined,
              });
              break;
            default:
              result = `Unknown function: ${functionName}`;
          }

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
        const finalResponse = await this.genAI.models.generateContent({
          model: 'gemini-2.0-flash',
          config: {
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            tools,
          },
          contents: session.history,
        });

        const responseText = finalResponse?.text;

        if (responseText) {
          // Add final response to history
          session.history.push({
            role: 'model',
            parts: [{ text: responseText }],
          });
          session.lastActivity = new Date();

          // Limit history
          if (session.history.length > 20) {
            session.history = session.history.slice(-20);
          }

          return {
            response: responseText,
            sessionId: session.sessionId,
          };
        }
      } else {
        // No function calls, normal response
        const responseText = response?.text;

        if (responseText) {
          // Update history
          session.history.push({ role: 'user', parts: [{ text: message }] });
          session.history.push({
            role: 'model',
            parts: [{ text: responseText }],
          });
          session.lastActivity = new Date();

          // Limit history
          if (session.history.length > 20) {
            session.history = session.history.slice(-20);
          }

          return {
            response: responseText,
            sessionId: session.sessionId,
          };
        }
      }

      throw new Error('No response text generated');
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error(
        `Failed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
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
