#!/bin/bash

# BSM Platform - Automated Setup Script
# This script sets up the entire BSM Platform with zero configuration

echo "🚀 BSM Platform - Automated Setup"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"
        
        # Check if version is 18 or higher
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -ge 18 ]; then
            print_status "Node.js version is compatible (18+)"
        else
            print_error "Node.js version $NODE_VERSION is not compatible. Please install Node.js 18 or higher."
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher from https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm found: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    if npm install; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Setup environment file
setup_environment() {
    print_info "Setting up environment configuration..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env.local
            print_status "Environment file created from template"
            print_warning "Please edit .env.local with your Supabase credentials"
        else
            print_error "env.example file not found"
            exit 1
        fi
    else
        print_warning ".env.local already exists, skipping creation"
    fi
}

# Check environment variables
check_environment() {
    print_info "Checking environment configuration..."
    
    if [ -f ".env.local" ]; then
        # Check if Supabase URL is set
        if grep -q "NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url" .env.local; then
            print_warning "Supabase URL not configured in .env.local"
            print_info "Please update .env.local with your Supabase project URL"
        else
            print_status "Supabase URL appears to be configured"
        fi
        
        # Check if Supabase Anon Key is set
        if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key" .env.local; then
            print_warning "Supabase Anon Key not configured in .env.local"
            print_info "Please update .env.local with your Supabase anon key"
        else
            print_status "Supabase Anon Key appears to be configured"
        fi
    else
        print_error ".env.local file not found"
        exit 1
    fi
}

# Create Supabase setup instructions
create_supabase_instructions() {
    print_info "Creating Supabase setup instructions..."
    
    cat > SUPABASE_SETUP_INSTRUCTIONS.md << 'EOF'
# 🗄️ Supabase Database Setup Instructions

## Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com/)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: BSM Platform
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
6. Click "Create new project"
7. Wait for project to be created (2-3 minutes)

## Step 2: Get Project Credentials
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with https://)
   - **anon public** key (starts with eyJ)
   - **service_role** key (starts with eyJ)

## Step 3: Update Environment File
1. Open `.env.local` in your project
2. Replace the following values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Step 4: Setup Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Copy the entire content of `supabase-setup.sql`
3. Paste it in the SQL Editor
4. Click **Run** to execute the script
5. Verify tables are created in **Table Editor**

## Step 5: Create Default Users
1. In **SQL Editor**, copy the content of `create-users.sql`
2. Paste and run the script
3. Verify users are created in **Authentication** → **Users**

## Step 6: Test the Application
1. Run `npm run dev`
2. Go to http://localhost:3000
3. Try logging in with:
   - Admin: admin@bsm-platform.com / admin123
   - Customer: customer@bsm-platform.com / customer123

## Troubleshooting
- **Connection Error**: Check if Supabase URL and keys are correct
- **Permission Error**: Ensure RLS policies are created
- **Auth Error**: Verify users exist in Supabase Auth
EOF

    print_status "Supabase setup instructions created: SUPABASE_SETUP_INSTRUCTIONS.md"
}

# Create quick start script
create_quick_start() {
    print_info "Creating quick start script..."
    
    cat > quick-start.sh << 'EOF'
#!/bin/bash

echo "🚀 BSM Platform - Quick Start"
echo "============================"
echo ""

# Check if .env.local exists and is configured
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    echo "Please run: cp env.example .env.local"
    echo "Then edit .env.local with your Supabase credentials"
    exit 1
fi

# Check if Supabase is configured
if grep -q "your_supabase_project_url" .env.local; then
    echo "❌ Supabase not configured"
    echo "Please update .env.local with your Supabase credentials"
    echo "See SUPABASE_SETUP_INSTRUCTIONS.md for details"
    exit 1
fi

echo "✅ Environment configured"
echo "🚀 Starting development server..."
echo ""
echo "Access the application at:"
echo "  Main App: http://localhost:3000"
echo "  Admin: admin@bsm-platform.com / admin123"
echo "  Customer: customer@bsm-platform.com / customer123"
echo ""

npm run dev
EOF

    chmod +x quick-start.sh
    print_status "Quick start script created: quick-start.sh"
}

# Create package.json scripts
update_package_scripts() {
    print_info "Updating package.json scripts..."
    
    # Check if package.json exists
    if [ -f "package.json" ]; then
        print_status "package.json found"
    else
        print_error "package.json not found"
        exit 1
    fi
}

# Main setup function
main() {
    echo "Starting BSM Platform setup..."
    echo ""
    
    # Check prerequisites
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Setup environment
    setup_environment
    
    # Check environment
    check_environment
    
    # Create instructions
    create_supabase_instructions
    create_quick_start
    
    # Update package scripts
    update_package_scripts
    
    echo ""
    echo "🎉 Setup Complete!"
    echo "================"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env.local with your Supabase credentials"
    echo "2. Follow SUPABASE_SETUP_INSTRUCTIONS.md"
    echo "3. Run: ./quick-start.sh"
    echo ""
    echo "Or manually:"
    echo "1. Setup Supabase project and database"
    echo "2. Run: npm run dev"
    echo "3. Access: http://localhost:3000"
    echo ""
    echo "Default Login:"
    echo "  Admin: admin@bsm-platform.com / admin123"
    echo "  Customer: customer@bsm-platform.com / customer123"
    echo ""
}

# Run main function
main "$@"

