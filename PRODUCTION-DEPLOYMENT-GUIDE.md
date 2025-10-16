# 🚀 credX Platform - Production Deployment Guide

## 📋 Overview

This guide covers deploying the credX Platform to production with all features enabled, including:

- ✅ **Credit Management System** with ZKP and DID support
- ✅ **Admin Dashboard** with comprehensive analytics
- ✅ **Customer Portal** with credit features
- ✅ **Real-time Features** (live chat, notifications)
- ✅ **Supabase Integration** (database, auth, real-time)
- ✅ **Security Features** (RLS, encryption, validation)

## 🎯 Prerequisites

### Required Services
- **Supabase Project** (database, auth, storage)
- **Deployment Platform** (Vercel, Netlify, Render, etc.)
- **Domain Name** (optional but recommended)

### Required Tools
- Node.js 18+
- npm or yarn
- Git
- Supabase CLI (optional)

## 🔧 Environment Setup

### 1. Supabase Configuration

```bash
# Create a new Supabase project
# Go to https://supabase.com/dashboard
# Create new project
# Note down your project URL and API keys
```

### 2. Environment Variables

Create `.env.local` with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_secret_key

# AI Integration (Optional)
GEMINI_API_KEY=your_gemini_api_key

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_UPLOADS=true
NEXT_PUBLIC_ENABLE_EMAIL=true

# Production Configuration
NODE_ENV=production
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false

# Application Info
NEXT_PUBLIC_APP_NAME=credX Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_COMPANY_NAME=credX
NEXT_PUBLIC_COMPANY_EMAIL=support@credX.com

# Credit System Configuration
NEXT_PUBLIC_ENABLE_CREDIT_SCORING=true
NEXT_PUBLIC_ENABLE_ZKP_PROOFS=true
NEXT_PUBLIC_ENABLE_DID_MANAGEMENT=true
NEXT_PUBLIC_ENABLE_VERIFIABLE_CREDENTIALS=true

# Security Configuration
NEXT_PUBLIC_CORS_ORIGINS=https://your-domain.com
NEXT_PUBLIC_SESSION_TIMEOUT=3600
NEXT_PUBLIC_RATE_LIMIT=100

# Monitoring & Analytics
NEXT_PUBLIC_ENABLE_MONITORING=true
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_ERROR_TRACKING_DSN=your_error_tracking_dsn
```

## 🗄️ Database Setup

### 1. Run Database Migrations

```sql
-- The database schema is already set up in Supabase
-- All tables are created with proper RLS policies
-- Sample data is included for testing
```

### 2. Create Admin Users

```sql
-- Create admin user
INSERT INTO users (email, full_name, role, is_verified) 
VALUES ('admin@credX.com', 'Admin User', 'admin', true);

-- Create customer user
INSERT INTO users (email, full_name, role, is_verified) 
VALUES ('customer@credX.com', 'Customer User', 'customer', true);
```

### 3. Set up Supabase Auth

1. Go to Supabase Dashboard → Authentication → Users
2. Create users with the same emails as in the database
3. Set passwords for each user
4. Verify email addresses

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
# Go to Project Settings → Environment Variables
# Add all variables from .env.local
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=.next

# Set environment variables in Netlify dashboard
```

### Option 3: Render

```bash
# Connect your GitHub repository to Render
# Use the render.yaml configuration file
# Set environment variables in Render dashboard
```

### Option 4: Docker

```bash
# Build Docker image
docker build -t credX-platform .

# Run container
docker run -p 3000:3000 credX-platform

# Or use Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security Configuration

### 1. Supabase Security

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;
-- ... (all tables already have RLS enabled)

-- Create security policies
-- (Policies are already created in the schema)
```

### 2. Application Security

- ✅ **HTTPS Only** - All production traffic over HTTPS
- ✅ **CORS Configuration** - Restrict to your domain
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **Input Validation** - All inputs validated
- ✅ **SQL Injection Protection** - Using Supabase client
- ✅ **XSS Protection** - React built-in protection

### 3. Environment Security

