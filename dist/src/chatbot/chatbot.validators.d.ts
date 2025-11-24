import { AgentsService } from '../agents/agents.service';
export interface WorkingHoursValidation {
    valid: boolean;
    message?: string;
}
export declare function validateWorkingHours(date: string, time: string, timezone: string): WorkingHoursValidation;
export declare function findAgentByNameOrEmail(nameOrEmail: string, agentsService: AgentsService): Promise<string | null>;
export declare function calculateTimeDifference(date: string, time: string, fromTimezone: string, toTimezone: string): string;
