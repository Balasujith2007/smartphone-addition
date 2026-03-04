# System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ prediction.  │  │ dashboard.   │  │  result.     │          │
│  │    html      │  │    html      │  │    html      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
│                     HTTP/HTTPS Request                           │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS SERVER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE LAYER                       │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐        │   │
│  │  │ CORS   │  │Helmet  │  │ Rate   │  │ Body   │        │   │
│  │  │        │  │Security│  │Limiter │  │ Parser │        │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │                    ROUTES LAYER                          │   │
│  │  ┌────────────────────────────────────────────────┐     │   │
│  │  │  /api/health                                   │     │   │
│  │  │  /api/predictions (POST)                       │     │   │
│  │  │  /api/predictions/history (GET)                │     │   │
│  │  │  /api/predictions/:id (GET)                    │     │   │
│  │  └────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │                 CONTROLLER LAYER                         │   │
│  │  ┌────────────────────────────────────────────────┐     │   │
│  │  │  predictionController                          │     │   │
│  │  │  - createPrediction()                          │     │   │
│  │  │  - getPredictionHistory()                      │     │   │
│  │  │  - getPredictionById()                         │     │   │
│  │  └────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │                  SERVICE LAYER                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Prediction   │  │     SMS      │  │    Email     │  │   │
│  │  │   Service    │  │   Service    │  │   Service    │  │   │
│  │  │              │  │              │  │              │  │   │
│  │  │ Calculate    │  │   Twilio     │  │  Nodemailer  │  │   │
│  │  │ Risk Score   │  │ Integration  │  │ Integration  │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │         │                  │                  │          │   │
│  │         └──────────────────┴──────────────────┘          │   │
│  │                            │                              │   │
│  │  ┌─────────────────────────▼──────────────────────────┐ │   │
│  │  │         Notification Service                       │ │   │
│  │  │         (Orchestrates SMS + Email)                 │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │                   UTILS LAYER                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │  Validators  │  │    Logger    │  │   Database   │  │   │
│  │  │     (Joi)    │  │  (Winston)   │  │    Config    │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │    Twilio    │  │    Gmail/    │          │
│  │   Database   │  │     SMS      │  │   SendGrid   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagram

### Prediction Creation Flow

