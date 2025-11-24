import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { adapter } from '../../prisma.config';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class EmailsService implements OnModuleInit, OnModuleDestroy {
  private prisma = new PrismaClient({ adapter });

  constructor(private emailService: EmailService) {}

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

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
