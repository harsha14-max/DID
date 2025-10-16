# 🚨 DEPLOYMENT TROUBLESHOOTING GUIDE

## 🔧 **Authentication Issues - Quick Fix**

### **Problem**: Authentication not working in deployed version

### **Solution Steps**:

#### **1. Check Supabase Configuration**

**Go to Supabase Dashboard → Authentication → Settings:**

1. **Site URL**: Set to your Vercel domain
   ```
   https://your-app-name.vercel.app
   ```

2. **Redirect URLs**: Add these URLs
   ```
   https://your-app-name.vercel.app/auth/callback
   https://your-app-name.vercel.app/admin/dashboard
   https://your-app-name.vercel.app/customer/dashboard
   ```

#### **2. Verify Environment Variables in Vercel**

**Go to Vercel Dashboard → Settings → Environment Variables:**

Make sure these are set correctly:
- `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your_anon_key`
- `SUPABASE_SERVICE_ROLE_KEY` = `your_service_role_key`

#### **3. Check Database Setup**

**Run these SQL scripts in Supabase SQL Editor:**

1. **Create users table** (if not exists):
```sql
-- Run supabase-setup.sql content
```

2. **Create default users**:
```sql
-- Run create-users.sql content
```

#### **4. Test Authentication**

**Default Login Credentials:**
- **Admin**: admin@bsm-platform.com / admin123
- **Customer**: customer@bsm-platform.com / customer123

---

## 🎨 **Theme Issues - Quick Fix**

### **Problem**: Light theme not showing

### **Solution Applied**:

1. **Fixed Theme Provider**: Set default theme to "light"
2. **Added Theme Toggle**: Button in top-right corner
3. **Disabled System Theme**: Prevents conflicts

### **How to Use**:
- Click the **Sun/Moon icon** in the top-right corner
- Toggle between light and dark themes
- Theme preference is saved automatically

---

## 🔍 **Debugging Steps**

### **Check Browser Console**:
1. Open Developer Tools (F12)
2. Look for errors in Console tab
3. Check Network tab for failed requests

### **Common Error Messages**:
- `supabaseUrl is required` → Environment variables not set
- `Invalid login credentials` → Database not set up
- `CORS error` → Supabase site URL not configured

### **Test Authentication Flow**:
1. Go to `/auth/login`
2. Try logging in with default credentials
3. Check if redirect works to dashboard

---

## 🚀 **Quick Deployment Checklist**

### **Before Deployment**:
- [ ] Supabase project created
- [ ] Database scripts run
- [ ] Environment variables set in Vercel
- [ ] Supabase site URL configured

### **After Deployment**:
- [ ] Test authentication login
- [ ] Check theme toggle functionality
- [ ] Verify admin/customer portals work
- [ ] Test all navigation links

---

## 📞 **Still Having Issues?**

### **Check These**:
1. **Vercel Build Logs**: Look for errors during build
2. **Supabase Logs**: Check authentication logs
3. **Browser Network**: Look for failed API calls
4. **Environment Variables**: Verify all are set correctly

### **Common Fixes**:
- **Redeploy** after fixing environment variables
- **Clear browser cache** and try again
- **Check Supabase project status** (not paused)
- **Verify domain** matches in Supabase settings

---

## ✅ **Success Indicators**

### **Authentication Working**:
- Login page loads without errors
- Can log in with default credentials
- Redirects to correct dashboard
- User session persists

### **Theme Working**:
- Light theme shows by default
- Theme toggle button visible
- Can switch between light/dark
- Theme preference saves

**Your BSM Platform should now work perfectly!** 🎉
