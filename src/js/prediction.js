document.getElementById('predictionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const screenTime = parseFloat(document.getElementById('screenTime').value);
    const unlockFreq = parseInt(document.getElementById('unlockFreq').value);
    const socialMedia = parseFloat(document.getElementById('socialMedia').value);
    const gaming = parseFloat(document.getElementById('gaming').value);
    const nightUsage = parseFloat(document.getElementById('nightUsage').value);
    const avgSession = parseInt(document.getElementById('avgSession').value);
    
    // Validate inputs
    if (!screenTime || !unlockFreq || !socialMedia || !gaming || !nightUsage || !avgSession) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;
    
    // Simulate ML prediction with realistic algorithm
    setTimeout(() => {
        const results = calculateAddictionRisk(
            screenTime, 
            unlockFreq, 
            socialMedia, 
            gaming, 
            nightUsage, 
            avgSession
        );
        
        // Store results in sessionStorage
        sessionStorage.setItem('predictionResults', JSON.stringify(results));
        
        // Redirect to results page
        window.location.href = 'result.html';
    }, 2000);
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
