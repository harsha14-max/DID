# 🚀 credX Platform - Complete Deployment Guide

## 📋 Project Overview

**credX Platform** is a comprehensive Business Service Management solution featuring:
- **Admin Portal** - Complete dashboard with analytics, ticket management, workflows
- **Customer Portal** - Support ticket creation, live chat, knowledge base
- **Real-time Features** - Live chat, ticket updates, notifications
- **AI Integration** - Automated responses, smart routing
- **Multi-channel Support** - Email, chat, phone integration

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Modern icons

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database with Row Level Security
- **Real-time Subscriptions** - Live updates
- **Authentication** - Built-in auth with PKCE flow

### Additional Features
- **AI Integration** - Gemini API for smart responses
- **File Upload** - Support for attachments
- **Email Integration** - SMTP configuration
- **Analytics** - Real-time performance metrics

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Supabase Account** - [Sign up here](https://supabase.com/)

### 1. Clone Repository
```bash
git clone https://github.com/preetamspacee/deployed_project.git
cd deployed_project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Edit environment variables
nano .env.local
```

### 4. Supabase Setup
1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com/)
   - Create new project
   - Note your Project URL and API keys

2. **Run Database Setup**:
   ```sql
   -- Copy and paste supabase-setup.sql in Supabase SQL Editor
   ```

3. **Create Users**:
   ```sql
   -- Copy and paste create-users.sql in Supabase SQL Editor
   ```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Access Application
- **Main App**: http://localhost:3000
- **Admin Portal**: http://localhost:3000/admin/dashboard
- **Customer Portal**: http://localhost:3000/customer/dashboard

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# AI Integration (Optional)
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (Optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 🗄️ Database Schema

### Core Tables
- **`users`** - User profiles with roles (admin/customer)
- **`tickets`** - Support tickets with full lifecycle
- **`knowledge_base`** - Help articles and documentation
- **`workflows`** - Automation workflows
- **`analytics`** - Performance metrics
- **`chat_messages`** - Live chat conversations

### Security Features
- **Row Level Security (RLS)** - Data isolation
- **Role-based Access** - Admin vs Customer permissions
- **Automatic Timestamps** - Created/updated tracking
- **Data Validation** - Constraint checks

## 👥 Default Users

### Admin User
- **Email**: admin@credX-platform.com
- **Password**: admin123
- **Role**: admin
- **Access**: Full admin dashboard

### Customer User
- **Email**: customer@credX-platform.com
- **Password**: customer123
- **Role**: customer
- **Access**: Customer portal

## 🎯 Key Features

### Admin Portal Features
- **Dashboard Analytics** - Real-time metrics and KPIs
- **Ticket Management** - Assign, update, resolve tickets
- **User Management** - Manage customer accounts
- **Workflow Builder** - Create automation workflows
- **AI Insights** - Smart analytics and recommendations
- **System Health** - Monitor service status
- **Knowledge Base** - Create and manage help articles

### Customer Portal Features
- **Ticket Creation** - Submit support requests
- **Live Chat** - Real-time support chat
- **Ticket Tracking** - Monitor ticket status
- **Knowledge Base** - Search help articles
- **Service Status** - Check system health
- **Rating System** - Rate support experience

### Real-time Features
- **Live Chat** - Instant messaging
- **Ticket Updates** - Real-time status changes
- **Notifications** - Instant alerts
- **Analytics** - Live performance metrics

## 🔒 Security Features

### Authentication
- **Supabase Auth** - Secure authentication
- **PKCE Flow** - Enhanced security
- **Session Management** - Automatic token refresh
- **Role-based Access** - Admin/Customer separation

### Data Protection
- **Row Level Security** - Database-level security
- **API Key Protection** - Environment variable security
- **Input Validation** - Data sanitization
- **CORS Configuration** - Cross-origin protection

## 📱 Deployment Options

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t credX-platform .

# Run container
docker run -p 3000:3000 credX-platform
```

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Render Deployment
1. Connect GitHub repository to Render
2. Configure build settings
3. Set environment variables
4. Deploy with render.yaml configuration

## 🐛 Troubleshooting

### Common Issues

#### 1. Supabase Connection Error
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verify Supabase project is active
```

#### 2. Database Permission Error
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'tickets';

-- Verify user roles
SELECT email, role FROM users;
```

#### 3. Authentication Issues
```bash
# Clear browser cache
# Check Supabase Auth settings
# Verify email confirmation
```

#### 4. Build Errors
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

### Performance Optimization

#### 1. Database Optimization
- Enable database indexes
- Use connection pooling
- Optimize queries

#### 2. Frontend Optimization
- Enable Next.js optimizations
- Use dynamic imports
- Optimize images

#### 3. Real-time Optimization
- Limit subscription channels
- Use efficient queries
- Implement pagination

## 📊 Monitoring & Analytics

### Built-in Analytics
- **Ticket Metrics** - Resolution times, volumes
- **User Activity** - Login patterns, usage
- **System Performance** - Response times, uptime
- **Customer Satisfaction** - Ratings, feedback

### External Monitoring
- **Supabase Dashboard** - Database performance
- **Vercel Analytics** - Frontend performance
- **Custom Dashboards** - Business metrics

## 🔄 Updates & Maintenance

### Regular Updates
- **Dependencies** - Keep packages updated
- **Security Patches** - Monitor vulnerabilities
- **Feature Updates** - Add new functionality
- **Database Migrations** - Schema updates

### Backup Strategy
- **Database Backups** - Supabase automatic backups
- **Code Backups** - Git repository
- **Environment Backups** - Configuration files

## 📞 Support & Documentation

### Documentation
- **API Documentation** - Supabase API docs
- **Component Library** - UI component docs
- **Database Schema** - Table relationships
- **Deployment Guides** - Platform-specific guides

### Community Support
- **GitHub Issues** - Bug reports and feature requests
- **Discord Community** - Real-time support
- **Documentation Site** - Comprehensive guides

## 🎉 Success Metrics

### Key Performance Indicators
- **Ticket Resolution Time** - < 2 hours average
- **Customer Satisfaction** - > 4.5/5 rating
- **System Uptime** - > 99.9% availability
- **User Adoption** - Active user growth

### Business Impact
- **Reduced Support Costs** - Automated workflows
- **Improved Customer Experience** - Faster responses
- **Better Resource Utilization** - Efficient ticket routing
- **Data-driven Decisions** - Analytics insights

---

## 🚀 Ready to Deploy!

Your credX Platform is now ready for production deployment. Follow the steps above to get started, and don't hesitate to reach out if you need any assistance!

**Happy Deploying! 🎉**

