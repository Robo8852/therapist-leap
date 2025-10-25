# Soul Synaptica - Backend-Heavy Application

Full-stack psychedelic therapy clinic platform with Encore.ts microservices backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Encore CLI (`npm install -g encore.dev`)
- PostgreSQL (auto-provisioned by Encore)

### Local Development

```bash
# Install dependencies
npm install

# Run Encore development server
encore run

# The API will be available at http://localhost:4000
# The development dashboard at http://localhost:9400
```

### Frontend Development

```bash
# Open index.html in a browser
# Or use a simple HTTP server:
npx serve .
```

## 📁 Project Structure

```
soul-synaptica/
├── Backend Services (Encore.ts)
│   ├── contact/           # Contact form submissions
│   ├── content/           # CMS (testimonials, team, services)
│   ├── auth/              # Authentication & JWT
│   ├── appointments/      # Booking system
│   └── notifications/     # Email service
│
├── Frontend
│   ├── index.html         # Main page
│   ├── assets/
│   │   ├── css/          # Styles
│   │   ├── js/           # JavaScript + API integration
│   │   └── images/       # Static assets
│   └── pages/            # Additional pages (TBD)
│
└── Documentation
    ├── REFACTORING_GUIDE.md  # Complete technical guide
    └── PROJECT_README.md     # This file
```

## 🔧 Backend Services

### 1. Contact Service
- **Database:** `contact`
- **Endpoints:** Submit form, view/manage inquiries
- **Path:** `contact/contact.ts`

### 2. Content Management
- **Database:** `content`
- **Endpoints:** CRUD for testimonials, team, services
- **Path:** `content/*.ts`

### 3. Authentication
- **Database:** `auth`
- **Endpoints:** Login, register, JWT verification
- **Path:** `auth/auth.ts`

### 4. Appointments
- **Database:** `appointments`
- **Endpoints:** Book, view, manage appointments
- **Path:** `appointments/appointments.ts`

### 5. Notifications
- **Endpoints:** Email sending with templates
- **Path:** `notifications/email.ts`

## 🌐 API Endpoints

### Public Endpoints
```
POST   /contact/submit
GET    /testimonials
GET    /team
GET    /services
POST   /appointments/book
POST   /auth/login
```

### Admin Endpoints (Auth Required)
```
GET    /contact/inquiries
GET    /admin/testimonials
GET    /admin/team
GET    /admin/services
GET    /appointments
POST   /auth/register
```

See `REFACTORING_GUIDE.md` for complete API documentation.

## 🔐 Configuration

### Encore Secrets (Required)
```bash
# Set these secrets in Encore
encore secret set --prod JWTSecret
encore secret set --prod EmailAPIKey
encore secret set --prod EmailFromAddress
```

### Environment Variables
```bash
# Local development
API_BASE_URL=http://localhost:4000

# Production
API_BASE_URL=https://your-production-url.com
```

Update `assets/js/api-config.js` with your production URL.

## 🗄️ Database

Encore automatically provisions PostgreSQL databases:
- `contact` - Contact inquiries
- `content` - Testimonials, team, services
- `auth` - Users and sessions
- `appointments` - Booking data

### Migrations
Located in each service's `migrations/` folder:
- `*.up.sql` - Apply migration
- `*.down.sql` - Rollback migration

## 🧪 Testing

```bash
# Run tests
encore test

# Test specific service
encore test ./contact

# View API documentation
encore api docs
```

## 🚢 Deployment

### Deploy to Leap.new

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - Backend refactor"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Leap:**
- Go to https://leap.new
- Connect your GitHub repository
- Leap will detect Encore.ts automatically

3. **Configure Secrets:**
- Set `JWTSecret`, `EmailAPIKey`, `EmailFromAddress`

4. **Review & Deploy:**
- Review generated infrastructure
- Choose AWS or GCP
- Deploy to your cloud

### Manual Deployment (AWS/GCP)

```bash
# Build for production
encore build

# Deploy to cloud
encore deploy --cloud <aws|gcp>
```

## 📊 Monitoring

Access Encore development dashboard:
```bash
encore run
# Open http://localhost:9400
```

View:
- API traces
- Database queries
- Service map
- Performance metrics

## 🛠️ Development Workflow

1. **Backend Changes:**
```bash
# Edit service files
# Encore auto-reloads

# Run migrations
encore db migrate
```

2. **Frontend Changes:**
```bash
# Edit HTML/CSS/JS
# Refresh browser
```

3. **Add New Endpoint:**
```typescript
export const myEndpoint = api(
  { expose: true, method: "GET", path: "/my-path" },
  async (): Promise<MyResponse> => {
    // Implementation
  }
);
```

## 📝 Key Features

✅ **5 Microservices** - Contact, Content, Auth, Appointments, Email
✅ **Type-Safe APIs** - Full TypeScript with Encore.ts
✅ **Auto-Provisioned DBs** - PostgreSQL with migrations
✅ **JWT Authentication** - Secure admin access
✅ **Email Templates** - Branded notifications
✅ **API Integration** - Frontend consumes backend APIs
✅ **Fallback Support** - Static content if API unavailable

## 🎯 Next Steps

- [ ] Create admin dashboard UI
- [ ] Add missing HTML pages (about, services, team, etc.)
- [ ] Implement auth middleware for admin endpoints
- [ ] Connect real email provider (SendGrid/SES)
- [ ] Add unit tests
- [ ] Set up CI/CD pipeline
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement caching

## 📚 Documentation

- **Technical Guide:** See `REFACTORING_GUIDE.md`
- **API Docs:** Run `encore api docs` or visit dashboard
- **Encore Docs:** https://encore.dev/docs
- **Leap Docs:** https://docs.leap.new

## 🆘 Troubleshooting

### API not connecting
- Check `assets/js/api-config.js` has correct URL
- Verify Encore is running (`encore run`)
- Check browser console for CORS errors

### Database errors
- Run migrations: `encore db migrate`
- Check database status: `encore db status`

### Email not sending
- Verify secrets are set
- Check console logs for email content
- Implement actual email provider integration

## 📞 Contact

**Soul Synaptica**
Lima, Perú
Email: connect@soulsynaptica.com
Phone: +51 954 140 424

---

**Built with:** Encore.ts, PostgreSQL, TypeScript, HTML/CSS/JS
**Optimized for:** Leap.new deployment
**Purpose:** Backend-heavy microservices architecture
