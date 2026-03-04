# Quick Reference Card

## 🚀 Installation (2 Minutes)

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

## 🔑 Required Environment Variables

```env
# Database
DB_HOST=localhost
DB_NAME=smartphone_addiction
DB_USER=postgres
DB_PASSWORD=your_password

# Twilio
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| POST | `/api/predictions` | Create prediction |
| GET | `/api/predictions/history?email=` | Get history |
| GET | `/api/predictions/:id` | Get by ID |

## 📝 Create Prediction Request

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "screenTimeHours": 8.5,
  "nightUsageHours": 3.2,
  "unlocksPerDay": 150,
  "socialMediaHours": 5.0,
  "productivityHours": 1.5
}
```

## 🧪 Quick Test

```bash
# Test with cURL
curl -X POST http://localhost:3000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "screenTimeHours": 8,
    "nightUsageHours": 3,
    "unlocksPerDay": 150,
    "socialMediaHours": 5,
    "productivityHours": 1.5
  }'

# Or use test script
node backend/test-api.js
```

## 🔧 Common Commands

```bash
# Start server
npm start

# Development mode (auto-restart)
npm run dev

# View logs
tail -f logs/combined.log

# Check database
psql -U postgres -d smartphone_addiction
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Change PORT in .env |
| Database error | Check PostgreSQL is running |
| SMS not sending | Verify Twilio credentials |
| Email not sending | Use Gmail app password |

## 📊 Risk Levels

| Score | Level | Action |
|-------|-------|--------|
| 70-100 | High | Immediate action |
| 40-69 | Medium | Attention needed |
| 0-39 | Low | Maintain habits |

## 🔐 Security

- Rate Limit: 10 predictions/hour
- Input validation: Joi schemas
- Security headers: Helmet
- CORS: Configured

## 📱 Notification Status

Check in response:
```json
{
  "notifications": {
    "sms": true,
    "email": true
  }
}
```

## 🌐 Deployment

```bash
# Heroku
heroku create
git push heroku main

# PM2 (VPS)
pm2 start server.js
pm2 save
```

## 📚 Documentation

- `README.md` - Full docs
- `SETUP_GUIDE.md` - Quick setup
- `API_DOCUMENTATION.md` - API reference
- `DEPLOYMENT.md` - Deploy guide

## 💡 Tips

1. Use `.env` for secrets
2. Check logs for errors
3. Test locally first
4. Monitor rate limits
5. Backup database regularly

## 🆘 Get Help

- Check logs: `logs/error.log`
- Test API: `node backend/test-api.js`
- Read docs: `README.md`
- GitHub Issues

---

**Server URL**: `http://localhost:3000`
**API Base**: `http://localhost:3000/api`
**Health Check**: `http://localhost:3000/api/health`
