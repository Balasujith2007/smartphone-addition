document.getElementById('predictionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get user data
    const userData = UserData.get();
    
    // Get form values
    const screenTime = parseFloat(document.getElementById('screenTime').value);
    const unlockFreq = parseInt(document.getElementById('unlockFreq').value);
    const socialMedia = parseFloat(document.getElementById('socialMedia').value);
    const gaming = parseFloat(document.getElementById('gaming').value);
    const nightUsage = parseFloat(document.getElementById('nightUsage').value);
    const avgSession = parseInt(document.getElementById('avgSession').value);
    
    // Validate inputs
    if (!screenTime || !unlockFreq || !socialMedia || !gaming || !nightUsage || !avgSession) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;
    
    // Show notification toast
    showToast('Analyzing your usage patterns...', 'info');
    
    try {
        // Calculate productivity hours (estimate based on other metrics)
        const productivityHours = Math.max(0, screenTime - socialMedia - gaming);
        
        // Send to backend API
        const response = await fetch('http://localhost:3000/api/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone || '+1234567890',
                screenTimeHours: screenTime,
                nightUsageHours: nightUsage,
                unlocksPerDay: unlockFreq,
                socialMediaHours: socialMedia,
                productivityHours: productivityHours
            })
        });

        const result = await response.json();
        
        if (result.success) {
            // Store results in sessionStorage
            const predictionData = {
                riskLevel: result.data.riskLevel,
                riskScore: result.data.riskScore,
                confidence: result.data.confidence,
                recommendation: result.data.recommendation,
                screenTime: screenTime,
                unlockFreq: unlockFreq,
                socialMedia: socialMedia,
                gaming: gaming,
                nightUsage: nightUsage,
                avgSession: avgSession,
                timestamp: new Date().toISOString()
            };
            
            sessionStorage.setItem('predictionResults', JSON.stringify(predictionData));
            
            // Show success notification
            const notificationMsg = result.data.notifications.sms && result.data.notifications.email
                ? '📧 Results sent to your email and mobile!'
                : result.data.notifications.email
                ? '📧 Results sent to your email!'
                : '✅ Prediction completed!';
            
            showToast(notificationMsg, 'success');
            
            // Redirect to results page after a short delay
            setTimeout(() => {
                window.location.href = 'result.html';
            }, 1500);
        } else {
            // Handle API error
            showToast(result.message || 'Prediction failed. Please try again.', 'error');
            
            // Reset button state
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Prediction error:', error);
        
        // Fallback to local calculation if backend is unavailable
        showToast('Using offline mode...', 'info');
        
        setTimeout(() => {
            const results = calculateAddictionRisk(
                screenTime, 
                unlockFreq, 
                socialMedia, 
                gaming, 
                nightUsage, 
                avgSession
            );
            
            sessionStorage.setItem('predictionResults', JSON.stringify(results));
            showToast('✅ Prediction completed (offline mode)', 'success');
            
            setTimeout(() => {
                window.location.href = 'result.html';
            }, 1500);
        }, 1000);
    }
});

