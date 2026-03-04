// ============================================================
// Store original values (loaded from UserData on DOMContentLoaded)
// ============================================================
let originalValues = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dob: '1995-06-15'
};

// ============================================================
// Toggle Edit Mode
// ============================================================
function toggleEditMode() {
    const inputs = document.querySelectorAll('#profileForm input');
    const formActions = document.getElementById('formActions');
    const editBtn = document.querySelector('.btn-edit-profile');

    const isDisabled = inputs[0].disabled;

    inputs.forEach(input => {
        input.disabled = !isDisabled;
        if (!isDisabled) {
            // Switching back to view mode — restore white/theme text
            input.style.background = '';
            input.style.cursor = 'not-allowed';
            input.style.borderColor = '';
            input.style.color = 'var(--text-primary, #e8f4fd)';
        } else {
            // Switching to edit mode — black text for visibility while typing
            input.style.background = 'var(--bg-tertiary, #262626)';
            input.style.cursor = 'text';
            input.style.borderColor = 'rgba(6,182,212,0.4)';
            input.style.color = '#ffffff';
        }
    });

    if (isDisabled) {
        formActions.style.display = 'flex';
        editBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Cancel`;
        editBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    } else {
        formActions.style.display = 'none';
        editBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit Profile`;
        editBtn.style.background = '';
    }
}

// ============================================================
// Cancel Edit
// ============================================================
function cancelEdit() {
    document.getElementById('firstName').value = originalValues.firstName;
    document.getElementById('lastName').value = originalValues.lastName;
    document.getElementById('email').value = originalValues.email;
    document.getElementById('phone').value = originalValues.phone;
    document.getElementById('dob').value = originalValues.dob;
    updateDisplayName();
    toggleEditMode();
}

