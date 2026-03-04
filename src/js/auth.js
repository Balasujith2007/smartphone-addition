const Auth = {
    isAuthenticated: function () {
        return localStorage.getItem('isLoggedIn') === 'true';
    },


    login: function (email, password) {

        if (email && password) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('loginTime', new Date().toISOString());
            return true;
        }
        return false;
    },


    logout: function () {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('loginTime');
        window.location.href = 'index.html';
    },


    protectPage: function () {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    },

    register: function (firstName, lastName, email, phone, password) {
        if (!firstName || !lastName || !email || !password) return false;
        // Save user data to localStorage
        const userData = {
            firstName, lastName, email, phone,
            dob: '',
            avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(firstName.charAt(0) + lastName.charAt(0)) + '&size=120&background=06b6d4&color=fff&bold=true'
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        // Save registered accounts list
        const accounts = JSON.parse(localStorage.getItem('registeredAccounts') || '[]');
        accounts.push({ email, password, registeredAt: new Date().toISOString() });
        localStorage.setItem('registeredAccounts', JSON.stringify(accounts));
        // Auto login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('loginTime', new Date().toISOString());
        return true;
    },

    forgotPassword: function (email) {
        if (!email) return false;
        // Simulate sending a reset token
        const token = Math.random().toString(36).substring(2, 10).toUpperCase();
        const resetData = { email, token, expiresAt: new Date(Date.now() + 15 * 60000).toISOString() };
        localStorage.setItem('passwordReset', JSON.stringify(resetData));
        return token; // In real app this would be emailed
    },

    getCurrentUser: function () {
        return localStorage.getItem('userEmail') || 'user@example.com';
    }
};

if (window.location.pathname.includes('dashboard.html') ||
    window.location.pathname.includes('prediction.html') ||
    window.location.pathname.includes('analytics.html') ||
    window.location.pathname.includes('profile.html') ||
    window.location.pathname.includes('result.html')) {
    Auth.protectPage();
}


window.Auth = Auth;
