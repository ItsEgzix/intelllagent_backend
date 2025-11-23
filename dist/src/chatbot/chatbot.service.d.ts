import { OnModuleInit } from '@nestjs/common';
import { MeetingsService } from '../meetings/meetings.service';
import { AgentsService } from '../agents/agents.service';
export declare class ChatbotService implements OnModuleInit {
    private meetingsService;
    private agentsService;
    private genAI;
    private sessions;
    private ragContext;
    constructor(meetingsService: MeetingsService, agentsService: AgentsService);
    onModuleInit(): Promise<void>;
    private loadRAGContext;
    private getOrCreateSession;
    private generateSessionId;
    private buildSystemPrompt;
    private getAvailableAgents;
    private validateWorkingHours;
    private findAgentByNameOrEmail;
    private scheduleMeeting;
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
