"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const timezone_helper_1 = require("../email/templates/timezone-helper");
let AgentsService = class AgentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAgentDto) {
        if (createAgentDto.userId && createAgentDto.userId.trim() !== '') {
            const user = await this.prisma.user.findUnique({
                where: { id: createAgentDto.userId },
            });
            if (!user) {
                throw new common_1.BadRequestException('User not found');
            }
            if (user.isAgent) {
                throw new common_1.BadRequestException('User is already an agent');
            }
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
        if (!createAgentDto.email || !createAgentDto.name) {
            throw new common_1.BadRequestException('userId is required. Please select a user from the list.');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createAgentDto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        return this.prisma.user.create({
            data: {
                email: createAgentDto.email,
                password: hashedPassword,
                name: createAgentDto.name,
                role: 'admin',
                isAgent: createAgentDto.isAgent ?? true,
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
        }
        catch (error) {
            console.error('Error in findActive:', error);
            try {
                await this.prisma.$disconnect();
                await this.prisma.$connect();
            }
            catch (reconnectError) {
                console.error('Failed to reconnect:', reconnectError);
            }
            throw error;
        }
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        return agent;
    }
    async update(id, updateAgentDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, isAgent: true },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
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
    async remove(id) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, isAgent: true },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const meetingsCount = await this.prisma.meeting.count({
            where: { agentId: id },
        });
        if (meetingsCount > 0) {
            throw new common_1.BadRequestException('Cannot delete agent with scheduled meetings. Deactivate instead.');
        }
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
    async isAgentAvailable(agentId, date, time, customerTimezone) {
        const agent = await this.findOne(agentId);
        if (!agent.timezone) {
            throw new common_1.BadRequestException('Agent timezone is not set');
        }
        const existingMeeting = await this.prisma.meeting.findFirst({
            where: {
                agentId,
                agentDate: date,
                agentTime: time,
            },
        });
        return !existingMeeting;
    }
    async getAvailableTimeSlots(agentId, date, customerTimezone) {
        const agent = await this.findOne(agentId);
        if (!agent.timezone) {
            throw new common_1.BadRequestException('Agent timezone is not set');
        }
        const customerDateTime = `${date}T12:00:00`;
        const customerDateObj = new Date(customerDateTime);
        const agentDateStr = customerDateObj.toLocaleDateString('en-CA', {
            timeZone: agent.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const meetings = await this.prisma.meeting.findMany({
            where: {
                agentId,
                agentDate: agentDateStr,
            },
        });
        const bookedTimes = new Set(meetings.map((m) => m.agentTime).filter((t) => t !== null));
        const allAgentSlots = [];
        for (let hour = 9; hour <= 17; hour++) {
            if (hour === 13 || hour === 14)
                continue;
            const timeStr = `${String(hour).padStart(2, '0')}:00`;
            allAgentSlots.push(timeStr);
        }
        const availableAgentSlots = allAgentSlots.filter((slot) => !bookedTimes.has(slot));
        const availableCustomerSlots = [];
        for (const agentSlot of availableAgentSlots) {
            try {
                const converted = (0, timezone_helper_1.convertTimezone)(agentDateStr, agentSlot, agent.timezone, customerTimezone);
                availableCustomerSlots.push(converted.time);
            }
            catch (e) {
                console.error('Error converting time slot:', e);
            }
        }
        return availableCustomerSlots;
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgentsService);
//# sourceMappingURL=agents.service.js.map