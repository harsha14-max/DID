# credX Platform Setup Guide

## 🚀 Quick Start

### 1. Start the Development Server
```bash
# Make sure you're in the project directory
cd "C:\Users\Hajir\naya ackermann\naya_ackermannn"

# Start the server
npm run dev
```

### 2. Set Up Supabase Users

#### Step 1: Create Users in Supabase Auth
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** and create these users:

**Admin User:**
- Email: `admin@bsm.com`
- Password: `admin123`
- Email Confirm: ✅ (check this box)

**Customer User:**
- Email: `customer@bsm.com`
- Password: `customer123`
- Email Confirm: ✅ (check this box)

#### Step 2: Run Database Setup
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `create-users.sql`
3. Run the SQL script

### 3. Test the Login Flow

1. Open `http://localhost:3000` in your browser
2. Click **"Login"** or **"Get Started"** button
3. Select **Customer** or **Admin** portal
4. Use the credentials:
   - **Admin:** admin@bsm.com / admin123
   - **Customer:** customer@bsm.com / customer123
5. Click **"Sign In"**

### 4. Navigation Flow

- **Landing Page** → Click "Login" → **Login Page**
- **Landing Page** → Click "Get Started" → **Login Page** (Admin pre-selected)
- **Login Page** → Select role → Enter credentials → **Dashboard**

## 🔧 Troubleshooting

### Server Not Starting
```bash
# Kill existing processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Restart server
npm run dev
```

### Login Not Working
1. Check browser console (F12) for errors
2. Verify Supabase credentials in `.env.local`
3. Make sure users exist in Supabase Auth
4. Check if database tables are created

### Port 3000 Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID_NUMBER> /F
```

## 📁 File Structure

```
src/
├── app/
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx          # Login page
│   ├── customer/
│   │   └── dashboard/
│   │       └── page.tsx          # Customer dashboard
│   └── admin/
│       └── dashboard/
│           └── page.tsx          # Admin dashboard
├── components/
│   ├── landing/
│   │   └── Navbar.tsx            # Navigation with login links
│   └── advanced/
│       └── AdvancedWelcomePage.tsx # Landing page with CTA buttons
└── lib/
    └── supabase/
        └── client.ts             # Supabase client configuration
```

## 🎯 Features

- ✅ Dark theme login page
- ✅ Role selection (Admin/Customer)
- ✅ Supabase authentication
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Landing page integration

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bsm.com | admin123 |
| Customer | customer@bsm.com | customer123 |

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify Supabase connection
3. Ensure all dependencies are installed
4. Check that the server is running on port 3000
