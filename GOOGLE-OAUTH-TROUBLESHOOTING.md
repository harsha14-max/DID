# Google OAuth Troubleshooting Guide

## 🔍 **Current Issue: "Authentication Failed"**

The Google OAuth authentication is failing. Here are the most common causes and solutions:

## ✅ **Step 1: Configure Supabase Dashboard**

### **1.1 Enable Google Provider in Supabase**
1. Go to your Supabase Dashboard: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and toggle it to **Enabled**
4. Add your credentials:
   - **Client ID**: `YOUR_GOOGLE_CLIENT_ID`
   - **Client Secret**: `YOUR_GOOGLE_CLIENT_SECRET`
5. **Save** the configuration

### **1.2 Configure Redirect URLs**
In Supabase, add these redirect URLs:
- `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
- `http://localhost:3000/auth/callback` (for development)

## ✅ **Step 2: Configure Google Cloud Console**

### **2.1 Update OAuth 2.0 Client**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID: `YOUR_GOOGLE_CLIENT_ID`
4. Click **Edit**
5. Add **Authorized redirect URIs**:
   - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`

### **2.2 Verify OAuth Consent Screen**
1. Go to **OAuth consent screen**
2. Make sure it's configured for your domain
3. Add test users if in testing mode

## 🔧 **Step 3: Debug the Issue**

### **3.1 Check Browser Console**
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Try Google OAuth login
4. Look for error messages like:
   - `OAuth error details:`
   - `OAuth callback error:`
   - `Session data:`

### **3.2 Common Error Messages & Solutions**

| Error Message | Solution |
|---------------|----------|
| `Provider not enabled` | Enable Google provider in Supabase dashboard |
| `Invalid redirect URI` | Add correct redirect URIs in Google Console |
| `Client ID not found` | Verify Client ID in Supabase dashboard |
| `Invalid client secret` | Verify Client Secret in Supabase dashboard |
| `Access blocked` | Check OAuth consent screen configuration |

## 🚀 **Step 4: Test the Flow**

### **4.1 Test Steps**
1. Go to `http://localhost:3000/auth/login`
2. Select **Customer Portal**
3. Click **Continue with Google**
4. Complete Google authentication
5. Should redirect to customer dashboard

### **4.2 Expected Console Logs**
```
Starting Google OAuth for customer role
Google OAuth initiated successfully
Handling OAuth callback...
OAuth callback role (forced to customer): customer
Session data: { session: {...}, user: {...} }
OAuth user authenticated: user@example.com
User profile created/updated: {...}
```

## 🛠️ **Step 5: Manual Verification**

### **5.1 Check Environment Variables**
```bash
# Verify these are in your .env.local file:
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

### **5.2 Test Supabase Connection**
```bash
# Check if Supabase is accessible
curl https://YOUR_PROJECT_ID.supabase.co/auth/v1/health
```

## 📞 **Step 6: Get Specific Error Details**

### **6.1 Enable Debug Mode**
Add this to your `.env.local`:
```
NEXT_PUBLIC_DEBUG=true
```

### **6.2 Check Network Tab**
1. Open Developer Tools → **Network** tab
2. Try Google OAuth
3. Look for failed requests to:
   - `supabase.co/auth/v1/authorize`
   - `accounts.google.com/oauth/authorize`

## 🔄 **Step 7: Restart Development Server**

After making changes:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 📋 **Quick Checklist**

- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Redirect URIs added to Google Console
- [ ] OAuth consent screen configured
- [ ] Environment variables set correctly
- [ ] Development server restarted
- [ ] Browser console checked for errors

## 🆘 **Still Having Issues?**

If the problem persists, please share:
1. **Browser console error messages**
2. **Network tab failed requests**
3. **Supabase dashboard configuration status**
4. **Google Console configuration status**

This will help identify the specific issue causing the authentication failure.
