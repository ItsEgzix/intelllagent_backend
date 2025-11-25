import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createAgentDto: CreateAgentDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        role: string;
        isAgent: boolean;
        avatar: string | null;
        isActive: boolean;
    }>;
    findAll(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        role: string;
        isAgent: boolean;
        avatar: string | null;
        isActive: boolean;
    }[]>;
    findActive(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        role: string;
        isAgent: boolean;
        avatar: string | null;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        role: string;
        isAgent: boolean;
        avatar: string | null;
        isActive: boolean;
    }>;
    update(id: string, updateAgentDto: UpdateAgentDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        role: string;
        isAgent: boolean;
        avatar: string | null;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        role: string;
        isAgent: boolean;
        avatar: string | null;
        isActive: boolean;
    }>;
    isAgentAvailable(agentId: string, date: string, time: string, customerTimezone: string): Promise<boolean>;
    getAvailableTimeSlots(agentId: string, date: string, customerTimezone: string): Promise<string[]>;
}
