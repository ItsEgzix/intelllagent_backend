import { EmailsService } from './emails.service';
import { CreateEmailDto } from './dto/create-email.dto';
export declare class EmailsController {
    private readonly emailsService;
    constructor(emailsService: EmailsService);
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
