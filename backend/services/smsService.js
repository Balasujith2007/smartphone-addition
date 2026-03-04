const twilio = require('twilio');
const logger = require('../utils/logger');

class SMSService {
    constructor() {
        this.client = null;
        this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
        
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            this.client = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );
        } else {
            logger.warn('Twilio credentials not configured. SMS service disabled.');
        }
    }

    /**
     * Send SMS notification with prediction results
     */
    async sendPredictionSMS(phone, predictionData) {
        if (!this.client) {
            logger.warn('SMS service not configured. Skipping SMS.');
            return { success: false, status: 'not_configured' };
        }

        const { riskLevel, riskScore, confidence } = predictionData;

        const message = this.formatSMSMessage(riskLevel, riskScore, confidence);

        try {
            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: phone
            });

            logger.info('SMS sent successfully', { 
                to: phone, 
                sid: result.sid,
                status: result.status 
            });

            return {
                success: true,
                status: result.status,
                sid: result.sid
            };
        } catch (error) {
            logger.error('Failed to send SMS', { 
                phone, 
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
     * Format SMS message
     */
    formatSMSMessage(riskLevel, riskScore, confidence) {
        return `Smartphone Addiction Risk Result:

Risk Level: ${riskLevel}
Score: ${riskScore}/100
Confidence: ${confidence}%

Please check your email for detailed report.

- Smartphone Wellness Team`;
    }

    /**
     * Validate phone number format
     */
    static isValidPhone(phone) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    }
}

module.exports = new SMSService();
