import { OnModuleInit } from '@nestjs/common';
import { MeetingsService } from '../meetings/meetings.service';
import { AgentsService } from '../agents/agents.service';
import { TranslationsService } from '../translations/translations.service';
export declare class ChatbotService implements OnModuleInit {
    private meetingsService;
    private agentsService;
    private translationsService;
    private genAI;
    private sessions;
    private ragContext;
    private requestQueue;
    private isProcessingQueue;
    private lastRequestTime;
    private readonly MIN_REQUEST_INTERVAL;
    constructor(meetingsService: MeetingsService, agentsService: AgentsService, translationsService: TranslationsService);
    onModuleInit(): Promise<void>;
    private loadRAGContext;
    private getOrCreateSession;
    private getFunctionDisplayName;
    private processResponseRecursively;
    private generateSessionId;
    private throttleRequest;
    private processQueue;
    sendMessage(message: string, sessionId?: string): Promise<{
        response: string;
        sessionId: string;
    }>;
    getSessionHistory(sessionId: string): Array<{
        role: string;
        message: string;
    }> | null;
    clearSession(sessionId: string): boolean;
    getAllSessions(): Array<{
        sessionId: string;
        messageCount: number;
        createdAt: Date;
        lastActivity: Date;
    }>;
}
