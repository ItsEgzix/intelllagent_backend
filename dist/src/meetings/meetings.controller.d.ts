import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
export declare class MeetingsController {
    private readonly meetingsService;
    constructor(meetingsService: MeetingsService);
    create(createMeetingDto: CreateMeetingDto): Promise<{
        customer: {
            id: string;
            email: string;
            name: string;
            timezone: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        };
        agent: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            role: string;
            isAgent: boolean;
            timezone: string | null;
            avatar: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        agentId: string | null;
        customerDate: string;
        customerTime: string;
        customerTimezone: string;
        agentDate: string | null;
        agentTime: string | null;
        agentTimezone: string | null;
        customerId: string;
    }>;
    findAll(): Promise<({
        customer: {
            id: string;
            email: string;
            name: string;
            timezone: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        };
        agent: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            role: string;
            isAgent: boolean;
            timezone: string | null;
            avatar: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        agentId: string | null;
        customerDate: string;
        customerTime: string;
        customerTimezone: string;
        agentDate: string | null;
        agentTime: string | null;
        agentTimezone: string | null;
        customerId: string;
    })[]>;
}
