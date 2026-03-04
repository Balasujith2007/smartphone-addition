@echo off
echo ╔════════════════════════════════════════════════════════╗
echo ║  Smartphone Addiction Prediction - Backend Setup      ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo 📥 Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
echo ✅ npm is installed
npm --version
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  PostgreSQL is not installed!
    echo 📥 Please install PostgreSQL from:
    echo    https://www.postgresql.org/download/windows/
    echo.
    set /p continue="Continue anyway? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
) else (
    echo ✅ PostgreSQL is installed
)

echo.
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file with your credentials:
    echo    - Database credentials
    echo    - Twilio API keys
    echo    - Email configuration
    echo.
) else (
    echo ✅ .env file already exists
)

REM Create logs directory
if not exist logs (
    mkdir logs
    echo ✅ Created logs directory
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  Installation Complete!                                ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📋 Next Steps:
echo.
echo 1. Setup PostgreSQL database:
echo    Open pgAdmin or psql and run:
echo    CREATE DATABASE smartphone_addiction;
echo.
echo 2. Configure environment variables:
echo    Edit .env file with your credentials
echo.
echo 3. Get Twilio credentials:
echo    Sign up at https://www.twilio.com/try-twilio
echo.
echo 4. Configure email service:
echo    - Gmail: Generate app password
echo    - SendGrid: Get API key
echo.
echo 5. Start the server:
echo    npm start
echo.
echo 📚 Documentation:
echo    - README.md - Full documentation
echo    - SETUP_GUIDE.md - Quick setup guide
echo    - API_DOCUMENTATION.md - API reference
echo    - DEPLOYMENT.md - Deployment guide
echo.
echo 🚀 Happy coding!
echo.
pause
