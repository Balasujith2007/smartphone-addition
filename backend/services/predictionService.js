const logger = require('../utils/logger');

class PredictionService {
    /**
     * Calculate risk level, score, and confidence based on user data
     */
    static calculateRisk(data) {
        const {
            screenTimeHours,
            nightUsageHours,
            unlocksPerDay,
            socialMediaHours,
            productivityHours
        } = data;

        let riskScore = 0;
        let factors = [];

        // Screen Time Analysis (0-30 points)
        if (screenTimeHours >= 8) {
            riskScore += 30;
            factors.push('excessive_screen_time');
        } else if (screenTimeHours >= 6) {
            riskScore += 20;
            factors.push('high_screen_time');
        } else if (screenTimeHours >= 4) {
            riskScore += 10;
        }

        // Night Usage Analysis (0-25 points)
        if (nightUsageHours >= 3) {
            riskScore += 25;
            factors.push('severe_night_usage');
        } else if (nightUsageHours >= 2) {
            riskScore += 18;
            factors.push('high_night_usage');
        } else if (nightUsageHours >= 1) {
            riskScore += 10;
        }

        // Phone Unlocks Analysis (0-20 points)
        if (unlocksPerDay >= 150) {
            riskScore += 20;
            factors.push('excessive_unlocks');
        } else if (unlocksPerDay >= 100) {
            riskScore += 15;
            factors.push('high_unlocks');
        } else if (unlocksPerDay >= 60) {
            riskScore += 8;
        }

        // Social Media Usage (0-15 points)
        if (socialMediaHours >= 5) {
            riskScore += 15;
            factors.push('excessive_social_media');
        } else if (socialMediaHours >= 3) {
            riskScore += 10;
        } else if (socialMediaHours >= 2) {
            riskScore += 5;
        }

        // Productivity Balance (0-10 points)
        const productivityRatio = productivityHours / (screenTimeHours || 1);
        if (productivityRatio < 0.2) {
            riskScore += 10;
            factors.push('low_productivity');
        } else if (productivityRatio < 0.4) {
            riskScore += 5;
        }

        // Cap score at 100
        riskScore = Math.min(riskScore, 100);

        // Determine risk level
        let riskLevel;
        if (riskScore >= 70) {
            riskLevel = 'High';
        } else if (riskScore >= 40) {
            riskLevel = 'Medium';
        } else {
            riskLevel = 'Low';
        }

        // Calculate confidence based on data consistency
        const confidence = this.calculateConfidence(data, factors);

        // Generate recommendation
        const recommendation = this.generateRecommendation(riskLevel, factors);

        logger.info('Risk calculation completed', { riskLevel, riskScore, confidence });

        return {
            riskLevel,
            riskScore,
            confidence,
            recommendation,
            factors
        };
    }

    /**
     * Calculate confidence percentage
     */
    static calculateConfidence(data, factors) {
        let confidence = 75; // Base confidence

        // Increase confidence if multiple risk factors present
        if (factors.length >= 3) {
            confidence += 15;
        } else if (factors.length >= 2) {
            confidence += 10;
        }

        // Adjust based on data consistency
        const totalUsage = data.socialMediaHours + data.productivityHours;
        if (totalUsage <= data.screenTimeHours) {
            confidence += 10;
        }

        return Math.min(confidence, 99);
    }

    /**
     * Generate personalized recommendation
     */
    static generateRecommendation(riskLevel, factors) {
        const recommendations = {
            High: [
                'Immediate action required! Your smartphone usage shows signs of addiction.',
                'We strongly recommend: Set strict daily limits, enable app timers, and seek professional guidance if needed.',
                'Consider a digital detox and establish phone-free zones in your daily routine.'
            ],
            Medium: [
                'Your smartphone usage is concerning and needs attention.',
                'Recommendations: Reduce screen time by 2 hours daily, limit night usage, and increase productive activities.',
                'Set app limits and create healthy boundaries with your device.'
            ],
            Low: [
                'Your smartphone usage is within healthy limits. Keep it up!',
                'Continue maintaining balanced usage and stay mindful of your screen time.',
                'Consider setting preventive measures to maintain this healthy pattern.'
            ]
        };

        return recommendations[riskLevel].join(' ');
    }
}

module.exports = PredictionService;
