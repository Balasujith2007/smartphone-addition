#!/usr/bin/env node

/**
 * Interactive Notification Setup
 * Helps configure email and SMS notifications
 * 
 * Usage: node setup-notifications.js
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  NOTIFICATION SETUP WIZARD');
console.log('═══════════════════════════════════════════════════════════\n');

async function setupEmail() {
    console.log('📧 Email Notification Setup');
    console.log('─────────────────────────────────────────────────────────\n');
    
    const setupEmail = await question('Do you want to configure email notifications? (y/n): ');
    
    if (setupEmail.toLowerCase() !== 'y') {
        console.log('⏭️  Skipping email setup\n');
        return null;
    }
    
    console.log('\nChoose email provider:');
    console.log('1. Gmail (recommended - free)');
    console.log('2. Outlook/Hotmail');
    console.log('3. Yahoo Mail');
    console.log('4. Custom SMTP');
    
    const provider = await question('\nSelect option (1-4): ');
    
    let config = {};
    
    switch(provider) {
        case '1':
            config.EMAIL_HOST = 'smtp.gmail.com';
            config.EMAIL_PORT = '587';
            config.EMAIL_USER = await question('Gmail address: ');
            console.log('\n💡 You need a Gmail App Password (not your regular password)');
            console.log('   Get it from: https://myaccount.google.com/apppasswords\n');
            config.EMAIL_PASSWORD = await question('Gmail App Password (16 characters): ');
            config.EMAIL_FROM = config.EMAIL_USER;
            break;
            
        case '2':
            config.EMAIL_HOST = 'smtp-mail.outlook.com';
            config.EMAIL_PORT = '587';
            config.EMAIL_USER = await question('Outlook email: ');
            config.EMAIL_PASSWORD = await question('Outlook password: ');
            config.EMAIL_FROM = config.EMAIL_USER;
            break;
            
        case '3':
            config.EMAIL_HOST = 'smtp.mail.yahoo.com';
            config.EMAIL_PORT = '587';
            config.EMAIL_USER = await question('Yahoo email: ');
            console.log('\n💡 You need a Yahoo App Password');
            console.log('   Get it from: https://login.yahoo.com/account/security\n');
            config.EMAIL_PASSWORD = await question('Yahoo App Password: ');
            config.EMAIL_FROM = config.EMAIL_USER;
            break;
            
        case '4':
            config.EMAIL_HOST = await question('SMTP Host: ');
            config.EMAIL_PORT = await question('SMTP Port (usually 587): ');
            config.EMAIL_USER = await question('SMTP Username: ');
            config.EMAIL_PASSWORD = await question('SMTP Password: ');
            config.EMAIL_FROM = await question('From Email Address: ');
            break;
            
        default:
            console.log('❌ Invalid option\n');
            return null;
    }
    
    console.log('\n✅ Email configuration saved\n');
    return config;
}

async function setupSMS() {
    console.log('📱 SMS Notification Setup (Twilio)');
    console.log('─────────────────────────────────────────────────────────\n');
    
    const setupSMS = await question('Do you want to configure SMS notifications? (y/n): ');
    
    if (setupSMS.toLowerCase() !== 'y') {
        console.log('⏭️  Skipping SMS setup\n');
        return null;
    }
    
    console.log('\n💡 You need a Twilio account (free trial available)');
    console.log('   Sign up at: https://www.twilio.com/try-twilio');
    console.log('   Trial gives $15 credit (~500 SMS)\n');
    
    const hasTwilio = await question('Do you have a Twilio account? (y/n): ');
    
    if (hasTwilio.toLowerCase() !== 'y') {
        console.log('\n⏭️  Please create a Twilio account first, then run this script again\n');
        return null;
    }
    
    const config = {};
    
    console.log('\nGet your credentials from: https://console.twilio.com/\n');
    config.TWILIO_ACCOUNT_SID = await question('Twilio Account SID: ');
    config.TWILIO_AUTH_TOKEN = await question('Twilio Auth Token: ');
    config.TWILIO_PHONE_NUMBER = await question('Twilio Phone Number (e.g., +1234567890): ');
    
    console.log('\n✅ SMS configuration saved\n');
    return config;
}

async function updateEnvFile(emailConfig, smsConfig) {
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    // Read existing .env or create from .env.example
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    } else if (fs.existsSync(path.join(__dirname, '.env.example'))) {
        envContent = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
    } else {
        envContent = `# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

`;
    }
    
    // Update or add email config
    if (emailConfig) {
        for (const [key, value] of Object.entries(emailConfig)) {
            const regex = new RegExp(`^#?\\s*${key}=.*$`, 'm');
            if (envContent.match(regex)) {
                envContent = envContent.replace(regex, `${key}=${value}`);
            } else {
                envContent += `\n${key}=${value}`;
            }
        }
    }
    
    // Update or add SMS config
    if (smsConfig) {
        for (const [key, value] of Object.entries(smsConfig)) {
            const regex = new RegExp(`^#?\\s*${key}=.*$`, 'm');
            if (envContent.match(regex)) {
                envContent = envContent.replace(regex, `${key}=${value}`);
            } else {
                envContent += `\n${key}=${value}`;
            }
        }
    }
    
    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully\n');
}

async function main() {
    try {
        const emailConfig = await setupEmail();
        const smsConfig = await setupSMS();
        
        if (emailConfig || smsConfig) {
            await updateEnvFile(emailConfig, smsConfig);
            
            console.log('═══════════════════════════════════════════════════════════');
            console.log('  SETUP COMPLETE!');
            console.log('═══════════════════════════════════════════════════════════\n');
            
            if (emailConfig) {
                console.log('✅ Email notifications configured');
            }
            if (smsConfig) {
                console.log('✅ SMS notifications configured');
            }
            
            console.log('\nNext steps:');
            console.log('1. Test notifications: node test-notifications.js');
            console.log('2. Start server: npm start');
            console.log('3. Complete a prediction to test\n');
        } else {
            console.log('⚠️  No notifications configured');
            console.log('   App will run in offline mode\n');
        }
        
    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
    } finally {
        rl.close();
    }
}

main();
