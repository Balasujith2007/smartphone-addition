document.getElementById('predictionForm').addEventListener('submit', async function (e) {
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

    showToast('Analyzing your usage patterns and sending to server...', 'info');

    try {
        // Calculate productivity hours (estimate based on other metrics)
        const productivityHours = Math.max(0, screenTime - socialMedia - gaming);

        // Define API URL strictly
        const apiUrl = typeof API_CONFIG !== 'undefined'
            ? API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.PREDICTIONS
            : 'http://localhost:3000/api/predictions';

        // Ensure we send valid phone and email (fallback to prevent backend crash)
        // Phone must match pattern: ^\+?[1-9]\d{1,14}$
        let validPhone = userData.phone || '';

        // Clean and validate phone number
        validPhone = validPhone.replace(/[^\d+]/g, ''); // Remove non-digits except +

        // Ensure phone starts with + if it doesn't have it
        if (validPhone && !validPhone.startsWith('+')) {
            validPhone = '+' + validPhone;
        }

        // Validate phone format
        if (!validPhone || !validPhone.match(/^\+[1-9]\d{1,14}$/)) {
            validPhone = '+10000000000'; // Default valid phone
        }

        // Ensure firstName is at least 2 characters
        const validFirstName = (userData.firstName && userData.firstName.length >= 2)
            ? userData.firstName
            : 'User';

        // Ensure lastName is at least 2 characters  
        const validLastName = (userData.lastName && userData.lastName.length >= 2)
            ? userData.lastName
            : 'Name';

        // Ensure email is valid
        let validEmail = userData.email || '';
        // Basic pattern matching for email validation
        if (!validEmail || !validEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            validEmail = 'user@example.com'; // Default valid email
        }

        const payload = {
            firstName: validFirstName,
            lastName: validLastName,
            email: validEmail,
            phone: validPhone,
            screenTimeHours: screenTime,
            nightUsageHours: nightUsage,
            unlocksPerDay: unlockFreq,
            socialMediaHours: socialMedia,
            productivityHours: productivityHours
        };

        console.log('Sending prediction payload:', payload);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        console.log('Server response:', result);

        if (response.ok && result.success) {
            // Store results in sessionStorage for UI state
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
                timestamp: new Date().toISOString(),
                // Store actual notification states from DB
                notifications: result.data.notifications
            };

            sessionStorage.setItem('predictionResults', JSON.stringify(predictionData));

            // Show exact notification status based on backend result
            let notificationMsg = '✅ Prediction completed successfully!';

            if (result.data.notifications) {
                const { sms, email } = result.data.notifications;

                // Save to history if any notification was intended/sent
                const history = JSON.parse(localStorage.getItem('notificationHistory') || '[]');
                history.push({
                    riskLevel: result.data.riskLevel,
                    riskScore: result.data.riskScore,
                    timestamp: Date.now(),
                    email: validEmail,
                    phone: validPhone
                });
                localStorage.setItem('notificationHistory', JSON.stringify(history));

                const emails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
                emails.push({
                    to: validEmail,
                    subject: `Your Digital Wellness Assessment: ${result.data.riskLevel}`,
                    body: `Hi ${validFirstName},\n\nYour recent Digital Wellness assessment indicates a ${result.data.riskLevel} with a score of ${result.data.riskScore}/100.\n\nRecommendation:\n${result.data.recommendation}\n\nStay mindful of your screen time!`
                });
                localStorage.setItem('sentEmails', JSON.stringify(emails));

                const smsList = JSON.parse(localStorage.getItem('sentSMS') || '[]');
                smsList.push({
                    to: validPhone,
                    message: `Digital Wellness: Your risk level is ${result.data.riskLevel} (Score: ${result.data.riskScore}). ${result.data.recommendation}`,
                    timestamp: Date.now()
                });
                localStorage.setItem('sentSMS', JSON.stringify(smsList));

                if (sms && email) {
                    notificationMsg += ' 📧📱 Email and SMS sent!';
                } else if (email) {
                    notificationMsg += ' 📧 Email sent!';
                    showToast('⚠️ SMS not sent (Twilio not configured)', 'warning');
                } else if (sms) {
                    notificationMsg += ' 📱 SMS sent!';
                    showToast('⚠️ Email not sent (SMTP not configured)', 'warning');
                } else {
                    notificationMsg += ' ⚠️ Notifications not sent (services not configured)';
                    setTimeout(() => {
                        showToast('💡 See NOTIFICATION_SETUP.md to enable email/SMS', 'info');
                    }, 2000);
                }
            }

            showToast(notificationMsg, 'success');

            // Redirect to results page after a short delay
            setTimeout(() => {
                window.location.href = 'result.html';
            }, 1500);
        } else {
            // Handle validation / API error
            const errorMsg = result.message || 'Prediction failed. Please check your inputs.';
            console.error('Server error details:', result);

            // Show specific validation errors if available
            if (result.errors && result.errors.length > 0) {
                const errorList = result.errors.map(err => `${err.field}: ${err.message}`).join('\n');
                showToast(`Validation Error:\n${errorList}`, 'error');
                console.error('Validation errors:', result.errors);
            } else {
                showToast(errorMsg, 'error');
            }

            // Reset button state
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    } catch (error) {
        // Critical server failure / unreachable
        console.error('CRITICAL API ERROR:', error);

        // Check if server is running
        showToast('❌ Cannot reach backend server. Make sure server is running on port 3000.', 'error');

        // Show helpful message
        setTimeout(() => {
            showToast('💡 Run "npm start" in terminal to start the server', 'info');
        }, 2000);

        // Reset button state
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Real-time validation
document.querySelectorAll('#predictionForm input').forEach(input => {
    input.addEventListener('input', function () {
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
