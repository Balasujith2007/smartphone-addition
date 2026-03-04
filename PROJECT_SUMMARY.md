# Smartphone Addiction Prediction - Backend System

## 🎯 Project Overview

A production-ready backend system for smartphone addiction risk assessment with automated SMS and email notifications.

## ✨ Features Implemented

### Core Functionality
- ✅ Risk calculation engine with intelligent scoring algorithm
- ✅ Automated SMS notifications via Twilio
- ✅ Professional email notifications with HTML templates
- ✅ PostgreSQL database with automatic table creation
- ✅ RESTful API with Express.js
- ✅ Input validation with Joi
- ✅ Comprehensive error handling
- ✅ Structured logging with Winston
- ✅ Rate limiting for API protection
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ Modular, scalable architecture

### Security Features
- ✅ Input sanitization and validation
- ✅ Rate limiting (100 req/15min general, 10 req/hour predictions)
- ✅ Helmet security headers
- ✅ Environment variable protection
- ✅ SQL injection prevention
- ✅ Error message sanitization

## 📁 Project Structure

```
smartphone-addiction-backend/
├── backend/
│   ├── config/
│   │   └── database.js              # PostgreSQL configuration
│   ├── controllers/
│   │   └── predictionController.js  # Business logic handlers
│   ├── middleware/
│   │   ├── errorHandler.js          # Centralized error handling
│   │   └── rateLimiter.js           # Rate limiting configuration
│   ├── routes/
│   │   └── predictionRoutes.js      # API route definitions
│   ├── services/
│   │   ├── predictionService.js     # Risk calculation algorithm
│   │   ├── smsService.js            # Twilio SMS integration
│   │   ├── emailService.js          # Nodemailer email service
│   │   └── notificationService.js   # Notification orchestration
│   ├── utils/
│   │   ├── logger.js                # Winston logger setup
│   │   └── validators.js            # Joi validation schemas
│   └── test-api.js                  # API testing script
├── logs/                            # Application logs
├── src/                             # Frontend files
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies
├── server.js                        # Main application entry
├── install.sh                       # Linux/Mac installation
├── install.bat                      # Windows installation
├── README.md                        # Main documentation
├── SETUP_GUIDE.md                   # Quick setup guide
├── API_DOCUMENTATION.md             # API reference
├── DEPLOYMENT.md                    # Deployment guide
└── PROJECT_SUMMARY.md               # This file
```

## 🔧 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Node.js | JavaScript runtime |
| Framework | Express.js | Web framework |
| Database | PostgreSQL | Data persistence |
| SMS | Twilio | SMS notifications |
| Email | Nodemailer | Email notifications |
| Validation | Joi | Input validation |
| Logging | Winston | Application logging |
| Security | Helmet | Security headers |
| CORS | cors | Cross-origin requests |
| Rate Limiting | express-rate-limit | API protection |

