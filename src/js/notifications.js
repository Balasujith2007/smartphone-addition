/**
 * NotificationService - Handles sending Email and SMS notifications
 * Uses EmailJS for emails and Fast2SMS for SMS
 */
const NotificationService = {
    /**
     * Send Email via EmailJS
     */
    sendEmail: async function (userData, riskData) {
        try {
            const config = API_CONFIG.NOTIFICATION_CONFIG.EMAIL_JS;

            // Validate configuration
            if (config.SERVICE_ID === 'YOUR_SERVICE_ID' || config.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                console.warn('EmailJS not configured. Skipping email.');
                return { success: false, message: 'Email service not configured' };
            }

            // Initialize EmailJS with your Public Key
            emailjs.init(config.PUBLIC_KEY);

            const templateParams = {
                to_name: `${userData.firstName} ${userData.lastName}`,
                user_email: userData.email,
                risk_level: riskData.riskLevel,
                risk_score: riskData.riskScore,
                recommendation: riskData.recommendation,
                date: new Date().toLocaleString()
            };

            const response = await emailjs.send(
                config.SERVICE_ID,
                config.TEMPLATE_ID,
                templateParams
            );

            console.log('Email sent successfully:', response);
            return { success: true, response };
        } catch (error) {
            console.error('Email sending failed:', error);
            showToast('Email delivery failed. Please check your connection.', 'error');
            return { success: false, error };
        }
    },

    /**
     * Send SMS via Fast2SMS
     */
    sendSMS: async function (userData, riskData) {
        try {
            const config = API_CONFIG.NOTIFICATION_CONFIG.FAST2SMS;

            // Validate configuration
            if (config.API_KEY === 'YOUR_FAST2SMS_API_KEY') {
                console.warn('Fast2SMS not configured. Skipping SMS.');
                return { success: false, message: 'SMS service not configured' };
            }

            // Clean phone number (Indian 10-digit format)
            const cleanPhone = userData.phone.replace(/\D/g, '').slice(-10);

            const message = `Digital Wellness: Your Risk Level is ${riskData.riskLevel} (Score: ${riskData.riskScore}/100). Please check your email for recommendations.`;

            // Using Fast2SMS Bulk SMS V2 POST method
            const response = await fetch(`https://www.fast2sms.com/dev/bulkV2`, {
                method: 'POST',
                headers: {
                    "authorization": config.API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "route": config.ROUTE,
                    "message": message,
                    "numbers": cleanPhone
                })
            });

            const result = await response.json();

            if (result.return) {
                console.log('SMS sent successfully:', result);
                return { success: true, result };
            } else {
                throw new Error(result.message || 'Fast2SMS failed to send');
            }
        } catch (error) {
            console.error('SMS sending failed:', error);
            showToast('SMS delivery failed. Check your mobile number format.', 'error');
            return { success: false, error };
        }
    },

    /**
     * Automatically trigger both notifications and save to history
     */
    triggerAll: async function (riskData) {
        const userData = UserData.get();

        showToast('Sending your assessment details...', 'info');

        const [emailResult, smsResult] = await Promise.all([
            this.sendEmail(userData, riskData),
            this.sendSMS(userData, riskData)
        ]);

        if (emailResult.success) showToast('📧 Email assessment sent!', 'success');
        if (smsResult.success) showToast('📱 SMS assessment sent!', 'success');

        // Record in history (already handled in prediction.js, but let's ensure it matches requirements)
        this.saveToHistory(userData, riskData, emailResult.success, smsResult.success);

        return { emailResult, smsResult };
    },

    /**
     * Save to local history
     */
    saveToHistory: function (userData, riskData, emailSent, smsSent) {
        const history = JSON.parse(localStorage.getItem('notificationHistory') || '[]');

        const newEntry = {
            riskLevel: riskData.riskLevel,
            riskScore: riskData.riskScore,
            timestamp: Date.now(),
            email: userData.email,
            phone: userData.phone,
            status: {
                email: emailSent ? 'Sent' : 'Failed',
                sms: smsSent ? 'Sent' : 'Failed'
            }
        };

        history.push(newEntry);
        localStorage.setItem('notificationHistory', JSON.stringify(history));
    }
};
