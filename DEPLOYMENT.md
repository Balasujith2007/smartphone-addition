# Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] API endpoints tested
- [ ] SMS and Email services verified
- [ ] Error logging configured
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] CORS configured for production domain

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000

# Database (Use managed database service)
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=smartphone_addiction_prod
DB_USER=prod_user
DB_PASSWORD=strong_password_here

# Twilio
TWILIO_ACCOUNT_SID=your_production_sid
TWILIO_AUTH_TOKEN=your_production_token
TWILIO_PHONE_NUMBER=+1234567890

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=production@yourdomain.com
EMAIL_PASSWORD=app_password
EMAIL_FROM=noreply@yourdomain.com

# Frontend
FRONTEND_URL=https://yourdomain.com

# JWT (for future auth)
JWT_SECRET=generate_strong_random_secret_here
```

## Deployment Options

### Option 1: Heroku (Easiest)

#### Step 1: Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

#### Step 2: Create Heroku App
```bash
heroku create smartphone-addiction-api
```

#### Step 3: Add PostgreSQL
```bash
heroku addons:create heroku-postgresql:mini
```

#### Step 4: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
heroku config:set TWILIO_PHONE_NUMBER=+1234567890
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_USER=your_email@gmail.com
heroku config:set EMAIL_PASSWORD=your_app_password
heroku config:set EMAIL_FROM=noreply@yourdomain.com
heroku config:set FRONTEND_URL=https://yourdomain.com
```

#### Step 5: Deploy
```bash
git add .
git commit -m "Production ready"
git push heroku main
```

#### Step 6: Initialize Database
```bash
heroku run node -e "require('./backend/config/database').initDatabase()"
```

#### Step 7: View Logs
```bash
heroku logs --tail
```

Your API will be available at: `https://smartphone-addiction-api.herokuapp.com`

---

### Option 2: AWS EC2

#### Step 1: Launch EC2 Instance
- Choose Ubuntu Server 22.04 LTS
- Instance type: t2.micro (free tier) or t2.small
- Configure security group:
  - SSH (22) - Your IP
  - HTTP (80) - Anywhere
  - HTTPS (443) - Anywhere
  - Custom TCP (3000) - Anywhere

#### Step 2: Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### Step 3: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

#### Step 4: Setup PostgreSQL
```bash
sudo -u postgres psql
CREATE DATABASE smartphone_addiction;
CREATE USER prod_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smartphone_addiction TO prod_user;
\q
```

#### Step 5: Clone and Setup Project
```bash
git clone your-repo-url
cd smartphone-addiction-backend
npm install
```

#### Step 6: Configure Environment
```bash
nano .env
# Add all production environment variables
```

#### Step 7: Start with PM2
```bash
pm2 start server.js --name smartphone-api
pm2 save
pm2 startup
```

#### Step 8: Setup Nginx (Optional - for reverse proxy)
```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/smartphone-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/smartphone-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 3: DigitalOcean App Platform

#### Step 1: Create Account
Sign up at https://www.digitalocean.com

#### Step 2: Create New App
- Connect your GitHub repository
- Choose Node.js environment
- Set build command: `npm install`
- Set run command: `npm start`

#### Step 3: Add Database
- Add PostgreSQL database component
- Connection details will be auto-configured

#### Step 4: Set Environment Variables
Add all variables in the App Platform dashboard

#### Step 5: Deploy
Click "Deploy" - automatic deployment on git push

---

### Option 4: Railway (Modern & Simple)

#### Step 1: Sign Up
Go to https://railway.app

#### Step 2: New Project
- Click "New Project"
- Choose "Deploy from GitHub repo"
- Select your repository

#### Step 3: Add PostgreSQL
- Click "New"
- Select "Database"
- Choose "PostgreSQL"

#### Step 4: Configure Environment
Railway auto-detects Node.js and sets up environment

#### Step 5: Add Custom Variables
Add Twilio and Email credentials in Variables tab

#### Step 6: Deploy
Automatic deployment on git push

---

## Database Hosting Options

### 1. Heroku Postgres
- Free tier: 10,000 rows
- Paid: Starting $9/month
- Automatic backups
- Easy setup

### 2. AWS RDS
- Free tier: 750 hours/month
- Highly scalable
- Automatic backups
- Multi-AZ deployment

### 3. DigitalOcean Managed Database
- Starting $15/month
- Automatic backups
- Easy scaling
- Good performance

### 4. ElephantSQL
- Free tier: 20MB
- PostgreSQL as a service
- Easy setup
- Good for testing

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Monitoring & Logging

### 1. PM2 Monitoring
```bash
pm2 monit
pm2 logs
```

### 2. Log Management
- Use Winston for structured logging
- Send logs to external service:
  - Papertrail
  - Loggly
  - CloudWatch (AWS)

### 3. Uptime Monitoring
- UptimeRobot (free)
- Pingdom
- StatusCake

### 4. Error Tracking
- Sentry
- Rollbar
- Bugsnag

---

## Performance Optimization

### 1. Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Database Connection Pooling
Already configured in `backend/config/database.js`

### 3. Caching
```javascript
const redis = require('redis');
const client = redis.createClient();
```

### 4. CDN for Static Files
- Cloudflare
- AWS CloudFront
- Fastly

---

## Backup Strategy

### Database Backups

#### Automated Daily Backups
```bash
# Create backup script
nano /home/ubuntu/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

