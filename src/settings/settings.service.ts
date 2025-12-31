import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get a setting by key
   */
  async getSetting(key: string): Promise<string | null> {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });

    return setting?.value || null;
  }

  /**
   * Get all settings
   */
  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await this.prisma.setting.findMany();
    const result: Record<string, string> = {};

    for (const setting of settings) {
      result[setting.key] = setting.value;
    }

    return result;
  }

  /**
   * Get chatbot visibility setting (defaults to true if not set)
   */
  async isChatbotEnabled(): Promise<boolean> {
    const value = await this.getSetting('chatbot_enabled');
    if (value === null) {
      // Default to enabled if not set
      return true;
    }
    return value === 'true';
  }

  /**
   * Update or create a setting (upsert)
   */
  async updateSetting(
    key: string,
    value: string,
    description?: string,
  ): Promise<{
    id: string;
    key: string;
    value: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }> {
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

  /**
   * Set chatbot visibility
   */
  async setChatbotEnabled(enabled: boolean): Promise<{
    id: string;
    key: string;
    value: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }> {
    return this.updateSetting(
      'chatbot_enabled',
      enabled.toString(),
      'Controls whether the AI chatbot widget is visible on the frontend',
    );
  }

  // ========== Email Notification Toggles ==========

  async isEmailNotifySuperadminEnabled(): Promise<boolean> {
    const value = await this.getSetting('email_notify_superadmin_enabled');
    return value === null ? true : value === 'true'; // Default to enabled
  }

  async isEmailNotifyAgentEnabled(): Promise<boolean> {
    const value = await this.getSetting('email_notify_agent_enabled');
    return value === null ? true : value === 'true'; // Default to enabled
  }

  async isEmailNotifyClientEnabled(): Promise<boolean> {
    const value = await this.getSetting('email_notify_client_enabled');
    return value === null ? true : value === 'true'; // Default to enabled
  }

  async isEmailNotifyWelcomeEnabled(): Promise<boolean> {
    const value = await this.getSetting('email_notify_welcome_enabled');
    return value === null ? true : value === 'true'; // Default to enabled
  }

  async setEmailNotifySuperadminEnabled(enabled: boolean) {
    return this.updateSetting(
      'email_notify_superadmin_enabled',
      enabled.toString(),
      'Enable/disable email notifications to superadmins when meetings are scheduled',
    );
  }

  async setEmailNotifyAgentEnabled(enabled: boolean) {
    return this.updateSetting(
      'email_notify_agent_enabled',
      enabled.toString(),
      'Enable/disable email notifications to agents when meetings are scheduled',
    );
  }

  async setEmailNotifyClientEnabled(enabled: boolean) {
    return this.updateSetting(
      'email_notify_client_enabled',
      enabled.toString(),
      'Enable/disable confirmation emails to clients when meetings are scheduled',
    );
  }

  async setEmailNotifyWelcomeEnabled(enabled: boolean) {
    return this.updateSetting(
      'email_notify_welcome_enabled',
      enabled.toString(),
      'Enable/disable welcome emails to new subscribers',
    );
  }

  // ========== Additional Recipients ==========

  async getEmailAdditionalRecipients(): Promise<string[]> {
    const value = await this.getSetting('email_additional_recipients');
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  async setEmailAdditionalRecipients(emails: string[]) {
    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emails.filter((email) => emailRegex.test(email));
    return this.updateSetting(
      'email_additional_recipients',
      JSON.stringify(validEmails),
      'Additional email addresses to notify when meetings are scheduled (JSON array)',
    );
  }

  // ========== Email Sender Configuration ==========

  async getEmailFromAddress(): Promise<string | null> {
    return this.getSetting('email_from_address');
  }

  async getEmailFromName(): Promise<string | null> {
    return this.getSetting('email_from_name');
  }

  async setEmailFromAddress(address: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address)) {
      throw new Error('Invalid email address');
    }
    return this.updateSetting(
      'email_from_address',
      address,
      'Email address to use as sender (overrides SMTP_FROM env variable)',
    );
  }

  async setEmailFromName(name: string) {
    return this.updateSetting(
      'email_from_name',
      name,
      'Display name for email sender',
    );
  }
}
