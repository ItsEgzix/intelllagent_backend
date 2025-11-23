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
    private sendMeetingEmails;
}
