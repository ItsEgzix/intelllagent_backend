import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    sendMessage(sendMessageDto: SendMessageDto): Promise<{
        response: string;
        sessionId: string;
    }>;
    getSessionHistory(sessionId: string): Promise<{
        error: string;
        sessionId?: undefined;
        history?: undefined;
    } | {
        sessionId: string;
        history: {
            role: string;
            message: string;
        }[];
        error?: undefined;
    }>;
    clearSession(sessionId: string): Promise<{
        error: string;
        message?: undefined;
    } | {
        message: string;
        error?: undefined;
    }>;
    getAllSessions(): Promise<{
        sessionId: string;
        messageCount: number;
        createdAt: Date;
        lastActivity: Date;
    }[]>;
}
