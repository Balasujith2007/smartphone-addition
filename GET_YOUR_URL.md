# 🌐 Get Your Website URL in 10 Minutes!

## ⚡ FASTEST METHOD - Render (Recommended)

### Step 1: Sign Up (2 minutes)
1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account**

### Step 2: Deploy (5 minutes)
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect GitHub"** and authorize Render
3. Find and select: **`smartphone-addition`**
4. Fill in:
   - **Name**: `smartphone-addiction`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Create Web Service"**

### Step 3: Add Database (2 minutes)
1. Go back to Dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. **Name**: `smartphone-db`
4. Click **"Create Database"**
5. Copy the **Internal Database URL**

### Step 4: Configure Environment (1 minute)
1. Go to your Web Service
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add these (one by one):

```
NODE_ENV = production
PORT = 3000
DATABASE_URL = <paste the database URL from step 3>
```

**Optional (for SMS/Email):**
```
TWILIO_ACCOUNT_SID = <get from twilio.com>
TWILIO_AUTH_TOKEN = <get from twilio.com>
TWILIO_PHONE_NUMBER = <your twilio number>
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = <your gmail>
EMAIL_PASSWORD = <gmail app password>
EMAIL_FROM = noreply@yourdomain.com
```

### Step 5: Wait for Deployment
- Render will automatically deploy
- Wait 5-10 minutes
- Watch the logs for "Server is running"

### Step 6: Get Your URL! 🎉
Your website will be live at:
```
https://smartphone-addiction.onrender.com
```

---

## 🎯 Alternative: Railway (Even Faster!)

### Step 1: Sign Up
1. Go to: **https://railway.app**
2. Click **"Start a New Project"**
3. Login with **GitHub**

### Step 2: Deploy
1. Click **"Deploy from GitHub repo"**
2. Select: **`smartphone-addition`**
3. Railway auto-detects everything!

### Step 3: Add Database
1. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway auto-connects it!

### Step 4: Add Variables (Optional)
1. Click your service → **"Variables"**
2. Add Twilio and Email credentials if needed

### Step 5: Get Your URL! 🎉
```
https://smartphone-addiction-production.up.railway.app
```

---

## 📱 Update Your Frontend

After deployment, update the API URL:

1. Open: `src/js/config.js`
2. Change line 4:
```javascript
PRODUCTION_URL: 'https://your-actual-url.onrender.com/api',
```

3. Commit and push:
```bash
git add .
git commit -m "Update production API URL"
git push origin main
```

4. Render will auto-redeploy!

---

## ✅ Test Your Website

1. Visit your URL
2. Click "Get Started" or "Prediction"
3. Fill out the form
4. Submit
5. Check if it works!

---

## 🎊 You're Live!

Share your URL:
- **Your Website**: `https://smartphone-addiction.onrender.com`
- **API Health**: `https://smartphone-addiction.onrender.com/api/health`

---

## 🆘 Issues?

### "Application Error"
- Check logs in Render dashboard
- Verify environment variables
- Wait a few more minutes

### "Cannot connect to database"
- Make sure DATABASE_URL is set
- Check database is running

### "Build Failed"
- Check if package.json exists
- Verify Node.js version

---

## 💡 Pro Tips

1. **Free Tier Limits**:
   - Render: Sleeps after 15 min of inactivity
   - Railway: $5 credit/month
   - First request may be slow (waking up)

2. **Keep It Awake**:
   - Use UptimeRobot.com (free)
   - Pings your site every 5 minutes

3. **Custom Domain** (Optional):
   - Buy domain from Namecheap
   - Add in Render settings
   - Your site: `www.yourname.com`

---

## 🚀 Next Steps

1. Deploy now (10 minutes)
2. Test your website
3. Share with friends
4. Add to your resume/portfolio
5. Celebrate! 🎉

---

**Ready? Go to https://render.com and start deploying!**
