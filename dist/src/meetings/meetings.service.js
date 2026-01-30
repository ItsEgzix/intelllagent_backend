"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const timezone_helper_1 = require("../email/templates/timezone-helper");
const agents_service_1 = require("../agents/agents.service");
const chatbot_validators_1 = require("../chatbot/chatbot.validators");
const settings_service_1 = require("../settings/settings.service");
let MeetingsService = class MeetingsService {
    prisma;
    emailService;
    agentsService;
    settingsService;
    constructor(prisma, emailService, agentsService, settingsService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.agentsService = agentsService;
        this.settingsService = settingsService;
    }
    async create(createMeetingDto) {
        this.validateNotPastDateTime(createMeetingDto.date, createMeetingDto.time, createMeetingDto.timezone);
        return await this.prisma.$transaction(async (tx) => {
            let customer = await tx.customer.findUnique({
                where: { email: createMeetingDto.email },
            });
            let adminId = undefined;
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
                        source: 'website',
                    },
                });
            }
            else {
                const updateData = {
                    name: createMeetingDto.customerName,
                    phone: createMeetingDto.phone,
                    timezone: createMeetingDto.timezone,
                };
                if (adminId) {
                    updateData.adminId = adminId;
                }
                customer = await tx.customer.update({
                    where: { id: customer.id },
                    data: updateData,
                });
            }
            let agentDate = null;
            let agentTime = null;
            let agentTimezone = null;
            if (createMeetingDto.agentId) {
                const agent = await tx.user.findUnique({
                    where: { id: createMeetingDto.agentId },
                });
                if (!agent) {
                    throw new common_1.BadRequestException('Agent not found');
                }
                if (!agent.isAgent) {
                    throw new common_1.BadRequestException('User is not an agent');
                }
                if (!agent.timezone) {
                    throw new common_1.BadRequestException('Agent timezone is not set');
                }
                const agentTimeResult = (0, timezone_helper_1.convertTimezone)(createMeetingDto.date, createMeetingDto.time, createMeetingDto.timezone, agent.timezone);
                agentDate = agentTimeResult.date;
                agentTime = agentTimeResult.time;
                agentTimezone = agent.timezone;
                const workingHoursValidation = (0, chatbot_validators_1.validateWorkingHours)(agentDate, agentTime, agent.timezone);
                if (!workingHoursValidation.valid) {
                    throw new common_1.BadRequestException(workingHoursValidation.message ||
                        'The selected time is outside agent working hours');
                }
                const isAvailable = await this.agentsService.isAgentAvailable(createMeetingDto.agentId, agentDate, agentTime, createMeetingDto.timezone);
                if (!isAvailable) {
                    throw new common_1.BadRequestException('The selected agent is not available at this time');
                }
                const existingMeeting = await tx.meeting.findFirst({
                    where: {
                        agentId: createMeetingDto.agentId,
                        agentDate: agentDate,
                        agentTime: agentTime,
                    },
                });
                if (existingMeeting) {
                    throw new common_1.BadRequestException('The selected agent already has a meeting scheduled at this time');
                }
            }
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
            this.sendMeetingEmails(meeting).catch((error) => {
                console.error('Failed to send meeting emails:', error);
            });
            return meeting;
        });
    }
    validateNotPastDateTime(date, time, timezone) {
        try {
            const [year, month, day] = date.split('-').map(Number);
            const [hours, minutes] = time.split(':').map(Number);
            const dateTimeStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
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
            const meetingDateTime = `${date} ${time}`;
            const [nowDate, nowTime] = nowInTimezone.split('T');
            const nowDateTime = `${nowDate} ${nowTime}`;
            if (meetingDateTime < nowDateTime) {
                throw new common_1.BadRequestException('Cannot schedule a meeting in the past. Please select a future date and time.');
            }
            if (meetingDateTime === nowDateTime) {
                throw new common_1.BadRequestException('Cannot schedule a meeting at the current time. Please select a future time.');
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error validating past date/time:', error);
        }
    }
    async findAll(adminId) {
        const where = {};
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
    async sendMeetingEmails(meeting) {
        const emailPromises = [];
        const notifySuperadmin = await this.settingsService.isEmailNotifySuperadminEnabled();
        if (notifySuperadmin) {
            const superadmins = await this.prisma.user.findMany({
                where: {
                    role: 'superadmin',
                },
                select: {
                    email: true,
                    name: true,
                },
            });
            const superadminEmailPromises = superadmins.map((superadmin) => this.emailService
                .sendMeetingNotificationToAdmin(meeting, superadmin.email)
                .catch((error) => {
                console.error(`Failed to send meeting notification to superadmin ${superadmin.email}:`, error);
            }));
            emailPromises.push(...superadminEmailPromises);
        }
        const additionalRecipients = await this.settingsService.getEmailAdditionalRecipients();
        if (additionalRecipients.length > 0) {
            const additionalEmailPromises = additionalRecipients.map((email) => this.emailService
                .sendMeetingNotificationToAdmin(meeting, email)
                .catch((error) => {
                console.error(`Failed to send meeting notification to additional recipient ${email}:`, error);
            }));
            emailPromises.push(...additionalEmailPromises);
        }
        const notifyAgent = await this.settingsService.isEmailNotifyAgentEnabled();
        if (notifyAgent && meeting.agent && meeting.agent.email) {
            const agentEmailPromise = this.emailService
                .sendMeetingNotificationToAgent(meeting)
                .catch((error) => {
                console.error(`Failed to send meeting notification to agent ${meeting.agent.email}:`, error);
            });
            emailPromises.push(agentEmailPromise);
        }
        const notifyClient = await this.settingsService.isEmailNotifyClientEnabled();
        if (notifyClient) {
            const clientEmailPromise = this.emailService
                .sendMeetingConfirmationToClient(meeting)
                .catch((error) => {
                console.error(`Failed to send meeting confirmation to client ${meeting.customer?.email}:`, error);
            });
            emailPromises.push(clientEmailPromise);
        }
        if (emailPromises.length > 0) {
            await Promise.allSettled(emailPromises);
        }
    }
};
exports.MeetingsService = MeetingsService;
exports.MeetingsService = MeetingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        agents_service_1.AgentsService,
        settings_service_1.SettingsService])
], MeetingsService);
//# sourceMappingURL=meetings.service.js.map