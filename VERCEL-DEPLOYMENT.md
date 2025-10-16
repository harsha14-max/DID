# Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Method 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/preetamspacee/deployed_project.git)

### Method 2: Manual Deploy

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🔧 Environment Variables Setup

### Required Environment Variables in Vercel Dashboard:

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add the following variables (click "Add New" for each):**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_supabase_anon_key` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_supabase_service_role_key` | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your_google_client_id` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | `your_google_client_secret` | Production, Preview, Development |
| `GEMINI_API_KEY` | `your_gemini_api_key` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-vercel-app.vercel.app` | Production, Preview, Development |

**Important:** Make sure to select **all three environments** (Production, Preview, Development) for each variable.

### Environment Variable Sources:

- **NEXT_PUBLIC_SUPABASE_URL**: From Supabase Dashboard → Settings → API
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: From Supabase Dashboard → Settings → API
- **SUPABASE_SERVICE_ROLE_KEY**: From Supabase Dashboard → Settings → API
- **NEXT_PUBLIC_GOOGLE_CLIENT_ID**: From Google Cloud Console
- **GOOGLE_CLIENT_SECRET**: From Google Cloud Console
- **GEMINI_API_KEY**: From Google AI Studio
- **NEXT_PUBLIC_APP_URL**: Your Vercel deployment URL

## 🗄️ Database Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for setup to complete

2. **Run Database Scripts:**
   - Copy `supabase-setup.sql` content
   - Paste in Supabase SQL Editor
   - Run the script

3. **Create Default Users:**
   - Copy `create-users.sql` content
   - Paste in Supabase SQL Editor
   - Run the script

## 🔐 Authentication Setup

### Supabase Auth Configuration:

1. **Go to Supabase Dashboard → Authentication → Settings**
2. **Configure Site URL:**
   ```
   https://your-vercel-app.vercel.app
   ```
3. **Add Redirect URLs:**
   ```
   https://your-vercel-app.vercel.app/auth/callback
   https://your-vercel-app.vercel.app/admin/dashboard
   https://your-vercel-app.vercel.app/customer/dashboard
   ```

### Google OAuth Setup (Optional):

1. **Go to Google Cloud Console**
2. **Create OAuth 2.0 credentials**
3. **Add authorized redirect URIs:**
   ```
   https://your-supabase-project.supabase.co/auth/v1/callback
   ```

## 🎯 Default Login Credentials

After database setup, use these credentials:

- **Admin**: admin@bsm-platform.com / admin123
- **Customer**: customer@bsm-platform.com / customer123

## 🚨 Troubleshooting

### Common Issues:

1. **"Environment Variable references Secret which does not exist" Error:**
   - **Problem**: Vercel is looking for secrets instead of environment variables
   - **Solution**: Remove the `vercel.json` file or ensure environment variables are set directly in Vercel dashboard
   - **Fix**: Go to Vercel Dashboard → Settings → Environment Variables → Add variables manually

2. **"supabaseUrl is required" Error:**
   - **Problem**: Environment variables not set in Vercel
   - **Solution**: Add all required environment variables in Vercel dashboard
   - **Check**: Ensure variables are set for Production, Preview, and Development

3. **Authentication Issues:**
   - **Problem**: Supabase site URL not configured
   - **Solution**: Update Supabase site URL to match your Vercel domain
   - **Fix**: Supabase Dashboard → Authentication → Settings → Site URL

4. **Database Connection Issues:**
   - **Problem**: Database not set up or scripts not run
   - **Solution**: Run database setup scripts in Supabase SQL Editor
   - **Check**: Ensure Supabase project is active and accessible

### Step-by-Step Fix for Environment Variable Error:

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Click "Add New"**
5. **Add each variable one by one:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
   - Environment: Select all (Production, Preview, Development)
6. **Repeat for all variables**
7. **Redeploy your project**

### Support:
- Check Vercel deployment logs
- Verify environment variables are set correctly
- Ensure Supabase project is active

## 🎉 Success!

Once deployed, your credX Platform will be available at:
```
https://your-vercel-app.vercel.app
```

Both admin and customer portals will be fully functional with:
- ✅ Real-time features
- ✅ Authentication system
- ✅ Database connectivity
- ✅ AI integration
- ✅ Multi-channel support