// ============================================================
// Update display name everywhere
// ============================================================
function updateDisplayName() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const fullName = `${firstName} ${lastName}`;
    
    // Get first letter of first name and first letter of last name
    const firstInitial = firstName.charAt(0).toUpperCase() || 'J';
    const lastInitial = lastName.charAt(0).toUpperCase() || 'D';
    const initials = `${firstInitial}${lastInitial}`;

    // Update profile header display
    const displayName = document.getElementById('profileDisplayName');
    const displayEmail = document.getElementById('profileDisplayEmail');
    if (displayName) displayName.textContent = fullName;
    if (displayEmail) displayEmail.textContent = document.getElementById('email').value;

    // Update navbar name
    const navSpan = document.querySelector('.profile-menu span');
    if (navSpan) navSpan.textContent = fullName;

    // Update avatar with initials
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=120&background=06b6d4&color=fff&bold=true`;
    const avatar = document.querySelector('.profile-avatar');
    const navImg = document.querySelector('.profile-menu img');
    if (avatar) avatar.src = avatarUrl;
    if (navImg) navImg.src = avatarUrl;
}

// ============================================================
// Save Profile (form submit)
// ============================================================
document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value;

    if (!firstName || !lastName || !email || !phone || !dob) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    originalValues = { firstName, lastName, email, phone, dob };

    const currentAvatar = document.querySelector('.profile-avatar').src;
    UserData.set({ firstName, lastName, email, phone, dob, avatar: currentAvatar });

    updateDisplayName();
    document.querySelector('.profile-details p').textContent = email;

    showToast('Profile updated successfully! ✓', 'success');
    toggleEditMode();
});

// ============================================================
// Avatar Upload
// ============================================================
const avatarInput = document.getElementById('avatarInput');
if (avatarInput) {
    avatarInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { showToast('Please select an image file', 'error'); return; }
        if (file.size > 5 * 1024 * 1024) { showToast('Image size should be less than 5MB', 'error'); return; }

        const reader = new FileReader();
        reader.onload = function (event) {
            const imageUrl = event.target.result;
            document.querySelector('.profile-avatar').src = imageUrl;
            document.querySelector('.profile-menu img').src = imageUrl;
            const currentUser = UserData.get();
            currentUser.avatar = imageUrl;
            UserData.set(currentUser);
            showToast('Profile picture updated! ✓', 'success');
        };
        reader.readAsDataURL(file);
    });
}

// ============================================================
// Mark All Notifications as Read
// ============================================================
const markReadBtn = document.querySelector('.mark-read-btn');
if (markReadBtn) {
    markReadBtn.addEventListener('click', function () {
        NotificationManager.markAllAsRead();
        showToast('All notifications marked as read', 'success');
    });
}

// ============================================================
// MODAL HELPERS
// ============================================================
function createModal(title, bodyHTML, footerHTML = '') {
    closeModal(); // Remove any existing modal
    const overlay = document.createElement('div');
    overlay.id = 'profileModal';
    overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.7);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; padding: 20px; backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease;
    `;
    overlay.innerHTML = `
        <div style="
            background: var(--bg-secondary, #1a1a1a);
            border: 1px solid var(--border-color, #2a2a2a);
            border-radius: 20px; padding: 32px;
            max-width: 480px; width: 100%;
            box-shadow: 0 25px 50px rgba(0,0,0,0.7);
            animation: slideUp 0.25s ease;
        ">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                <h3 style="font-size:20px; font-weight:700; color:var(--text-primary,#f5f5f5);">${title}</h3>
                <button onclick="closeModal()" style="
                    background:none; border:none; cursor:pointer;
                    color:var(--text-secondary,#a3a3a3); font-size:24px; line-height:1;
                    padding:4px; border-radius:6px; transition:color 0.2s;
                " onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--text-secondary,#a3a3a3)'">×</button>
            </div>
            <div style="color:var(--text-secondary,#a3a3a3); line-height:1.7;">${bodyHTML}</div>
            ${footerHTML ? `<div style="margin-top:24px; display:flex; gap:12px; justify-content:flex-end;">${footerHTML}</div>` : ''}
        </div>
    `;
    // Close on overlay click
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.body.appendChild(overlay);

    // Add animations
    if (!document.getElementById('modalStyles')) {
        const s = document.createElement('style');
        s.id = 'modalStyles';
        s.textContent = `
            @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
            @keyframes slideUp { from { transform:translateY(20px); opacity:0 } to { transform:translateY(0); opacity:1 } }
            .modal-input {
                width:100%; padding:12px 16px; border-radius:10px;
                border:1px solid var(--border-color, #2a2a2a);
                background:var(--bg-tertiary, #262626);
                color:var(--text-primary, #f5f5f5);
                font-family:inherit; font-size:15px; outline:none;
                transition:border-color 0.2s;
            }
            .modal-input:focus { border-color:#6366f1; }
            .modal-label {
                display:block; font-size:13px; font-weight:500;
                color:var(--text-secondary,#a3a3a3); margin-bottom:6px; margin-top:16px;
            }
            .modal-label:first-child { margin-top:0; }
            .modal-btn-primary {
                padding:10px 22px; background:linear-gradient(135deg,#6366f1,#8b5cf6);
                color:white; border:none; border-radius:10px; font-weight:600;
                cursor:pointer; font-family:inherit; font-size:14px; transition:all 0.2s;
            }
            .modal-btn-primary:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(99,102,241,0.4); }
            .modal-btn-secondary {
                padding:10px 22px; background:var(--bg-tertiary,#262626);
                color:var(--text-primary,#f5f5f5); border:1px solid var(--border-color,#2a2a2a);
                border-radius:10px; font-weight:600; cursor:pointer; font-family:inherit; font-size:14px; transition:all 0.2s;
            }
            .modal-btn-secondary:hover { border-color:var(--border-light,#3a3a3a); }
            .modal-btn-danger {
                padding:10px 22px; background:linear-gradient(135deg,#ef4444,#dc2626);
                color:white; border:none; border-radius:10px; font-weight:600;
                cursor:pointer; font-family:inherit; font-size:14px; transition:all 0.2s;
            }
            .modal-btn-danger:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(239,68,68,0.4); }
        `;
        document.head.appendChild(s);
    }
}

function closeModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.remove();
}

// ============================================================
// SET NEW GOAL MODAL
// ============================================================
function openSetGoalModal() {
    createModal(
        '🎯 Set New Goal',
        `
        <label class="modal-label">Goal Type</label>
        <select id="goalType" class="modal-input" style="cursor:pointer;">
            <option value="screen_time">Daily Screen Time</option>
            <option value="night_usage">Night Usage</option>
            <option value="unlocks">Phone Unlocks</option>
            <option value="app_limit">App Limit</option>
        </select>
        <label class="modal-label">Target Value</label>
        <input id="goalTarget" class="modal-input" type="number" placeholder="e.g. 4 (hours) or 80 (times)" min="0">
        <label class="modal-label">Unit</label>
        <select id="goalUnit" class="modal-input" style="cursor:pointer; margin-top:0;">
            <option value="hours">Hours</option>
            <option value="times">Times</option>
            <option value="minutes">Minutes</option>
        </select>
        `,
        `<button class="modal-btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="modal-btn-primary" onclick="saveGoal()">Save Goal</button>`
    );
}

