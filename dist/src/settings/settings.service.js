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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSetting(key) {
        const setting = await this.prisma.setting.findUnique({
            where: { key },
        });
        return setting?.value || null;
    }
    async getAllSettings() {
        const settings = await this.prisma.setting.findMany();
        const result = {};
        for (const setting of settings) {
            result[setting.key] = setting.value;
        }
        return result;
    }
    async isChatbotEnabled() {
        const value = await this.getSetting('chatbot_enabled');
        if (value === null) {
            return true;
        }
        return value === 'true';
    }
    async updateSetting(key, value, description) {
        return this.prisma.setting.upsert({
            where: { key },
            update: {
                value,
                ...(description !== undefined && { description }),
            },
            create: {
                key,
                value,
                description: description || null,
            },
        });
    }
    async setChatbotEnabled(enabled) {
        return this.updateSetting('chatbot_enabled', enabled.toString(), 'Controls whether the AI chatbot widget is visible on the frontend');
    }
    async isEmailNotifySuperadminEnabled() {
        const value = await this.getSetting('email_notify_superadmin_enabled');
        return value === null ? true : value === 'true';
    }
    async isEmailNotifyAgentEnabled() {
        const value = await this.getSetting('email_notify_agent_enabled');
        return value === null ? true : value === 'true';
    }
    async isEmailNotifyClientEnabled() {
        const value = await this.getSetting('email_notify_client_enabled');
        return value === null ? true : value === 'true';
    }
    async isEmailNotifyWelcomeEnabled() {
        const value = await this.getSetting('email_notify_welcome_enabled');
        return value === null ? true : value === 'true';
    }
    async setEmailNotifySuperadminEnabled(enabled) {
        return this.updateSetting('email_notify_superadmin_enabled', enabled.toString(), 'Enable/disable email notifications to superadmins when meetings are scheduled');
    }
    async setEmailNotifyAgentEnabled(enabled) {
        return this.updateSetting('email_notify_agent_enabled', enabled.toString(), 'Enable/disable email notifications to agents when meetings are scheduled');
    }
    async setEmailNotifyClientEnabled(enabled) {
        return this.updateSetting('email_notify_client_enabled', enabled.toString(), 'Enable/disable confirmation emails to clients when meetings are scheduled');
    }
    async setEmailNotifyWelcomeEnabled(enabled) {
        return this.updateSetting('email_notify_welcome_enabled', enabled.toString(), 'Enable/disable welcome emails to new subscribers');
    }
    async getEmailAdditionalRecipients() {
        const value = await this.getSetting('email_additional_recipients');
        if (!value)
            return [];
        try {
            return JSON.parse(value);
        }
        catch {
            return [];
        }
    }
    async setEmailAdditionalRecipients(emails) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmails = emails.filter((email) => emailRegex.test(email));
        return this.updateSetting('email_additional_recipients', JSON.stringify(validEmails), 'Additional email addresses to notify when meetings are scheduled (JSON array)');
    }
    async getEmailFromAddress() {
        return this.getSetting('email_from_address');
    }
    async getEmailFromName() {
        return this.getSetting('email_from_name');
    }
    async setEmailFromAddress(address) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(address)) {
            throw new Error('Invalid email address');
        }
        return this.updateSetting('email_from_address', address, 'Email address to use as sender (overrides SMTP_FROM env variable)');
    }
    async setEmailFromName(name) {
        return this.updateSetting('email_from_name', name, 'Display name for email sender');
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map