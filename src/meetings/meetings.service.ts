import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { EmailService } from '../email/email.service';
import { convertTimezone } from '../email/templates/timezone-helper';
import { AgentsService } from '../agents/agents.service';
import { validateWorkingHours } from '../chatbot/chatbot.validators';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class MeetingsService {
  constructor(
    private readonly prisma: PrismaService,
    private emailService: EmailService,
    private agentsService: AgentsService,
    private settingsService: SettingsService,
  ) {}

  async create(createMeetingDto: CreateMeetingDto) {
    // Validate that date/time is not in the past
    this.validateNotPastDateTime(
      createMeetingDto.date,
      createMeetingDto.time,
      createMeetingDto.timezone,
    );

    // Use transaction to ensure atomicity
    return await this.prisma.$transaction(async (tx) => {
      // Step 1: Create or find customer
      let customer = await tx.customer.findUnique({
        where: { email: createMeetingDto.email },
      });

      // Determine adminId - if agent is assigned, use agent's ID as adminId
      let adminId: string | undefined = undefined;
      if (createMeetingDto.agentId) {
        adminId = createMeetingDto.agentId;
      }

      if (!customer) {
        customer = await tx.customer.create({
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
        // Always update adminId if agent is assigned (allows reassignment)
        const updateData: any = {
          name: createMeetingDto.customerName,
          phone: createMeetingDto.phone,
          timezone: createMeetingDto.timezone,
        };

        // Update adminId if agent is assigned (allows reassignment)
        if (adminId) {
          updateData.adminId = adminId;
        }

        customer = await tx.customer.update({
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
        const agent = await tx.user.findUnique({
          where: { id: createMeetingDto.agentId },
        });

        if (!agent) {
          throw new BadRequestException('Agent not found');
        }

        if (!agent.isAgent) {
          throw new BadRequestException('User is not an agent');
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

        // Validate working hours in AGENT's timezone (not customer's)
        const workingHoursValidation = validateWorkingHours(
          agentDate,
          agentTime,
          agent.timezone,
        );

        if (!workingHoursValidation.valid) {
          throw new BadRequestException(
            workingHoursValidation.message ||
              'The selected time is outside agent working hours',
          );
        }

        // Check agent availability using the service method
        const isAvailable = await this.agentsService.isAgentAvailable(
          createMeetingDto.agentId,
          agentDate,
          agentTime,
          createMeetingDto.timezone,
        );

        if (!isAvailable) {
          throw new BadRequestException(
            'The selected agent is not available at this time',
          );
        }

        // Double-check for existing meeting (race condition protection)
        // This check inside transaction helps prevent duplicates
        const existingMeeting = await tx.meeting.findFirst({
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
      // Using transaction ensures atomicity
      const meeting = await tx.meeting.create({
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
    });
  }

  /**
   * Validate that the date and time is not in the past
   */
  private validateNotPastDateTime(
    date: string,
    time: string,
    timezone: string,
  ): void {
    try {
      // Parse the date and time
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);

      // Create a date string in ISO format (this will be interpreted as local time)
      const dateTimeStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

      // Get the current time in the target timezone
      const now = new Date();
      const nowInTimezone = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);

      // Compare date strings (YYYY-MM-DD HH:mm format)
      const meetingDateTime = `${date} ${time}`;
      const [nowDate, nowTime] = nowInTimezone.split('T');
      const nowDateTime = `${nowDate} ${nowTime}`;

      // Simple string comparison works for ISO date format
      if (meetingDateTime < nowDateTime) {
        throw new BadRequestException(
          'Cannot schedule a meeting in the past. Please select a future date and time.',
        );
      }

      // Also check if it's exactly now (within the same minute) - consider that as past
      if (meetingDateTime === nowDateTime) {
        throw new BadRequestException(
          'Cannot schedule a meeting at the current time. Please select a future time.',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // If validation fails due to parsing, let it pass (other validators will catch it)
      console.error('Error validating past date/time:', error);
    }
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
    const emailPromises: Promise<any>[] = [];

    // Check if superadmin notifications are enabled
    const notifySuperadmin =
      await this.settingsService.isEmailNotifySuperadminEnabled();
    if (notifySuperadmin) {
      // Find all superadmin users and send email to each
      const superadmins = await this.prisma.user.findMany({
        where: {
          role: 'superadmin',
        },
        select: {
          email: true,
          name: true,
        },
      });

      // Send email to all superadmins
      const superadminEmailPromises = superadmins.map((superadmin) =>
        this.emailService
          .sendMeetingNotificationToAdmin(meeting, superadmin.email)
          .catch((error) => {
            console.error(
              `Failed to send meeting notification to superadmin ${superadmin.email}:`,
              error,
            );
          }),
      );
      emailPromises.push(...superadminEmailPromises);
    }

    // Get additional recipients from settings
    const additionalRecipients =
      await this.settingsService.getEmailAdditionalRecipients();
    if (additionalRecipients.length > 0) {
      const additionalEmailPromises = additionalRecipients.map((email) =>
        this.emailService
          .sendMeetingNotificationToAdmin(meeting, email)
          .catch((error) => {
            console.error(
              `Failed to send meeting notification to additional recipient ${email}:`,
              error,
            );
          }),
      );
      emailPromises.push(...additionalEmailPromises);
    }

    // Check if agent notifications are enabled
    const notifyAgent = await this.settingsService.isEmailNotifyAgentEnabled();
    if (notifyAgent && meeting.agent && meeting.agent.email) {
      const agentEmailPromise = this.emailService
        .sendMeetingNotificationToAgent(meeting)
        .catch((error) => {
          console.error(
            `Failed to send meeting notification to agent ${meeting.agent.email}:`,
            error,
          );
        });
      emailPromises.push(agentEmailPromise);
    }

    // Check if client notifications are enabled
    const notifyClient =
      await this.settingsService.isEmailNotifyClientEnabled();
    if (notifyClient) {
      const clientEmailPromise = this.emailService
        .sendMeetingConfirmationToClient(meeting)
        .catch((error) => {
          console.error(
            `Failed to send meeting confirmation to client ${meeting.customer?.email}:`,
            error,
          );
        });
      emailPromises.push(clientEmailPromise);
    }

    // Send all emails in parallel (don't wait for them to complete)
    if (emailPromises.length > 0) {
      await Promise.allSettled(emailPromises);
    }
  }
}
