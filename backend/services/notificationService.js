const smsService = require('./smsService');
const emailService = require('./emailService');
const logger = require('../utils/logger');

class NotificationService {
    /**
     * Send all notifications (SMS + Email)
     */
    async sendAllNotifications(userData, predictionData) {
        const { email, phone, firstName, lastName } = userData;

        logger.info('Starting notification process', { email, phone });

        const results = {
            sms: { sent: false, status: null },
            email: { sent: false, status: null }
        };

        // Send SMS
        try {
            const smsResult = await smsService.sendPredictionSMS(phone, predictionData);
            results.sms = {
                sent: smsResult.success,
                status: smsResult.status,
                sid: smsResult.sid,
                error: smsResult.error
            };
        } catch (error) {
            logger.error('SMS notification failed', { error: error.message });
            results.sms = {
                sent: false,
                status: 'error',
                error: error.message
            };
        }

        // Send Email
        try {
            const emailResult = await emailService.sendPredictionEmail(
                email,
                { firstName, lastName },
                predictionData
            );
            results.email = {
                sent: emailResult.success,
                status: emailResult.status,
                messageId: emailResult.messageId,
                error: emailResult.error
            };
        } catch (error) {
            logger.error('Email notification failed', { error: error.message });
            results.email = {
                sent: false,
                status: 'error',
                error: error.message
            };
        }

        logger.info('Notification process completed', results);

        return results;
    }
}

module.exports = new NotificationService();