```
┌─────────┐
│  User   │
│ Submits │
│  Form   │
└────┬────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 1. Frontend Validation                                  │
│    - Check required fields                              │
│    - Validate data types                                │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. API Request                                          │
│    POST /api/predictions                                │
│    Content-Type: application/json                       │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Middleware Processing                                │
│    ├─ CORS Check                                        │
│    ├─ Rate Limit Check                                  │
│    ├─ Body Parsing                                      │
│    └─ Security Headers                                  │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Input Validation (Joi)                               │
│    ├─ Email format                                      │
│    ├─ Phone format                                      │
│    ├─ Number ranges                                     │
│    └─ Required fields                                   │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Database Transaction START                           │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. User Management                                      │
│    ├─ Check if user exists (by email)                  │
│    ├─ Create new user OR                                │
│    └─ Update existing user                              │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Risk Calculation (PredictionService)                 │
│    ├─ Screen Time Analysis (0-30 pts)                   │
│    ├─ Night Usage Analysis (0-25 pts)                   │
│    ├─ Phone Unlocks Analysis (0-20 pts)                 │
│    ├─ Social Media Analysis (0-15 pts)                  │
│    ├─ Productivity Balance (0-10 pts)                   │
│    ├─ Calculate Total Score (0-100)                     │
│    ├─ Determine Risk Level (Low/Med/High)               │
│    ├─ Calculate Confidence (75-99%)                     │
│    └─ Generate Recommendation                           │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 8. Save Prediction to Database                          │
│    └─ Insert into predictions table                     │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 9. Send Notifications (Parallel)                        │
│    ┌──────────────────┐    ┌──────────────────┐        │
│    │  SMS Service     │    │  Email Service   │        │
│    │  (Twilio)        │    │  (Nodemailer)    │        │
│    │                  │    │                  │        │
│    │ Format message   │    │ Format HTML      │        │
│    │ Send via Twilio  │    │ Send via SMTP    │        │
│    │ Return status    │    │ Return status    │        │
│    └──────────────────┘    └──────────────────┘        │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 10. Save Notification Status                            │
│     └─ Insert into notifications table                  │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 11. Database Transaction COMMIT                         │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 12. Return Response                                     │
│     {                                                   │
│       "success": true,                                  │
│       "data": {                                         │
│         "riskLevel": "High",                            │
│         "riskScore": 90,                                │
│         "confidence": 88,                               │
│         "notifications": {                              │
│           "sms": true,                                  │
│           "email": true                                 │
│         }                                               │
│       }                                                 │
│     }                                                   │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ 13. Frontend Displays Result                            │
│     - Show risk level                                   │
│     - Show recommendations                              │
│     - Notify user about SMS/Email                       │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Error Handling Flow

```
┌─────────────┐
│   Error     │
│  Occurs     │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Error Type?                          │
├──────────────────────────────────────┤
│                                      │
│  ┌─────────────────────────────┐    │
│  │ Validation Error (400)      │    │
│  │ - Return field errors       │    │
│  │ - User-friendly messages    │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ Database Error (500)        │    │
│  │ - Rollback transaction      │    │
│  │ - Log error details         │    │
│  │ - Return generic message    │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ External Service Error      │    │
│  │ - Log service failure       │    │
│  │ - Continue with partial     │    │
│  │ - Return success with note  │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ Rate Limit Error (429)      │    │
│  │ - Return retry-after        │    │
│  │ - Log attempt               │    │
│  └─────────────────────────────┘    │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Log to Winston                       │
│ - Error level                        │
│ - Stack trace                        │
│ - Request context                    │
│ - Timestamp                          │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Return JSON Response                 │
│ {                                    │
│   "success": false,                  │
│   "message": "Error description",    │
│   "errors": [...]                    │
│ }                                    │
└──────────────────────────────────────┘
```

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────┐
│                        USERS                            │
├─────────────────────────────────────────────────────────┤
│ id              SERIAL PRIMARY KEY                      │
│ first_name      VARCHAR(100) NOT NULL                   │
│ last_name       VARCHAR(100) NOT NULL                   │
│ email           VARCHAR(255) UNIQUE NOT NULL            │
│ phone           VARCHAR(20)                             │
│ created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP     │
│ updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP     │
└─────────────────────────────────────────────────────────┘
                          │
                          │ 1:N
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     PREDICTIONS                         │
├─────────────────────────────────────────────────────────┤
│ id                    SERIAL PRIMARY KEY                │
│ user_id               INTEGER FK → users(id)            │
│ risk_level            VARCHAR(20) NOT NULL              │
│ risk_score            INTEGER NOT NULL                  │
│ confidence            DECIMAL(5,2) NOT NULL             │
│ screen_time_hours     DECIMAL(5,2)                      │
│ night_usage_hours     DECIMAL(5,2)                      │
│ unlocks_per_day       INTEGER                           │
│ social_media_hours    DECIMAL(5,2)                      │
│ productivity_hours    DECIMAL(5,2)                      │
│ recommendation        TEXT                              │
│ created_at            TIMESTAMP DEFAULT CURRENT_TS      │
└─────────────────────────────────────────────────────────┘
                          │
                          │ 1:1
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   NOTIFICATIONS                         │
├─────────────────────────────────────────────────────────┤
│ id              SERIAL PRIMARY KEY                      │
│ prediction_id   INTEGER FK → predictions(id)            │
│ sms_sent        BOOLEAN DEFAULT FALSE                   │
│ email_sent      BOOLEAN DEFAULT FALSE                   │
│ sms_status      VARCHAR(50)                             │
│ email_status    VARCHAR(50)                             │
│ sent_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP     │
└─────────────────────────────────────────────────────────┘
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: Network Security                              │
│  ┌───────────────────────────────────────────────┐     │
│  │ - HTTPS/TLS encryption                        │     │
│  │ - Firewall rules                              │     │
│  │ - DDoS protection                             │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
│  Layer 2: Application Security                          │
│  ┌───────────────────────────────────────────────┐     │
│  │ - Helmet (Security headers)                   │     │
│  │ - CORS (Cross-origin control)                 │     │
│  │ - Rate limiting                               │     │
│  │ - Input validation (Joi)                      │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
│  Layer 3: Data Security                                 │
│  ┌───────────────────────────────────────────────┐     │
│  │ - Parameterized queries (SQL injection)       │     │
│  │ - Environment variables (.env)                │     │
│  │ - No sensitive data in logs                   │     │
│  │ - Database encryption at rest                 │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
│  Layer 4: API Security                                  │
│  ┌───────────────────────────────────────────────┐     │
│  │ - Request validation                          │     │
│  │ - Error message sanitization                  │     │
│  │ - Transaction support                         │     │
│  │ - Audit logging                               │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📈 Scalability Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   LOAD BALANCER                          │
│                   (Nginx / AWS ELB)                      │
└────┬────────────────────┬────────────────────┬──────────┘
     │                    │                    │
     ▼                    ▼                    ▼
┌─────────┐          ┌─────────┐          ┌─────────┐
│ Server  │          │ Server  │          │ Server  │
│ Node 1  │          │ Node 2  │          │ Node 3  │
└────┬────┘          └────┬────┘          └────┬────┘
     │                    │                    │
     └────────────────────┴────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Redis Cache        │
              │   (Session Store)    │
              └──────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  PostgreSQL Master   │
              │  (Read/Write)        │
              └──────────────────────┘
                         │
                    ┌────┴────┐
                    ▼         ▼
         ┌──────────────┐  ┌──────────────┐
         │ PostgreSQL   │  │ PostgreSQL   │
         │ Replica 1    │  │ Replica 2    │
         │ (Read Only)  │  │ (Read Only)  │
         └──────────────┘  └──────────────┘
```

