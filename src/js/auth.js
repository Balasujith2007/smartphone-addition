// Authentication Module
const Auth = {
    // Check if user is logged in
    isAuthenticated: function() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },
    
    // Login user
    login: function(email, password) {
        // In production, this would call a backend API
        // For now, we'll use simple validation
        if (email && password) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('loginTime', new Date().toISOString());
            return true;
        }
        return false;
    },
    
    // Logout user
    logout: function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('loginTime');
        window.location.href = 'index.html';
    },
    
    // Protect page (redirect to login if not authenticated)
    protectPage: function() {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    },
    
    // Get current user email
    getCurrentUser: function() {
        return localStorage.getItem('userEmail') || 'user@example.com';
    }
};

// Protect all pages except login
if (window.location.pathname.includes('dashboard.html') || 
    window.location.pathname.includes('prediction.html') || 
    window.location.pathname.includes('analytics.html') || 
    window.location.pathname.includes('profile.html') || 
    window.location.pathname.includes('result.html')) {
    Auth.protectPage();
}

// Export for use in other modules
window.Auth = Auth;
