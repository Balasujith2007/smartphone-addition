# 🌐 Hosting Guide - Get Your Website Live!

## 🎯 Quick Deploy (Choose One)

### ⭐ Option 1: Render (Recommended - Free Full-Stack)

**Best for**: Complete backend + frontend hosting with database

#### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub

#### Step 2: Deploy
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `Balasujith2007/smartphone-addition`
3. Configure:
   - **Name**: smartphone-addiction
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 3: Add Database
1. Click "New +" → "PostgreSQL"
2. **Name**: smartphone-addiction-db
3. **Plan**: Free
4. Copy connection details

#### Step 4: Add Environment Variables
In your web service settings, add:
```
NODE_ENV=production
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourdomain.com
```

#### Step 5: Deploy!
Click "Create Web Service" - Done! 🎉

**Your URL**: `https://smartphone-addiction.onrender.com`

---

### ⚡ Option 2: Railway (Easiest - One Click)

**Best for**: Quick deployment with minimal setup

#### Step 1: Deploy
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose: `Balasujith2007/smartphone-addition`

#### Step 2: Add Database
1. Click "New" → "Database" → "PostgreSQL"
2. Railway auto-connects it!

#### Step 3: Add Environment Variables
Click on your service → Variables:
```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

#### Step 4: Done!
Railway auto-deploys on every git push!

**Your URL**: `https://smartphone-addiction-production.up.railway.app`

---

### 🚀 Option 3: Vercel (Frontend) + Heroku (Backend)

**Best for**: Separate frontend and backend hosting

#### Frontend on Vercel:

1. Go to https://vercel.com
2. Import your GitHub repo
3. Click "Deploy"
4. **Your Frontend URL**: `https://smartphone-addiction.vercel.app`

#### Backend on Heroku:

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create smartphone-addiction-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
heroku config:set TWILIO_PHONE_NUMBER=+1234567890
heroku config:set EMAIL_USER=your_email@gmail.com
heroku config:set EMAIL_PASSWORD=your_app_password

# Deploy
git push heroku main
```

**Your Backend URL**: `https://smartphone-addiction-api.herokuapp.com`

---

### 🎨 Option 4: Netlify (Frontend Only)

**Best for**: Static frontend hosting

1. Go to https://netlify.com
2. Drag and drop your project folder
3. **Your URL**: `https://smartphone-addiction.netlify.app`

For backend, use Railway or Render separately.

---

## 🔧 Update Frontend API URL

After deploying backend, update the API URL in your frontend:

<function_calls>
<invoke name="fsWrite">
<parameter name="path">src/js/config.js API Configuration
const API_CONFIG = {
    // Change this to your deployed backend URL
    BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://your-backend-url.onrender.com/api'  // Replace with your actual URL
        : 'http://localhost:3000/api',
    
    ENDPOINTS: {
        HEALTH: '/health',
        PREDICTIONS: '/predictions',
        HISTORY: '/predictions/history',
        PREDICTION_BY_ID: '/predictions'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
