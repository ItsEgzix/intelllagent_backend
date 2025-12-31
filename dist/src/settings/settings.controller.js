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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getAllSettings() {
        const settings = await this.settingsService.getAllSettings();
        return { data: settings };
    }
    async getChatbotEnabled() {
        const enabled = await this.settingsService.isChatbotEnabled();
        return { enabled };
    }
    async updateSetting(updateSettingDto) {
        if (!updateSettingDto.key || updateSettingDto.value === undefined) {
            throw new common_1.BadRequestException('Key and value are required');
        }
        return this.settingsService.updateSetting(updateSettingDto.key, updateSettingDto.value, updateSettingDto.description);
    }
    async updateChatbotEnabled(dto) {
        if (typeof dto.enabled !== 'boolean') {
            throw new common_1.BadRequestException('enabled must be a boolean');
        }
        const setting = await this.settingsService.setChatbotEnabled(dto.enabled);
        return {
            data: setting,
            message: 'Chatbot visibility updated successfully',
        };
    }
    async getEmailNotifications() {
        const [superadmin, agent, client, welcome] = await Promise.all([
            this.settingsService.isEmailNotifySuperadminEnabled(),
            this.settingsService.isEmailNotifyAgentEnabled(),
            this.settingsService.isEmailNotifyClientEnabled(),
            this.settingsService.isEmailNotifyWelcomeEnabled(),
        ]);
        return {
            data: {
                superadmin,
                agent,
                client,
                welcome,
            },
        };
    }
    async updateEmailNotifySuperadmin(dto) {
        if (typeof dto.enabled !== 'boolean') {
            throw new common_1.BadRequestException('enabled must be a boolean');
        }
        const setting = await this.settingsService.setEmailNotifySuperadminEnabled(dto.enabled);
        return { data: setting, message: 'Superadmin email notifications updated' };
    }
    async updateEmailNotifyAgent(dto) {
        if (typeof dto.enabled !== 'boolean') {
            throw new common_1.BadRequestException('enabled must be a boolean');
        }
        const setting = await this.settingsService.setEmailNotifyAgentEnabled(dto.enabled);
        return { data: setting, message: 'Agent email notifications updated' };
    }
    async updateEmailNotifyClient(dto) {
        if (typeof dto.enabled !== 'boolean') {
            throw new common_1.BadRequestException('enabled must be a boolean');
        }
        const setting = await this.settingsService.setEmailNotifyClientEnabled(dto.enabled);
        return { data: setting, message: 'Client email notifications updated' };
    }
    async updateEmailNotifyWelcome(dto) {
        if (typeof dto.enabled !== 'boolean') {
            throw new common_1.BadRequestException('enabled must be a boolean');
        }
        const setting = await this.settingsService.setEmailNotifyWelcomeEnabled(dto.enabled);
        return { data: setting, message: 'Welcome email notifications updated' };
    }
    async getEmailAdditionalRecipients() {
        const emails = await this.settingsService.getEmailAdditionalRecipients();
        return { data: { emails } };
    }
    async updateEmailAdditionalRecipients(dto) {
        if (!Array.isArray(dto.emails)) {
            throw new common_1.BadRequestException('emails must be an array');
        }
        const setting = await this.settingsService.setEmailAdditionalRecipients(dto.emails);
        return { data: setting, message: 'Additional recipients updated' };
    }
    async getEmailSender() {
        const [address, name] = await Promise.all([
            this.settingsService.getEmailFromAddress(),
            this.settingsService.getEmailFromName(),
        ]);
        return {
            data: {
                address,
                name,
            },
        };
    }
    async updateEmailSender(dto) {
        if (!dto.address) {
            throw new common_1.BadRequestException('address is required');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dto.address)) {
            throw new common_1.BadRequestException('Invalid email address format');
        }
        const [addressSetting, nameSetting] = await Promise.all([
            this.settingsService.setEmailFromAddress(dto.address),
            dto.name !== undefined
                ? this.settingsService.setEmailFromName(dto.name)
                : Promise.resolve(null),
        ]);
        return {
            data: {
                address: addressSetting,
                name: nameSetting,
            },
            message: 'Email sender configuration updated',
        };
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getAllSettings", null);
__decorate([
    (0, common_1.Get)('chatbot-enabled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getChatbotEnabled", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateSetting", null);
__decorate([
    (0, common_1.Put)('chatbot-enabled'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateChatbotEnabled", null);
__decorate([
    (0, common_1.Get)('email/notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getEmailNotifications", null);
__decorate([
    (0, common_1.Put)('email/notifications/superadmin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateEmailNotifySuperadmin", null);
__decorate([
    (0, common_1.Put)('email/notifications/agent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateEmailNotifyAgent", null);
__decorate([
    (0, common_1.Put)('email/notifications/client'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateEmailNotifyClient", null);
__decorate([
    (0, common_1.Put)('email/notifications/welcome'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateEmailNotifyWelcome", null);
__decorate([
    (0, common_1.Get)('email/additional-recipients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getEmailAdditionalRecipients", null);
__decorate([
    (0, common_1.Put)('email/additional-recipients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateEmailAdditionalRecipients", null);
__decorate([
    (0, common_1.Get)('email/sender'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getEmailSender", null);
__decorate([
    (0, common_1.Put)('email/sender'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateEmailSender", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map