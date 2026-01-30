"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const meetings_service_1 = require("../meetings/meetings.service");
const agents_service_1 = require("../agents/agents.service");
const translations_service_1 = require("../translations/translations.service");
const chatbot_prompts_1 = require("./chatbot.prompts");
const chatbot_tools_1 = require("./chatbot.tools");
const chatbot_functions_1 = require("./chatbot.functions");
const chatbot_config_1 = require("./chatbot.config");
const chatbot_utils_1 = require("./chatbot.utils");
let ChatbotService = class ChatbotService {
    meetingsService;
    agentsService;
    translationsService;
    genAI;
    sessions = new Map();
    ragContext = '';
    requestQueue = [];
    isProcessingQueue = false;
    lastRequestTime = 0;
    MIN_REQUEST_INTERVAL = chatbot_config_1.GEMINI_CONFIG.MIN_REQUEST_INTERVAL;
    constructor(meetingsService, agentsService, translationsService) {
        this.meetingsService = meetingsService;
        this.agentsService = agentsService;
        this.translationsService = translationsService;
        (0, chatbot_config_1.validateGeminiConfig)();
        if (!chatbot_config_1.GEMINI_CONFIG.API_KEY) {
            console.warn('GEMINI_API_KEY not found in environment variables');
        }
        else {
            try {
                this.genAI = new genai_1.GoogleGenAI({ apiKey: chatbot_config_1.GEMINI_CONFIG.API_KEY });
            }
            catch (error) {
                console.error('Failed to initialize GoogleGenAI:', error);
            }
        }
    }
    async onModuleInit() {
        await this.loadRAGContext();
    }
    async loadRAGContext() {
        try {
            const possiblePaths = [
                path.join(process.cwd(), 'src', 'chatbot', 'context.md'),
                path.join(process.cwd(), 'context.md'),
                path.join(process.cwd(), 'data', 'context.md'),
                path.join(__dirname, 'context.md'),
            ];
            let contextPath = null;
            for (const possiblePath of possiblePaths) {
                try {
                    if (fs.existsSync(possiblePath)) {
                        contextPath = possiblePath;
                        break;
                    }
                }
                catch (err) {
                    continue;
                }
            }
            if (contextPath) {
                try {
                    this.ragContext = fs.readFileSync(contextPath, 'utf-8');
                    console.log(`RAG context loaded from: ${contextPath}`);
                }
                catch (readError) {
                    console.warn(`Failed to read context file from ${contextPath}:`, readError);
                    this.ragContext = '';
                }
            }
            else {
                console.warn('No context.md file found. RAG will not be available.');
                this.ragContext = '';
            }
        }
        catch (error) {
            console.error('Error loading RAG context:', error);
            this.ragContext = '';
        }
    }
    getOrCreateSession(sessionId) {
        if (sessionId && this.sessions.has(sessionId)) {
            const session = this.sessions.get(sessionId);
            session.lastActivity = new Date();
            return session;
        }
        const newSessionId = sessionId || this.generateSessionId();
        const newSession = {
            sessionId: newSessionId,
            history: [],
            createdAt: new Date(),
            lastActivity: new Date(),
        };
        this.sessions.set(newSessionId, newSession);
        return newSession;
    }
    getFunctionDisplayName(functionName) {
        const displayNames = {
            list_agents: 'Listing available agents',
            check_agent_availability: 'Checking agent availability',
            schedule_meeting: 'Scheduling meeting',
            set_locale: 'Updating language preference',
        };
        return displayNames[functionName] || functionName;
    }
    async processResponseRecursively(session, systemPrompt, tools, maxIterations = chatbot_config_1.GEMINI_CONFIG.SESSION.MAX_ITERATIONS) {
        if (maxIterations <= 0) {
            console.warn('Max iterations reached in processResponseRecursively');
            return null;
        }
        const response = await this.throttleRequest(() => (0, chatbot_utils_1.retryWithBackoff)(() => this.genAI.models.generateContent({
            model: chatbot_config_1.GEMINI_CONFIG.MODEL,
            config: {
                systemInstruction: {
                    parts: [{ text: systemPrompt }],
                },
                tools,
            },
            contents: session.history,
        }), {
            maxRetries: chatbot_config_1.GEMINI_CONFIG.RETRY.MAX_RETRIES,
            initialDelay: chatbot_config_1.GEMINI_CONFIG.RETRY.INITIAL_DELAY,
            maxDelay: chatbot_config_1.GEMINI_CONFIG.RETRY.MAX_DELAY,
            context: 'Chat',
        }));
        let responseText = null;
        if (response?.text) {
            responseText = response.text.trim() || null;
        }
        else if (response?.candidates?.[0]?.content?.parts) {
            const parts = response.candidates[0].content.parts;
            const textParts = parts
                .filter((part) => part.text && !part.functionCall)
                .map((part) => part.text);
            if (textParts.length > 0) {
                responseText = textParts.join('').trim() || null;
            }
        }
        let functionCalls = [];
        if (response.functionCalls) {
            functionCalls = response.functionCalls;
        }
        else if (response?.candidates?.[0]?.content?.parts) {
            const parts = response.candidates[0].content.parts;
            functionCalls = parts
                .filter((part) => part.functionCall)
                .map((part) => part.functionCall);
        }
        if (!responseText && functionCalls && functionCalls.length > 0) {
            console.log(`Response has ${functionCalls.length} function call(s) but no text. Processing function calls...`);
        }
        if (!responseText && functionCalls && functionCalls.length > 0) {
            console.log(`Response has ${functionCalls.length} function call(s) but no text. Processing function calls...`);
        }
        if (functionCalls && functionCalls.length > 0) {
            const services = {
                agentsService: this.agentsService,
                meetingsService: this.meetingsService,
                translationsService: this.translationsService,
            };
            const functionResults = [];
            for (const funcCall of functionCalls) {
                const functionName = funcCall.name;
                const args = funcCall.args || {};
                const result = await (0, chatbot_functions_1.handleFunctionCall)(functionName, args, services, this.genAI);
                functionResults.push({
                    functionResponse: {
                        name: functionName,
                        response: { result },
                    },
                });
            }
            session.history.push({
                role: 'model',
                parts: functionCalls.map((fc) => ({
                    functionCall: {
                        name: fc.name,
                        args: fc.args || {},
                    },
                })),
            });
            session.history.push({
                role: 'function',
                parts: functionResults,
            });
            const nextResponseText = await this.processResponseRecursively(session, systemPrompt, tools, maxIterations - 1);
            if (nextResponseText) {
                return nextResponseText;
            }
            const functionResultsText = functionResults
                .map((fr) => fr.functionResponse?.response?.result || '')
                .filter((text) => text)
                .join('\n\n');
            if (functionResultsText) {
                return functionResultsText;
            }
            if (responseText) {
                return responseText;
            }
            return null;
        }
        return responseText;
    }
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async throttleRequest(fn) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ resolve, reject, fn });
            this.processQueue();
        });
    }
    async processQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }
        this.isProcessingQueue = true;
        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            if (!request)
                break;
            try {
                const now = Date.now();
                const timeSinceLastRequest = now - this.lastRequestTime;
                const delayNeeded = Math.max(0, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest);
                if (delayNeeded > 0) {
                    await new Promise((resolve) => setTimeout(resolve, delayNeeded));
                }
                const result = await request.fn();
                this.lastRequestTime = Date.now();
                request.resolve(result);
            }
            catch (error) {
                request.reject(error);
            }
        }
        this.isProcessingQueue = false;
    }
    async sendMessage(message, sessionId) {
        if (!this.genAI) {
            throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY environment variable.');
        }
        if (!message ||
            typeof message !== 'string' ||
            message.trim().length === 0) {
            throw new Error('Message cannot be empty');
        }
        const session = this.getOrCreateSession(sessionId);
        try {
            const systemPrompt = (0, chatbot_prompts_1.buildSystemPrompt)(this.ragContext);
            const tools = (0, chatbot_tools_1.getToolDefinitions)();
            const contents = [
                ...session.history,
                {
                    role: 'user',
                    parts: [{ text: message }],
                },
            ];
            const response = await this.throttleRequest(() => (0, chatbot_utils_1.retryWithBackoff)(() => this.genAI.models.generateContent({
                model: chatbot_config_1.GEMINI_CONFIG.MODEL,
                config: {
                    systemInstruction: {
                        parts: [{ text: systemPrompt }],
                    },
                    tools,
                },
                contents,
            })));
            let functionCalls = [];
            if (response.functionCalls) {
                functionCalls = response.functionCalls;
            }
            else if (response.candidates &&
                response.candidates[0]?.content?.parts) {
                const parts = response.candidates[0].content.parts;
                functionCalls = parts
                    .filter((part) => part.functionCall)
                    .map((part) => part.functionCall);
            }
            if (functionCalls && functionCalls.length > 0) {
                const functionResults = [];
                const services = {
                    agentsService: this.agentsService,
                    meetingsService: this.meetingsService,
                    translationsService: this.translationsService,
                };
                for (const funcCall of functionCalls) {
                    const functionName = funcCall.name;
                    const args = funcCall.args || {};
                    const result = await (0, chatbot_functions_1.handleFunctionCall)(functionName, args, services, this.genAI);
                    functionResults.push({
                        functionResponse: {
                            name: functionName,
                            response: { result },
                        },
                    });
                }
                session.history.push({ role: 'user', parts: [{ text: message }] });
                session.history.push({
                    role: 'model',
                    parts: functionCalls.map((fc) => ({
                        functionCall: {
                            name: fc.name,
                            args: fc.args || {},
                        },
                    })),
                });
                session.history.push({
                    role: 'function',
                    parts: functionResults,
                });
                let finalResponseText = await this.processResponseRecursively(session, systemPrompt, tools, chatbot_config_1.GEMINI_CONFIG.SESSION.MAX_ITERATIONS);
                if (finalResponseText) {
                    session.history.push({
                        role: 'model',
                        parts: [{ text: finalResponseText }],
                    });
                    session.lastActivity = new Date();
                    if (session.history.length > chatbot_config_1.GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH) {
                        session.history = session.history.slice(-chatbot_config_1.GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH);
                    }
                    return {
                        response: finalResponseText,
                        sessionId: session.sessionId,
                    };
                }
                const functionResultsText = functionResults
                    .map((fr) => fr.functionResponse?.response?.result || '')
                    .filter((text) => text)
                    .join('\n\n');
                if (functionResultsText) {
                    session.history.push({
                        role: 'model',
                        parts: [{ text: functionResultsText }],
                    });
                    session.lastActivity = new Date();
                    if (session.history.length > chatbot_config_1.GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH) {
                        session.history = session.history.slice(-chatbot_config_1.GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH);
                    }
                    return {
                        response: functionResultsText,
                        sessionId: session.sessionId,
                    };
                }
            }
            else {
                let responseText = response?.text;
                if (!responseText && response?.candidates?.[0]?.content?.parts) {
                    const parts = response.candidates[0].content.parts;
                    const textParts = parts
                        .filter((part) => part.text)
                        .map((part) => part.text);
                    if (textParts.length > 0) {
                        responseText = textParts.join('');
                    }
                }
                if (responseText) {
                    session.history.push({ role: 'user', parts: [{ text: message }] });
                    session.history.push({
                        role: 'model',
                        parts: [{ text: responseText }],
                    });
                    session.lastActivity = new Date();
                    if (session.history.length > chatbot_config_1.GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH) {
                        session.history = session.history.slice(-chatbot_config_1.GEMINI_CONFIG.SESSION.MAX_HISTORY_LENGTH);
                    }
                    return {
                        response: responseText,
                        sessionId: session.sessionId,
                    };
                }
            }
            throw new Error('No response text generated');
        }
        catch (error) {
            let errorMessage = 'Failed to get response from AI';
            let userFriendlyMessage = 'Sorry, I encountered an error. Please try again.';
            if (error instanceof Error) {
                const errorMsg = error.message.toLowerCase();
                if (errorMsg.includes('fetch failed') ||
                    errorMsg.includes('econnrefused') ||
                    errorMsg.includes('etimedout') ||
                    errorMsg.includes('enotfound') ||
                    errorMsg.includes('network')) {
                    errorMessage = 'Network error: Unable to connect to AI service';
                    userFriendlyMessage =
                        "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
                }
                else if (errorMsg.includes('not found') ||
                    errorMsg.includes('404') ||
                    errorMsg.includes('not supported')) {
                    errorMessage = `Model not found: ${chatbot_config_1.GEMINI_CONFIG.MODEL}`;
                    userFriendlyMessage = `The AI model "${chatbot_config_1.GEMINI_CONFIG.MODEL}" is not available. Please check your GEMINI_MODEL environment variable. Valid models: gemini-pro, gemini-1.5-pro, gemini-1.5-flash`;
                }
                else if (errorMsg.includes('api key') ||
                    errorMsg.includes('unauthorized') ||
                    errorMsg.includes('401') ||
                    errorMsg.includes('403')) {
                    errorMessage = 'Authentication error: Invalid API key';
                    userFriendlyMessage =
                        'AI service authentication failed. Please contact support.';
                }
                else if (errorMsg.includes('rate limit') ||
                    errorMsg.includes('429') ||
                    errorMsg.includes('quota') ||
                    errorMsg.includes('resource_exhausted')) {
                    errorMessage = 'Rate limit or quota exceeded';
                    const retryDelay = (0, chatbot_utils_1.parseRetryDelay)(error);
                    if (retryDelay) {
                        const retrySeconds = Math.ceil(retryDelay / 1000);
                        userFriendlyMessage = `The AI service has reached its rate limit. Please wait ${retrySeconds} seconds and try again. If this persists, the daily quota may have been exceeded.`;
                    }
                    else {
                        userFriendlyMessage =
                            'The AI service has reached its rate limit or daily quota. Please wait a few minutes and try again. If this issue persists, please contact support.';
                    }
                }
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
            }
            else {
                console.error('Unknown error calling Gemini API:', error);
            }
            throw new Error(userFriendlyMessage);
        }
    }
    getSessionHistory(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return null;
        }
        return session.history.map((msg) => ({
            role: msg.role,
            message: msg.parts[0]?.text || '',
        }));
    }
    clearSession(sessionId) {
        return this.sessions.delete(sessionId);
    }
    getAllSessions() {
        return Array.from(this.sessions.values()).map((session) => ({
            sessionId: session.sessionId,
            messageCount: session.history.length,
            createdAt: session.createdAt,
            lastActivity: session.lastActivity,
        }));
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => meetings_service_1.MeetingsService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => agents_service_1.AgentsService))),
    __metadata("design:paramtypes", [meetings_service_1.MeetingsService,
        agents_service_1.AgentsService,
        translations_service_1.TranslationsService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map