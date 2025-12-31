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
        avatar: string | null;
        isActive: boolean;
        isAgent: boolean;
        role: string;
    }>;
    findAll(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        isAgent: boolean;
        role: string;
    }[]>;
    findActive(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        isAgent: boolean;
        role: string;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        isAgent: boolean;
        role: string;
    }>;
    update(id: string, updateAgentDto: UpdateAgentDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        isAgent: boolean;
        role: string;
    }>;
    remove(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        isAgent: boolean;
        role: string;
    }>;
    isAgentAvailable(agentId: string, date: string, time: string, customerTimezone: string): Promise<boolean>;
    getAvailableTimeSlots(agentId: string, date: string, customerTimezone: string): Promise<string[]>;
}
