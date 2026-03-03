// Toggle Edit Mode
function toggleEditMode() {
    const inputs = document.querySelectorAll('#profileForm input');
    const formActions = document.getElementById('formActions');
    const editBtn = document.querySelector('.btn-edit-profile');
    
    inputs.forEach(input => {
        input.disabled = !input.disabled;
    });
    
    if (formActions.style.display === 'none') {
        formActions.style.display = 'flex';
        editBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Cancel';
    } else {
        formActions.style.display = 'none';
        editBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit Profile';
    }
}

// Cancel Edit
function cancelEdit() {
    toggleEditMode();
    // Reset form values
    document.getElementById('firstName').value = 'John';
    document.getElementById('lastName').value = 'Doe';
    document.getElementById('email').value = 'john.doe@example.com';
    document.getElementById('phone').value = '+1 (555) 123-4567';
    document.getElementById('dob').value = '1995-06-15';
}

// Save Profile
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show success message
    alert('Profile updated successfully!');
    toggleEditMode();
});

// Toggle Notifications
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('show');
}

// Close notifications when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationDropdown');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (!dropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Mark all as read
document.querySelector('.mark-read-btn')?.addEventListener('click', function() {
    document.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('unread');
    });
    document.querySelector('.badge').textContent = '0';
});

// Avatar upload
document.getElementById('avatarInput')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.querySelector('.profile-avatar').src = event.target.result;
            document.querySelector('.profile-menu img').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});
