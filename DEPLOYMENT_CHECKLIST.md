# 🚀 Deployment Checklist - Soul Synaptica

## ✅ Pre-Deployment (Complete)

- [x] All 5 backend services implemented
- [x] Database migrations created
- [x] Frontend API integration complete
- [x] Documentation written
- [x] Configuration files created
- [x] .gitignore configured

## 📋 Deploy to Leap.new - Step by Step

### 1. Prepare Git Repository

```bash
cd /home/owner/Github/therapist-copy

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Complete backend refactor with Encore.ts microservices

- Implemented 5 microservices: Contact, Content, Auth, Appointments, Notifications
- Created PostgreSQL database schemas with migrations
- Integrated frontend with backend APIs
- Added comprehensive documentation
- Ready for Leap.new deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/soul-synaptica.git
git branch -M main
git push -u origin main
```

### 2. Connect to Leap.new

1. Go to https://leap.new
2. Sign in or create account
3. Click "New Project"
4. Connect GitHub repository: `soul-synaptica`
5. Leap will auto-detect Encore.ts

### 3. Configure Secrets in Leap

Before deploying, set these required secrets:

```bash
# JWT Secret (generate a strong random string)
JWTSecret=<your-secure-random-string>

# Email Configuration (if using SendGrid)
EmailAPIKey=<your-sendgrid-api-key>
EmailFromAddress=connect@soulsynaptica.com

# Or if using AWS SES
EmailAPIKey=<your-aws-ses-key>
EmailFromAddress=connect@soulsynaptica.com
```

**How to generate JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Review Generated Infrastructure

Leap will generate:
- Load balancers
- Container orchestration
- PostgreSQL databases (4 databases)
- Networking & security groups
- Auto-scaling configuration
- Monitoring & logging

**Review and approve** the infrastructure plan.

### 5. Choose Cloud Provider

Select:
- [ ] AWS (Amazon Web Services)
- [ ] GCP (Google Cloud Platform)

**Recommendation:** Use your existing cloud account credentials.

### 6. Deploy

Click "Deploy" and wait for:
- Infrastructure provisioning (5-10 minutes)
- Database setup
- Service deployment
- Health checks

### 7. Verify Deployment

```bash
# Test API endpoints
curl https://your-leap-url.com/testimonials
curl https://your-leap-url.com/services
curl -X POST https://your-leap-url.com/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message",
    "privacy_accepted": true
  }'
```

### 8. Update Frontend API URL

After deployment, update `assets/js/api-config.js`:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://YOUR-ACTUAL-LEAP-URL.com';  // <-- Update this
```

Commit and push:
```bash
git add assets/js/api-config.js
git commit -m "Update production API URL"
git push
```

### 9. Configure Custom Domain (Optional)

In Leap dashboard:
1. Go to Settings → Domains
2. Add your custom domain: `soulsynaptica.com`
3. Update DNS records as instructed
4. Enable HTTPS (automatic with Leap)

### 10. Set Up Email Provider

#### Option A: SendGrid
1. Create SendGrid account
2. Get API key
3. Verify sender email
4. Update secret: `EmailAPIKey`

#### Option B: AWS SES
1. Enable AWS SES in your account
2. Verify domain/email
3. Get SMTP credentials
4. Update `notifications/email.ts` to use SES SDK

### 11. Post-Deployment Testing

Test all features:
- [ ] Contact form submission
- [ ] Testimonials loading
- [ ] Services display
- [ ] Appointment booking
- [ ] Email notifications
- [ ] Admin login (if implementing dashboard)

## 🔧 Configuration Reference

### Environment-Specific Settings

**Local Development:**
```
API_BASE_URL=http://localhost:4000
```

**Production:**
```
API_BASE_URL=https://your-leap-url.com
```

### Database Connections

Leap automatically handles:
- Connection pooling
- SSL/TLS encryption
- Automatic backups
- High availability

No manual configuration needed!

## 📊 Monitoring & Maintenance

### Check Application Health

```bash
# View logs
leap logs

# Monitor performance
leap metrics

# Check database status
leap db status
```

### Scaling

Leap auto-scales based on:
- Request volume
- CPU usage
- Memory usage

Configure limits in Leap dashboard.

## 🐛 Troubleshooting

### Issue: 502 Bad Gateway
**Solution:** Check service health in Leap dashboard, verify all migrations ran successfully

### Issue: Database connection errors
**Solution:** Verify database provisioning completed, check connection strings in Leap

### Issue: CORS errors
**Solution:** Configure CORS in Encore app settings, add allowed origins

### Issue: Email not sending
**Solution:** Verify EmailAPIKey secret is set, check email provider credentials

## 🎯 Next Steps After Deployment

1. **Create Admin Dashboard**
   - Build admin UI for managing content
   - Implement authentication flow
   - Add protected routes

2. **Add Missing Pages**
   - about.html
   - services.html (detailed)
   - team.html
   - contribution.html
   - contact.html (dedicated page)

3. **Enhance Features**
   - Multi-language support
   - Blog/articles system
   - Payment integration
   - Calendar sync
   - SMS notifications

4. **Set Up CI/CD**
   - Automatic deployments on push to main
   - Run tests before deployment
   - Staging environment

5. **Implement Analytics**
   - Google Analytics
   - User behavior tracking
   - Conversion tracking

6. **Security Hardening**
   - Rate limiting
   - Input sanitization
   - SQL injection prevention
   - XSS protection
   - CSRF tokens

## 📚 Resources

- **Leap Documentation:** https://docs.leap.new
- **Encore Documentation:** https://encore.dev/docs
- **Project Guide:** See `REFACTORING_GUIDE.md`
- **Quick Start:** See `PROJECT_README.md`

## 📞 Support

**Technical Issues:**
- Leap Support: https://leap.new/support
- Encore Discord: https://encore.dev/discord

**Soul Synaptica:**
- Email: connect@soulsynaptica.com
- Phone: +51 954 140 424

---

**Status:** Ready for Deployment ✅
**Last Updated:** 2025-10-25
