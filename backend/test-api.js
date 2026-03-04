/**
 * API Testing Script
 * Run this to test your backend endpoints
 * Usage: node backend/test-api.js
 */

const testPrediction = async () => {
    const testData = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        phone: "+1234567890",
        screenTimeHours: 8.5,
        nightUsageHours: 3.2,
        unlocksPerDay: 150,
        socialMediaHours: 5.0,
        productivityHours: 1.5
    };

    try {
        console.log('🧪 Testing Prediction API...\n');
        console.log('Request Data:', JSON.stringify(testData, null, 2));
        
        const response = await fetch('http://localhost:3000/api/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        console.log('\n✅ Response Status:', response.status);
        console.log('📊 Response Data:', JSON.stringify(result, null, 2));

        if (result.success) {
            console.log('\n🎉 Test Passed!');
            console.log(`Risk Level: ${result.data.riskLevel}`);
            console.log(`Risk Score: ${result.data.riskScore}/100`);
            console.log(`Confidence: ${result.data.confidence}%`);
            console.log(`SMS Sent: ${result.data.notifications.sms ? '✅' : '❌'}`);
            console.log(`Email Sent: ${result.data.notifications.email ? '✅' : '❌'}`);
        } else {
            console.log('\n❌ Test Failed:', result.message);
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('\n💡 Make sure the server is running: npm start');
    }
};

const testHealth = async () => {
    try {
        console.log('🏥 Testing Health Check...\n');
        
        const response = await fetch('http://localhost:3000/api/health');
        const result = await response.json();
        
        console.log('Response:', JSON.stringify(result, null, 2));
        
        if (result.success) {
            console.log('\n✅ Server is healthy!');
        }
    } catch (error) {
        console.error('\n❌ Server is not responding');
        console.log('💡 Start the server: npm start');
    }
};

// Run tests
(async () => {
    console.log('═══════════════════════════════════════');
    console.log('  Smartphone Addiction API Test Suite');
    console.log('═══════════════════════════════════════\n');
    
    await testHealth();
    console.log('\n───────────────────────────────────────\n');
    await testPrediction();
    
    console.log('\n═══════════════════════════════════════');
})();
