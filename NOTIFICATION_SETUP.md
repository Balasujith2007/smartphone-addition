# Notification Setup Guide

## Overview
Your application supports SMS and Email notifications when users complete their smartphone addiction prediction. Currently, these services are not configured, so the app runs in "offline mode" without sending notifications.

## Current Status
❌ SMS Notifications: Not configured (Twilio credentials missing)
❌ Email Notifications: Not configured (SMTP credentials missing)
✅ Backend API: Working (returns prediction results)
✅ Offline Mode: Working (frontend calculates results locally)

---

## Option 1: Enable Email Notifications (Recommended - Free)

### Using Gmail (Free)

1. **Get Gmail App Password**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security → 2-Step Verification (enable if not already)
   - Scroll down to "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Name it "Smartphone Wellness"
   - Copy the 16-character password

2. **Update .env file**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   EMAIL_FROM=your_email@gmail.com
   ```

3. **Restart the server**
   ```bash
   npm start
   ```

### Using Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=your_email@outlook.com
```

#### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@yahoo.com
```

#### Custom SMTP Server
```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your_username
EMAIL_PASSWORD=your_password
EMAIL_FROM=noreply@yourdomain.com
```

---

## Option 2: Enable SMS Notifications (Paid - Twilio)

### Setup Twilio (Trial gives $15 credit)

1. **Create Twilio Account**
   - Go to: https://www.twilio.com/try-twilio
   - Sign up for free trial
   - Verify your email and phone number

2. **Get Credentials**
   - After login, go to Console Dashboard
   - Copy your **Account SID**
   - Copy your **Auth Token**
   - Get a Twilio phone number (free with trial)

3. **Update .env file**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Restart the server**
   ```bash
   npm start
   ```

### Twilio Trial Limitations
- Can only send SMS to verified phone numbers
- Messages include "Sent from a Twilio trial account"
- $15 free credit (enough for ~500 SMS)
- Upgrade to paid account to remove limitations

---

## Option 3: Test Without Real Notifications

### Simulate Notifications (Current Setup)

The app currently works in offline mode:
- ✅ Predictions are calculated locally in the browser
- ✅ Results are displayed correctly
- ✅ No actual SMS or emails are sent
- ✅ Notification history is stored in localStorage

This is perfect for:
- Development and testing
- Demo purposes
- When you don't need real notifications

### Enable Backend API (Without Notifications)

Even without SMS/Email credentials, you can use the backend API:

1. The backend will:
   - ✅ Calculate risk scores
   - ✅ Store predictions in database (if configured)
   - ✅ Return results to frontend
   - ⚠️ Skip SMS/Email (log warning)

2. Frontend will show:
   - "✅ Prediction completed!" (instead of "📧 Results sent to email")

---

## Testing Notifications

### Test Email Service

1. Configure email credentials in `.env`
2. Restart server: `npm start`
3. Check server logs for: `Email service initialized with Nodemailer`
4. Complete a prediction
5. Check your email inbox

### Test SMS Service

1. Configure Twilio credentials in `.env`
2. Add your phone number to Twilio verified numbers (trial only)
3. Restart server: `npm start`
4. Check server logs for: `Twilio client initialized`
5. Complete a prediction
6. Check your phone for SMS

### Check Server Logs

Monitor the terminal where your server is running:

```bash
# Successful email
info: Email sent successfully { to: 'user@example.com', messageId: '...' }

# Successful SMS
info: SMS sent successfully { to: '+1234567890', sid: '...', status: 'queued' }

# Not configured
warn: Email service not configured. Skipping email.
warn: SMS service not configured. Skipping SMS.
```

---

## Troubleshooting

### Email Not Sending

**Problem**: "Email service not configured"
- **Solution**: Add EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD to .env

**Problem**: "Invalid login" or "Authentication failed"
- **Solution**: Use App Password instead of regular password (Gmail)
- **Solution**: Enable "Less secure app access" (not recommended)

**Problem**: "Connection timeout"
- **Solution**: Check EMAIL_PORT (587 for TLS, 465 for SSL)
- **Solution**: Check firewall/antivirus blocking SMTP

### SMS Not Sending

**Problem**: "SMS service not configured"
- **Solution**: Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER to .env

**Problem**: "Unable to create record: The number is unverified"
- **Solution**: Add recipient phone to Twilio verified numbers (trial accounts)
- **Solution**: Upgrade to paid Twilio account

**Problem**: "Invalid phone number format"
- **Solution**: Use E.164 format: +[country code][number] (e.g., +12345678900)

### Backend Not Called

**Problem**: Frontend shows "offline mode" even with backend running
- **Solution**: Check if server is running on port 3000
- **Solution**: Check browser console for CORS errors
- **Solution**: Verify API_CONFIG in src/js/config.js

---

## Recommended Setup for Production

### For Testing/Demo
```env
# No credentials needed
# App works in offline mode
```

### For Development
```env
# Email only (free)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
```

### For Production
```env
# Both Email and SMS
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourdomain.com

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Cost Breakdown

### Email
- **Gmail**: FREE (with existing account)
- **Outlook**: FREE (with existing account)
- **SendGrid**: FREE tier (100 emails/day)
- **Mailgun**: FREE tier (5,000 emails/month)

### SMS
- **Twilio**: $15 FREE trial credit
  - After trial: ~$0.0075 per SMS (US)
  - ~$1 per month for phone number
- **Alternatives**:
  - Vonage (Nexmo): Similar pricing
  - AWS SNS: $0.00645 per SMS

### Recommendation
Start with **Email only** (free) for testing, add SMS later if needed.

---

## Quick Start Commands

### 1. Install dependencies (if not done)
```bash
npm install
```

### 2. Configure .env file
```bash
# Edit .env and add your credentials
```

### 3. Start server
```bash
npm start
```

### 4. Test prediction
- Open http://localhost:3000
- Login and complete prediction
- Check email/phone for notifications

---

## Need Help?

Check the server logs for detailed error messages:
- Email errors: Look for "Email" in logs
- SMS errors: Look for "SMS" in logs
- API errors: Look for "Prediction" in logs

All logs are saved to:
- `logs/combined.log` - All logs
- `logs/error.log` - Errors only
