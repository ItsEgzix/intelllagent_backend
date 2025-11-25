import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { EmailService } from '../email/email.service';
import { convertTimezone } from '../email/templates/timezone-helper';

@Injectable()
export class MeetingsService {
  constructor(
    private readonly prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(createMeetingDto: CreateMeetingDto) {
    // Step 1: Create or find customer
    let customer = await this.prisma.customer.findUnique({
      where: { email: createMeetingDto.email },
    });

    // Determine adminId - if agent is assigned, use agent's ID as adminId
    let adminId: string | undefined = undefined;
    if (createMeetingDto.agentId) {
      adminId = createMeetingDto.agentId;
    }

    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          name: createMeetingDto.customerName,
          email: createMeetingDto.email,
          phone: createMeetingDto.phone,
          timezone: createMeetingDto.timezone,
          adminId: adminId,
          source: 'website', // Customer self-registered through website
        },
      });
    } else {
      // Update customer info if it has changed
      // If customer doesn't have an admin and we're assigning an agent, assign adminId
      const updateData: any = {
        name: createMeetingDto.customerName,
        phone: createMeetingDto.phone,
        timezone: createMeetingDto.timezone,
      };

      if (adminId && !customer.adminId) {
        updateData.adminId = adminId;
      }

      customer = await this.prisma.customer.update({
        where: { id: customer.id },
        data: updateData,
      });
    }

    // Step 2: Calculate agent time if agent is assigned
    let agentDate: string | null = null;
    let agentTime: string | null = null;
    let agentTimezone: string | null = null;

    if (createMeetingDto.agentId) {
      // Get agent to get their timezone
      const agent = await this.prisma.user.findUnique({
        where: { id: createMeetingDto.agentId },
      });

      if (!agent) {
        throw new BadRequestException('Agent not found');
      }

      if (!agent.timezone) {
        throw new BadRequestException('Agent timezone is not set');
      }

      // Convert customer time to agent time
      const agentTimeResult = convertTimezone(
        createMeetingDto.date,
        createMeetingDto.time,
        createMeetingDto.timezone,
        agent.timezone,
      );

      agentDate = agentTimeResult.date;
      agentTime = agentTimeResult.time;
      agentTimezone = agent.timezone;

      // Check if agent already has a meeting at this time (in agent's timezone)
      const existingMeeting = await this.prisma.meeting.findFirst({
        where: {
          agentId: createMeetingDto.agentId,
          agentDate: agentDate,
          agentTime: agentTime,
        },
      });

      if (existingMeeting) {
        throw new BadRequestException(
          'The selected agent already has a meeting scheduled at this time',
        );
      }
    }

    // Step 3: Create meeting with both customer and agent times
    const meeting = await this.prisma.meeting.create({
      data: {
        customerId: customer.id,
        customerDate: createMeetingDto.date,
        customerTime: createMeetingDto.time,
        customerTimezone: createMeetingDto.timezone,
        agentId: createMeetingDto.agentId || null,
        agentDate: agentDate,
        agentTime: agentTime,
        agentTimezone: agentTimezone,
      },
      include: {
        customer: true,
        agent: true,
      },
    });

    // Send emails asynchronously (don't block the response)
    this.sendMeetingEmails(meeting).catch((error) => {
      console.error('Failed to send meeting emails:', error);
    });

    return meeting;
  }

  async findAll(adminId?: string) {
    const where: any = {};

    // If adminId is provided, filter meetings by customers belonging to that admin
    if (adminId) {
      where.customer = {
        adminId: adminId,
      };
    }

    const meetings = await this.prisma.meeting.findMany({
      where,
      include: {
        customer: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        agent: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return meetings;
  }

  private async sendMeetingEmails(meeting: any) {
    const managementEmail = 'itsegzix@gmail.com';

    // Send email to management
    await this.emailService.sendMeetingNotificationToAdmin(
      meeting,
      managementEmail,
    );

    // Send email to agent if assigned
    if (meeting.agent && meeting.agent.email) {
      await this.emailService.sendMeetingNotificationToAgent(meeting);
    }

    // Send confirmation email to client
    await this.emailService.sendMeetingConfirmationToClient(meeting);
  }
}
