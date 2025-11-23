import * as nodemailer from 'nodemailer';
export declare function getWelcomeEmailTemplate(): {
    html: string;
    attachments: nodemailer.SendMailOptions['attachments'];
};
