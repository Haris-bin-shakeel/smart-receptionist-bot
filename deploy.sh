#!/bin/bash

echo "🚀 AI Receptionist Phase 2 Deployment Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm version: $(npm --version)"

# Backend Setup
echo ""
echo "🔧 Setting up Backend..."
cd backend

# Install backend dependencies
print_status "Installing backend dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp env.example .env
    print_warning "Please edit backend/.env with your configuration before continuing."
    echo "Required variables:"
    echo "  - MONGODB_URI"
    echo "  - JWT_SECRET"
    echo "  - EMAIL_USER"
    echo "  - EMAIL_PASS"
    echo "  - PAYFAST_MERCHANT_ID"
    echo "  - PAYFAST_MERCHANT_KEY"
    echo "  - PAYFAST_PASSPHRASE"
    echo ""
    read -p "Press Enter after configuring .env file..."
else
    print_status ".env file found"
fi

cd ..

# Frontend Setup
echo ""
echo "🎨 Setting up Frontend..."

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

# Check if .env exists in frontend
if [ ! -f .env ]; then
    print_warning "Creating frontend .env file..."
    echo "REACT_APP_API_URL=http://localhost:5000" > .env
    print_status "Frontend .env created"
else
    print_status "Frontend .env file found"
fi

# Database Setup Check
echo ""
echo "🗄️  Database Setup Check..."
print_warning "Please ensure MongoDB is running:"
echo "  - Local: mongod --dbpath /path/to/data/db"
echo "  - Cloud: Update MONGODB_URI in backend/.env"

# PayFast Setup Check
echo ""
echo "💳 PayFast Integration Check..."
print_warning "Please ensure PayFast is configured:"
echo "  - Register at https://www.payfast.co.za/"
echo "  - Get merchant credentials"
echo "  - Update backend/.env with PayFast details"

# Start Development Servers
echo ""
echo "🚀 Starting Development Servers..."

# Start backend in background
print_status "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
print_status "Starting frontend server..."
npm start &
FRONTEND_PID=$!

echo ""
print_status "Development servers started!"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    print_warning "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_status "Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait 