// Common JavaScript for all pages - User data management and notifications

// Loading Overlay
const Loading = {
    show: function (message = 'Loading...') {
        let overlay = document.getElementById('loadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <div class="spinner"></div>
                    <div class="loading-text">${message}</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        setTimeout(() => overlay.classList.add('show'), 10);
    },

    hide: function () {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        }
    }
};

// User Data Management
const UserData = {
    get: function () {
        const defaultUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            dob: '1995-06-15',
            avatar: 'https://ui-avatars.com/api/?name=JD&size=120&background=1f2937&color=fff&bold=true'
        };

        const stored = localStorage.getItem('userData');
        return stored ? JSON.parse(stored) : defaultUser;
    },

    set: function (data) {
        localStorage.setItem('userData', JSON.stringify(data));
        this.updateAllPages();
    },

    updateAllPages: function () {
        const user = this.get();
        const fullName = `${user.firstName} ${user.lastName}`;

        // Create initials from first letter of first name and first letter of last name
        const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

        // Update profile menu in navbar
        const profileMenus = document.querySelectorAll('.profile-menu span');
        profileMenus.forEach(menu => {
            menu.textContent = fullName;
        });

        // Update profile images with initials
        const profileImages = document.querySelectorAll('.profile-menu img, .profile-avatar');
        profileImages.forEach(img => {
            // If custom avatar exists, use it; otherwise generate with initials
            if (user.avatar && !user.avatar.includes('ui-avatars.com')) {
                img.src = user.avatar;
            } else {
                img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=120&background=1f2937&color=fff&bold=true`;
            }
        });

        // Update profile details if on profile page
        const profileName = document.querySelector('.profile-details h2');
        const profileEmail = document.querySelector('.profile-details p');
        if (profileName) profileName.textContent = fullName;
        if (profileEmail) profileEmail.textContent = user.email;
    }
};

// Notification Management
const NotificationManager = {
    notifications: [],

    init: function () {
        // Load notifications from localStorage
        const stored = localStorage.getItem('notifications');
        this.notifications = stored ? JSON.parse(stored) : this.getDefaultNotifications();
        this.render();
        this.updateBadge();
    },

    getDefaultNotifications: function () {
        return [
            {
                id: 1,
                icon: '⚠️',
                type: 'risk-high',
                title: 'High Usage Alert',
                message: 'Your screen time exceeded 7 hours today',
                time: '5 minutes ago',
                unread: true,
                timestamp: Date.now()
            },
            {
                id: 2,
                icon: '📊',
                type: 'risk-medium',
                title: 'Weekly Report Ready',
                message: 'Your weekly wellness report is available',
                time: '2 hours ago',
                unread: true,
                timestamp: Date.now() - 7200000
            },
            {
                id: 3,
                icon: '✅',
                type: 'risk-low',
                title: 'Goal Achieved!',
                message: 'You stayed under 5 hours today',
                time: 'Yesterday',
                unread: false,
                timestamp: Date.now() - 86400000
            }
        ];
    },

    add: function (notification) {
        notification.id = Date.now();
        notification.unread = true;
        notification.timestamp = Date.now();
        this.notifications.unshift(notification);
        this.save();
        this.render();
        this.updateBadge();
    },

    markAsRead: function (id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.unread = false;
            this.save();
            this.render();
            this.updateBadge();
        }
    },

    markAllAsRead: function () {
        this.notifications.forEach(n => n.unread = false);
        this.save();
        this.render();
        this.updateBadge();
    },

    remove: function (id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.save();
        this.render();
        this.updateBadge();
    },

    save: function () {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    },

    render: function () {
        const notificationList = document.querySelector('.notification-list');
        if (!notificationList) return;

        if (this.notifications.length === 0) {
            notificationList.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; color: #6b7280;">
                    <p>No notifications</p>
                </div>
            `;
            return;
        }

        notificationList.innerHTML = this.notifications.map(n => `
            <div class="notification-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
                <div class="notification-icon ${n.type}">${n.icon}</div>
                <div class="notification-content">
                    <h4>${n.title}</h4>
                    <p>${n.message}</p>
                    <span class="notification-time">${n.time}</span>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.markAsRead(id);
            });
        });
    },

    updateBadge: function () {
        const unreadCount = this.notifications.filter(n => n.unread).length;
        const badges = document.querySelectorAll('.badge');
        badges.forEach(badge => {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        });
    }
};

// Toggle Notifications Dropdown
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close notifications when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('notificationDropdown');
    const notificationBtn = document.querySelector('.notification-btn');

    if (dropdown && !dropdown.contains(event.target) && !notificationBtn?.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Update user data on all pages
    UserData.updateAllPages();

    // Initialize notifications
    NotificationManager.init();

    // Setup mark all as read button
    const markReadBtn = document.querySelector('.mark-read-btn');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', function () {
            NotificationManager.markAllAsRead();
        });
    }

    // Add form validation to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const inputs = form.querySelectorAll('input[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';

                    // Remove error styling after user starts typing
                    input.addEventListener('input', function () {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });

            if (!isValid) {
                e.preventDefault();
                showToast('Please fill in all required fields', 'error');
            }
        });
    });
});

// Toast Notification System
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary, #1a1a1a);
        border: 1px solid var(--border-color, #2a2a2a);
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        min-width: 300px;
    }
    
    .toast-notification.show {
        transform: translateX(0);
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .toast-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        flex-shrink: 0;
    }
    
    .toast-success .toast-icon {
        background: #10b981;
        color: white;
    }
    
    .toast-error .toast-icon {
        background: #ef4444;
        color: white;
    }
    
    .toast-info .toast-icon {
        background: #3b82f6;
        color: white;
    }
    
    .toast-warning .toast-icon {
        background: #f59e0b;
        color: white;
    }
    
    .toast-message {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-primary, #f5f5f5);
        flex: 1;
    }
`;
document.head.appendChild(toastStyles);

// Form Validation Helper
const FormValidator = {
    validateEmail: function (email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validateRequired: function (value) {
        return value && value.trim().length > 0;
    },

    validateNumber: function (value, min = 0, max = Infinity) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },

    showError: function (input, message) {
        input.classList.add('error');
        input.classList.remove('success');

        let errorDiv = input.parentElement.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            input.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    },

    clearError: function (input) {
        input.classList.remove('error');
        input.classList.add('success');

        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.classList.remove('show');
        }
    },

    clearAllErrors: function (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
            const errorDiv = input.parentElement.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.classList.remove('show');
            }
        });
    }
};

// Export utilities
window.Loading = Loading;
window.FormValidator = FormValidator;

