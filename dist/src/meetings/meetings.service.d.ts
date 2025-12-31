import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { EmailService } from '../email/email.service';
import { AgentsService } from '../agents/agents.service';
import { SettingsService } from '../settings/settings.service';
export declare class MeetingsService {
    private readonly prisma;
    private emailService;
    private agentsService;
    private settingsService;
    constructor(prisma: PrismaService, emailService: EmailService, agentsService: AgentsService, settingsService: SettingsService);
    create(createMeetingDto: CreateMeetingDto): Promise<{
        customer: {
            name: string;
            id: string;
            email: string;
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
            name: string | null;
            id: string;
            email: string;
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
        customerDate: string;
        customerTime: string;
        customerTimezone: string;
        agentDate: string | null;
        agentTime: string | null;
        agentTimezone: string | null;
        customerId: string;
        agentId: string | null;
    }>;
    private validateNotPastDateTime;
    findAll(adminId?: string): Promise<({
        customer: {
            admin: {
                name: string | null;
                id: string;
                email: string;
            } | null;
        } & {
            name: string;
            id: string;
            email: string;
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
            name: string | null;
            id: string;
            email: string;
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
        customerDate: string;
        customerTime: string;
        customerTimezone: string;
        agentDate: string | null;
        agentTime: string | null;
        agentTimezone: string | null;
        customerId: string;
        agentId: string | null;
    })[]>;
    private sendMeetingEmails;
}