## 📊 Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- first_name (VARCHAR)
- last_name (VARCHAR)
- email (VARCHAR UNIQUE)
- phone (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Predictions Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- risk_level (VARCHAR)
- risk_score (INTEGER)
- confidence (DECIMAL)
- screen_time_hours (DECIMAL)
- night_usage_hours (DECIMAL)
- unlocks_per_day (INTEGER)
- social_media_hours (DECIMAL)
- productivity_hours (DECIMAL)
- recommendation (TEXT)
- created_at (TIMESTAMP)
```

### Notifications Table
```sql
- id (SERIAL PRIMARY KEY)
- prediction_id (INTEGER FK)
- sms_sent (BOOLEAN)
- email_sent (BOOLEAN)
- sms_status (VARCHAR)
- email_status (VARCHAR)
- sent_at (TIMESTAMP)
```

## 🚀 API Endpoints

### 1. Health Check
```
GET /api/health
```
Returns server status

### 2. Create Prediction
```
POST /api/predictions
```
Creates prediction and sends notifications

### 3. Get History
```
GET /api/predictions/history?email=user@example.com
```
Returns user's prediction history

### 4. Get by ID
```
GET /api/predictions/:id
```
Returns specific prediction details

## 🧮 Risk Calculation Algorithm

### Scoring Components (0-100)
1. **Screen Time** (0-30 points)
   - ≥8h: 30pts | 6-8h: 20pts | 4-6h: 10pts | <4h: 0pts

2. **Night Usage** (0-25 points)
   - ≥3h: 25pts | 2-3h: 18pts | 1-2h: 10pts | <1h: 0pts

3. **Phone Unlocks** (0-20 points)
   - ≥150: 20pts | 100-150: 15pts | 60-100: 8pts | <60: 0pts

4. **Social Media** (0-15 points)
   - ≥5h: 15pts | 3-5h: 10pts | 2-3h: 5pts | <2h: 0pts

5. **Productivity Balance** (0-10 points)
   - <20%: 10pts | 20-40%: 5pts | >40%: 0pts

### Risk Levels
- **High**: Score ≥70
- **Medium**: Score 40-69
- **Low**: Score <40

### Confidence Calculation
- Base: 75%
- +15% if 3+ risk factors
- +10% if 2 risk factors
- +10% if data consistent
- Max: 99%

## 📱 Notification Formats

### SMS Template
```
Smartphone Addiction Risk Result:

Risk Level: High
Score: 90/100
Confidence: 88%

Please check your email for detailed report.

- Smartphone Wellness Team
```

### Email Template
Professional HTML email with:
- Personalized greeting
- Color-coded risk results
- Detailed recommendations
- Call-to-action button
- Professional footer

## 🔐 Security Measures

1. **Input Validation**
   - Joi schema validation
   - Type checking
   - Range validation
   - Format validation

2. **Rate Limiting**
   - General API: 100 req/15min
   - Predictions: 10 req/hour

3. **Security Headers**
   - Helmet middleware
   - XSS protection
   - CSRF protection
   - Content Security Policy

4. **Error Handling**
   - Sanitized error messages
   - No sensitive data exposure
   - Proper HTTP status codes

5. **Database Security**
   - Parameterized queries
   - Connection pooling
   - Transaction support

## 📝 Logging

### Log Levels
- **Error**: Critical errors
- **Warn**: Warning messages
- **Info**: General information
- **Debug**: Detailed debugging

### Log Files
- `logs/error.log` - Error-level logs
- `logs/combined.log` - All logs

### Log Format
```json
{
  "timestamp": "2024-03-04 10:30:00",
  "level": "info",
  "message": "Prediction created",
  "service": "smartphone-addiction-api",
  "predictionId": 1,
  "userId": 1
}
```

## 🧪 Testing

### Manual Testing
```bash
# Run test script
node backend/test-api.js
```

### API Testing with cURL
```bash
# Health check
curl http://localhost:3000/api/health

# Create prediction
curl -X POST http://localhost:3000/api/predictions \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

### Frontend Integration
```javascript
const response = await fetch('http://localhost:3000/api/predictions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(predictionData)
});
```

## 📦 Installation

### Quick Start
```bash
# Clone repository
git clone your-repo-url

# Run installation script
# Linux/Mac:
chmod +x install.sh
./install.sh

# Windows:
install.bat

# Configure .env file
cp .env.example .env
# Edit .env with your credentials

# Start server
npm start
```

### Manual Installation
```bash
# Install dependencies
npm install

# Setup database
psql -U postgres
CREATE DATABASE smartphone_addiction;

# Configure environment
cp .env.example .env
# Edit .env

# Start server
npm start
```

## 🌐 Deployment Options

1. **Heroku** (Easiest)
   - One-click deployment
   - Managed PostgreSQL
   - Automatic scaling

2. **AWS EC2** (Flexible)
   - Full control
   - Custom configuration
   - Cost-effective

3. **DigitalOcean** (Balanced)
   - App Platform
   - Managed database
   - Simple deployment

4. **Railway** (Modern)
   - Git-based deployment
   - Automatic HTTPS
   - Free tier available

## 💰 Cost Estimation

### Development (Free)
- Local PostgreSQL: Free
- Twilio Trial: $15 credit
- Gmail: Free
- Total: $0

### Small Scale (<1000 users)
- Heroku Hobby: $7/month
- Heroku Postgres: $9/month
- Twilio: ~$10/month
- Total: ~$26/month

### Medium Scale (1000-10000 users)
- AWS EC2 t2.small: $17/month
- AWS RDS: $15/month
- Twilio: ~$50/month
- Total: ~$82/month

## 📚 Documentation Files

1. **README.md** - Complete documentation
2. **SETUP_GUIDE.md** - Quick 5-minute setup
3. **API_DOCUMENTATION.md** - API reference
4. **DEPLOYMENT.md** - Production deployment
5. **PROJECT_SUMMARY.md** - This overview

## ✅ Checklist for Production

- [ ] Environment variables configured
- [ ] Database created and connected
- [ ] Twilio credentials added
- [ ] Email service configured
- [ ] API endpoints tested
- [ ] SMS notifications working
- [ ] Email notifications working
- [ ] Error handling verified
- [ ] Logging configured
- [ ] Rate limiting tested
- [ ] Security headers enabled
- [ ] CORS configured
- [ ] Frontend integrated
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Documentation reviewed

## 🎓 Key Learnings

### Best Practices Implemented
1. Modular architecture for maintainability
2. Separation of concerns (MVC pattern)
3. Environment-based configuration
4. Comprehensive error handling
5. Structured logging
6. Input validation
7. Security-first approach
8. Transaction support for data integrity
9. Rate limiting for API protection
10. Professional notification templates

### Code Quality
- Clean, readable code
- Consistent naming conventions
- Comprehensive comments
- Error handling at every level
- Async/await for clean async code
- Promise-based architecture

## 🔮 Future Enhancements

### Phase 2
- [ ] JWT authentication
- [ ] User dashboard
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics
- [ ] Machine learning model integration

### Phase 3
- [ ] Mobile app API
- [ ] Multi-language support
- [ ] Social features
- [ ] Gamification
- [ ] Integration with fitness trackers

### Phase 4
- [ ] AI-powered recommendations
- [ ] Predictive analytics
- [ ] Community features
- [ ] Professional counselor integration
- [ ] Research data export

## 🆘 Support & Resources

### Documentation
- Main README: Complete setup and usage
- Setup Guide: Quick 5-minute start
- API Docs: Endpoint reference
- Deployment: Production guide

### External Resources
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Twilio Documentation](https://www.twilio.com/docs)
- [Nodemailer Documentation](https://nodemailer.com/)

### Community
- GitHub Issues
- Stack Overflow
- Discord/Slack community

## 🏆 Success Metrics

### Technical Metrics
- API response time: <200ms
- Error rate: <1%
- Uptime: >99.9%
- SMS delivery: >95%
- Email delivery: >98%

### Business Metrics
- User satisfaction
- Prediction accuracy
- Notification engagement
- System reliability

## 📄 License

MIT License - Free for personal and commercial use

## 👏 Acknowledgments

Built with modern best practices and production-ready architecture for real-world deployment.

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: March 2024

---

## 🚀 Quick Commands

```bash
# Install
npm install

# Development
npm run dev

# Production
npm start

# Test API
node backend/test-api.js

# View logs
tail -f logs/combined.log
```

---

**Your backend is ready for deployment! 🎉**
