# 🎯 START HERE - Smartphone Addiction Backend

## Welcome! 👋

You now have a **production-ready backend system** for your Smartphone Addiction Prediction project!

## 🎁 What You Got

### ✅ Complete Backend System
- Risk calculation engine with intelligent algorithm
- Automated SMS notifications via Twilio
- Professional email notifications with HTML templates
- PostgreSQL database with auto-setup
- RESTful API with Express.js
- Security, validation, logging, and error handling
- Rate limiting and CORS protection

### ✅ Complete Documentation
- 6 comprehensive documentation files
- Installation scripts for Windows & Linux/Mac
- API testing tools
- Deployment guides

### ✅ Production-Ready Features
- Modular, scalable architecture
- Transaction support for data integrity
- Comprehensive error handling
- Structured logging with Winston
- Input validation with Joi
- Security headers with Helmet

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE smartphone_addiction;
\q
```

### Step 3: Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit .env with your credentials
# Minimum required:
# - Database credentials
# - Twilio API keys (get from twilio.com)
# - Email credentials (Gmail app password)
```

### Step 4: Start Server
```bash
npm start
```

### Step 5: Test
```bash
# Open browser
http://localhost:3000/api/health

# Or run test script
node backend/test-api.js
```

## 📚 Documentation Guide

### For Quick Setup
👉 **Read**: `SETUP_GUIDE.md` (5-minute setup)

### For API Integration
👉 **Read**: `API_DOCUMENTATION.md` (Complete API reference)

### For Deployment
👉 **Read**: `DEPLOYMENT.md` (Production deployment)

### For Quick Reference
👉 **Read**: `QUICK_REFERENCE.md` (Cheat sheet)

### For Complete Overview
👉 **Read**: `README.md` (Full documentation)

### For Project Summary
👉 **Read**: `PROJECT_SUMMARY.md` (Architecture & features)

## 🎯 What to Do Next

### Immediate (Today)
1. ✅ Run installation: `npm install`
2. ✅ Setup PostgreSQL database
3. ✅ Configure `.env` file
4. ✅ Start server: `npm start`
5. ✅ Test health endpoint
6. ✅ Run test script

### This Week
1. 📱 Get Twilio account and credentials
2. 📧 Setup Gmail app password
3. 🧪 Test prediction endpoint
4. 🔗 Integrate with frontend
5. 📊 Test SMS and email notifications

### Before Production
1. 🔐 Review security settings
2. 🗄️ Setup production database
3. 🌐 Choose hosting platform
4. 📈 Setup monitoring
5. 💾 Configure backups
6. 🚀 Deploy!

## 📁 Project Structure

```
smartphone-addiction-backend/
├── backend/              # Backend code
│   ├── config/          # Database config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utilities
├── logs/                # Application logs
├── src/                 # Frontend files
├── .env.example         # Environment template
├── package.json         # Dependencies
├── server.js            # Main entry point
└── *.md                 # Documentation files
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main application entry point |
| `.env` | Environment variables (create from .env.example) |
| `package.json` | Dependencies and scripts |
| `backend/services/predictionService.js` | Risk calculation logic |
| `backend/services/smsService.js` | Twilio SMS integration |
| `backend/services/emailService.js` | Email notifications |

## 🌐 API Endpoints

Once running, your API will be available at:

```
http://localhost:3000/api
```

### Available Endpoints:
- `GET /api/health` - Check server status
- `POST /api/predictions` - Create prediction (sends SMS & email)
- `GET /api/predictions/history?email=` - Get user history
- `GET /api/predictions/:id` - Get specific prediction

## 🧪 Testing Your Setup

### Test 1: Health Check
```bash
curl http://localhost:3000/api/health
```
Expected: `{"success": true, "message": "Server is running"}`

### Test 2: Create Prediction
```bash
curl -X POST http://localhost:3000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "your_email@gmail.com",
    "phone": "+1234567890",
    "screenTimeHours": 8.5,
    "nightUsageHours": 3.2,
    "unlocksPerDay": 150,
    "socialMediaHours": 5.0,
    "productivityHours": 1.5
  }'
