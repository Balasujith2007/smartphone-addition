// Common JavaScript for all pages - User data management and notifications

// User Data Management
const UserData = {
    get: function() {
        const defaultUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            dob: '1995-06-15',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&size=120&background=1f2937&color=fff'
        };
        
        const stored = localStorage.getItem('userData');
        return stored ? JSON.parse(stored) : defaultUser;
    },
    
    set: function(data) {
        localStorage.setItem('userData', JSON.stringify(data));
        this.updateAllPages();
    },
    
    updateAllPages: function() {
        const user = this.get();
        const fullName = `${user.firstName} ${user.lastName}`;
        
        // Update profile menu in navbar
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
        const profileName = document.querySelector('.profile-details h2');
        const profileEmail = document.querySelector('.profile-details p');
        if (profileName) profileName.textContent = fullName;
        if (profileEmail) profileEmail.textContent = user.email;
    }
};

// Notification Management
const NotificationManager = {
    notifications: [],
    
    init: function() {
        // Load notifications from localStorage
        const stored = localStorage.getItem('notifications');
        this.notifications = stored ? JSON.parse(stored) : this.getDefaultNotifications();
        this.render();
        this.updateBadge();
    },
    
    getDefaultNotifications: function() {
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
    
    add: function(notification) {
        notification.id = Date.now();
        notification.unread = true;
        notification.timestamp = Date.now();
        this.notifications.unshift(notification);
        this.save();
        this.render();
        this.updateBadge();
    },
    
    markAsRead: function(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.unread = false;
            this.save();
            this.render();
            this.updateBadge();
        }
    },
    
    markAllAsRead: function() {
        this.notifications.forEach(n => n.unread = false);
        this.save();
        this.render();
        this.updateBadge();
    },
    
    remove: function(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.save();
        this.render();
        this.updateBadge();
    },
    
    save: function() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    },
    
    render: function() {
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
    
    updateBadge: function() {
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
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationDropdown');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (dropdown && !dropdown.contains(event.target) && !notificationBtn?.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update user data on all pages
    UserData.updateAllPages();
    
    // Initialize notifications
    NotificationManager.init();
    
    // Setup mark all as read button
    const markReadBtn = document.querySelector('.mark-read-btn');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', function() {
            NotificationManager.markAllAsRead();
        });
    }
    
    // Add form validation to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                    
                    // Remove error styling after user starts typing
                    input.addEventListener('input', function() {
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

// Add toast styles
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
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
    
    .toast-message {
        font-size: 14px;
        font-weight: 500;
        color: #111827;
    }
`;
document.head.appendChild(toastStyles);