pg_dump -U prod_user smartphone_addiction > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
chmod +x /home/ubuntu/backup-db.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-db.sh
```

---

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` to git
- Use secrets management (AWS Secrets Manager, HashiCorp Vault)

### 2. Database Security
- Use strong passwords
- Enable SSL connections
- Restrict IP access
- Regular backups

### 3. API Security
- Rate limiting (already configured)
- Input validation (already configured)
- CORS restrictions
- Helmet security headers (already configured)

### 4. Server Security
```bash
# Enable firewall
sudo ufw enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Auto security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (AWS ELB, Nginx)
- Multiple server instances
- Shared database
- Redis for session management

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Add database indexes
- Use caching

---

## Rollback Strategy

### Quick Rollback
```bash
# Heroku
heroku rollback

# PM2
pm2 restart smartphone-api --update-env

# Git
git revert HEAD
git push heroku main
```

---

## Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-domain.com/api/health
```

### 2. Test Prediction
```bash
curl -X POST https://your-domain.com/api/predictions \
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
```

### 3. Check Logs
```bash
# Heroku
heroku logs --tail

# PM2
pm2 logs smartphone-api

# System logs
tail -f /var/log/nginx/error.log
```

---

## Maintenance

### Regular Tasks
- [ ] Monitor error logs daily
- [ ] Check database performance weekly
- [ ] Review security updates weekly
- [ ] Test backups monthly
- [ ] Update dependencies monthly
- [ ] Review API usage monthly

### Update Process
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations (if any)
npm run migrate

# Restart service
pm2 restart smartphone-api
```

---

## Support & Troubleshooting

### Common Issues

**Issue: Database connection timeout**
- Check database credentials
- Verify network connectivity
- Check connection pool settings

**Issue: SMS not sending**
- Verify Twilio credentials
- Check account balance
- Review Twilio logs

**Issue: High memory usage**
- Check for memory leaks
- Optimize database queries
- Increase server resources

---

## Cost Estimation

### Small Scale (< 1000 users)
- Heroku Hobby: $7/month
- Heroku Postgres: $9/month
- Twilio: ~$10/month
- Total: ~$26/month

### Medium Scale (1000-10000 users)
- AWS EC2 t2.small: $17/month
- AWS RDS: $15/month
- Twilio: ~$50/month
- Total: ~$82/month

### Large Scale (10000+ users)
- AWS EC2 t2.medium: $34/month
- AWS RDS: $50/month
- Twilio: ~$200/month
- Load Balancer: $18/month
- Total: ~$302/month

---

## Success Metrics

Track these metrics post-deployment:
- API response time
- Error rate
- SMS delivery rate
- Email delivery rate
- Database query performance
- Server uptime
- User satisfaction

---

## Next Steps

1. Choose deployment platform
2. Setup production database
3. Configure environment variables
4. Deploy application
5. Test all endpoints
6. Setup monitoring
7. Configure backups
8. Document API for frontend team
9. Setup CI/CD pipeline
10. Monitor and optimize

---

## Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [PostgreSQL Performance](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Twilio Documentation](https://www.twilio.com/docs)
- [Nodemailer Documentation](https://nodemailer.com/)

---

**Your backend is production-ready! 🚀**
