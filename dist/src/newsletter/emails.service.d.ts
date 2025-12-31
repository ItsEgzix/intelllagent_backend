import { PrismaService } from '../prisma/prisma.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailService } from '../email/email.service';
export declare class EmailsService {
    private readonly prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    create(createEmailDto: CreateEmailDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
