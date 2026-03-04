const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    logger.info('Database connected successfully');
});

pool.on('error', (err) => {
    logger.error('Unexpected database error:', err);
    process.exit(-1);
});

// Initialize database tables
const initDatabase = async () => {
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
