// API Configuration
// Update this after deploying your backend
const API_CONFIG = {
    // Production URL - Update this with your deployed backend URL
    PRODUCTION_URL: 'https://your-backend-url.onrender.com/api',
    
    // Development URL
    DEVELOPMENT_URL: 'http://localhost:3000/api',
    
    // Auto-detect environment
    get BASE_URL() {
        // Check if running on localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return this.DEVELOPMENT_URL;
        }
        return this.PRODUCTION_URL;
    },
    
    // API Endpoints
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