## 🔄 Deployment Pipeline

```
┌─────────────┐
│ Developer   │
│ Commits     │
│ Code        │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Git Repository (GitHub)             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ CI/CD Pipeline                      │
│ ┌─────────────────────────────────┐ │
│ │ 1. Run Tests                    │ │
│ │ 2. Lint Code                    │ │
│ │ 3. Build Application            │ │
│ │ 4. Run Security Scan            │ │
│ └─────────────────────────────────┘ │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Staging Environment                 │
│ - Test deployment                   │
│ - Integration tests                 │
│ - Performance tests                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Manual Approval                     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Production Deployment               │
│ - Blue/Green deployment             │
│ - Health checks                     │
│ - Rollback capability               │
└─────────────────────────────────────┘
```

## 📊 Monitoring Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION                            │
│  ┌──────────────────────────────────────────────┐       │
│  │ Winston Logger                               │       │
│  │ - Error logs                                 │       │
│  │ - Info logs                                  │       │
│  │ - Debug logs                                 │       │
│  └────────┬─────────────────────────────────────┘       │
└───────────┼──────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              LOG AGGREGATION                             │
│  ┌──────────────────────────────────────────────┐       │
│  │ Papertrail / CloudWatch / Loggly             │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              MONITORING DASHBOARD                        │
│  ┌──────────────────────────────────────────────┐       │
│  │ - API response times                         │       │
│  │ - Error rates                                │       │
│  │ - Request volume                             │       │
│  │ - Database performance                       │       │
│  │ - SMS/Email delivery rates                   │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              ALERTING SYSTEM                             │
│  ┌──────────────────────────────────────────────┐       │
│  │ - Email alerts                               │       │
│  │ - SMS alerts                                 │       │
│  │ - Slack notifications                        │       │
│  │ - PagerDuty integration                      │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Scalability
- ✅ Security
- ✅ Reliability
- ✅ Maintainability
- ✅ Observability
