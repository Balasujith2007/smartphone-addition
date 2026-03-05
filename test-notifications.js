#!/usr/bin/env node

/**
 * Test Notification Services
 * Run this script to test if email and SMS notifications are configured correctly
 * 
 * Usage: node test-notifications.js
 */

require('dotenv').config();
const emailService = require('./backend/services/emailService');
const smsService = require('./backend/services/smsService');

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  NOTIFICATION SERVICES TEST');
console.log('═══════════════════════════════════════════════════════════\n');

// Test data
const testData = {
    userData: {
        firstName: 'Test',
        lastName: 'User',
        email: process.env.TEST_EMAIL || 'test@example.com',
        phone: process.env.TEST_PHONE || '+1234567890'
    },
    predictionData: {
        riskLevel: 'Medium',
        riskScore: 65,
        confidence: 87,
        recommendation: 'Consider reducing screen time by 1-2 hours daily and limiting social media usage.'
    }
};

async function testEmailService() {
    console.log('📧 Testing Email Service...');
    console.log('─────────────────────────────────────────────────────────');
    
    // Check configuration
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('❌ Email service NOT configured');
        console.log('   Missing: EMAIL_HOST, EMAIL_USER, or EMAIL_PASSWORD in .env');
        console.log('   See NOTIFICATION_SETUP.md for setup instructions\n');
        return false;
    }
    
    console.log('✅ Email credentials found in .env');
    console.log(`   Host: ${process.env.EMAIL_HOST}`);
    console.log(`   User: ${process.env.EMAIL_USER}`);
    console.log(`   From: ${process.env.EMAIL_FROM || process.env.EMAIL_USER}`);
    
    try {
        console.log(`\n   Sending test email to: ${testData.userData.email}...`);
        
        const result = await emailService.sendPredictionEmail(
            testData.userData.email,
            testData.userData,
            testData.predictionData
        );
        
        if (result.success) {
            console.log('✅ Email sent successfully!');
            console.log(`   Message ID: ${result.messageId}`);
            console.log(`   Check inbox: ${testData.userData.email}\n`);
            return true;
        } else {
            console.log('❌ Email failed to send');
            console.log(`   Status: ${result.status}`);
            console.log(`   Error: ${result.error}\n`);
            return false;
        }
    } catch (error) {
        console.log('❌ Email test failed');
        console.log(`   Error: ${error.message}\n`);
        return false;
    }
}

async function testSMSService() {
    console.log('📱 Testing SMS Service...');
    console.log('─────────────────────────────────────────────────────────');
    
    // Check configuration
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        console.log('❌ SMS service NOT configured');
        console.log('   Missing: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER in .env');
        console.log('   See NOTIFICATION_SETUP.md for setup instructions\n');
        return false;
    }
    
    console.log('✅ Twilio credentials found in .env');
    console.log(`   Account SID: ${process.env.TWILIO_ACCOUNT_SID.substring(0, 10)}...`);
    console.log(`   From Number: ${process.env.TWILIO_PHONE_NUMBER}`);
    
    try {
        console.log(`\n   Sending test SMS to: ${testData.userData.phone}...`);
        
        const result = await smsService.sendPredictionSMS(
            testData.userData.phone,
            testData.predictionData
        );
        
        if (result.success) {
            console.log('✅ SMS sent successfully!');
            console.log(`   SID: ${result.sid}`);
            console.log(`   Status: ${result.status}`);
            console.log(`   Check phone: ${testData.userData.phone}\n`);
            return true;
        } else {
            console.log('❌ SMS failed to send');
            console.log(`   Status: ${result.status}`);
            if (result.error) {
                console.log(`   Error: ${result.error}`);
                if (result.error.includes('unverified')) {
                    console.log('\n   💡 TIP: For Twilio trial accounts, you must verify the recipient phone number');
                    console.log('      Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
                }
            }
            console.log('');
            return false;
        }
    } catch (error) {
        console.log('❌ SMS test failed');
        console.log(`   Error: ${error.message}\n`);
        return false;
    }
}

async function runTests() {
    console.log('Configuration:');
    console.log(`  Test Email: ${testData.userData.email}`);
    console.log(`  Test Phone: ${testData.userData.phone}`);
    console.log('\n💡 TIP: Set TEST_EMAIL and TEST_PHONE in .env to use your own contact info\n');
    
    const emailResult = await testEmailService();
    const smsResult = await testSMSService();
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  TEST SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  Email Service: ${emailResult ? '✅ WORKING' : '❌ NOT CONFIGURED'}`);
    console.log(`  SMS Service:   ${smsResult ? '✅ WORKING' : '❌ NOT CONFIGURED'}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    if (!emailResult && !smsResult) {
        console.log('⚠️  No notification services configured');
        console.log('   App will run in OFFLINE MODE (no notifications sent)');
        console.log('   See NOTIFICATION_SETUP.md for setup instructions\n');
    } else if (!emailResult) {
        console.log('⚠️  Email not configured (SMS only)');
        console.log('   Users will receive SMS but no email notifications\n');
    } else if (!smsResult) {
        console.log('✅ Email configured (recommended for testing)');
        console.log('   Users will receive email notifications\n');
        console.log('💡 TIP: Add Twilio credentials to enable SMS notifications\n');
    } else {
        console.log('✅ All notification services working!');
        console.log('   Users will receive both email and SMS notifications\n');
    }
}

// Run tests
runTests().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
});
