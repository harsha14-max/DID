# 🚀 credX Platform - Complete Working Project

A comprehensive Credit Management platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- **🔐 Real Supabase Authentication** - Email/password with role-based access
- **👥 Dual Portal System** - Admin and Customer dashboards
- **🎯 Portal Type Validation** - Smart role-based redirection
- **📊 Analytics Dashboard** - Real-time metrics and insights
- **🎫 Ticket Management** - Complete support ticket system
- **📚 Knowledge Base** - Help articles and documentation
- **💬 Live Chat** - Real-time customer support
- **🔄 Workflow Automation** - Custom business processes
- **📱 Responsive Design** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel-ready with Docker support
- **Authentication**: Supabase Auth with RLS policies

## 🚀 Quick Start

### 1. **Environment Setup**
```bash
# Copy environment variables
cp env.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. **Database Setup**
1. Create a Supabase project
2. Go to SQL Editor
3. Run the complete schema: `FINAL-WORKING-SCHEMA.sql`
4. Create users in Supabase Auth:
   - **Admin**: `admin2@gmail.com` / `admin123`
   - **Customer**: `customer@gmail.com` / `cust123`

### 3. **Environment Variables**
Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🔐 Authentication

### **Working Credentials:**
- **Admin Portal**: `admin2@gmail.com` / `admin123`
- **Customer Portal**: `customer@gmail.com` / `cust123`

### **Portal Type Validation:**
- ✅ Correct portal selection → Redirects to appropriate dashboard
- ❌ Wrong portal selection → Shows error message
- 🛡️ Role-based access control enforced

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin dashboard
│   ├── customer/          # Customer dashboard
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Welcome page
├── components/            # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── customer/          # Customer-specific components
│   ├── ui/                # UI components
│   └── providers/         # Context providers
├── lib/                   # Utilities and configurations
│   ├── supabase/          # Supabase client setup
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript type definitions
```

## 🗄️ Database Schema

The `FINAL-WORKING-SCHEMA.sql` includes:

- **Users Table** - Linked to Supabase Auth
- **Tickets Table** - Support ticket management
- **Knowledge Base** - Help articles
- **Workflows** - Automation processes
- **Analytics** - Platform metrics
- **Chat Messages** - Live chat system

## 🚀 Deployment

### **Vercel Deployment:**
```bash
# Deploy to Vercel
vercel --prod
```

### **Docker Deployment:**
```bash
# Build and run with Docker
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run setup        # Setup project dependencies
```

## 🎯 Key Features Explained

### **Authentication Flow:**
1. User enters credentials and selects portal type
2. Supabase authenticates the user
3. System validates portal type matches user role
4. Redirects to appropriate dashboard

### **Role-Based Access:**
- **Admin**: Full access to all features, user management, analytics
- **Customer**: Limited access to ticket creation, knowledge base, live chat

### **Portal Type Validation:**
- Prevents users from accessing wrong portals
- Shows clear error messages for mismatched selections
- Ensures proper role-based security

## 📊 Sample Data

The schema includes:
- 2 users (admin + customer)
- 4 knowledge base articles
- 3 sample tickets
- 9 analytics metrics

## 🛡️ Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Role-based permissions** - Admin vs Customer access
- **Portal type validation** - Prevents unauthorized access
- **Secure authentication** - Supabase Auth integration

## 🎨 UI/UX Features

- **Modern Design** - Clean, professional interface
- **Smooth Animations** - Framer Motion powered
- **Responsive Layout** - Works on all screen sizes
- **Dark/Light Mode** - Theme switching support
- **Interactive Elements** - Engaging user experience

## 📈 Performance

- **Optimized Queries** - Database indexes for fast queries
- **Lazy Loading** - Components load on demand
- **Image Optimization** - Next.js image optimization
- **Code Splitting** - Automatic code splitting

## 🔍 Troubleshooting

### **Common Issues:**

1. **Infinite Recursion Error**: RLS is disabled on users table to prevent this
2. **Portal Type Validation**: Ensure user roles match selected portal
3. **Authentication Issues**: Check Supabase credentials and user creation

### **Debug Steps:**
1. Check browser console for errors
2. Verify Supabase connection
3. Confirm user roles in database
4. Test with provided credentials

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**🎉 Your credX Platform is ready to use!**

For support or questions, check the browser console for detailed error messages.