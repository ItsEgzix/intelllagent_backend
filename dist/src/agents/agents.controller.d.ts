import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
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
    getAvailableSlots(id: string, date: string, customerTimezone: string): Promise<string[]>;
}
