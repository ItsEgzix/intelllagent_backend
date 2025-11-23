import * as nodemailer from 'nodemailer';
export declare function getClientMeetingConfirmationTemplate(meeting: any): {
    html: string;
    attachments: nodemailer.SendMailOptions['attachments'];
};
