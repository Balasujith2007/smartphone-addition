# API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication
Currently, the API does not require authentication. Future versions will implement JWT-based authentication.

---

## Endpoints

### 1. Health Check

Check if the API server is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-04T10:30:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

### 2. Create Prediction

Submit user data for smartphone addiction risk assessment. Automatically sends SMS and email notifications.

**Endpoint:** `POST /predictions`

**Headers:**
```
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

**Field Descriptions:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| firstName | string | Yes | 2-100 chars | User's first name |
| lastName | string | Yes | 2-100 chars | User's last name |
| email | string | Yes | Valid email | User's email address |
| phone | string | Yes | E.164 format | User's phone number (e.g., +1234567890) |
| screenTimeHours | number | Yes | 0-24 | Daily screen time in hours |
| nightUsageHours | number | Yes | 0-24 | Night usage (10 PM - 6 AM) in hours |
| unlocksPerDay | integer | Yes | 0-1000 | Number of phone unlocks per day |
| socialMediaHours | number | Yes | 0-24 | Daily social media usage in hours |
| productivityHours | number | Yes | 0-24 | Daily productive app usage in hours |

**Success Response (201 Created):**
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
    "recommendation": "Immediate action required! Your smartphone usage shows signs of addiction. We strongly recommend: Set strict daily limits, enable app timers, and seek professional guidance if needed. Consider a digital detox and establish phone-free zones in your daily routine.",
    "notifications": {
      "sms": true,
      "email": true
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    },
    {
      "field": "screenTimeHours",
      "message": "\"screenTimeHours\" must be less than or equal to 24"
    }
  ]
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Failed to process prediction",
  "error": "Database connection failed"
}
```

**Status Codes:**
- `201 Created` - Prediction created successfully
- `400 Bad Request` - Invalid input data
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

**Rate Limiting:**
- 10 requests per hour per IP address

**Notifications:**
After successful prediction, the system automatically:
1. Sends SMS to the provided phone number
2. Sends detailed email to the provided email address

---

### 3. Get Prediction History

Retrieve prediction history for a specific user by email.

**Endpoint:** `GET /predictions/history`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User's email address |

**Example Request:**
```
GET /predictions/history?email=john.doe@example.com
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "user_id": 1,
      "risk_level": "High",
      "risk_score": 90,
      "confidence": 88.00,
      "screen_time_hours": 8.50,
      "night_usage_hours": 3.20,
      "unlocks_per_day": 150,
      "social_media_hours": 5.00,
      "productivity_hours": 1.50,
      "recommendation": "Immediate action required!...",
      "created_at": "2024-03-04T10:30:00.000Z",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    },
    {
      "id": 1,
      "user_id": 1,
      "risk_level": "Medium",
      "risk_score": 65,
      "confidence": 82.00,
      "screen_time_hours": 6.00,
      "night_usage_hours": 2.00,
      "unlocks_per_day": 100,
      "social_media_hours": 3.50,
      "productivity_hours": 2.00,
      "recommendation": "Your smartphone usage is concerning...",
      "created_at": "2024-03-03T08:15:00.000Z",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email is required"
}
```

**Status Codes:**
- `200 OK` - History retrieved successfully
- `400 Bad Request` - Missing email parameter
- `500 Internal Server Error` - Server error

**Notes:**
- Returns last 10 predictions
- Ordered by creation date (newest first)

---

### 4. Get Prediction by ID

Retrieve detailed information about a specific prediction.

