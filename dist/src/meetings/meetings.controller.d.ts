import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
export declare class MeetingsController {
    private readonly meetingsService;
    constructor(meetingsService: MeetingsService);
    create(createMeetingDto: CreateMeetingDto): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
            phone: string;
            timezone: string;
            companyDetails: string | null;
            adminId: string | null;
            source: string;
            level: string;
        };
        agent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string | null;
            timezone: string | null;
            password: string;
            role: string;
            isAgent: boolean;
            avatar: string | null;
            isActive: boolean;
        } | null;
    } & {
        id: string;
        customerDate: string;
        customerTime: string;
        customerTimezone: string;
        agentDate: string | null;
        agentTime: string | null;
        agentTimezone: string | null;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        agentId: string | null;
    }>;
    findAll(req: any): Promise<({
        customer: {
            admin: {
                id: string;
                email: string;
                name: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
            phone: string;
            timezone: string;
            companyDetails: string | null;
            adminId: string | null;
            source: string;
            level: string;
        };
        agent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string | null;
            timezone: string | null;
            password: string;
            role: string;
            isAgent: boolean;
            avatar: string | null;
            isActive: boolean;
        } | null;
    } & {
        id: string;
        customerDate: string;
        customerTime: string;
        customerTimezone: string;
        agentDate: string | null;
        agentTime: string | null;
        agentTimezone: string | null;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        agentId: string | null;
    })[]>;
}
