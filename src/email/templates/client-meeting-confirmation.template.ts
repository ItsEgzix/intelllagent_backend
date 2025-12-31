import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export function getClientMeetingConfirmationTemplate(meeting: any): {
  html: string;
  attachments: nodemailer.SendMailOptions['attachments'];
} {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  const attachments: NonNullable<nodemailer.SendMailOptions['attachments']> =
    [];

  // Add logo
  const projectRoot = process.cwd();
  const possiblePaths = [
    path.join(projectRoot, 'src', 'images', 'intellagent_logo.png'),
    path.join(projectRoot, 'dist', 'images', 'intellagent_logo.png'),
    path.join(projectRoot, 'images', 'intellagent_logo.png'),
  ];

  let logoPath: string | null = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      logoPath = possiblePath;
      break;
    }
  }

  let logoUrl = `${baseUrl}/logo/intellagent_logo.png`;

  if (logoPath) {
    attachments.push({
      filename: 'intellagent-logo.png',
      path: logoPath,
      cid: 'intellagent-logo@intellagent.com',
      contentType: 'image/png',
      contentDisposition: 'inline',
    });
    logoUrl = 'cid:intellagent-logo@intellagent.com';
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Confirmation</title>
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
            padding: 40px 30px 20px;
            text-align: center;
        }
        
        .logo {
            max-width: 180px;
            height: auto;
        }
        
        .email-content {
            padding: 40px;
            background-color: #ffffff;
        }
        
        h1 {
            font-size: 32px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 20px;
        }
        
        .confirmation-message {
            font-size: 18px;
            color: #333333;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .meeting-details {
            background-color: #f9f9f9;
            border-left: 4px solid #111111;
            padding: 24px;
            margin: 30px 0;
        }
        
        .detail-row {
            margin-bottom: 16px;
        }
        
        .detail-label {
            font-weight: 600;
            color: #333333;
            display: inline-block;
            width: 120px;
        }
        
        .detail-value {
            color: #111111;
            font-size: 16px;
        }
        
        .email-footer {
            background-color: #f9f9f9;
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="${logoUrl}" alt="IntellAgent Logo" class="logo" />
        </div>
        
        <div class="email-content">
            <h1>Meeting Confirmed!</h1>
            
            <p class="confirmation-message">
                Thank you for scheduling a meeting with us. We're looking forward to speaking with you!
            </p>
            
                   <div class="meeting-details">
                       <div class="detail-row">
                           <span class="detail-label">Date:</span>
                           <span class="detail-value">${meeting.customerDate}</span>
                       </div>
                       <div class="detail-row">
                           <span class="detail-label">Time:</span>
                           <span class="detail-value">${meeting.customerTime}</span>
                       </div>
                       <div class="detail-row">
                           <span class="detail-label">Timezone:</span>
                           <span class="detail-value">${meeting.customerTimezone}</span>
                       </div>
                       ${
                         meeting.agent && meeting.agentDate && meeting.agentTime
                           ? `
                       <div class="detail-row">
                           <span class="detail-label">Agent Time:</span>
                           <span class="detail-value">${meeting.agentDate} at ${meeting.agentTime} (${meeting.agentTimezone})</span>
                       </div>
                       `
                           : ''
                       }
                   </div>
            
            <p style="margin-top: 30px; color: #666666;">
                We'll be in touch soon to confirm the details. If you need to reschedule or have any questions, please don't hesitate to reach out.
            </p>
        </div>
        
        <div class="email-footer">
            <p>© ${new Date().getFullYear()} IntellAgent. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;

  return { html, attachments };
}
