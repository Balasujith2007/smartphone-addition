const { pool } = require('../config/database');
const { validatePrediction } = require('../utils/validators');
const PredictionService = require('../services/predictionService');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

class PredictionController {
    /**
     * Create new prediction and send notifications
     */
    async createPrediction(req, res) {
        let client = null;
        let riskData = null;

        try {
            // Validate input
            const { error, value } = validatePrediction(req.body);
            if (error) {
                logger.warn('Validation failed', { errors: error.details });
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.details.map(err => ({
                        field: err.path[0],
                        message: err.message
                    }))
                });
            }

            const {
                firstName, lastName, email, phone,
                screenTimeHours, nightUsageHours, unlocksPerDay,
                socialMediaHours, productivityHours
            } = value;

            // Calculate risk synchronously (Always works, even without DB)
            riskData = PredictionService.calculateRisk({
                screenTimeHours, nightUsageHours, unlocksPerDay,
                socialMediaHours, productivityHours
            });

            // Attempt Database Storage
            try {
                client = await pool.connect();
            } catch (dbConnectError) {
                logger.warn('Database connection failed. Returning prediction without saving to DB or sending notifications.', { error: dbConnectError.message });

                // Return prediction anyway so the UI works
                return res.status(201).json({
                    success: true,
                    message: 'Prediction completed successfully (Offline Mode)',
                    data: {
                        predictionId: 'mock-' + Date.now(),
                        userId: 'mock-user',
                        riskLevel: riskData.riskLevel,
                        riskScore: riskData.riskScore,
                        confidence: riskData.confidence,
                        recommendation: riskData.recommendation,
                        notifications: { sms: false, email: false }
                    }
                });
            }

            // Start transaction
            await client.query('BEGIN');

            // Check if user exists, if not create
            let userResult = await client.query('SELECT id FROM users WHERE email = $1', [email]);
            let userId;
            if (userResult.rows.length === 0) {
                const insertUserResult = await client.query(
                    `INSERT INTO users (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING id`,
                    [firstName, lastName, email, phone]
                );
                userId = insertUserResult.rows[0].id;
            } else {
                userId = userResult.rows[0].id;
                await client.query(
                    `UPDATE users SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
                    [firstName, lastName, phone, userId]
                );
            }

            // Save prediction
            const predictionResult = await client.query(
                `INSERT INTO predictions 
                 (user_id, risk_level, risk_score, confidence, screen_time_hours, 
                  night_usage_hours, unlocks_per_day, social_media_hours, 
                  productivity_hours, recommendation) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
                [userId, riskData.riskLevel, riskData.riskScore, riskData.confidence,
                    screenTimeHours, nightUsageHours, unlocksPerDay, socialMediaHours,
                    productivityHours, riskData.recommendation]
            );

            const predictionId = predictionResult.rows[0].id;

            // Send notifications
            const notificationResults = await notificationService.sendAllNotifications(
                { firstName, lastName, email, phone }, riskData
            );

            // Save notification status
            await client.query(
                `INSERT INTO notifications (prediction_id, sms_sent, email_sent, sms_status, email_status) VALUES ($1, $2, $3, $4, $5)`,
                [predictionId, notificationResults.sms.sent, notificationResults.email.sent,
                    notificationResults.sms.status, notificationResults.email.status]
            );

            await client.query('COMMIT');

            res.status(201).json({
                success: true,
                message: 'Prediction completed successfully',
                data: {
                    predictionId, userId,
                    riskLevel: riskData.riskLevel,
                    riskScore: riskData.riskScore,
                    confidence: riskData.confidence,
                    recommendation: riskData.recommendation,
                    notifications: { sms: notificationResults.sms.sent, email: notificationResults.email.sent }
                }
            });

        } catch (error) {
            if (client) await client.query('ROLLBACK');
            logger.error('Prediction creation failed', { error: error.message });
            res.status(500).json({
                success: false, message: 'Failed to process prediction',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        } finally {
            if (client) client.release();
        }
    }

    /**
     * Get user's prediction history
     */
    async getPredictionHistory(req, res) {
        try {
            const { email } = req.query;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required'
                });
            }

            const result = await pool.query(
                `SELECT p.*, u.first_name, u.last_name, u.email 
                 FROM predictions p
                 JOIN users u ON p.user_id = u.id
                 WHERE u.email = $1
                 ORDER BY p.created_at DESC
                 LIMIT 10`,
                [email]
            );

            res.status(200).json({
                success: true,
                data: result.rows
            });

        } catch (error) {
            logger.error('Failed to fetch prediction history', { error: error.message });

            res.status(500).json({
                success: false,
                message: 'Failed to fetch prediction history',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    /**
     * Get prediction by ID
     */
    async getPredictionById(req, res) {
        try {
            const { id } = req.params;

            const result = await pool.query(
                `SELECT p.*, u.first_name, u.last_name, u.email, u.phone,
                 n.sms_sent, n.email_sent, n.sms_status, n.email_status
                 FROM predictions p
                 JOIN users u ON p.user_id = u.id
                 LEFT JOIN notifications n ON p.id = n.prediction_id
                 WHERE p.id = $1`,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Prediction not found'
                });
            }

            res.status(200).json({
                success: true,
                data: result.rows[0]
            });

        } catch (error) {
            logger.error('Failed to fetch prediction', { error: error.message });

            res.status(500).json({
                success: false,
                message: 'Failed to fetch prediction',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
}

module.exports = new PredictionController();
