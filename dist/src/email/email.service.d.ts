export declare class EmailService {
    private transporter;
    constructor();
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
