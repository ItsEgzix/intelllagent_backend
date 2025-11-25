import { EmailsService } from './emails.service';
import { CreateEmailDto } from './dto/create-email.dto';
export declare class EmailsController {
    private readonly emailsService;
    constructor(emailsService: EmailsService);
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
