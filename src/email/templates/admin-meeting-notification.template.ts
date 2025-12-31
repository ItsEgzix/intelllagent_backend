import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export function getAdminMeetingNotificationTemplate(
  meeting: any,
  calculateKLTime: (date: string, time: string, timezone: string) => string,
): {
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
    // Add relative path fallback
    path.join(__dirname, '..', '..', 'images', 'intellagent_logo.png'),
    path.join(__dirname, '..', '..', '..', 'images', 'intellagent_logo.png'),
  ];

  let logoPath: string | null = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      logoPath = possiblePath;
      break;
    }
  }

  if (!logoPath) {
    console.warn(
      '⚠️  Logo file not found in any expected path:',
      possiblePaths,
    );
  } else {
    // console.log('✅ Logo found at:', logoPath);
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
            padding: 40px 30px 20px;
            text-align: left;
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
            <img src="${logoUrl}" alt="IntellAgent Logo" class="logo" />
        </div>
        
        <div class="email-content">
            <p style="margin-bottom: 20px;">A meeting has been scheduled:</p>
            
            <div class="meeting-details">
                <div class="detail-row">
                    <span class="detail-label">Client:</span>
                    <span class="detail-value"><strong>${meeting.customer?.name || 'N/A'}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Client Email:</span>
                    <span class="detail-value">${meeting.customer?.email || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Client Phone:</span>
                    <span class="detail-value">${meeting.customer?.phone || 'N/A'}</span>
                </div>
                ${
                  meeting.agent
                    ? `
                <div class="detail-row" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <span class="detail-label">Assigned Agent:</span>
                    <span class="detail-value"><strong>${meeting.agent.name || meeting.agent.email}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Agent Email:</span>
                    <span class="detail-value">${meeting.agent.email || 'N/A'}</span>
                </div>
                ${
                  meeting.agentDate && meeting.agentTime
                    ? `
                <div class="detail-row">
                    <span class="detail-label">Agent Time:</span>
                    <span class="detail-value">${meeting.agentDate} at ${meeting.agentTime} (${meeting.agentTimezone})</span>
                </div>
                `
                    : ''
                }
                `
                    : `
                <div class="detail-row" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <span class="detail-label">Agent:</span>
                    <span class="detail-value" style="color: #999;">No agent assigned yet</span>
                </div>
                `
                }
                <div class="detail-row" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <span class="detail-label">Meeting Time:</span>
                    <span class="detail-value">${meeting.customerDate} at ${meeting.customerTime} (${meeting.customerTimezone})</span>
                </div>
                
                <div class="kl-time-section">
                    <p style="font-weight: bold; margin-bottom: 10px;">Kuala Lumpur Time:</p>
                    <div class="detail-row">
                        <span class="detail-label">KL Time:</span>
                        <span class="detail-value">${calculateKLTime(meeting.customerDate, meeting.customerTime, meeting.customerTimezone)}</span>
                    </div>
                </div>
            </div>
            
            <p style="margin-top: 30px; color: #666666; font-size: 14px;">
                This is an informational notification. The meeting will be conducted between the client and assigned agent.
            </p>
        </div>
        
        <div class="email-footer">
            <p>This is an automated notification from IntellAgent meeting scheduling system.</p>
        </div>
    </div>
</body>
</html>
  `;

  return { html, attachments };
}
