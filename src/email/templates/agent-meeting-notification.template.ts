export function getAgentMeetingNotificationTemplate(meeting: any): string {
  const agentTimezone = meeting.agent?.timezone || 'Not set';
  const agentName = meeting.agent?.name || 'Agent';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Meeting Scheduled</title>
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
        
        .greeting {
            font-size: 18px;
            color: #333333;
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
            width: 120px;
        }
        
        .detail-value {
            color: #111111;
        }

        .timezone-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px dashed #ccc;
        }

        .timezone-note {
            font-size: 14px;
            color: #666666;
            margin-top: 10px;
            font-style: italic;
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
            <h1>New Meeting Scheduled</h1>
        </div>
        
        <div class="email-content">
            <p class="greeting">Hello ${agentName},</p>
            
            <p style="margin-bottom: 20px;">You have a new meeting scheduled:</p>
            
            <div class="meeting-details">
                <div class="detail-row">
                    <span class="detail-label">Customer:</span>
                    <span class="detail-value">${meeting.customer?.name || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Customer Email:</span>
                    <span class="detail-value">${meeting.customer?.email || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Customer Phone:</span>
                    <span class="detail-value">${meeting.customer?.phone || 'N/A'}</span>
                </div>
                
                <div class="timezone-section">
                    <p style="font-weight: bold; margin-bottom: 10px;">Meeting Time:</p>
                    ${
                      meeting.agentDate && meeting.agentTime
                        ? `
                    <div class="detail-row">
                        <span class="detail-label">Your Time:</span>
                        <span class="detail-value">${meeting.agentDate} at ${meeting.agentTime} (${meeting.agentTimezone})</span>
                    </div>
                    `
                        : ''
                    }
                    <div class="detail-row">
                        <span class="detail-label">Customer Time:</span>
                        <span class="detail-value">${meeting.customerDate} at ${meeting.customerTime} (${meeting.customerTimezone})</span>
                    </div>
                </div>
            </div>

            <p style="margin-top: 30px; color: #666666;">
                Please prepare for this meeting and ensure you're available at the scheduled time.
            </p>
        </div>
        
        <div class="email-footer">
            <p>This is an automated notification from IntellAgent meeting scheduling system.</p>
        </div>
    </div>
</body>
</html>
  `;
}