function saveGoal() {
    const type = document.getElementById('goalType').value;
    const target = document.getElementById('goalTarget').value;
    const unit = document.getElementById('goalUnit').value;
    if (!target || isNaN(target) || Number(target) <= 0) {
        showToast('Please enter a valid target value', 'error');
        return;
    }
    const labels = { screen_time: 'Daily Screen Time', night_usage: 'Night Usage', unlocks: 'Phone Unlocks', app_limit: 'App Limit' };
    showToast(`Goal set: ${labels[type]} → ${target} ${unit} ✓`, 'success');
    closeModal();
}

// ============================================================
// CHANGE PASSWORD MODAL
// ============================================================
function openChangePasswordModal() {
    createModal(
        '🔐 Change Password',
        `
        <label class="modal-label">Current Password</label>
        <input id="currentPass" class="modal-input" type="password" placeholder="Enter current password">
        <label class="modal-label">New Password</label>
        <input id="newPass" class="modal-input" type="password" placeholder="At least 8 characters">
        <label class="modal-label">Confirm New Password</label>
        <input id="confirmPass" class="modal-input" type="password" placeholder="Re-enter new password">
        `,
        `<button class="modal-btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="modal-btn-primary" onclick="savePassword()">Update Password</button>`
    );
}

function savePassword() {
    const current = document.getElementById('currentPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirm = document.getElementById('confirmPass').value;
    if (!current) { showToast('Please enter your current password', 'error'); return; }
    if (newPass.length < 8) { showToast('New password must be at least 8 characters', 'error'); return; }
    if (newPass !== confirm) { showToast('Passwords do not match', 'error'); return; }
    showToast('Password updated successfully! ✓', 'success');
    closeModal();
}

// ============================================================
// ENABLE 2FA MODAL
// ============================================================
function openEnable2FAModal() {
    createModal(
        '🔒 Two-Factor Authentication',
        `
        <p style="margin-bottom:16px;">Choose your preferred 2FA method:</p>
        <div style="display:flex; flex-direction:column; gap:12px;">
            <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1px solid var(--border-color,#2a2a2a); border-radius:12px; cursor:pointer; transition:border-color 0.2s;"
                   onmouseover="this.style.borderColor='#6366f1'" onmouseout="this.style.borderColor='var(--border-color,#2a2a2a)'">
                <input type="radio" name="tfa" value="sms" style="accent-color:#6366f1;"> 
                <div><strong style="color:var(--text-primary,#f5f5f5);">📱 SMS Code</strong><br><small>Receive a code via text message</small></div>
            </label>
            <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1px solid var(--border-color,#2a2a2a); border-radius:12px; cursor:pointer; transition:border-color 0.2s;"
                   onmouseover="this.style.borderColor='#6366f1'" onmouseout="this.style.borderColor='var(--border-color,#2a2a2a)'">
                <input type="radio" name="tfa" value="app" style="accent-color:#6366f1;"> 
                <div><strong style="color:var(--text-primary,#f5f5f5);">🔑 Authenticator App</strong><br><small>Use Google Authenticator or similar</small></div>
            </label>
            <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1px solid var(--border-color,#2a2a2a); border-radius:12px; cursor:pointer; transition:border-color 0.2s;"
                   onmouseover="this.style.borderColor='#6366f1'" onmouseout="this.style.borderColor='var(--border-color,#2a2a2a)'">
                <input type="radio" name="tfa" value="email" style="accent-color:#6366f1;"> 
                <div><strong style="color:var(--text-primary,#f5f5f5);">📧 Email Code</strong><br><small>Receive a code via email</small></div>
            </label>
        </div>
        `,
        `<button class="modal-btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="modal-btn-primary" onclick="enable2FA()">Enable 2FA</button>`
    );
}

function enable2FA() {
    const selected = document.querySelector('input[name="tfa"]:checked');
    if (!selected) { showToast('Please select a 2FA method', 'error'); return; }
    const labels = { sms: 'SMS Code', app: 'Authenticator App', email: 'Email Code' };
    showToast(`Two-Factor Authentication enabled via ${labels[selected.value]}! ✓`, 'success');
    // Update the button text on the page
    const twoFABtn = document.querySelector('.security-item:nth-child(2) button');
    if (twoFABtn) { twoFABtn.textContent = 'Disable'; twoFABtn.classList.remove('btn-primary'); twoFABtn.classList.add('btn-secondary'); }
    const twoFAStatus = document.querySelector('.security-item:nth-child(2) p');
    if (twoFAStatus) twoFAStatus.textContent = `Enabled via ${labels[selected.value]}`;
    closeModal();
}

// ============================================================
// MANAGE SESSIONS MODAL
// ============================================================
function openManageSessionsModal() {
    const sessions = [
        { device: '💻 Windows PC', browser: 'Chrome 121', location: 'Chennai, IN', time: 'Active now', current: true },
        { device: '📱 Android Phone', browser: 'Chrome Mobile', location: 'Chennai, IN', time: '2 hours ago', current: false },
    ];
    const sessionsHTML = sessions.map((s, i) => `
        <div style="padding:14px 16px; border:1px solid var(--border-color,#2a2a2a); border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <p style="font-size:15px; font-weight:600; color:var(--text-primary,#f5f5f5); margin-bottom:2px;">${s.device} — ${s.browser}</p>
                <p style="font-size:13px; margin-bottom:2px;">📍 ${s.location} · ${s.time}</p>
                ${s.current ? '<span style="font-size:11px; background:rgba(16,185,129,0.15); color:#10b981; padding:2px 8px; border-radius:6px; font-weight:600;">Current Session</span>' : ''}
            </div>
            ${!s.current ? `<button onclick="revokeSession(${i})" class="modal-btn-danger" style="padding:6px 14px; font-size:13px;">Revoke</button>` : ''}
        </div>
    `).join('');
    createModal(
        '🖥️ Active Sessions',
        `<p style="margin-bottom:16px;">You are currently logged in on ${sessions.length} devices.</p>${sessionsHTML}`,
        `<button class="modal-btn-secondary" onclick="closeModal()">Close</button>
         <button class="modal-btn-danger" onclick="revokeAllSessions()">Revoke All Others</button>`
    );
}

function revokeSession(index) {
    showToast('Session revoked successfully ✓', 'success');
    closeModal();
}

function revokeAllSessions() {
    showToast('All other sessions have been revoked ✓', 'success');
    const activeCount = document.querySelector('.security-item:nth-child(3) p');
    if (activeCount) activeCount.textContent = '1 device logged in';
    closeModal();
}

// ============================================================
// EXPORT DATA MODAL
// ============================================================
function openExportDataModal() {
    createModal(
        '📦 Export Your Data',
        `
        <p style="margin-bottom:16px;">Choose the data you want to export:</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                <input type="checkbox" id="exp_profile" checked style="accent-color:#6366f1; width:16px; height:16px;">
                <span style="color:var(--text-primary,#f5f5f5);">👤 Profile Information</span>
            </label>
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                <input type="checkbox" id="exp_usage" checked style="accent-color:#6366f1; width:16px; height:16px;">
                <span style="color:var(--text-primary,#f5f5f5);">📱 Screen Time History</span>
            </label>
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                <input type="checkbox" id="exp_analytics" checked style="accent-color:#6366f1; width:16px; height:16px;">
                <span style="color:var(--text-primary,#f5f5f5);">📊 Analytics Data</span>
            </label>
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                <input type="checkbox" id="exp_goals" style="accent-color:#6366f1; width:16px; height:16px;">
                <span style="color:var(--text-primary,#f5f5f5);">🎯 Goals & Progress</span>
            </label>
        </div>
        <label class="modal-label" style="margin-top:20px;">Format</label>
        <select id="exportFormat" class="modal-input" style="cursor:pointer;">
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
        </select>
        `,
        `<button class="modal-btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="modal-btn-primary" onclick="exportData()">Download Export</button>`
    );
}

function exportData() {
    const selected = [];
    if (document.getElementById('exp_profile')?.checked) selected.push('profile');
    if (document.getElementById('exp_usage')?.checked) selected.push('usage');
    if (document.getElementById('exp_analytics')?.checked) selected.push('analytics');
    if (document.getElementById('exp_goals')?.checked) selected.push('goals');
    if (selected.length === 0) { showToast('Please select at least one data type', 'error'); return; }

    const format = document.getElementById('exportFormat').value;
    const user = UserData.get();
    const exportObj = {
        exportedAt: new Date().toISOString(),
        format,
        data: {}
    };
    if (selected.includes('profile')) exportObj.data.profile = user;
    if (selected.includes('usage')) exportObj.data.usage = { totalScreenTime: '38h 45m', weeklyAvg: '5h 32m', unlocks: 892 };
    if (selected.includes('analytics')) exportObj.data.analytics = { peakHour: '8 PM - 11 PM', topApp: 'Social Media (32%)' };
    if (selected.includes('goals')) exportObj.data.goals = { dailyScreenTime: '4h target', nightUsage: '<1h target' };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-wellness-export-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully! ✓', 'success');
    closeModal();
}

// ============================================================
// DELETE ACCOUNT MODAL
// ============================================================
function openDeleteAccountModal() {
    createModal(
        '⚠️ Delete Account',
        `
        <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:12px; padding:16px; margin-bottom:20px;">
            <p style="color:#ef4444; font-weight:600; margin-bottom:6px;">This action is permanent and cannot be undone.</p>
            <p style="font-size:14px;">All your data including screen time history, analytics, goals, and settings will be permanently deleted.</p>
        </div>
        <label class="modal-label">Type <strong style="color:#ef4444;">DELETE</strong> to confirm</label>
        <input id="deleteConfirm" class="modal-input" type="text" placeholder="Type DELETE here">
        `,
        `<button class="modal-btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="modal-btn-danger" onclick="confirmDeleteAccount()">Delete Account</button>`
    );
}

function confirmDeleteAccount() {
    const val = document.getElementById('deleteConfirm').value.trim();
    if (val !== 'DELETE') { showToast('Please type DELETE to confirm', 'error'); return; }
    localStorage.clear();
    showToast('Account deleted. Redirecting...', 'info');
    closeModal();
    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
}

// ============================================================
// Wire up buttons on DOMContentLoaded
// ============================================================
window.addEventListener('DOMContentLoaded', function () {
    // Load profile data
    const profile = UserData.get();
    originalValues = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        dob: profile.dob
    };

    document.getElementById('firstName').value = profile.firstName;
    document.getElementById('lastName').value = profile.lastName;
    document.getElementById('email').value = profile.email;
    document.getElementById('phone').value = profile.phone;
    document.getElementById('dob').value = profile.dob;

    // Update the display name & email in the header (no hardcoded values in HTML now)
    const displayName = document.getElementById('profileDisplayName');
    const displayEmail = document.getElementById('profileDisplayEmail');
    if (displayName) displayName.textContent = `${profile.firstName} ${profile.lastName}`;
    if (displayEmail) displayEmail.textContent = profile.email;

    if (profile.avatar) {
        document.querySelector('.profile-avatar').src = profile.avatar;
        document.querySelector('.profile-menu img').src = profile.avatar;
    }

    // Add real-time update listeners for name fields
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    
    firstNameInput.addEventListener('input', updateDisplayName);
    lastNameInput.addEventListener('input', updateDisplayName);

    // Wire: Set New Goal
    const setGoalBtn = document.querySelector('.btn-full');
    if (setGoalBtn) setGoalBtn.addEventListener('click', openSetGoalModal);

    // Wire: Security buttons
    const securityItems = document.querySelectorAll('.security-item');
    securityItems.forEach(item => {
        const h4 = item.querySelector('h4');
        const btn = item.querySelector('button');
        if (!btn || !h4) return;
        const label = h4.textContent.trim();
        if (label === 'Password') btn.addEventListener('click', openChangePasswordModal);
        if (label === 'Two-Factor Authentication') btn.addEventListener('click', openEnable2FAModal);
        if (label === 'Active Sessions') btn.addEventListener('click', openManageSessionsModal);
    });

    // Wire: Danger zone buttons
    const dangerItems = document.querySelectorAll('.danger-item');
    dangerItems.forEach(item => {
        const h4 = item.querySelector('h4');
        const btn = item.querySelector('button');
        if (!btn || !h4) return;
        const label = h4.textContent.trim();
        if (label === 'Export Data') btn.addEventListener('click', openExportDataModal);
        if (label === 'Delete Account') btn.addEventListener('click', openDeleteAccountModal);
    });
});

// Expose for onclick attributes
window.toggleEditMode = toggleEditMode;
window.cancelEdit = cancelEdit;
window.closeModal = closeModal;
window.saveGoal = saveGoal;
window.savePassword = savePassword;
window.enable2FA = enable2FA;
window.revokeSession = revokeSession;
window.revokeAllSessions = revokeAllSessions;
window.exportData = exportData;
window.confirmDeleteAccount = confirmDeleteAccount;
