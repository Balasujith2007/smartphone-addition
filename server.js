require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const { initDatabase } = require('./backend/config/database');
const predictionRoutes = require('./backend/routes/predictionRoutes');
const { errorHandler, notFoundHandler } = require('./backend/middleware/errorHandler');
const { apiLimiter, predictionLimiter } = require('./backend/middleware/rateLimiter');
const logger = require('./backend/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Request logging
app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/predictions', predictionLimiter, predictionRoutes);

// Serve static files (frontend)
app.use(express.static(path.join(__dirname)));

// Frontend routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
    try {
        // Initialize database tables (optional - won't fail if DB not configured)
        try {
            await initDatabase();
        } catch (dbError) {
            logger.warn('Database initialization skipped or failed:', dbError.message);
            logger.info('Server will start without database. Some features may not work.');
        }
        
        // Start server
        app.listen(PORT, () => {
            logger.info(`Server started successfully on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`API available at: http://localhost:${PORT}/api`);
            console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📊 API Endpoint: http://localhost:${PORT}/api/predictions`);
            console.log(`🏥 Health Check: http://localhost:${PORT}/api/health\n`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

startServer();
