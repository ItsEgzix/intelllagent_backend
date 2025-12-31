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
    private validateNotPastDateTime;
    findAll(adminId?: string): Promise<({
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
    private sendMeetingEmails;
}
