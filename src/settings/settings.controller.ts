import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

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

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * Get all settings (public endpoint - for frontend to check chatbot visibility)
   */
  @Get()
  async getAllSettings() {
    const settings = await this.settingsService.getAllSettings();
    return { data: settings };
  }

  /**
   * Get chatbot enabled status (public endpoint)
   */
  @Get('chatbot-enabled')
  async getChatbotEnabled() {
    const enabled = await this.settingsService.isChatbotEnabled();
    return { enabled };
  }

  /**
   * Update a setting (superadmin only)
   */
  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async updateSetting(@Body() updateSettingDto: UpdateSettingDto) {
    if (!updateSettingDto.key || updateSettingDto.value === undefined) {
      throw new BadRequestException('Key and value are required');
    }

    return this.settingsService.updateSetting(
      updateSettingDto.key,
      updateSettingDto.value,
      updateSettingDto.description,
    );
  }

  /**
   * Update chatbot visibility (superadmin only)
   */
  @Put('chatbot-enabled')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async updateChatbotEnabled(@Body() dto: UpdateChatbotEnabledDto) {
    if (typeof dto.enabled !== 'boolean') {
      throw new BadRequestException('enabled must be a boolean');
    }

    const setting = await this.settingsService.setChatbotEnabled(dto.enabled);
    return {
      data: setting,
      message: 'Chatbot visibility updated successfully',
    };
  }

  // ========== Email Notification Toggles ==========

  @Get('email/notifications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
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

  @Put('email/notifications/superadmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async updateEmailNotifySuperadmin(
    @Body() dto: UpdateEmailNotificationToggleDto,
  ) {
    if (typeof dto.enabled !== 'boolean') {
      throw new BadRequestException('enabled must be a boolean');
    }
    const setting = await this.settingsService.setEmailNotifySuperadminEnabled(
      dto.enabled,
    );
    return { data: setting, message: 'Superadmin email notifications updated' };
  }

  @Put('email/notifications/agent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async updateEmailNotifyAgent(@Body() dto: UpdateEmailNotificationToggleDto) {
    if (typeof dto.enabled !== 'boolean') {
      throw new BadRequestException('enabled must be a boolean');
    }
    const setting = await this.settingsService.setEmailNotifyAgentEnabled(
      dto.enabled,
    );
    return { data: setting, message: 'Agent email notifications updated' };
  }

  @Put('email/notifications/client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async updateEmailNotifyClient(@Body() dto: UpdateEmailNotificationToggleDto) {
    if (typeof dto.enabled !== 'boolean') {
      throw new BadRequestException('enabled must be a boolean');
    }
    const setting = await this.settingsService.setEmailNotifyClientEnabled(
      dto.enabled,
    );
    return { data: setting, message: 'Client email notifications updated' };
  }

  @Put('email/notifications/welcome')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async updateEmailNotifyWelcome(
    @Body() dto: UpdateEmailNotificationToggleDto,
  ) {
    if (typeof dto.enabled !== 'boolean') {
      throw new BadRequestException('enabled must be a boolean');
    }
    const setting = await this.settingsService.setEmailNotifyWelcomeEnabled(
      dto.enabled,
    );
    return { data: setting, message: 'Welcome email notifications updated' };
  }

  // ========== Additional Recipients ==========

  @Get('email/additional-recipients')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async getEmailAdditionalRecipients() {
    const emails = await this.settingsService.getEmailAdditionalRecipients();
    return { data: { emails } };
  }

  @Put('email/additional-recipients')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async updateEmailAdditionalRecipients(
    @Body() dto: UpdateEmailAdditionalRecipientsDto,
  ) {
    if (!Array.isArray(dto.emails)) {
      throw new BadRequestException('emails must be an array');
    }
    const setting = await this.settingsService.setEmailAdditionalRecipients(
      dto.emails,
    );
    return { data: setting, message: 'Additional recipients updated' };
  }

  // ========== Email Sender Configuration ==========

  @Get('email/sender')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
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

  @Put('email/sender')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async updateEmailSender(@Body() dto: UpdateEmailSenderDto) {
    if (!dto.address) {
      throw new BadRequestException('address is required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.address)) {
      throw new BadRequestException('Invalid email address format');
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
}
