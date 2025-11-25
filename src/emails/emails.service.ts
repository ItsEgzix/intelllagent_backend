import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class EmailsService {
  constructor(
    private readonly prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(createEmailDto: CreateEmailDto) {
    const email = await this.prisma.email.create({
      data: {
        email: createEmailDto.email,
      },
    });

    // Send welcome email asynchronously (don't block the response)
    this.emailService.sendWelcomeEmail(createEmailDto.email).catch((error) => {
      console.error('Failed to send welcome email:', error);
      // Don't throw - we don't want email failures to break the subscription
    });

    return email;
  }

  async findAll() {
    return this.prisma.email.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