function calculateAddictionRisk(screenTime, unlockFreq, socialMedia, gaming, nightUsage, avgSession) {
    let riskScore = 0;
    let factors = [];
    
    // Screen Time Analysis (Weight: 30%)
    if (screenTime > 8) {
        riskScore += 30;
        factors.push({
            name: 'Excessive Screen Time',
            impact: 'high',
            description: `Your daily screen time of ${screenTime} hours is significantly above the healthy limit of 4-5 hours.`,
            recommendation: 'Reduce screen time by 30 minutes each week until you reach 5 hours daily.'
        });
    } else if (screenTime > 5) {
        riskScore += 20;
        factors.push({
            name: 'High Screen Time',
            impact: 'medium',
            description: `Your screen time of ${screenTime} hours exceeds recommended limits.`,
            recommendation: 'Set daily app time limits and take regular breaks.'
        });
    } else {
        riskScore += 10;
        factors.push({
            name: 'Moderate Screen Time',
            impact: 'low',
            description: `Your screen time of ${screenTime} hours is within acceptable range.`,
            recommendation: 'Maintain current habits and stay mindful of usage.'
        });
    }
    
    // Unlock Frequency Analysis (Weight: 20%)
    if (unlockFreq > 150) {
        riskScore += 20;
        factors.push({
            name: 'Compulsive Checking',
            impact: 'high',
            description: `${unlockFreq} unlocks per day indicates habitual phone checking behavior.`,
            recommendation: 'Disable non-essential notifications and practice mindful phone usage.'
        });
    } else if (unlockFreq > 100) {
        riskScore += 15;
        factors.push({
            name: 'Frequent Unlocks',
            impact: 'medium',
            description: `${unlockFreq} unlocks suggests moderate dependency on phone.`,
            recommendation: 'Group notifications and check phone at scheduled times only.'
        });
    } else {
        riskScore += 5;
        factors.push({
            name: 'Normal Unlock Pattern',
            impact: 'low',
            description: `${unlockFreq} unlocks per day is within healthy range.`,
            recommendation: 'Continue current notification management practices.'
        });
    }
    
    // Social Media Analysis (Weight: 25%)
    if (socialMedia > 4) {
        riskScore += 25;
        factors.push({
            name: 'Social Media Addiction',
            impact: 'high',
            description: `${socialMedia} hours on social media is excessive and may affect mental health.`,
            recommendation: 'Limit social media to 1-2 hours daily using app timers.'
        });
    } else if (socialMedia > 2) {
        riskScore += 15;
        factors.push({
            name: 'High Social Media Usage',
            impact: 'medium',
            description: `${socialMedia} hours on social media exceeds healthy limits.`,
            recommendation: 'Reduce social media time by 30 minutes daily.'
        });
    } else {
        riskScore += 5;
        factors.push({
            name: 'Balanced Social Media',
            impact: 'low',
            description: `${socialMedia} hours on social media is reasonable.`,
            recommendation: 'Maintain current usage patterns.'
        });
    }
    
    // Gaming Analysis (Weight: 10%)
    if (gaming > 3) {
        riskScore += 10;
        factors.push({
            name: 'Excessive Gaming',
            impact: 'medium',
            description: `${gaming} hours of gaming may interfere with daily activities.`,
            recommendation: 'Limit gaming sessions to 1-2 hours with breaks.'
        });
    } else {
        riskScore += 5;
        factors.push({
            name: 'Moderate Gaming',
            impact: 'low',
            description: `${gaming} hours of gaming is within acceptable limits.`,
            recommendation: 'Continue balanced gaming habits.'
        });
    }
    
    // Night Usage Analysis (Weight: 15%)
    if (nightUsage > 2) {
        riskScore += 15;
        factors.push({
            name: 'Severe Sleep Disruption',
            impact: 'high',
            description: `${nightUsage} hours of night usage severely impacts sleep quality.`,
            recommendation: 'Stop phone usage 2 hours before bedtime. Use night mode.'
        });
    } else if (nightUsage > 1) {
        riskScore += 10;
        factors.push({
            name: 'Night Usage Concern',
            impact: 'medium',
            description: `${nightUsage} hours of night usage may affect sleep patterns.`,
            recommendation: 'Reduce night usage to under 30 minutes.'
        });
    } else {
        riskScore += 3;
        factors.push({
            name: 'Good Sleep Hygiene',
            impact: 'low',
            description: `${nightUsage} hours of night usage is minimal.`,
            recommendation: 'Maintain good sleep hygiene practices.'
        });
    }
    
    // Determine risk level
    let riskLevel, riskColor, confidence;
    if (riskScore >= 70) {
        riskLevel = 'High Risk';
        riskColor = 'high';
        confidence = Math.min(95, 85 + Math.floor(Math.random() * 10));
    } else if (riskScore >= 40) {
        riskLevel = 'Medium Risk';
        riskColor = 'medium';
        confidence = Math.min(92, 80 + Math.floor(Math.random() * 12));
    } else {
        riskLevel = 'Low Risk';
        riskColor = 'low';
        confidence = Math.min(90, 75 + Math.floor(Math.random() * 15));
    }
    
    return {
        screenTime,
        unlockFreq,
        socialMedia,
        gaming,
        nightUsage,
        avgSession,
        riskScore,
        riskLevel,
        riskColor,
        confidence,
        factors,
        timestamp: new Date().toISOString()
    };
}

// Real-time validation
document.querySelectorAll('#predictionForm input').forEach(input => {
    input.addEventListener('input', function() {
        const value = parseFloat(this.value);
        const max = parseFloat(this.max);
        
        if (value > max) {
            this.style.borderColor = '#ef4444';
        } else if (value > max * 0.7) {
            this.style.borderColor = '#f59e0b';
        } else {
            this.style.borderColor = '#10b981';
        }
    });
});

// Send notification to user's email and mobile
function sendNotificationToUser(results) {
    // Get user data
    const userData = UserData.get();
    const userEmail = userData.email;
    const userPhone = userData.phone;
    const userName = `${userData.firstName} ${userData.lastName}`;
    
    // Prepare notification message
    const message = formatNotificationMessage(results, userName);
    
    // In production, this would call a backend API
    // For now, we'll simulate the notification and show confirmation
    
    // Simulate API call to send email
    sendEmailNotification(userEmail, message, results);
    
    // Simulate API call to send SMS
    sendSMSNotification(userPhone, message, results);
    
    // Log notification for demo purposes
    console.log('📧 Email Notification Sent to:', userEmail);
    console.log('📱 SMS Notification Sent to:', userPhone);
    console.log('Message:', message);
    
    // Store notification in localStorage for history
    saveNotificationHistory(results, userEmail, userPhone);
}

