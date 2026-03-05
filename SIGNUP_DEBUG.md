# Signup Debug Guide

## Test Signup Functionality

### Method 1: Browser Console Test

1. Open http://localhost:3000
2. Open browser console (F12)
3. Run this test:

```javascript
// Test the Auth.register function directly
console.log('Testing Auth.register...');
const result = Auth.register('Test', 'User', 'test@example.com', '+1234567890', 'test123');
console.log('Register result:', result);
console.log('Is logged in:', Auth.isAuthenticated());
console.log('User email:', Auth.getCurrentUser());
console.log('Registered accounts:', JSON.parse(localStorage.getItem('registeredAccounts') || '[]'));
```

### Method 2: Manual Signup Test

1. Go to http://localhost:3000
2. Click "Sign up" link
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Password: john123
   - Confirm Password: john123
4. Click "Create Account"

### Expected Behavior

1. Form validates all fields
2. Checks for duplicate email
3. Calls `Auth.register()`
4. Shows success message with progress bar
5. Redirects to dashboard after 2.2 seconds

### Common Issues

#### Issue 1: Nothing Happens When Clicking "Create Account"

**Possible Causes:**
- JavaScript error in console
- Button not wired up correctly
- Form validation failing silently

**Debug Steps:**
1. Open console (F12)
2. Look for red error messages
3. Check if `submitSignUp` function exists:
   ```javascript
   console.log(typeof submitSignUp);
   // Should output: "function"
   ```

#### Issue 2: "An account with this email already exists"

**Solution:**
Clear existing accounts:
```javascript
localStorage.removeItem('registeredAccounts');
location.reload();
```

#### Issue 3: Validation Errors

**Check:**
- First name and last name are not empty
- Email format is valid (contains @ and .)
- Password is at least 6 characters
- Passwords match

#### Issue 4: Redirects but Not Logged In

**Debug:**
```javascript
console.log('Is logged in:', localStorage.getItem('isLoggedIn'));
console.log('User email:', localStorage.getItem('userEmail'));
console.log('User data:', localStorage.getItem('userData'));
```

### Manual Fix

If signup is completely broken, you can manually create an account:

```javascript
// Run this in browser console
Auth.register('John', 'Doe', 'john@example.com', '+1234567890', 'john123');
console.log('Account created! Refresh the page and login.');
```

### Check if Auth Object Exists

```javascript
// Run in console
console.log('Auth object:', Auth);
console.log('Auth.register:', typeof Auth.register);
console.log('Auth.login:', typeof Auth.login);
```

### Verify Form Elements Exist

```javascript
// Run in console after opening signup modal
console.log('First name input:', document.getElementById('suFirstName'));
console.log('Last name input:', document.getElementById('suLastName'));
console.log('Email input:', document.getElementById('suEmail'));
console.log('Phone input:', document.getElementById('suPhone'));
console.log('Password input:', document.getElementById('suPassword'));
console.log('Confirm password input:', document.getElementById('suConfirmPassword'));
```

### Test Step by Step

```javascript
// 1. Open signup modal
openModal('signUpModal');

// 2. Fill in values
document.getElementById('suFirstName').value = 'John';
document.getElementById('suLastName').value = 'Doe';
document.getElementById('suEmail').value = 'john@example.com';
document.getElementById('suPhone').value = '+1234567890';
document.getElementById('suPassword').value = 'john123';
document.getElementById('suConfirmPassword').value = 'john123';

// 3. Call submit function
submitSignUp();

// 4. Check result
console.log('Logged in:', Auth.isAuthenticated());
```

### Clear All Data and Start Fresh

```javascript
// Run in console
localStorage.clear();
sessionStorage.clear();
location.reload();
console.log('All data cleared. Try signup again.');
```

### Check for JavaScript Errors

Look for these common errors in console:
- `Auth is not defined` - auth.js not loaded
- `submitSignUp is not defined` - function not in scope
- `Cannot read property 'value' of null` - form element not found
- `showError is not defined` - utility function missing

### Verify Files Are Loading

```javascript
// Check if scripts loaded
console.log('Auth loaded:', typeof Auth !== 'undefined');
console.log('FormValidator loaded:', typeof FormValidator !== 'undefined');
console.log('UserData loaded:', typeof UserData !== 'undefined');
```

## Quick Test Script

Copy and paste this entire block into console:

```javascript
console.log('=== SIGNUP DEBUG TEST ===');

// 1. Check if Auth exists
console.log('1. Auth object exists:', typeof Auth !== 'undefined');

// 2. Check if register function exists
console.log('2. Auth.register exists:', typeof Auth?.register === 'function');

// 3. Clear old data
localStorage.removeItem('registeredAccounts');
console.log('3. Cleared old accounts');

// 4. Test registration
const testResult = Auth.register('Test', 'User', 'test@example.com', '+1234567890', 'test123');
console.log('4. Registration result:', testResult);

// 5. Check if logged in
console.log('5. Is logged in:', Auth.isAuthenticated());

// 6. Check stored data
console.log('6. Registered accounts:', JSON.parse(localStorage.getItem('registeredAccounts') || '[]'));
console.log('7. User data:', JSON.parse(localStorage.getItem('userData') || '{}'));

console.log('=== TEST COMPLETE ===');
console.log('If all checks passed, signup is working!');
console.log('Try refreshing and logging in with: test@example.com / test123');
```

## What to Report

If signup still doesn't work, please provide:

1. Browser console errors (screenshot or copy/paste)
2. Result of the Quick Test Script above
3. What happens when you click "Create Account" (nothing, error message, etc.)
4. Browser and version (Chrome, Firefox, etc.)

## Workaround

If signup is broken, you can still use the app:

1. Use demo login (if no accounts exist):
   - Email: demo@example.com
   - Password: demo123

2. Or manually create account via console:
   ```javascript
   Auth.register('Your', 'Name', 'your@email.com', '+1234567890', 'yourpassword');
   location.reload();
   ```

Then login with your credentials.
