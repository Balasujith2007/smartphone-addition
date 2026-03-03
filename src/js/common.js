// Common utilities and shared functionality across all pages

// User Profile Management
const UserProfile = {
    // Get user data from localStorage
    get: function() {
        const defaultUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            dob: '1995-06-15',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&size=120&background=1f2937&color=fff'
        };
        
        const stored = localStorage.getItem('userProfile');
        return stored ? JSON.parse(stored) : defaultUser;
    },
    
    // Save user data to localStorage
    save: function(userData) {
        localStorage.setItem('userProfile', JSON.stringify(userData));
        this.updateAllPages();
    },
    
    // Update user info across all pages
    updateAllPages: function() {
        const user = this.get();
        const fullName = `${user.firstName} ${user.lastName}`;
        
        // Update profile menu
        const profileMenus = document.querySelectorAll('.profile-menu span');
        profileMenus.forEach(menu => {
            menu.textContent = fullName;
        });
        
        // Update profile images
        const profileImages = document.querySelectorAll('.profile-menu img, .profile-avatar');
        profileImages.forEach(img => {
            img.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=120&background=1f2937&color=fff`;
        });
        
        // Update profile details if on profile page
        const profileDetails = document.querySelector('.profile-details h2');
        if (profileDetails) {
            profileDetails.textContent = fullName;
        }
        
        const profileEmail = document.querySelector('.profile-details p');
        if (profileEmail) {
            profileEmail.textContent = user.email;
        }
    }
};

// Notification Management
const NotificationManager = {
    // Get notifications from localStorage
    get: function() {
        const stored = localStorage.getItem('notifications');
        return stored ? JSON.parse(stored) : this.getDefaultNotifications();
    },
    
    // Get default notifications
    getDefaultNotifications: function() {
        return [
            {
                id: 1,
                icon: '⚠️',
                type: 'risk-high',
                title: 'High Usage Alert',
                message: 'Your screen time exceeded 7 hours today',
                time: 'Just now',
                timestamp: Date.now(),
                read: false
            },
            {
                id: 2,
                icon: '📊',
                type: 'risk-medium',
                title: 'Weekly Report Ready',
                message: 'Your weekly wellness report is available',
                time: '2 hours ago',
                timestamp: Date.now() - 7200000,
                read: false
            },
            {
                id: 3,
                icon: '✅',
                type: 'risk-low',
                title: 'Goal Achieved!',
                message: 'You stayed under 5 hours today',
                time: 'Yesterday',
                timestamp: Date.now() - 86400000,
                read: false
            }
        ];
    },
    
    // Save notifications
    save: function(notifications) {
        localStorage.setItem('notifications', JSON.stringify(notifications));
        this.updateBadge();
    },
    
    // Mark all as read
    markAllRead: function() {
        const notifications = this.get();
        notifications.forEach(n => n.read = true);
        this.save(notifications);
    },
    
    // Mark single notification as read
    markRead: function(id) {
        const notifications = this.get();
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.save(notifications);
        }
    },
    
    // Add new notification
    add: function(notification) {
        const notifications = this.get();
        notification.id = Date.now();
        notification.timestamp = Date.now();
        notification.read = false;
        notifications.unshift(notification);
        this.save(notifications);
    },
    
    // Update badge count
    updateBadge: function() {
        const notifications = this.get();
        const unreadCount = notifications.filter(n => !n.read).length;
        const badges = document.querySelectorAll('.badge');
        badges.forEach(badge => {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        });
    },
    
    // Render notifications
    render: function() {
        const notifications = this.get();
        const container = document.querySelector('.notification-list');
        if (!container) return;
        
        container.innerHTML = notifications.map(n => `
            <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
                <div class="notification-icon ${n.type}">${n.icon}</div>
                <div class="notification-content">
                    <h4>${n.title}</h4>
                    <p>${n.message}</p>
                    <span class="notification-time">${n.time}</span>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        container.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                NotificationManager.markRead(id);
                this.classList.remove('unread');
            });
        });
    }
};

// Toggle Notifications Dropdown
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        if (dropdown.classList.contains('show')) {
            NotificationManager.render();
        }
    }
}

// Close notifications when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationDropdown');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (dropdown && !dropdown.contains(event.target) && !notificationBtn?.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Form Validation Utilities
const Validator = {
    email: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    phone: function(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },
    
    required: function(value) {
        return value && value.trim().length > 0;
    },
    
    number: function(value, min = 0, max = Infinity) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }
};

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</div>
        <div class="toast-message">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Loading state management
function setLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner"></span> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update user profile across all pages
    UserProfile.updateAllPages();
    
    // Update notification badge
    NotificationManager.updateBadge();
    
    // Setup mark all as read button
    const markReadBtn = document.querySelector('.mark-read-btn');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', function() {
            NotificationManager.markAllRead();
            document.querySelectorAll('.notification-item').forEach(item => {
                item.classList.remove('unread');
            });
            showToast('All notifications marked as read', 'success');
        });
    }
});

// Export for use in other modules
window.UserProfile = UserProfile;
window.NotificationManager = NotificationManager;
window.Validator = Validator;
window.showToast = showToast;
window.setLoading = setLoading;
window.toggleNotifications = toggleNotifications;