// Format notification message
function formatNotificationMessage(results, userName) {
    const riskEmoji = results.riskColor === 'high' ? '🔴' : results.riskColor === 'medium' ? '🟡' : '🟢';
    
    return `
${riskEmoji} Smartphone Addiction Risk Assessment

Hello ${userName},

Your addiction risk analysis is complete:

📊 Risk Level: ${results.riskLevel}
🎯 Risk Score: ${results.riskScore}/100
✅ Confidence: ${results.confidence}%

📱 Usage Summary:
• Screen Time: ${results.screenTime} hours/day
• Unlocks: ${results.unlockFreq} times/day
• Social Media: ${results.socialMedia} hours/day
• Gaming: ${results.gaming} hours/day
• Night Usage: ${results.nightUsage} hours

${results.riskColor === 'high' ? '⚠️ URGENT: Your usage patterns indicate high addiction risk. Please review your detailed report and follow the recommendations.' : results.riskColor === 'medium' ? '⚡ ATTENTION: Your usage shows moderate risk. Consider implementing the suggested changes.' : '✨ GOOD NEWS: Your usage is within healthy limits. Keep up the good habits!'}

View your detailed report and personalized recommendations in the app.

Best regards,
Digital Wellness Team
    `.trim();
}

// Simulate sending email notification
function sendEmailNotification(email, message, results) {
    // In production, this would call your backend API endpoint
    // Example: fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ email, message, results }) })
    
    const emailData = {
        to: email,
        subject: `${results.riskLevel} - Your Smartphone Addiction Assessment`,
        body: message,
        html: formatEmailHTML(results),
        timestamp: new Date().toISOString()
    };
    
    // Store in localStorage to simulate sent emails
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    sentEmails.push(emailData);
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));
    
    return emailData;
}

// Simulate sending SMS notification
function sendSMSNotification(phone, message, results) {
    // In production, this would call your backend API endpoint with SMS service (Twilio, etc.)
    // Example: fetch('/api/send-sms', { method: 'POST', body: JSON.stringify({ phone, message }) })
    
    const smsMessage = `
${results.riskLevel === 'High Risk' ? '🔴' : results.riskLevel === 'Medium Risk' ? '🟡' : '🟢'} Digital Wellness Alert

Risk Level: ${results.riskLevel}
Score: ${results.riskScore}/100

Screen Time: ${results.screenTime}h/day
Unlocks: ${results.unlockFreq}/day

Check your email for detailed report and recommendations.
    `.trim();
    
    const smsData = {
        to: phone,
        message: smsMessage,
        timestamp: new Date().toISOString()
    };
    
    // Store in localStorage to simulate sent SMS
    const sentSMS = JSON.parse(localStorage.getItem('sentSMS') || '[]');
    sentSMS.push(smsData);
    localStorage.setItem('sentSMS', JSON.stringify(sentSMS));
    
    return smsData;
}

// Format email HTML
function formatEmailHTML(results) {
    const riskColor = results.riskColor === 'high' ? '#ef4444' : results.riskColor === 'medium' ? '#f59e0b' : '#10b981';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
        .risk-badge { display: inline-block; padding: 10px 20px; background: ${riskColor}; color: white; border-radius: 20px; font-weight: bold; margin: 20px 0; }
        .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid ${riskColor}; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 30px; background: ${riskColor}; color: white; text-decoration: none; border-radius: 8px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 Digital Wellness Report</h1>
            <p>Your Smartphone Addiction Risk Assessment</p>
        </div>
        <div class="content">
            <div class="risk-badge">${results.riskLevel}</div>
            <h2>Assessment Results</h2>
            <div class="metric">
                <strong>Risk Score:</strong> ${results.riskScore}/100 (${results.confidence}% confidence)
            </div>
            <div class="metric">
                <strong>Screen Time:</strong> ${results.screenTime} hours/day
            </div>
            <div class="metric">
                <strong>Daily Unlocks:</strong> ${results.unlockFreq} times
            </div>
            <div class="metric">
                <strong>Social Media:</strong> ${results.socialMedia} hours/day
            </div>
            <div class="metric">
                <strong>Gaming:</strong> ${results.gaming} hours/day
            </div>
            <div class="metric">
                <strong>Night Usage:</strong> ${results.nightUsage} hours
            </div>
            <h3>Key Recommendations:</h3>
            <ul>
                ${results.factors.slice(0, 3).map(f => `<li>${f.recommendation}</li>`).join('')}
            </ul>
            <a href="http://localhost:3000/result.html" class="btn">View Detailed Report</a>
        </div>
        <div class="footer">
            <p>This is an automated message from Digital Wellness Dashboard</p>
            <p>© 2024 Digital Wellness. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
}

// Save notification history
function saveNotificationHistory(results, email, phone) {
    const history = JSON.parse(localStorage.getItem('notificationHistory') || '[]');
    
    history.push({
        timestamp: new Date().toISOString(),
        riskLevel: results.riskLevel,
        riskScore: results.riskScore,
        email: email,
        phone: phone,
        sent: true
    });
    
    // Keep only last 50 notifications
    if (history.length > 50) {
        history.shift();
    }
    
    localStorage.setItem('notificationHistory', JSON.stringify(history));
}
