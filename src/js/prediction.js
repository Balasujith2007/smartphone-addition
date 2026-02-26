document.getElementById('predictionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const screenTime = parseFloat(document.getElementById('screenTime').value);
    const unlockFreq = parseInt(document.getElementById('unlockFreq').value);
    const socialMedia = parseFloat(document.getElementById('socialMedia').value);
    const gaming = parseFloat(document.getElementById('gaming').value);
    const nightUsage = parseFloat(document.getElementById('nightUsage').value);
    const avgSession = parseInt(document.getElementById('avgSession').value);
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;
    
    // Simulate prediction (in real app, this would call ML model API)
    setTimeout(() => {
        // Store results in sessionStorage for result page
        const results = {
            screenTime,
            unlockFreq,
            socialMedia,
            gaming,
            nightUsage,
            avgSession,
            riskLevel: calculateRiskLevel(screenTime, unlockFreq, socialMedia, nightUsage),
            confidence: Math.floor(Math.random() * 15) + 85 // 85-100%
        };
        
        sessionStorage.setItem('predictionResults', JSON.stringify(results));
        
        // Redirect to results page
        window.location.href = 'result.html';
    }, 2000);
});

function calculateRiskLevel(screenTime, unlockFreq, socialMedia, nightUsage) {
    let score = 0;
    
    // Screen time scoring
    if (screenTime > 6) score += 30;
    else if (screenTime > 4) score += 20;
    else score += 10;
    
    // Unlock frequency scoring
    if (unlockFreq > 150) score += 25;
    else if (unlockFreq > 100) score += 15;
    else score += 5;
    
    // Social media scoring
    if (socialMedia > 3) score += 25;
    else if (socialMedia > 2) score += 15;
    else score += 5;
    
    // Night usage scoring
    if (nightUsage > 2) score += 20;
    else if (nightUsage > 1) score += 10;
    else score += 5;
    
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
}
