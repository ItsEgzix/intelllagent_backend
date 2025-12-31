import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSetting(key: string): Promise<string | null>;
    getAllSettings(): Promise<Record<string, string>>;
    isChatbotEnabled(): Promise<boolean>;
    updateSetting(key: string, value: string, description?: string): Promise<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setChatbotEnabled(enabled: boolean): Promise<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    isEmailNotifySuperadminEnabled(): Promise<boolean>;
    isEmailNotifyAgentEnabled(): Promise<boolean>;
    isEmailNotifyClientEnabled(): Promise<boolean>;
    isEmailNotifyWelcomeEnabled(): Promise<boolean>;
    setEmailNotifySuperadminEnabled(enabled: boolean): Promise<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setEmailNotifyAgentEnabled(enabled: boolean): Promise<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setEmailNotifyClientEnabled(enabled: boolean): Promise<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setEmailNotifyWelcomeEnabled(enabled: boolean): Promise<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getEmailAdditionalRecipients(): Promise<string[]>;
    setEmailAdditionalRecipients(emails: string[]): Promise<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getEmailFromAddress(): Promise<string | null>;
    getEmailFromName(): Promise<string | null>;
    setEmailFromAddress(address: string): Promise<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setEmailFromName(name: string): Promise<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
