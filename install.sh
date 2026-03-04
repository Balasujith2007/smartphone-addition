#!/bin/bash

# Smartphone Addiction Backend - Installation Script
# This script helps you set up the backend quickly

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Smartphone Addiction Prediction - Backend Setup      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed!"
    echo "📥 Please install PostgreSQL:"
    echo "   - Windows: https://www.postgresql.org/download/windows/"
    echo "   - Mac: brew install postgresql"
    echo "   - Linux: sudo apt-get install postgresql"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ PostgreSQL is installed"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your credentials:"
    echo "   - Database credentials"
    echo "   - Twilio API keys"
    echo "   - Email configuration"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Create logs directory
if [ ! -d "logs" ]; then
    mkdir logs
    echo "✅ Created logs directory"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  Installation Complete!                                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Setup PostgreSQL database:"
echo "   psql -U postgres"
echo "   CREATE DATABASE smartphone_addiction;"
echo ""
echo "2. Configure environment variables:"
echo "   Edit .env file with your credentials"
echo ""
echo "3. Get Twilio credentials:"
echo "   Sign up at https://www.twilio.com/try-twilio"
echo ""
echo "4. Configure email service:"
echo "   - Gmail: Generate app password"
echo "   - SendGrid: Get API key"
echo ""
echo "5. Start the server:"
echo "   npm start"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Full documentation"
echo "   - SETUP_GUIDE.md - Quick setup guide"
echo "   - API_DOCUMENTATION.md - API reference"
echo "   - DEPLOYMENT.md - Deployment guide"
echo ""
echo "🚀 Happy coding!"
