const { Pool } = require('pg');
const logger = require('../utils/logger');

// Database configuration with fallbacks
const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

// Fallback to individual parameters if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
    dbConfig.host = process.env.DB_HOST || 'localhost';
    dbConfig.port = process.env.DB_PORT || 5432;
    dbConfig.database = process.env.DB_NAME || 'smartphone_addiction';
    dbConfig.user = process.env.DB_USER || 'postgres';
    dbConfig.password = process.env.DB_PASSWORD || '';
    delete dbConfig.connectionString;
}

const pool = new Pool(dbConfig);

pool.on('connect', () => {
    logger.info('Database connected successfully');
});

pool.on('error', (err) => {
    logger.error('Unexpected database error:', err);
    process.exit(-1);
});

// Initialize database tables
const initDatabase = async () => {
    // Skip database initialization if no database is configured
    if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
        logger.warn('No database configured. Skipping database initialization.');
        return;
    }

    const createTablesQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS predictions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            risk_level VARCHAR(20) NOT NULL,
            risk_score INTEGER NOT NULL,
            confidence DECIMAL(5,2) NOT NULL,
            screen_time_hours DECIMAL(5,2),
            night_usage_hours DECIMAL(5,2),
            unlocks_per_day INTEGER,
            social_media_hours DECIMAL(5,2),
            productivity_hours DECIMAL(5,2),
            recommendation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            prediction_id INTEGER REFERENCES predictions(id) ON DELETE CASCADE,
            sms_sent BOOLEAN DEFAULT FALSE,
            email_sent BOOLEAN DEFAULT FALSE,
            sms_status VARCHAR(50),
            email_status VARCHAR(50),
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
        CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at);
    `;

    try {
        await pool.query(createTablesQuery);
        logger.info('Database tables initialized successfully');
    } catch (error) {
        logger.error('Error initializing database tables:', error);
        throw error;
    }
};

module.exports = { pool, initDatabase };
