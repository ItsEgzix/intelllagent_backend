import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
export declare class MeetingsController {
    private readonly meetingsService;
    constructor(meetingsService: MeetingsService);
    create(createMeetingDto: CreateMeetingDto): Promise<{
        customer: {
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string;
            timezone: string;
            companyDetails: string | null;
            adminId: string | null;
            source: string;
            level: string;
        };
        agent: {
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            timezone: string | null;
            avatar: string | null;
            isActive: boolean;
            isAgent: boolean;
            password: string;
            role: string;
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
    findAll(req: any): Promise<({
        customer: {
            admin: {
                email: string;
                id: string;
                name: string | null;
            } | null;
        } & {
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string;
            timezone: string;
            companyDetails: string | null;
            adminId: string | null;
            source: string;
            level: string;
        };
        agent: {
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            timezone: string | null;
            avatar: string | null;
            isActive: boolean;
            isAgent: boolean;
            password: string;
            role: string;
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
