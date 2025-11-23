import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
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
    getAvailableSlots(id: string, date: string, customerTimezone: string): Promise<string[]>;
}
