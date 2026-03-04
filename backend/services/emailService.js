const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = null;
        this.fromEmail = process.env.EMAIL_FROM || 'noreply@smartphonewellness.com';
        this.initializeTransporter();
    }

    /**
     * Initialize email transporter
     */
    initializeTransporter() {
        try {
            // Using Nodemailer with SMTP
            if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
                this.transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    port: parseInt(process.env.EMAIL_PORT) || 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                });
                logger.info('Email service initialized with Nodemailer');
            } else {
                logger.warn('Email credentials not configured. Email service disabled.');
            }
        } catch (error) {
            logger.error('Failed to initialize email service:', error);
        }
    }

    /**
     * Send prediction result email
     */
    async sendPredictionEmail(email, userData, predictionData) {
        if (!this.transporter) {
            logger.warn('Email service not configured. Skipping email.');
            return { success: false, status: 'not_configured' };
        }

        const { firstName, lastName } = userData;
        const { riskLevel, riskScore, confidence, recommendation } = predictionData;

        const subject = 'Smartphone Addiction Risk Assessment Result';
        const htmlContent = this.formatEmailHTML(
            firstName,
            lastName,
            riskLevel,
            riskScore,
            confidence,
            recommendation
        );
        const textContent = this.formatEmailText(
            firstName,
            lastName,
            riskLevel,
            riskScore,
            confidence,
            recommendation
        );

        try {
            const info = await this.transporter.sendMail({
                from: `"Smartphone Wellness Team" <${this.fromEmail}>`,
                to: email,
                subject: subject,
                text: textContent,
                html: htmlContent,
            });

            logger.info('Email sent successfully', { 
                to: email, 
                messageId: info.messageId 
            });

            return {
                success: true,
                status: 'sent',
                messageId: info.messageId
            };
        } catch (error) {
            logger.error('Failed to send email', { 
                email, 
                error: error.message 
            });

            return {
                success: false,
                status: 'failed',
                error: error.message
            };
        }
    }

    /**
     * Format email HTML content
     */
    formatEmailHTML(firstName, lastName, riskLevel, riskScore, confidence, recommendation) {
        const riskColor = riskLevel === 'High' ? '#ef4444' : riskLevel === 'Medium' ? '#f59e0b' : '#10b981';
        
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .result-box { background: #f8f9fa; border-left: 4px solid ${riskColor}; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .result-item { margin: 10px 0; font-size: 16px; }
        .result-label { font-weight: 600; color: #555; }
        .result-value { font-weight: 700; color: ${riskColor}; }
        .recommendation { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .recommendation h3 { margin-top: 0; color: #856404; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 Smartphone Wellness Assessment</h1>
        </div>
        <div class="content">
            <p class="greeting">Dear ${firstName} ${lastName},</p>
            <p>Your smartphone addiction assessment has been completed. Here are your results:</p>
            
            <div class="result-box">
                <div class="result-item">
                    <span class="result-label">Risk Level:</span>
                    <span class="result-value">${riskLevel} Risk</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Risk Score:</span>
                    <span class="result-value">${riskScore}/100</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Confidence:</span>
                    <span class="result-value">${confidence}%</span>
                </div>
            </div>

            <div class="recommendation">
                <h3>📋 Recommendations</h3>
                <p>${recommendation}</p>
            </div>

            <p>Based on your usage patterns, we encourage you to review the detailed report and follow the suggested improvements to maintain a healthy relationship with your smartphone.</p>

            <center>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5500'}/dashboard.html" class="button">View Dashboard</a>
            </center>
        </div>
        <div class="footer">
            <p><strong>Smartphone Wellness Team</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} Smartphone Wellness. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Format email plain text content
     */
    formatEmailText(firstName, lastName, riskLevel, riskScore, confidence, recommendation) {
        return `
Dear ${firstName} ${lastName},

Your smartphone addiction assessment has been completed.

RESULTS:
--------
Risk Level: ${riskLevel} Risk
Risk Score: ${riskScore}/100
Confidence: ${confidence}%

RECOMMENDATIONS:
----------------
${recommendation}

Based on your usage patterns, we strongly recommend reviewing the detailed report and following the suggested improvements.

View your dashboard: ${process.env.FRONTEND_URL || 'http://localhost:5500'}/dashboard.html

Thank you,
Smartphone Wellness Team

---
This is an automated message. Please do not reply to this email.
        `;
    }
}

module.exports = new EmailService();
