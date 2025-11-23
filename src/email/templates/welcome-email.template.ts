import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export function getWelcomeEmailTemplate(): {
  html: string;
  attachments: nodemailer.SendMailOptions['attachments'];
} {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  // Prepare attachments array for embedded images
  const attachments: NonNullable<nodemailer.SendMailOptions['attachments']> =
    [];

  // Add logo as CID attachment (recommended by Nodemailer)
  // Try multiple paths: dist/images, src/images, and project root images
  const projectRoot = process.cwd();
  const possiblePaths = [
    path.join(projectRoot, 'src', 'images', 'intellagent_logo_png.png'), // src/images (most reliable)
    path.join(projectRoot, 'dist', 'images', 'intellagent_logo_png.png'), // dist/images
    path.join(projectRoot, 'images', 'intellagent_logo_png.png'), // project root images
  ];

  // Unique CIDs for images (must be globally unique within the message)
  const logoCid = 'intellagent-logo@intellagent.com';
  const yellowSquareCid = 'yellow-square@intellagent.com';
  let logoUrl = `cid:${logoCid}`; // Use CID reference
  let yellowSquareUrl = `cid:${yellowSquareCid}`;
  let logoPath: string | null = null;
  let yellowSquarePath: string | null = null;

  // Find logo path
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      logoPath = possiblePath;
      break;
    }
  }

  // Find yellow square path
  const yellowSquarePaths = [
    path.join(projectRoot, 'src', 'images', 'yellow_squar_png.png'),
    path.join(projectRoot, 'dist', 'images', 'yellow_squar_png.png'),
    path.join(projectRoot, 'images', 'yellow_squar_png.png'),
  ];

  for (const possiblePath of yellowSquarePaths) {
    if (fs.existsSync(possiblePath)) {
      yellowSquarePath = possiblePath;
      break;
    }
  }

  try {
    if (logoPath) {
      // Add logo as attachment with CID (Content-ID)
      attachments.push({
        filename: 'intellagent-logo.png',
        path: logoPath,
        cid: logoCid,
        contentType: 'image/png',
        contentDisposition: 'inline',
      });
    } else {
      logoUrl = `${baseUrl}/logo/intellagent_logo_png.png`;
    }

    if (yellowSquarePath) {
      // Add yellow square as attachment with CID
      attachments.push({
        filename: 'yellow-square.png',
        path: yellowSquarePath,
        cid: yellowSquareCid,
        contentType: 'image/png',
        contentDisposition: 'inline',
      });
    } else {
      yellowSquareUrl = `${baseUrl}/elements/yellow_squar_png.png`;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to IntellAgent</title>
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
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .email-container {
            max-width: 650px;
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
            margin-bottom: 0;
        }
        
        .welcome-section {
            padding: 50px 40px;
            background-color: #ffffff;
        }
        
        .welcome-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 32px;
            flex-wrap: wrap;
        }
        
        .welcome-left {
            flex: 1 1 320px;
            min-width: 280px;
        }
        
        .welcome-right {
            flex: 0 0 220px;
            text-align: right;
        }
        
        h1 {
            font-size: 42px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 20px;
            letter-spacing: -0.02em;
            line-height: 1.2;
        }
        
        .welcome-text {
            font-size: 18px;
            color: #333333;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .yellow-square {
            max-width: 220px;
            width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }
        
        .cta-button {
            display: inline-block;
            background-color: #111111;
            color: #ffffff !important;
            padding: 14px 28px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin-top: 10px;
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            background-color: #333333;
            color: #ffffff !important;
        }
        
        .features-section {
            padding: 40px;
            background-color: #000000;
            color: #ffffff;
            margin: 0 40px 50px;
            border-radius: 0;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            margin-top: 20px;
        }
        
        .feature-item {
            background-color: transparent;
            padding: 24px;
            text-align: left;
        }
        
        .feature-icon {
            font-size: 32px;
            margin-bottom: 14px;
        }
        
        .feature-title {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
        }
        
        .feature-text {
            font-size: 14px;
            color: #ffffff;
            line-height: 1.5;
            margin-bottom: 12px;
        }
        
        .feature-divider {
            width: 100%;
            height: 1px;
            background-color: #ffffff;
            margin-top: 12px;
        }
        
        .email-footer {
            background-color: #ffffff;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-link {
            display: inline-block;
            color: #666666;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
            transition: color 0.3s ease;
        }
        
        .social-link:hover {
            color: #111111;
        }
        
        .footer-text {
            font-size: 12px;
            color: #999999;
            margin-top: 20px;
        }
        
        @media only screen and (max-width: 600px) {
            .welcome-section {
                padding: 40px 30px;
            }
            
            .welcome-content {
                flex-direction: column;
            }
            
            .welcome-left {
                width: 100%;
                margin-bottom: 20px;
            }
            
            .welcome-right {
                width: 100%;
                text-align: center;
            }
            
            h1 {
                font-size: 32px;
            }
            
            .welcome-text {
                font-size: 16px;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
            
            .features-section {
                padding: 30px 25px 40px;
                margin: 0 20px 40px;
            }
            
            .email-footer {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="${logoUrl}" alt="IntellAgent Logo" class="logo" />
        </div>
        
        <div class="welcome-section">
            <div class="welcome-content">
                <div class="welcome-left">
                    <h1>Welcome to IntellAgent!</h1>
                    <p class="welcome-text">
                        Thank you for subscribing to our newsletter. We're excited to have you on board! Stay ahead with the latest in AI automation, intelligent agents, and cutting-edge technology solutions.
                    </p>
                    <a href="${baseUrl}" class="cta-button">Explore Our Services</a>
                </div>
                <div class="welcome-right">
                    <img src="${yellowSquareUrl}" alt="Yellow Square" class="yellow-square" />
                </div>
            </div>
        </div>
        
        <div class="features-section">
            <div class="features-grid">
                <div class="feature-item">
                    <div class="feature-title">AI-Powered Solutions</div>
                    <div class="feature-text">Leverage the power of artificial intelligence</div>
                    <div class="feature-divider"></div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">Automation Excellence</div>
                    <div class="feature-text">Streamline your workflows effortlessly</div>
                    <div class="feature-divider"></div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">Innovation First</div>
                    <div class="feature-text">Cutting-edge technology at your fingertips</div>
                    <div class="feature-divider"></div>
                </div>
            </div>
        </div>
        
        <div class="email-footer">
            <div class="social-links">
                <a href="#" class="social-link">LinkedIn</a>
                <a href="#" class="social-link">Twitter</a>
                <a href="#" class="social-link">Discord</a>
            </div>
            <p class="footer-text">
                You're receiving this email because you subscribed to IntellAgent newsletter.<br>
                © ${new Date().getFullYear()} IntellAgent. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
  `;

  return { html, attachments };
}
