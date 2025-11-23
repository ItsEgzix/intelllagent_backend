"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientMeetingConfirmationTemplate = getClientMeetingConfirmationTemplate;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getClientMeetingConfirmationTemplate(meeting) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const attachments = [];
    const projectRoot = process.cwd();
    const logoPath = path.join(projectRoot, 'src', 'images', 'intellagent_logo_png.png');
    let logoUrl = `${baseUrl}/logo/intellagent_logo_png.png`;
    if (fs.existsSync(logoPath)) {
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
                       ${meeting.agent && meeting.agentDate && meeting.agentTime
        ? `
                       <div class="detail-row">
                           <span class="detail-label">Agent Time:</span>
                           <span class="detail-value">${meeting.agentDate} at ${meeting.agentTime} (${meeting.agentTimezone})</span>
                       </div>
                       `
        : ''}
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
//# sourceMappingURL=client-meeting-confirmation.template.js.map