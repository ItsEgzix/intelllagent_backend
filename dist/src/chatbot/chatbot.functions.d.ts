import { AgentsService } from '../agents/agents.service';
import { MeetingsService } from '../meetings/meetings.service';
export interface FunctionServices {
    agentsService: AgentsService;
    meetingsService: MeetingsService;
    geminiApiKey?: string;
}
export declare function getAvailableAgents(services: FunctionServices): Promise<string>;
export declare function checkAgentAvailability(params: {
    agentId?: string;
    agentName?: string;
    date: string;
    time: string;
    customerTimezone: string;
}, services: FunctionServices): Promise<string>;
export declare function scheduleMeeting(params: {
    customerName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    timezone: string;
    agentId?: string;
    agentName?: string;
}, services: FunctionServices): Promise<string>;
export declare function handleFunctionCall(functionName: string, args: any, services: FunctionServices): Promise<string>;
