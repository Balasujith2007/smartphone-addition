# 🔄 Convert to Top Navbar Layout

## What Changed:
- ❌ Removed left sidebar
- ✅ Added horizontal top navbar
- ✅ Full-width content area
- ✅ Mobile-responsive menu

---

## Quick Conversion Steps:

### Step 1: Add CSS Files

In the `<head>` section of ALL HTML files, add:

```html
<link rel="stylesheet" href="src/css/top-navbar.css">
```

After the existing CSS files.

### Step 2: Add JavaScript

In the `<head>` section, add:

```html
<script src="src/js/top-navbar.js" defer></script>
```

### Step 3: Replace HTML Structure

**OLD Structure:**
```html
<div class="app-container">
    <aside class="sidebar">
        <!-- sidebar content -->
    </aside>
    <main class="main-content">
        <header class="top-navbar">
            <!-- old navbar -->
        </header>
        <!-- content -->
    </main>
</div>
```

**NEW Structure:**
```html
<nav class="top-nav-bar">
    <div class="top-nav-container">
        <!-- Logo -->
        <a href="dashboard.html" class="top-nav-logo">
            <svg width="36" height="36" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="url(#logo-gradient)" />
                <path d="M20 28 L14 22 C12 20 12 17 14 15 C16 13 18 13 20 15 C22 13 24 13 26 15 C28 17 28 20 26 22 L20 28 Z" fill="#fff" />
                <defs>
                    <linearGradient id="logo-gradient">
                        <stop offset="0%" stop-color="#06b6d4" />
                        <stop offset="100%" stop-color="#6366f1" />
                    </linearGradient>
                </defs>
            </svg>
            <span>Digital Wellness</span>
        </a>

        <!-- Mobile Toggle -->
        <button class="mobile-nav-toggle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>

        <!-- Menu -->
        <div class="top-nav-menu">
            <a href="dashboard.html" class="top-nav-item">
                <span class="icon">📊</span>
                <span>Dashboard</span>
            </a>
            <a href="prediction.html" class="top-nav-item">
                <span class="icon">🎯</span>
                <span>Prediction</span>
            </a>
            <a href="analytics.html" class="top-nav-item">
                <span class="icon">📈</span>
                <span>Analytics</span>
            </a>
            <a href="profile.html" class="top-nav-item">
                <span class="icon">👤</span>
                <span>Profile</span>
            </a>
        </div>

        <!-- Right Section -->
        <div class="top-nav-right">
            <button class="top-nav-notification-btn" onclick="toggleNotifications()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span class="badge">3</span>
            </button>

            <div class="top-nav-profile" onclick="window.location.href='profile.html'">
                <img src="https://ui-avatars.com/api/?name=JD&size=32&background=06b6d4&color=fff&bold=true" alt="Profile">
                <span>John Doe</span>
            </div>

            <a href="#" class="top-nav-logout" onclick="Auth.logout(); return false;">
                <span class="icon">🚪</span>
                <span>Logout</span>
            </a>
        </div>
    </div>
</nav>

<!-- Notification Dropdown -->
<div class="notification-dropdown" id="notificationDropdown">
    <!-- Keep your existing notification content -->
</div>

<!-- Content Wrapper -->
<div class="content-wrapper">
    <!-- Your page content goes here -->
    <!-- Move everything from main-content here -->
</div>
```

---

## Files to Update:

- [ ] dashboard.html
- [ ] prediction.html
- [ ] analytics.html
- [ ] profile.html
- [ ] result.html
- [ ] notifications-history.html

---

## Active Page Indicator:

Add `active` class to the current page's nav item:

```html
<!-- On dashboard.html -->
<a href="dashboard.html" class="top-nav-item active">

<!-- On prediction.html -->
<a href="prediction.html" class="top-nav-item active">
```

---

## Features:

✅ Fixed top navigation
✅ Horizontal menu layout
✅ Mobile hamburger menu
✅ Full-width content
✅ Responsive design
✅ Touch-friendly
✅ Modern look

---

## Preview:

Desktop: Logo | Dashboard | Prediction | Analytics | Profile | 🔔 | Profile | Logout
Mobile: Logo | ☰ (menu slides down)

---

## Need Help?

See `top-navbar-template.html` for complete example!
