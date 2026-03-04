const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Prediction endpoint rate limiter (stricter)
const predictionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 predictions per hour
    message: {
        success: false,
        message: 'Too many prediction requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter, predictionLimiter };
