/**
 * API & THIRD-PARTY CONFIGURATION
 * ---------------------------------------------------------
 * Replace the placeholder values below with your actual API keys.
 */
const API_CONFIG = {
    // 1. NOTIFICATION SERVICES SETUP
    NOTIFICATION_CONFIG: {
        // EmailJS: Get these from your EmailJS dashboard (https://dashboard.emailjs.com/)
        EMAIL_JS: {
            SERVICE_ID: 'YOUR_SERVICE_ID',     // e.g., 'service_abc123'
            TEMPLATE_ID: 'YOUR_TEMPLATE_ID',   // e.g., 'template_xyz789'
            PUBLIC_KEY: 'YOUR_PUBLIC_KEY'      // e.g., 'user_LmnOpq...'
        },

        // Fast2SMS: Get this from your Fast2SMS dashboard (https://www.fast2sms.com/dashboard)
        FAST2SMS: {
            API_KEY: 'YOUR_FAST2SMS_API_KEY',  // Paste your API Key here
            SENDER_ID: 'FSTSMS',               // Default sender ID
            ROUTE: 'q'                         // 'q' for Quick Message route
        }
    },

    // 2. BACKEND API URLS
    PRODUCTION_URL: 'https://smartphone-addiction-api.onrender.com/api',
    DEVELOPMENT_URL: 'https://smartphone-addiction-api.onrender.com/api',

    // Auto-detect environment
    get BASE_URL() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
            return this.DEVELOPMENT_URL;
        }
        return this.PRODUCTION_URL;
    },

    // 3. INTERNAL ENDPOINTS
    ENDPOINTS: {
        HEALTH: '/health',
        PREDICTIONS: '/predictions',
        HISTORY: '/predictions/history',
        PREDICTION_BY_ID: (id) => `/predictions/${id}`
    }
};

// Helper function to get full endpoint URL
function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}
