import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { convertTimezone } from '../email/templates/timezone-helper';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAgentDto: CreateAgentDto) {
    // If userId is provided, update existing user to be an agent
    if (createAgentDto.userId && createAgentDto.userId.trim() !== '') {
      const user = await this.prisma.user.findUnique({
        where: { id: createAgentDto.userId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isAgent) {
        throw new BadRequestException('User is already an agent');
      }

      // Update user to be an agent
      return this.prisma.user.update({
        where: { id: createAgentDto.userId },
        data: {
          isAgent: true,
          timezone: createAgentDto.timezone || user.timezone,
          avatar: createAgentDto.avatar || user.avatar,
          isActive: createAgentDto.isActive ?? true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isAgent: true,
          timezone: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    // Legacy: Create new user (if userId not provided)
    // This path is deprecated - should use userId instead
    if (!createAgentDto.email || !createAgentDto.name) {
      throw new BadRequestException(
        'userId is required. Please select a user from the list.',
      );
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createAgentDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Generate a random password (admin should set it later or send via email)
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create user with isAgent flag set
    return this.prisma.user.create({
      data: {
        email: createAgentDto.email,
        password: hashedPassword,
        name: createAgentDto.name,
        role: 'admin',
        isAgent: createAgentDto.isAgent ?? true, // Default to true for new agents
        timezone: createAgentDto.timezone || 'Asia/Kuala_Lumpur',
        avatar: createAgentDto.avatar,
        isActive: createAgentDto.isActive ?? true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isAgent: true,
        timezone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    // Return only users with isAgent = true
    return this.prisma.user.findMany({
      where: {
        isAgent: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isAgent: true,
        timezone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findActive() {
    // Return only active users with isAgent = true
    try {
      return await this.prisma.user.findMany({
        where: {
          isAgent: true,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isAgent: true,
          timezone: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      console.error('Error in findActive:', error);
      // Try to reconnect if connection was lost
      try {
        await this.prisma.$disconnect();
        await this.prisma.$connect();
      } catch (reconnectError) {
        console.error('Failed to reconnect:', reconnectError);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    const agent = await this.prisma.user.findFirst({
      where: {
        id,
        isAgent: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isAgent: true,
        timezone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto) {
    // Check if user exists (without filtering by isAgent, since we might be updating isAgent itself)
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, isAgent: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Don't allow changing role or password through this endpoint
    const { ...updateData } = updateAgentDto;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isAgent: true,
        timezone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    // Check if user exists (without filtering by isAgent, since we might be removing a former agent)
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, isAgent: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if agent has any meetings
    const meetingsCount = await this.prisma.meeting.count({
      where: { agentId: id },
    });

    if (meetingsCount > 0) {
      throw new BadRequestException(
        'Cannot delete agent with scheduled meetings. Deactivate instead.',
      );
    }

    // Instead of deleting, set isAgent to false
    return this.prisma.user.update({
      where: { id },
      data: { isAgent: false },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isAgent: true,
        timezone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Check if agent is available at a specific date and time (in agent's timezone)
  // Agent is unavailable if they have a meeting at that time
  async isAgentAvailable(
    agentId: string,
    date: string,
    time: string,
    customerTimezone: string,
  ): Promise<boolean> {
    const agent = await this.findOne(agentId);
    if (!agent.timezone) {
      throw new BadRequestException('Agent timezone is not set');
    }

    // Get existing meetings for this agent at this date and time (in agent's timezone)
    const existingMeeting = await this.prisma.meeting.findFirst({
      where: {
        agentId,
        agentDate: date,
        agentTime: time,
      },
    });

    return !existingMeeting; // Available if no meeting exists
  }

  // Get available time slots for an agent on a specific date
  // Accepts date in customer's timezone, converts to agent's timezone internally
  // Returns time slots in customer's timezone, already filtered for existing meetings
  async getAvailableTimeSlots(
    agentId: string,
    date: string, // Date in customer's timezone (YYYY-MM-DD)
    customerTimezone: string,
  ): Promise<string[]> {
    const agent = await this.findOne(agentId);
    if (!agent.timezone) {
      throw new BadRequestException('Agent timezone is not set');
    }

    // Convert customer's date to agent's timezone
    // We'll use a reference time (noon) to ensure accurate date conversion
    const customerDateTime = `${date}T12:00:00`;
    const customerDateObj = new Date(customerDateTime);

    // Format the date in agent's timezone
    const agentDateStr = customerDateObj.toLocaleDateString('en-CA', {
      timeZone: agent.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Get existing meetings for this agent on this date (in agent's timezone)
    const meetings = await this.prisma.meeting.findMany({
      where: {
        agentId,
        agentDate: agentDateStr,
      },
    });

    // Create a set of booked times (in agent's timezone)
    const bookedTimes = new Set(
      meetings.map((m) => m.agentTime).filter((t) => t !== null),
    );

    // Generate all possible time slots in agent's timezone (9 AM - 5 PM, excluding 1 PM - 2 PM lunch break)
    // Aligned with validateWorkingHours which allows 8:30-17:30 but excludes 13:00-14:00
    // We generate hourly slots from 9 AM to 5 PM, excluding 1 PM and 2 PM
    const allAgentSlots: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      if (hour === 13 || hour === 14) continue; // Skip 1 PM and 2 PM (lunch break)
      const timeStr = `${String(hour).padStart(2, '0')}:00`;
      allAgentSlots.push(timeStr);
    }

    // Filter out booked slots (in agent's timezone)
    const availableAgentSlots = allAgentSlots.filter(
      (slot) => !bookedTimes.has(slot),
    );

    // Convert available slots from agent's timezone to customer's timezone
    // Use agentDateStr (in agent's timezone) for conversion
    const availableCustomerSlots: string[] = [];

    for (const agentSlot of availableAgentSlots) {
      try {
        const converted = convertTimezone(
          agentDateStr,
          agentSlot,
          agent.timezone!,
          customerTimezone,
        );
        availableCustomerSlots.push(converted.time);
      } catch (e) {
        console.error('Error converting time slot:', e);
      }
    }

    return availableCustomerSlots;
  }
}
