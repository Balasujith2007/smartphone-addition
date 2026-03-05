# Notifications Quick Start Guide

## Current Status
Your app is working in **OFFLINE MODE** - predictions work but no SMS/Email notifications are sent.

---

## Why Notifications Aren't Working

The backend requires credentials to send notifications:
- ❌ **Email**: No SMTP credentials in `.env`
- ❌ **SMS**: No Twilio credentials in `.env`

Without these, the app falls back to offline mode (frontend calculates results locally).

---

## Quick Fix Options

### Option 1: Interactive Setup (Easiest)
```bash
npm run setup:notifications
```
Follow the prompts to configure email and/or SMS.

### Option 2: Manual Setup (Gmail - Free)

1. **Get Gmail App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Create app password for "Mail"
   - Copy the 16-character password

2. **Edit .env file**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   EMAIL_FROM=your_email@gmail.com
   ```

3. **Restart server**
   ```bash
   npm start
   ```

### Option 3: Test Without Real Notifications

Keep using offline mode - perfect for:
- Development and testing
- Demo purposes
- When you don't need real notifications

---

## Test Your Setup

After configuring credentials:

```bash
# Test if notifications work
npm run test:notifications

# Start the server
npm start

# Complete a prediction in the browser
# Check your email/phone for notifications
```

---

## What Happens Now

### With Credentials Configured ✅
1. User completes prediction
2. Backend calculates risk
3. **Email sent** to user's email
4. **SMS sent** to user's phone (if Twilio configured)
5. Results displayed in browser

### Without Credentials (Current) ⚠️
1. User completes prediction
2. Frontend calculates risk locally
3. **No email sent**
4. **No SMS sent**
5. Results displayed in browser

---

## Cost

- **Email (Gmail)**: FREE
- **SMS (Twilio)**: $15 free trial credit (~500 SMS)
- **Database**: Optional (app works without it)

---

## Recommended Setup

For testing/demo:
```env
# Email only (free)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
```

For production:
```env
# Email + SMS
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Need Help?

- **Detailed setup**: See `NOTIFICATION_SETUP.md`
- **Test notifications**: Run `npm run test:notifications`
- **Check logs**: Look at `logs/combined.log`
- **Server logs**: Watch terminal where `npm start` is running

---

## Quick Commands

```bash
# Interactive setup wizard
npm run setup:notifications

# Test if notifications work
npm run test:notifications

# Start server
npm start

# View logs
cat logs/combined.log
```

---

## Summary

Your app is fully functional in offline mode. To enable notifications:

1. **Easiest**: Run `npm run setup:notifications`
2. **Quick**: Add Gmail credentials to `.env`
3. **Test**: Run `npm run test:notifications`
4. **Start**: Run `npm start`

That's it! 🎉