**Endpoint:** `GET /predictions/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Prediction ID |

**Example Request:**
```
GET /predictions/1
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "risk_level": "High",
    "risk_score": 90,
    "confidence": 88.00,
    "screen_time_hours": 8.50,
    "night_usage_hours": 3.20,
    "unlocks_per_day": 150,
    "social_media_hours": 5.00,
    "productivity_hours": 1.50,
    "recommendation": "Immediate action required!...",
    "created_at": "2024-03-04T10:30:00.000Z",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "sms_sent": true,
    "email_sent": true,
    "sms_status": "sent",
    "email_status": "sent"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Prediction not found"
}
```

**Status Codes:**
- `200 OK` - Prediction found
- `404 Not Found` - Prediction doesn't exist
- `500 Internal Server Error` - Server error

---

## Risk Calculation Algorithm

The system calculates risk based on multiple factors:

### Risk Score Components (0-100)

1. **Screen Time (0-30 points)**
   - ≥8 hours: 30 points (Excessive)
   - 6-8 hours: 20 points (High)
   - 4-6 hours: 10 points (Moderate)
   - <4 hours: 0 points (Healthy)

2. **Night Usage (0-25 points)**
   - ≥3 hours: 25 points (Severe)
   - 2-3 hours: 18 points (High)
   - 1-2 hours: 10 points (Moderate)
   - <1 hour: 0 points (Healthy)

3. **Phone Unlocks (0-20 points)**
   - ≥150 times: 20 points (Excessive)
   - 100-150 times: 15 points (High)
   - 60-100 times: 8 points (Moderate)
   - <60 times: 0 points (Healthy)

4. **Social Media Usage (0-15 points)**
   - ≥5 hours: 15 points (Excessive)
   - 3-5 hours: 10 points (High)
   - 2-3 hours: 5 points (Moderate)
   - <2 hours: 0 points (Healthy)

5. **Productivity Balance (0-10 points)**
   - Productivity ratio <20%: 10 points (Low)
   - Productivity ratio 20-40%: 5 points (Moderate)
   - Productivity ratio >40%: 0 points (Good)

### Risk Levels

- **High Risk**: Score ≥70
- **Medium Risk**: Score 40-69
- **Low Risk**: Score <40

### Confidence Calculation

Base confidence: 75%
- +15% if 3+ risk factors present
- +10% if 2 risk factors present
- +10% if data is internally consistent

Maximum confidence: 99%

---

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
Professional HTML email containing:
- Personalized greeting
- Risk assessment results (color-coded)
- Confidence percentage
- Detailed recommendations
- Call-to-action button to dashboard
- Professional footer

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Validation failed | Invalid input data |
| 404 | Not found | Resource doesn't exist |
| 429 | Too many requests | Rate limit exceeded |
| 500 | Internal server error | Server-side error |

---

## Rate Limiting

### General API Endpoints
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

### Prediction Endpoint
- **Limit**: 10 requests per hour per IP
- **Reason**: Prevent abuse and ensure fair usage

**Rate Limit Response (429):**
```json
{
  "success": false,
  "message": "Too many prediction requests. Please try again later."
}
```

---

## CORS Policy

**Allowed Origins:**
- Development: `*` (all origins)
- Production: Configured domain only

**Allowed Methods:**
- GET
- POST
- OPTIONS

**Allowed Headers:**
- Content-Type
- Authorization (future use)

---

## Data Privacy

### Data Storage
- User data is stored securely in PostgreSQL
- Passwords are hashed (when authentication is implemented)
- Sensitive data is encrypted at rest

### Data Retention
- Prediction history: Indefinite (user can request deletion)
- Logs: 30 days
- Backups: 7 days

### GDPR Compliance
Users can request:
- Data export (via Export Data endpoint - future)
- Data deletion (via Delete Account endpoint - future)

---

## Testing

### Using cURL

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Create Prediction:**
```bash
curl -X POST http://localhost:3000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "screenTimeHours": 8.5,
    "nightUsageHours": 3.2,
    "unlocksPerDay": 150,
    "socialMediaHours": 5.0,
    "productivityHours": 1.5
  }'
```

**Get History:**
```bash
curl "http://localhost:3000/api/predictions/history?email=john.doe@example.com"
```

**Get by ID:**
```bash
curl http://localhost:3000/api/predictions/1
```

### Using JavaScript (Fetch)

```javascript
// Create Prediction
async function createPrediction(data) {
  const response = await fetch('http://localhost:3000/api/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return await response.json();
}

// Get History
async function getHistory(email) {
  const response = await fetch(
    `http://localhost:3000/api/predictions/history?email=${encodeURIComponent(email)}`
  );
  
  return await response.json();
}

// Get by ID
async function getPrediction(id) {
  const response = await fetch(
    `http://localhost:3000/api/predictions/${id}`
  );
  
  return await response.json();
}
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Prediction creation with risk calculation
- Automated SMS notifications via Twilio
- Automated email notifications
- Prediction history retrieval
- Rate limiting
- Input validation
- Error handling
- Logging

### Future Versions
- User authentication (JWT)
- Dashboard analytics
- Real-time notifications
- Mobile app integration
- Advanced ML models
- Multi-language support

---

## Support

For API issues or questions:
- GitHub Issues: [Repository URL]
- Email: support@yourdomain.com
- Documentation: [Docs URL]

---

## License

MIT License - See LICENSE file for details
