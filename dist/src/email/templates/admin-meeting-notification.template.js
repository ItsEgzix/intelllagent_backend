"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminMeetingNotificationTemplate = getAdminMeetingNotificationTemplate;
function getAdminMeetingNotificationTemplate(meeting, calculateKLTime) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Meeting Request</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
            color: #111111;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 0;
        }
        
        .email-header {
            background-color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        
        .email-content {
            padding: 40px;
            background-color: #ffffff;
        }
        
        h1 {
            font-size: 28px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 20px;
        }
        
        .meeting-details {
            background-color: #f9f9f9;
            border-left: 4px solid #111111;
            padding: 20px;
            margin: 20px 0;
        }
        
        .detail-row {
            margin-bottom: 12px;
        }
        
        .detail-label {
            font-weight: 600;
            color: #333333;
            display: inline-block;
            width: 100px;
        }
        
        .detail-value {
            color: #111111;
        }

        .kl-time-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px dashed #ccc;
        }
        
        .email-footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>New Meeting Request</h1>
        </div>
        
        <div class="email-content">
            <p style="margin-bottom: 20px;">You have received a new meeting request:</p>
            
            <div class="meeting-details">
                <div class="detail-row">
                    <span class="detail-label">Customer:</span>
                    <span class="detail-value">${meeting.customer?.name || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${meeting.customer?.email || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${meeting.customer?.phone || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Customer Time:</span>
                    <span class="detail-value">${meeting.customerDate} at ${meeting.customerTime} (${meeting.customerTimezone})</span>
                </div>
                ${meeting.agent
        ? `
                <div class="detail-row">
                    <span class="detail-label">Assigned Agent:</span>
                    <span class="detail-value">${meeting.agent.name || meeting.agent.email} (${meeting.agent.timezone || 'N/A'})</span>
                </div>
                ${meeting.agentDate && meeting.agentTime
            ? `
                <div class="detail-row">
                    <span class="detail-label">Agent Time:</span>
                    <span class="detail-value">${meeting.agentDate} at ${meeting.agentTime} (${meeting.agentTimezone})</span>
                </div>
                `
            : ''}
                `
        : ''}
                
                <div class="kl-time-section">
                    <p style="font-weight: bold; margin-bottom: 10px;">Management Time (Kuala Lumpur):</p>
                    <div class="detail-row">
                        <span class="detail-label">KL Time:</span>
                        <span class="detail-value">${calculateKLTime(meeting.customerDate, meeting.customerTime, meeting.customerTimezone)}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="email-footer">
            <p>This is an automated notification from IntellAgent meeting scheduling system.</p>
        </div>
    </div>
</body>
</html>
  `;
}
//# sourceMappingURL=admin-meeting-notification.template.js.map