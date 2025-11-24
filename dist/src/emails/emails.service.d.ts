import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailService } from '../email/email.service';
export declare class EmailsService implements OnModuleInit, OnModuleDestroy {
    private emailService;
    private prisma;
    constructor(emailService: EmailService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    create(createEmailDto: CreateEmailDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
