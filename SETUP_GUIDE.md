# Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup PostgreSQL Database

#### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install and remember your password
3. Open pgAdmin or command line:
```sql
CREATE DATABASE smartphone_addiction;
```

#### Mac:
```bash
brew install postgresql
brew services start postgresql
createdb smartphone_addiction
```

#### Linux:
```bash
sudo apt-get install postgresql
sudo service postgresql start
sudo -u postgres createdb smartphone_addiction
```

### Step 3: Configure Environment

Copy and edit `.env`:
```bash
cp .env.example .env
```

**Minimum Required Configuration:**
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartphone_addiction
DB_USER=postgres
DB_PASSWORD=your_password
```

### Step 4: Setup Twilio (SMS)

1. Go to https://www.twilio.com/try-twilio
2. Sign up (free trial gives you $15 credit)
3. Get your credentials from console:
   - Account SID
   - Auth Token
   - Phone Number
4. Add to `.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxx...
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 5: Setup Email (Gmail)

1. Enable 2FA on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Add to `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=noreply@smartphonewellness.com
```

### Step 6: Run the Server

```bash
npm start
```

You should see:
```
🚀 Server is running on http://localhost:3000
📊 API Endpoint: http://localhost:3000/api/predictions
🏥 Health Check: http://localhost:3000/api/health
```

### Step 7: Test the API

Open browser or Postman:
```
http://localhost:3000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## 🧪 Testing with Postman

### Test Prediction Endpoint

**POST** `http://localhost:3000/api/predictions`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "your_email@gmail.com",
  "phone": "+1234567890",
  "screenTimeHours": 8.5,
  "nightUsageHours": 3.2,
  "unlocksPerDay": 150,
  "socialMediaHours": 5.0,
  "productivityHours": 1.5
}
```

You should receive:
- ✅ Success response with risk assessment
- 📱 SMS to your phone
- 📧 Email to your inbox

## 🔧 Common Issues

### Issue: Database connection failed
**Solution:**
```bash
# Check PostgreSQL is running
# Windows: Check Services
# Mac: brew services list
# Linux: sudo service postgresql status

# Test connection
psql -U postgres -d smartphone_addiction
```

### Issue: Twilio SMS not sending
**Solution:**
- Verify phone number format: +1234567890 (include country code)
- Check Twilio console for errors
- Ensure trial account has verified the recipient number

### Issue: Email not sending
**Solution:**
- Use App Password, not regular Gmail password
- Check "Less secure app access" is OFF (use App Password instead)
- Verify SMTP settings are correct

### Issue: Port 3000 already in use
**Solution:**
```bash
# Change PORT in .env to 3001 or another port
PORT=3001
```

## 📱 Frontend Integration

Update your `src/js/prediction.js` to call the backend:

```javascript
// Add this function to your prediction.js
async function submitPredictionToBackend(userData) {
    try {
        const response = await fetch('http://localhost:3000/api/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                screenTimeHours: parseFloat(userData.screenTime),
                nightUsageHours: parseFloat(userData.nightUsage),
                unlocksPerDay: parseInt(userData.unlocks),
                socialMediaHours: parseFloat(userData.socialMedia),
                productivityHours: parseFloat(userData.productivity)
            })
        });

        const result = await response.json();
        
        if (result.success) {
            // Store result and redirect
            localStorage.setItem('predictionResult', JSON.stringify(result.data));
            window.location.href = 'result.html';
        } else {
            showToast('Prediction failed: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to connect to server', 'error');
    }
}
```

## ✅ Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] `.env` file configured
- [ ] Twilio credentials added
- [ ] Email credentials added
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors
- [ ] Health check returns success
- [ ] Test prediction works
- [ ] SMS received
- [ ] Email received

## 🎉 You're Ready!

Your backend is now fully configured and ready for production use!

## 📚 Next Steps

1. Update frontend to use the API
2. Test all features thoroughly
3. Configure production environment variables
4. Deploy to hosting service
5. Monitor logs for issues

## 🆘 Need Help?

Check the main README.md for detailed documentation or open an issue on GitHub.
