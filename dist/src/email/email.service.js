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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const welcome_email_template_1 = require("./templates/welcome-email.template");
const admin_meeting_notification_template_1 = require("./templates/admin-meeting-notification.template");
const client_meeting_confirmation_template_1 = require("./templates/client-meeting-confirmation.template");
const agent_meeting_notification_template_1 = require("./templates/agent-meeting-notification.template");
const timezone_helper_1 = require("./templates/timezone-helper");
const settings_service_1 = require("../settings/settings.service");
let EmailService = class EmailService {
    settingsService;
    transporter;
    constructor(settingsService) {
        this.settingsService = settingsService;
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            console.log('SMTP transporter configured successfully');
        }
        else {
            console.warn('SMTP credentials not found. SMTP_USER:', !!process.env.SMTP_USER, 'SMTP_PASS:', !!process.env.SMTP_PASS);
        }
    }
    async sendWelcomeEmail(to) {
        if (!this.transporter) {
            console.warn('SMTP not configured. Welcome email not sent to:', to);
            return { success: false, reason: 'SMTP not configured' };
        }
        const isEnabled = await this.settingsService.isEmailNotifyWelcomeEnabled();
        if (!isEnabled) {
            console.warn('Welcome emails are disabled in settings');
            return { success: false, reason: 'Welcome emails disabled' };
        }
        const { html, attachments } = (0, welcome_email_template_1.getWelcomeEmailTemplate)();
        const fromAddress = (await this.settingsService.getEmailFromAddress()) ||
            process.env.SMTP_FROM ||
            process.env.SMTP_USER;
        const fromName = await this.settingsService.getEmailFromName();
        const from = fromName ? `${fromName} <${fromAddress}>` : fromAddress;
        const mailOptions = {
            from,
            to,
            subject: 'Welcome to IntellAgent Newsletter! 🚀',
            html,
            attachments,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true };
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
            throw error;
        }
    }
    async sendMeetingNotificationToAdmin(meeting, adminEmail) {
        if (!this.transporter) {
            console.warn('SMTP not configured. Meeting notification not sent to admin');
            return { success: false, reason: 'SMTP not configured' };
        }
        const { html, attachments } = (0, admin_meeting_notification_template_1.getAdminMeetingNotificationTemplate)(meeting, timezone_helper_1.calculateKLTime);
        const subject = `Meeting Scheduled - ${meeting.customer?.name || 'Client'} with ${meeting.agent?.name || 'Agent'} - ${meeting.customerDate} at ${meeting.customerTime}`;
        const fromAddress = (await this.settingsService.getEmailFromAddress()) ||
            process.env.SMTP_FROM ||
            process.env.SMTP_USER;
        const fromName = await this.settingsService.getEmailFromName();
        const from = fromName ? `${fromName} <${fromAddress}>` : fromAddress;
        const mailOptions = {
            from,
            to: adminEmail,
            subject,
            html,
            attachments,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true };
        }
        catch (error) {
            console.error('Error sending meeting notification to admin:', error);
            throw error;
        }
    }
    async sendMeetingConfirmationToClient(meeting) {
        if (!this.transporter) {
            console.warn('SMTP not configured. Meeting confirmation not sent to client');
            return { success: false, reason: 'SMTP not configured' };
        }
        if (!meeting.customer || !meeting.customer.email) {
            console.warn('No customer email found for meeting confirmation');
            return { success: false, reason: 'No customer email' };
        }
        const { html, attachments } = (0, client_meeting_confirmation_template_1.getClientMeetingConfirmationTemplate)(meeting);
        const subject = `Meeting Scheduled - ${meeting.customerDate} at ${meeting.customerTime}`;
        const fromAddress = (await this.settingsService.getEmailFromAddress()) ||
            process.env.SMTP_FROM ||
            process.env.SMTP_USER;
        const fromName = await this.settingsService.getEmailFromName();
        const from = fromName ? `${fromName} <${fromAddress}>` : fromAddress;
        const mailOptions = {
            from,
            to: meeting.customer.email,
            subject,
            html,
            attachments,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true };
        }
        catch (error) {
            console.error('Error sending meeting confirmation to client:', error);
            throw error;
        }
    }
    async sendMeetingNotificationToAgent(meeting) {
        if (!this.transporter) {
            console.warn('SMTP not configured. Meeting notification not sent to agent');
            return { success: false, reason: 'SMTP not configured' };
        }
        if (!meeting.agent || !meeting.agent.email) {
            console.warn('No agent email found for meeting notification');
            return { success: false, reason: 'No agent email' };
        }
        const html = (0, agent_meeting_notification_template_1.getAgentMeetingNotificationTemplate)(meeting);
        const subject = `New Meeting Scheduled - ${meeting.customerDate} at ${meeting.customerTime}`;
        const fromAddress = (await this.settingsService.getEmailFromAddress()) ||
            process.env.SMTP_FROM ||
            process.env.SMTP_USER;
        const fromName = await this.settingsService.getEmailFromName();
        const from = fromName ? `${fromName} <${fromAddress}>` : fromAddress;
        const mailOptions = {
            from,
            to: meeting.agent.email,
            subject,
            html,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true };
        }
        catch (error) {
            console.error('Error sending meeting notification to agent:', error);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], EmailService);
//# sourceMappingURL=email.service.js.map