const Auth = {
    isAuthenticated: function () {
        return localStorage.getItem('isLoggedIn') === 'true';
    },


    login: function (email, password) {
        // Check if credentials match any registered account
        const accounts = JSON.parse(localStorage.getItem('registeredAccounts') || '[]');
        const account = accounts.find(a => a.email === email && a.password === password);

        if (account) {
            // Valid credentials
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('loginTime', new Date().toISOString());

            // Load user data if exists
            const allUsers = JSON.parse(localStorage.getItem('registeredAccounts') || '[]');
            const user = allUsers.find(u => u.email === email);
            if (user && user.userData) {
                localStorage.setItem('userData', JSON.stringify(user.userData));
            }

            return true;
        }

        // For demo/testing: Allow any email/password if no accounts exist
        if (accounts.length === 0 && email && password.length >= 6) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('loginTime', new Date().toISOString());

            // Create default user data
            const names = email.split('@')[0].split('.');
            const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : 'User';
            const lastName = names[1] ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';

            const userData = {
                firstName,
                lastName,
                email,
                phone: '+10000000000', // Default phone fallback to pass Backend Joi validation
                dob: '',
                avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(firstName.charAt(0) + (lastName ? lastName.charAt(0) : '')) + '&size=120&background=06b6d4&color=fff&bold=true'
            };
            localStorage.setItem('userData', JSON.stringify(userData));

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

        // Save user data
        const userData = {
            firstName,
            lastName,
            email,
            phone,
            dob: '',
            avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(firstName.charAt(0) + lastName.charAt(0)) + '&size=120&background=06b6d4&color=fff&bold=true'
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Save to registered accounts list with user data
        const accounts = JSON.parse(localStorage.getItem('registeredAccounts') || '[]');
        accounts.push({
            email,
            password,
            userData,
            registeredAt: new Date().toISOString()
        });
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
