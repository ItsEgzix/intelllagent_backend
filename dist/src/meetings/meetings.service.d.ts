import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { EmailService } from '../email/email.service';
export declare class MeetingsService implements OnModuleInit, OnModuleDestroy {
    private emailService;
    private prisma;
    constructor(emailService: EmailService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    create(createMeetingDto: CreateMeetingDto): Promise<{
        customer: {
            email: string;
            name: string;
            level: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            timezone: string;
            companyDetails: string | null;
            adminId: string | null;
            source: string;
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
            level: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            timezone: string;
            companyDetails: string | null;
            adminId: string | null;
            source: string;
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
