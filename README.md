# Smartphone Addiction Prediction System - Backend

Production-ready backend system for smartphone addiction risk assessment with automated SMS and email notifications.

## Features

- ✅ Risk calculation engine with ML-based scoring
- 📱 Automated SMS notifications via Twilio
- 📧 Professional email notifications via Nodemailer/SendGrid
- 🗄️ PostgreSQL database for data persistence
- 🔒 Security best practices (Helmet, CORS, Rate Limiting)
- 📊 Comprehensive logging with Winston
- ✨ Input validation with Joi
- 🚀 Production-ready architecture

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **SMS**: Twilio
- **Email**: Nodemailer (SMTP) or SendGrid
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Express Rate Limit

## Project Structure

```
smartphone-addiction-backend/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   └── predictionController.js  # Request handlers
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling
│   │   └── rateLimiter.js       # Rate limiting
│   ├── routes/
│   │   └── predictionRoutes.js  # API routes
│   ├── services/
│   │   ├── predictionService.js # Risk calculation logic
│   │   ├── smsService.js        # Twilio SMS service
│   │   ├── emailService.js      # Email service
│   │   └── notificationService.js # Notification orchestration
│   └── utils/
│       ├── logger.js            # Winston logger
│       └── validators.js        # Input validation schemas
├── logs/                        # Application logs
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── server.js                    # Main application entry
└── README.md
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Twilio account (for SMS)
- Email service (Gmail/SendGrid)

### Step 1: Clone and Install Dependencies

```bash
npm install
```

### Step 2: Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:

```sql
CREATE DATABASE smartphone_addiction;
```

3. The application will automatically create tables on first run

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Update `.env` with your credentials:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartphone_addiction
DB_USER=your_username
DB_PASSWORD=your_password

# Twilio (Get from https://console.twilio.com)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Email (Choose one method)
# Method 1: Gmail with App Password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@smartphonewellness.com

# Method 2: SendGrid
# SENDGRID_API_KEY=your_sendgrid_api_key
# EMAIL_FROM=noreply@smartphonewellness.com

# Frontend
FRONTEND_URL=http://localhost:5500
```

### Step 4: Get Twilio Credentials

1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get your Account SID and Auth Token from the console
3. Purchase a phone number or use trial number
4. Add credentials to `.env`

### Step 5: Configure Email Service

#### Option A: Gmail (Recommended for Development)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `.env`

#### Option B: SendGrid (Recommended for Production)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Verify your sender email
4. Add API key to `.env`

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-04T10:30:00.000Z"
}
```

### 2. Create Prediction

```http
POST /api/predictions
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "screenTimeHours": 8.5,
  "nightUsageHours": 3.2,
  "unlocksPerDay": 150,
  "socialMediaHours": 5.0,
  "productivityHours": 1.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prediction completed successfully",
  "data": {
    "predictionId": 1,
    "userId": 1,
    "riskLevel": "High",
    "riskScore": 90,
    "confidence": 88,
    "recommendation": "Immediate action required! Your smartphone usage shows signs of addiction...",
    "notifications": {
      "sms": true,
      "email": true
    }
  }
}
```

### 3. Get Prediction History

```http
GET /api/predictions/history?email=john.doe@example.com
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "risk_level": "High",
      "risk_score": 90,
      "confidence": 88,
      "created_at": "2024-03-04T10:30:00.000Z",
      ...
    }
  ]
}
```

### 4. Get Prediction by ID

```http
GET /api/predictions/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "risk_level": "High",
    "risk_score": 90,
    "confidence": 88,
    "sms_sent": true,
    "email_sent": true,
    ...
  }
}
```

## Frontend Integration

Update your frontend prediction form to call the API:

```javascript
async function submitPrediction(formData) {
    try {
        const response = await fetch('http://localhost:3000/api/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                screenTimeHours: parseFloat(formData.screenTime),
                nightUsageHours: parseFloat(formData.nightUsage),
                unlocksPerDay: parseInt(formData.unlocks),
                socialMediaHours: parseFloat(formData.socialMedia),
                productivityHours: parseFloat(formData.productivity)
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('Prediction successful:', result.data);
            // Show success message
            // Redirect to results page
        } else {
            console.error('Prediction failed:', result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## Security Features

- **Helmet**: Sets security HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 
  - General API: 100 requests per 15 minutes
  - Predictions: 10 requests per hour
- **Input Validation**: Joi schema validation
- **Error Handling**: Centralized error handling
- **Logging**: All requests and errors logged

## Database Schema

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

## Notification Formats

### SMS Format
```
Smartphone Addiction Risk Result:

Risk Level: High
Score: 90/100
Confidence: 88%

Please check your email for detailed report.

- Smartphone Wellness Team
```

### Email Format
Professional HTML email with:
- Personalized greeting
- Risk assessment results
- Color-coded risk levels
- Detailed recommendations
- Call-to-action button
- Professional footer

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Test connection
psql -U your_username -d smartphone_addiction
```

### Twilio SMS Not Sending
- Verify Account SID and Auth Token
- Check phone number format (+1234567890)
- Ensure Twilio account has credits
- Check trial account restrictions

### Email Not Sending
- Verify SMTP credentials
- Check Gmail app password is correct
- Ensure "Less secure app access" is enabled (if not using app password)
- Check spam folder

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
# Update all other credentials with production values
```

### Recommended Hosting
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Database**: AWS RDS, Heroku Postgres, DigitalOcean Managed Database
- **Frontend**: Netlify, Vercel, AWS S3

## Logging

Logs are stored in the `logs/` directory:
- `error.log`: Error-level logs only
- `combined.log`: All logs

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
