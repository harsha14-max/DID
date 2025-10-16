#!/bin/bash

# =====================================================
# credX Platform - Complete Setup Script
# =====================================================
# This script sets up the entire credX Platform environment

set -e

echo "🚀 Starting credX Platform Setup..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm $(npm --version) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env.local ]; then
        print_status "Creating .env.local from template..."
        cp env.example .env.local
        print_warning "Please update .env.local with your actual Supabase credentials"
    else
        print_success ".env.local already exists"
    fi
}

# Check Supabase connection
check_supabase() {
    print_status "Checking Supabase connection..."
    
    # This would normally check the connection, but for now we'll just verify the env file exists
    if [ -f .env.local ]; then
        print_success "Environment file found"
    else
        print_error "Environment file not found. Please run setup first."
        exit 1
    fi
}

# Build the project
build_project() {
    print_status "Building the project..."
    npm run build
    print_success "Project built successfully"
}

# Run type checking
type_check() {
    print_status "Running TypeScript type checking..."
    npm run type-check
    print_success "Type checking passed"
}

# Run linting
run_lint() {
    print_status "Running ESLint..."
    npm run lint
    print_success "Linting passed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm run test:ci
    print_success "Tests passed"
}

# Setup Git hooks (if git is available)
setup_git_hooks() {
    if command -v git &> /dev/null; then
        print_status "Setting up Git hooks..."
        
        # Create pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
npm run lint && npm run type-check && npm run test:ci
EOF
        chmod +x .git/hooks/pre-commit
        
        print_success "Git hooks configured"
    else
        print_warning "Git not found, skipping Git hooks setup"
    fi
}

# Create deployment scripts
create_deployment_scripts() {
    print_status "Creating deployment scripts..."
    
    # Vercel deployment script
    cat > deploy-vercel.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying to Vercel..."
vercel --prod
echo "✅ Deployment complete!"
EOF
    chmod +x deploy-vercel.sh
    
    # Docker deployment script
    cat > deploy-docker.sh << 'EOF'
#!/bin/bash
echo "🐳 Building Docker image..."
docker build -t credX-platform .
echo "🚀 Running Docker container..."
docker run -p 3000:3000 credX-platform
EOF
    chmod +x deploy-docker.sh
    
    print_success "Deployment scripts created"
}

# Main setup function
main() {
    echo ""
    print_status "Starting credX Platform setup..."
    echo ""
    
    # Run all setup steps
    check_node
    check_npm
    install_dependencies
    setup_environment
    check_supabase
    type_check
    run_lint
    run_tests
    build_project
    setup_git_hooks
    create_deployment_scripts
    
    echo ""
    print_success "🎉 credX Platform setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env.local with your Supabase credentials"
    echo "2. Run 'npm run dev' to start the development server"
    echo "3. Visit http://localhost:3003 to see your platform"
    echo ""
    echo "Deployment options:"
    echo "- Vercel: ./deploy-vercel.sh"
    echo "- Docker: ./deploy-docker.sh"
    echo ""
    echo "For more information, check the README.md file"
    echo ""
}

# Run main function
main "$@"
