import * as nodemailer from 'nodemailer';
export declare function getAdminMeetingNotificationTemplate(meeting: any, calculateKLTime: (date: string, time: string, timezone: string) => string): {
    html: string;
    attachments: nodemailer.SendMailOptions['attachments'];
};
