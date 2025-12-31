import { SettingsService } from '../settings/settings.service';
export declare class EmailService {
    private readonly settingsService;
    private transporter;
    constructor(settingsService: SettingsService);
    sendWelcomeEmail(to: string): Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
    sendMeetingNotificationToAdmin(meeting: any, adminEmail: string): Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
    sendMeetingConfirmationToClient(meeting: any): Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
    sendMeetingNotificationToAgent(meeting: any): Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
}
