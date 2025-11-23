import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { getWelcomeEmailTemplate } from './templates/welcome-email.template';
import { getAdminMeetingNotificationTemplate } from './templates/admin-meeting-notification.template';
import { getClientMeetingConfirmationTemplate } from './templates/client-meeting-confirmation.template';
import { getAgentMeetingNotificationTemplate } from './templates/agent-meeting-notification.template';
import { calculateKLTime } from './templates/timezone-helper';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
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

    const { html, attachments } = getWelcomeEmailTemplate();

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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

    const html = getAdminMeetingNotificationTemplate(meeting, calculateKLTime);

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminEmail,
      subject: `New Meeting Request - ${meeting.date} at ${meeting.time} (${meeting.timezone})`,
      html,
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

    const { html, attachments } = getClientMeetingConfirmationTemplate(meeting);

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: meeting.email,
      subject: `Meeting Scheduled - ${meeting.date} at ${meeting.time}`,
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

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: meeting.agent.email,
      subject: `New Meeting Scheduled - ${meeting.date} at ${meeting.time}`,
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
