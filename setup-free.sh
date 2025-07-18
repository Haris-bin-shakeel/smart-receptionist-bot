#!/bin/bash

echo "🆓 AI Receptionist Phase 2 - FREE Setup Guide"
echo "=============================================="
echo "This script will help you set up everything using FREE services"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
echo "🔍 Checking Prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js from https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm not found. Please install npm"
    exit 1
fi

if ! command -v git &> /dev/null; then
    print_error "Git not found. Please install Git"
    exit 1
fi

print_status "All prerequisites found!"

echo ""
echo "📋 FREE SERVICES WE'LL USE:"
echo "  🗄️  Database: MongoDB Atlas (Free Tier)"
echo "  ☁️  Backend: Render.com (Free Tier)"
echo "  🌐 Frontend: Netlify (Free Tier)"
echo "  📧 Email: Gmail (Free)"
echo "  💳 Payments: PayFast Sandbox (Free Testing)"
echo ""

# Step 1: Backend Setup
echo "🔧 STEP 1: Backend Setup"
echo "========================"

cd backend

# Install dependencies
print_status "Installing backend dependencies..."
npm install

# Create .env file
if [ ! -f .env ]; then
    print_info "Creating .env file..."
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - You'll update this with MongoDB Atlas connection string
MONGODB_URI=mongodb://localhost:27017/ai-receptionist

# JWT Secret - Generate a random one
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Backend URL
BACKEND_URL=http://localhost:5000

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# PayFast Configuration (Sandbox for testing)
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=mysecretpassphrase

# OpenAI Configuration (for bot integration)
OPENAI_API_KEY=your-openai-api-key

# Google Calendar API (for bot integration)
GOOGLE_CALENDAR_CLIENT_ID=your-google-client-id
GOOGLE_CALENDAR_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Telegram Bot Token (for bot integration)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
EOF
    print_status ".env file created"
else
    print_status ".env file already exists"
fi

cd ..

# Step 2: Frontend Setup
echo ""
echo "🎨 STEP 2: Frontend Setup"
echo "========================="

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

# Create .env file for frontend
if [ ! -f .env ]; then
    print_info "Creating frontend .env file..."
    echo "REACT_APP_API_URL=http://localhost:5000" > .env
    print_status "Frontend .env created"
else
    print_status "Frontend .env file found"
fi

# Step 3: Database Setup Instructions
echo ""
echo "🗄️  STEP 3: Database Setup (MongoDB Atlas)"
echo "==========================================="
print_info "Follow these steps to set up FREE MongoDB Atlas:"
echo ""
echo "1. Go to https://www.mongodb.com/atlas"
echo "2. Click 'Try Free' and create account"
echo "3. Choose 'FREE' tier (M0)"
echo "4. Select any cloud provider"
echo "5. Choose region closest to Pakistan"
echo "6. Click 'Create Cluster'"
echo ""
echo "7. Once cluster is ready, click 'Connect'"
echo "8. Choose 'Connect your application'"
echo "9. Copy the connection string"
echo "10. Replace <password> with your database password"
echo "11. Update MONGODB_URI in backend/.env"
echo ""

# Step 4: Email Setup Instructions
echo ""
echo "📧 STEP 4: Email Setup (Gmail)"
echo "=============================="
print_info "Set up Gmail for sending emails:"
echo ""
echo "1. Go to your Google Account settings"
echo "2. Enable 2-Factor Authentication"
echo "3. Generate an App Password:"
echo "   - Go to Security > 2-Step Verification"
echo "   - Click 'App passwords'"
echo "   - Generate password for 'Mail'"
echo "4. Update EMAIL_USER and EMAIL_PASS in backend/.env"
echo ""

# Step 5: PayFast Setup Instructions
echo ""
echo "💳 STEP 5: PayFast Setup (Sandbox Testing)"
echo "=========================================="
print_info "Set up PayFast for testing (FREE):"
echo ""
echo "1. Go to https://www.payfast.co.za/"
echo "2. Click 'Register' and create account"
echo "3. For testing, use these sandbox credentials:"
echo "   - Merchant ID: 10000100"
echo "   - Merchant Key: 46f0cd694581a"
echo "   - Passphrase: mysecretpassphrase"
echo "4. Update PayFast credentials in backend/.env"
echo ""

# Step 6: Test Setup
echo ""
echo "🧪 STEP 6: Test Your Setup"
echo "=========================="
print_info "Let's test if everything is working:"

# Test backend
echo ""
print_status "Testing backend..."
cd backend
if npm run dev &> /dev/null & then
    BACKEND_PID=$!
    sleep 3
    if curl -s http://localhost:5000/api/health > /dev/null; then
        print_status "Backend is running!"
    else
        print_warning "Backend might not be running properly"
    fi
    kill $BACKEND_PID 2>/dev/null
else
    print_warning "Could not start backend for testing"
fi
cd ..

# Step 7: Deployment Instructions
echo ""
echo "🚀 STEP 7: Free Deployment Options"
echo "=================================="
print_info "Deploy your app for FREE:"
echo ""
echo "🌐 FRONTEND (Netlify - FREE):"
echo "1. Go to https://netlify.com"
echo "2. Sign up with GitHub"
echo "3. Connect your repository"
echo "4. Build command: npm run build"
echo "5. Publish directory: build"
echo ""
echo "☁️  BACKEND (Render.com - FREE):"
echo "1. Go to https://render.com"
echo "2. Sign up with GitHub"
echo "3. Create new Web Service"
echo "4. Connect your repository"
echo "5. Build command: npm install"
echo "6. Start command: npm start"
echo "7. Add environment variables from .env"
echo ""

# Step 8: Final Instructions
echo ""
echo "🎯 STEP 8: Next Steps"
echo "====================="
print_info "After setup, you need to:"
echo ""
echo "1. Update backend/.env with your real credentials"
echo "2. Test the application locally"
echo "3. Deploy to free hosting services"
echo "4. Update your existing bot to use the new API"
echo "5. Start marketing to Pakistani businesses"
echo ""

print_status "Setup script completed!"
echo ""
print_info "Run this command to start development servers:"
echo "npm run dev"
echo ""
print_info "Or use the deployment script:"
echo "./deploy.sh" 