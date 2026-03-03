// Store original values
let originalValues = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dob: '1995-06-15'
};

// Toggle Edit Mode
function toggleEditMode() {
    const inputs = document.querySelectorAll('#profileForm input');
    const formActions = document.getElementById('formActions');
    const editBtn = document.querySelector('.btn-edit-profile');
    
    const isDisabled = inputs[0].disabled;
    
    inputs.forEach(input => {
        input.disabled = !isDisabled;
        if (!isDisabled) {
            input.style.background = 'var(--bg-primary)';
            input.style.cursor = 'not-allowed';
        } else {
            input.style.background = 'white';
            input.style.cursor = 'text';
        }
    });
    
    if (isDisabled) {
        formActions.style.display = 'flex';
        editBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Cancel';
        editBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    } else {
        formActions.style.display = 'none';
        editBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit Profile';
        editBtn.style.background = 'linear-gradient(135deg, #1f2937 0%, #374151 100%)';
    }
}

// Cancel Edit
function cancelEdit() {
    // Reset form values to original
    document.getElementById('firstName').value = originalValues.firstName;
    document.getElementById('lastName').value = originalValues.lastName;
    document.getElementById('email').value = originalValues.email;
    document.getElementById('phone').value = originalValues.phone;
    document.getElementById('dob').value = originalValues.dob;
    
    // Update display name
    updateDisplayName();
    
    toggleEditMode();
}

// Update display name
function updateDisplayName() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const fullName = `${firstName} ${lastName}`;
    
    // Update profile header
    document.querySelector('.profile-details h2').textContent = fullName;
    
    // Update navbar
    document.querySelector('.profile-menu span').textContent = fullName;
    
    // Update avatar
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=120&background=1f2937&color=fff`;
    document.querySelector('.profile-avatar').src = avatarUrl;
    document.querySelector('.profile-menu img').src = avatarUrl.replace('size=120', 'size=32');
}

// Save Profile
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get current values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value;
    
    // Validate
    if (!firstName || !lastName || !email || !phone || !dob) {
        alert('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Update original values
    originalValues = {
        firstName,
        lastName,
        email,
        phone,
        dob
    };
    
    // Update display
    updateDisplayName();
    document.querySelector('.profile-details p').textContent = email;
    
    // Show success message
    showSuccessMessage('Profile updated successfully!');
    
    // Toggle back to view mode
    toggleEditMode();
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(originalValues));
});

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        ${message}
    `;
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Toggle Notifications
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('show');
}

// Close notifications when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationDropdown');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (dropdown && !dropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Mark all as read
const markReadBtn = document.querySelector('.mark-read-btn');
if (markReadBtn) {
    markReadBtn.addEventListener('click', function() {
        document.querySelectorAll('.notification-item').forEach(item => {
            item.classList.remove('unread');
        });
        const badge = document.querySelector('.badge');
        if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
        showSuccessMessage('All notifications marked as read');
    });
}

// Avatar upload
const avatarInput = document.getElementById('avatarInput');
if (avatarInput) {
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageUrl = event.target.result;
                document.querySelector('.profile-avatar').src = imageUrl;
                document.querySelector('.profile-menu img').src = imageUrl;
                
                // Save to localStorage
                localStorage.setItem('userAvatar', imageUrl);
                
                showSuccessMessage('Profile picture updated!');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Load saved profile data on page load
window.addEventListener('DOMContentLoaded', function() {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        originalValues = profile;
        
        document.getElementById('firstName').value = profile.firstName;
        document.getElementById('lastName').value = profile.lastName;
        document.getElementById('email').value = profile.email;
        document.getElementById('phone').value = profile.phone;
        document.getElementById('dob').value = profile.dob;
        
        updateDisplayName();
        document.querySelector('.profile-details p').textContent = profile.email;
    }
    
    // Load avatar from localStorage
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        document.querySelector('.profile-avatar').src = savedAvatar;
        document.querySelector('.profile-menu img').src = savedAvatar;
    }
});
