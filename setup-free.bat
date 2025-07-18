@echo off
echo 🆓 AI Receptionist Phase 2 - FREE Setup Guide
echo ==============================================
echo This script will help you set up everything using FREE services
echo.

echo 🔍 Checking Prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please install npm
    pause
    exit /b 1
)

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git not found. Please install Git
    pause
    exit /b 1
)

echo ✅ All prerequisites found!

echo.
echo 📋 FREE SERVICES WE'LL USE:
echo   🗄️  Database: MongoDB Atlas (Free Tier)
echo   ☁️  Backend: Render.com (Free Tier)
echo   🌐 Frontend: Netlify (Free Tier)
echo   📧 Email: Gmail (Free)
echo   💳 Payments: PayFast Sandbox (Free Testing)
echo.

REM Step 1: Backend Setup
echo 🔧 STEP 1: Backend Setup
echo ========================

cd backend

REM Install dependencies
echo ✅ Installing backend dependencies...
call npm install

REM Create .env file
if not exist .env (
    echo ℹ️  Creating .env file...
    (
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Database - You'll update this with MongoDB Atlas connection string
        echo MONGODB_URI=mongodb://localhost:27017/ai-receptionist
        echo.
        echo # JWT Secret - Generate a random one
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo.
        echo # Frontend URL
        echo FRONTEND_URL=http://localhost:3000
        echo.
        echo # Backend URL
        echo BACKEND_URL=http://localhost:5000
        echo.
        echo # Email Configuration (Gmail)
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASS=your-app-password
        echo.
        echo # PayFast Configuration (Sandbox for testing)
        echo PAYFAST_MERCHANT_ID=10000100
        echo PAYFAST_MERCHANT_KEY=46f0cd694581a
        echo PAYFAST_PASSPHRASE=mysecretpassphrase
        echo.
        echo # OpenAI Configuration (for bot integration)
        echo OPENAI_API_KEY=your-openai-api-key
        echo.
        echo # Google Calendar API (for bot integration)
        echo GOOGLE_CALENDAR_CLIENT_ID=your-google-client-id
        echo GOOGLE_CALENDAR_CLIENT_SECRET=your-google-client-secret
        echo GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
        echo.
        echo # Telegram Bot Token (for bot integration)
        echo TELEGRAM_BOT_TOKEN=your-telegram-bot-token
    ) > .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

cd ..

REM Step 2: Frontend Setup
echo.
echo 🎨 STEP 2: Frontend Setup
echo =========================

REM Install dependencies
echo ✅ Installing frontend dependencies...
call npm install

REM Create .env file for frontend
if not exist .env (
    echo ℹ️  Creating frontend .env file...
    echo REACT_APP_API_URL=http://localhost:5000 > .env
    echo ✅ Frontend .env created
) else (
    echo ✅ Frontend .env file found
)

REM Step 3: Database Setup Instructions
echo.
echo 🗄️  STEP 3: Database Setup (MongoDB Atlas)
echo ===========================================
echo ℹ️  Follow these steps to set up FREE MongoDB Atlas:
echo.
echo 1. Go to https://www.mongodb.com/atlas
echo 2. Click 'Try Free' and create account
echo 3. Choose 'FREE' tier (M0)
echo 4. Select any cloud provider
echo 5. Choose region closest to Pakistan
echo 6. Click 'Create Cluster'
echo.
echo 7. Once cluster is ready, click 'Connect'
echo 8. Choose 'Connect your application'
echo 9. Copy the connection string
echo 10. Replace ^<password^> with your database password
echo 11. Update MONGODB_URI in backend/.env
echo.

REM Step 4: Email Setup Instructions
echo.
echo 📧 STEP 4: Email Setup (Gmail)
echo ==============================
echo ℹ️  Set up Gmail for sending emails:
echo.
echo 1. Go to your Google Account settings
echo 2. Enable 2-Factor Authentication
echo 3. Generate an App Password:
echo    - Go to Security ^> 2-Step Verification
echo    - Click 'App passwords'
echo    - Generate password for 'Mail'
echo 4. Update EMAIL_USER and EMAIL_PASS in backend/.env
echo.

REM Step 5: PayFast Setup Instructions
echo.
echo 💳 STEP 5: PayFast Setup (Sandbox Testing)
echo ==========================================
echo ℹ️  Set up PayFast for testing (FREE):
echo.
echo 1. Go to https://www.payfast.co.za/
echo 2. Click 'Register' and create account
echo 3. For testing, use these sandbox credentials:
echo    - Merchant ID: 10000100
echo    - Merchant Key: 46f0cd694581a
echo    - Passphrase: mysecretpassphrase
echo 4. Update PayFast credentials in backend/.env
echo.

REM Step 6: Deployment Instructions
echo.
echo 🚀 STEP 6: Free Deployment Options
echo ==================================
echo ℹ️  Deploy your app for FREE:
echo.
echo 🌐 FRONTEND (Netlify - FREE):
echo 1. Go to https://netlify.com
echo 2. Sign up with GitHub
echo 3. Connect your repository
echo 4. Build command: npm run build
echo 5. Publish directory: build
echo.
echo ☁️  BACKEND (Render.com - FREE):
echo 1. Go to https://render.com
echo 2. Sign up with GitHub
echo 3. Create new Web Service
echo 4. Connect your repository
echo 5. Build command: npm install
echo 6. Start command: npm start
echo 7. Add environment variables from .env
echo.

REM Step 7: Final Instructions
echo.
echo 🎯 STEP 7: Next Steps
echo =====================
echo ℹ️  After setup, you need to:
echo.
echo 1. Update backend/.env with your real credentials
echo 2. Test the application locally
echo 3. Deploy to free hosting services
echo 4. Update your existing bot to use the new API
echo 5. Start marketing to Pakistani businesses
echo.

echo ✅ Setup script completed!
echo.
echo ℹ️  To start development servers, run:
echo npm run dev
echo.
echo ℹ️  Or use the deployment script:
echo ./deploy.sh
echo.
pause 