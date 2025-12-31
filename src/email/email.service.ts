import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { getWelcomeEmailTemplate } from './templates/welcome-email.template';
import { getAdminMeetingNotificationTemplate } from './templates/admin-meeting-notification.template';
import { getClientMeetingConfirmationTemplate } from './templates/client-meeting-confirmation.template';
import { getAgentMeetingNotificationTemplate } from './templates/agent-meeting-notification.template';
import { calculateKLTime } from './templates/timezone-helper';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly settingsService: SettingsService) {
    // Only create transporter if SMTP credentials are provided
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
    } else {
      console.warn(
        'SMTP credentials not found. SMTP_USER:',
        !!process.env.SMTP_USER,
        'SMTP_PASS:',
        !!process.env.SMTP_PASS,
      );
    }
  }

  async sendWelcomeEmail(to: string) {
    // Skip sending if SMTP is not configured
    if (!this.transporter) {
      console.warn('SMTP not configured. Welcome email not sent to:', to);
      return { success: false, reason: 'SMTP not configured' };
    }

    // Check if welcome emails are enabled
    const isEnabled = await this.settingsService.isEmailNotifyWelcomeEnabled();
    if (!isEnabled) {
      console.warn('Welcome emails are disabled in settings');
      return { success: false, reason: 'Welcome emails disabled' };
    }

    const { html, attachments } = getWelcomeEmailTemplate();

    // Get sender configuration
    const fromAddress =
      (await this.settingsService.getEmailFromAddress()) ||
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
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendMeetingNotificationToAdmin(meeting: any, adminEmail: string) {
    if (!this.transporter) {
      console.warn(
        'SMTP not configured. Meeting notification not sent to admin',
      );
      return { success: false, reason: 'SMTP not configured' };
    }

    const { html, attachments } = getAdminMeetingNotificationTemplate(
      meeting,
      calculateKLTime,
    );

    // Subject line (hardcoded)
    const subject = `Meeting Scheduled - ${meeting.customer?.name || 'Client'} with ${meeting.agent?.name || 'Agent'} - ${meeting.customerDate} at ${meeting.customerTime}`;

    // Get sender configuration
    const fromAddress =
      (await this.settingsService.getEmailFromAddress()) ||
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
    } catch (error) {
      console.error('Error sending meeting notification to admin:', error);
      throw error;
    }
  }

  async sendMeetingConfirmationToClient(meeting: any) {
    if (!this.transporter) {
      console.warn(
        'SMTP not configured. Meeting confirmation not sent to client',
      );
      return { success: false, reason: 'SMTP not configured' };
    }

    if (!meeting.customer || !meeting.customer.email) {
      console.warn('No customer email found for meeting confirmation');
      return { success: false, reason: 'No customer email' };
    }

    const { html, attachments } = getClientMeetingConfirmationTemplate(meeting);

    // Subject line (hardcoded)
    const subject = `Meeting Scheduled - ${meeting.customerDate} at ${meeting.customerTime}`;

    // Get sender configuration
    const fromAddress =
      (await this.settingsService.getEmailFromAddress()) ||
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
    } catch (error) {
      console.error('Error sending meeting confirmation to client:', error);
      throw error;
    }
  }

  async sendMeetingNotificationToAgent(meeting: any) {
    if (!this.transporter) {
      console.warn(
        'SMTP not configured. Meeting notification not sent to agent',
      );
      return { success: false, reason: 'SMTP not configured' };
    }

    if (!meeting.agent || !meeting.agent.email) {
      console.warn('No agent email found for meeting notification');
      return { success: false, reason: 'No agent email' };
    }

    const html = getAgentMeetingNotificationTemplate(meeting);

    // Subject line (hardcoded)
    const subject = `New Meeting Scheduled - ${meeting.customerDate} at ${meeting.customerTime}`;

    // Get sender configuration
    const fromAddress =
      (await this.settingsService.getEmailFromAddress()) ||
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
    } catch (error) {
      console.error('Error sending meeting notification to agent:', error);
      throw error;
    }
  }
}