- ✅ **Environment Variables** - Never commit secrets
- ✅ **Service Role Key** - Server-side only
- ✅ **API Keys** - Properly secured
- ✅ **Database Access** - RLS policies enabled

## 📊 Monitoring & Analytics

### 1. Application Monitoring

```bash
# Set up error tracking (Sentry, LogRocket, etc.)
NEXT_PUBLIC_ERROR_TRACKING_DSN=your_sentry_dsn

# Set up analytics (Google Analytics, Mixpanel, etc.)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### 2. Performance Monitoring

- ✅ **Core Web Vitals** - Monitored automatically
- ✅ **API Response Times** - Tracked in Supabase
- ✅ **Database Performance** - Supabase dashboard
- ✅ **Error Rates** - Real-time monitoring

### 3. Business Metrics

- ✅ **User Registration** - Tracked in analytics
- ✅ **Credit Score Calculations** - Database metrics
- ✅ **ZKP Proof Generation** - Performance tracking
- ✅ **Customer Satisfaction** - Rating system

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test:ci
      - run: npm run lint
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 🧪 Testing

### 1. Pre-deployment Tests

```bash
# Run all tests
npm run test:ci

# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### 2. Production Testing

- ✅ **Smoke Tests** - Basic functionality
- ✅ **Authentication** - Login/logout flows
- ✅ **Credit Features** - Score calculation, ZKP generation
- ✅ **Admin Dashboard** - All features working
- ✅ **Customer Portal** - Credit management features
- ✅ **Real-time Features** - Live chat, notifications

## 📈 Performance Optimization

### 1. Frontend Optimization

- ✅ **Code Splitting** - Automatic with Next.js
- ✅ **Image Optimization** - Next.js Image component
- ✅ **Bundle Analysis** - `npm run analyze`
- ✅ **Lazy Loading** - Components loaded on demand

### 2. Backend Optimization

- ✅ **Database Indexing** - Proper indexes on all tables
- ✅ **Query Optimization** - Efficient Supabase queries
- ✅ **Caching** - Supabase built-in caching
- ✅ **CDN** - Vercel/Netlify CDN

### 3. Security Optimization

- ✅ **Rate Limiting** - Prevent abuse
- ✅ **Input Validation** - All inputs validated
- ✅ **SQL Injection Protection** - Supabase client
- ✅ **XSS Protection** - React built-in

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check Supabase credentials
   - Verify RLS policies
   - Check user roles

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Verify database permissions

3. **Build Errors**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check TypeScript errors

4. **Deployment Issues**
   - Verify environment variables
   - Check build logs
   - Verify domain configuration

### Debug Commands

```bash
# Check environment variables
npm run env:check

# Debug build
npm run build -- --debug

# Check Supabase connection
npm run db:setup

# View logs
npm run logs
```

## 📞 Support

### Getting Help

- 📧 **Email**: support@credX.com
- 📚 **Documentation**: Check README.md
- 🐛 **Issues**: GitHub Issues
- 💬 **Community**: Discord/Slack

### Emergency Contacts

- 🚨 **Critical Issues**: admin@credX.com
- 🔒 **Security Issues**: security@credX.com
- 💳 **Payment Issues**: billing@credX.com

## 🎉 Success Checklist

- [ ] Supabase project created and configured
- [ ] Environment variables set correctly
- [ ] Database schema deployed
- [ ] Admin users created
- [ ] Application deployed successfully
- [ ] Domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Monitoring configured
- [ ] Analytics tracking active
- [ ] Security policies enabled
- [ ] Performance optimized
- [ ] Tests passing
- [ ] Documentation updated

## 🚀 Launch

Once all checklist items are complete:

1. **Announce Launch** - Notify stakeholders
2. **Monitor Closely** - Watch for issues
3. **Gather Feedback** - Collect user feedback
4. **Iterate Quickly** - Fix issues promptly
5. **Scale Gradually** - Monitor performance

---

**🎊 Congratulations! Your credX Platform is now live in production!**

For ongoing maintenance and updates, refer to the maintenance guide in the documentation.