```

### Test 3: Run Test Script
```bash
node backend/test-api.js
```

## 🔧 Configuration Checklist

### Database ✅
- [ ] PostgreSQL installed
- [ ] Database created
- [ ] Credentials in .env

### Twilio (SMS) ✅
- [ ] Account created at twilio.com
- [ ] Account SID in .env
- [ ] Auth Token in .env
- [ ] Phone number in .env

### Email ✅
- [ ] Gmail account ready
- [ ] 2FA enabled
- [ ] App password generated
- [ ] Credentials in .env

### Server ✅
- [ ] Dependencies installed
- [ ] .env file configured
- [ ] Server starts without errors
- [ ] Health check returns success

## 🎓 Understanding the System

### How It Works

1. **User submits prediction form** (frontend)
2. **Frontend calls API** → `POST /api/predictions`
3. **Backend validates input** (Joi validation)
4. **Backend calculates risk** (PredictionService)
5. **Backend saves to database** (PostgreSQL)
6. **Backend sends SMS** (Twilio)
7. **Backend sends email** (Nodemailer)
8. **Backend returns result** (JSON response)
9. **Frontend shows result** (result.html)

### Risk Calculation

The system analyzes 5 factors:
1. Screen time (0-30 points)
2. Night usage (0-25 points)
3. Phone unlocks (0-20 points)
4. Social media (0-15 points)
5. Productivity balance (0-10 points)

**Total Score**: 0-100
- High Risk: 70-100
- Medium Risk: 40-69
- Low Risk: 0-39

## 💡 Pro Tips

1. **Start Simple**: Get basic setup working first
2. **Test Locally**: Always test on localhost before deploying
3. **Check Logs**: Use `logs/combined.log` for debugging
4. **Use Test Script**: `node backend/test-api.js` is your friend
5. **Read Docs**: Each .md file has specific information
6. **Secure Secrets**: Never commit .env to git

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution**: 
- Check PostgreSQL is running
- Verify credentials in .env
- Ensure database exists

### Issue: "SMS not sending"
**Solution**:
- Verify Twilio credentials
- Check phone number format (+1234567890)
- Ensure Twilio account has credits

### Issue: "Email not sending"
**Solution**:
- Use Gmail app password, not regular password
- Check SMTP settings
- Verify email credentials

### Issue: "Port 3000 already in use"
**Solution**:
- Change PORT in .env to 3001
- Or kill process using port 3000

## 📞 Getting Help

### Documentation
1. Check relevant .md file
2. Read error logs in `logs/error.log`
3. Run test script for diagnostics

### Resources
- README.md - Complete documentation
- SETUP_GUIDE.md - Step-by-step setup
- API_DOCUMENTATION.md - API reference
- QUICK_REFERENCE.md - Quick commands

### Community
- GitHub Issues
- Stack Overflow
- Developer forums

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Server starts without errors
- ✅ Health check returns success
- ✅ Test prediction creates record
- ✅ SMS arrives on phone
- ✅ Email arrives in inbox
- ✅ Database shows saved data

## 🚀 Deployment Options

When ready for production:

### Easy (Recommended for Beginners)
- **Heroku**: One-click deployment
- **Railway**: Git-based deployment

### Flexible (For Advanced Users)
- **AWS EC2**: Full control
- **DigitalOcean**: Balanced approach

See `DEPLOYMENT.md` for detailed guides.

## 📊 What's Included

### Backend Code
- ✅ 15+ modular files
- ✅ Clean, documented code
- ✅ Production-ready architecture
- ✅ Error handling everywhere
- ✅ Security best practices

### Documentation
- ✅ 7 comprehensive guides
- ✅ API reference
- ✅ Deployment instructions
- ✅ Quick reference card

### Tools
- ✅ Installation scripts
- ✅ Test scripts
- ✅ Environment templates

## 🎯 Your Next Steps

### Right Now
```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env

# 3. Start
npm start

# 4. Test
node backend/test-api.js
```

### Today
- Read SETUP_GUIDE.md
- Get Twilio account
- Setup Gmail app password
- Test all endpoints

### This Week
- Integrate with frontend
- Test notifications
- Review security
- Plan deployment

## 🏆 You're Ready!

You have everything you need to:
- ✅ Run the backend locally
- ✅ Test all features
- ✅ Integrate with frontend
- ✅ Deploy to production
- ✅ Scale as needed

## 📖 Documentation Map

```
START_HERE.md (You are here!)
    ↓
SETUP_GUIDE.md (Quick 5-min setup)
    ↓
README.md (Complete documentation)
    ↓
API_DOCUMENTATION.md (API reference)
    ↓
DEPLOYMENT.md (Production deployment)
    ↓
QUICK_REFERENCE.md (Cheat sheet)
```

---

## 🎊 Congratulations!

You now have a **professional, production-ready backend system** with:
- Intelligent risk calculation
- Automated notifications
- Secure API
- Complete documentation
- Deployment guides

**Ready to build something amazing! 🚀**

---

**Questions?** Check the documentation files or create an issue on GitHub.

**Happy Coding! 💻**
