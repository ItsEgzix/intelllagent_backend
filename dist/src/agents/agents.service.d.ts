import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsService implements OnModuleInit, OnModuleDestroy {
    private prisma;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    create(createAgentDto: CreateAgentDto): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        isAgent: boolean;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        isAgent: boolean;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findActive(): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        isAgent: boolean;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        isAgent: boolean;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateAgentDto: UpdateAgentDto): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        isAgent: boolean;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        isAgent: boolean;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    isAgentAvailable(agentId: string, date: string, time: string, customerTimezone: string): Promise<boolean>;
    getAvailableTimeSlots(agentId: string, date: string, customerTimezone: string): Promise<string[]>;
}
