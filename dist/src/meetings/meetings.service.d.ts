import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { EmailService } from '../email/email.service';
export declare class MeetingsService {
    private readonly prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    create(createMeetingDto: CreateMeetingDto): Promise<{
        customer: {
            email: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            timezone: string;
            companyDetails: string | null;
            adminId: string | null;
            source: string;
            level: string;
        };
        agent: {
            email: string;
            name: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            timezone: string | null;
            password: string;
            role: string;
            isAgent: boolean;
            avatar: string | null;
            isActive: boolean;
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
    findAll(adminId?: string): Promise<({
        customer: {
            admin: {
                email: string;
                name: string | null;
                id: string;
            } | null;
        } & {
            email: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            timezone: string;
            companyDetails: string | null;
            adminId: string | null;
            source: string;
            level: string;
        };
        agent: {
            email: string;
            name: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            timezone: string | null;
            password: string;
            role: string;
            isAgent: boolean;
            avatar: string | null;
            isActive: boolean;
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
    private sendMeetingEmails;
}
