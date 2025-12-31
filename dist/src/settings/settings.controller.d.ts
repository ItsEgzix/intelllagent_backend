import { SettingsService } from './settings.service';
interface UpdateSettingDto {
    key: string;
    value: string;
    description?: string;
}
interface UpdateChatbotEnabledDto {
    enabled: boolean;
}
interface UpdateEmailNotificationToggleDto {
    enabled: boolean;
}
interface UpdateEmailAdditionalRecipientsDto {
    emails: string[];
}
interface UpdateEmailSenderDto {
    address: string;
    name?: string;
}
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAllSettings(): Promise<{
        data: Record<string, string>;
    }>;
    getChatbotEnabled(): Promise<{
        enabled: boolean;
    }>;
    updateSetting(updateSettingDto: UpdateSettingDto): Promise<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateChatbotEnabled(dto: UpdateChatbotEnabledDto): Promise<{
        data: {
            id: string;
            key: string;
            value: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    getEmailNotifications(): Promise<{
        data: {
            superadmin: boolean;
            agent: boolean;
            client: boolean;
            welcome: boolean;
        };
    }>;
    updateEmailNotifySuperadmin(dto: UpdateEmailNotificationToggleDto): Promise<{
        data: {
            id: string;
            key: string;
            value: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    updateEmailNotifyAgent(dto: UpdateEmailNotificationToggleDto): Promise<{
        data: {
            id: string;
            key: string;
            value: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    updateEmailNotifyClient(dto: UpdateEmailNotificationToggleDto): Promise<{
        data: {
            id: string;
            key: string;
            value: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    updateEmailNotifyWelcome(dto: UpdateEmailNotificationToggleDto): Promise<{
        data: {
            id: string;
            key: string;
            value: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    getEmailAdditionalRecipients(): Promise<{
        data: {
            emails: string[];
        };
    }>;
    updateEmailAdditionalRecipients(dto: UpdateEmailAdditionalRecipientsDto): Promise<{
        data: {
            id: string;
            key: string;
            value: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    getEmailSender(): Promise<{
        data: {
            address: string | null;
            name: string | null;
        };
    }>;
    updateEmailSender(dto: UpdateEmailSenderDto): Promise<{
        data: {
            address: {
                id: string;
                key: string;
                value: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            name: {
                id: string;
                key: string;
                value: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        };
        message: string;
    }>;
}
export {};
