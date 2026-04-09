// Weekly Usage Trend Chart
const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
const weeklyChart = new Chart(weeklyCtx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Screen Time (hours)',
            data: [4.5, 5.2, 6.1, 5.8, 5.5, 7.2, 6.8],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#ef4444',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            borderWidth: 3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 13,
                        family: 'Inter',
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                padding: 12,
                titleFont: {
                    size: 14,
                    family: 'Inter',
                    weight: '600'
                },
                bodyFont: {
                    size: 13,
                    family: 'Inter'
                },
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 12,
                        family: 'Inter'
                    },
                    color: '#991b1b',
                    callback: function(value) {
                        return value + 'h';
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 12,
                        family: 'Inter',
                        weight: '500'
                    },
                    color: '#666666'
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            }
        }
    }
});

// App Category Usage Pie Chart
const categoryCtx = document.getElementById('categoryChart').getContext('2d');
const categoryChart = new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
        labels: ['Social Media', 'Gaming', 'Productivity', 'Entertainment', 'Others'],
        datasets: [{
            data: [35, 20, 15, 20, 10],
            backgroundColor: [
                '#ef4444',
                '#dc2626',
                '#f87171',
                '#fca5a5',
                '#f59e0b'
            ],
            borderWidth: 4,
            borderColor: '#fff',
            hoverOffset: 8
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 13,
                        family: 'Inter',
                        weight: '500'
                    },
                    color: '#7f1d1d'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: 12,
                titleFont: {
                    size: 14,
                    family: 'Inter',
                    weight: '600'
                },
                bodyFont: {
                    size: 13,
                    family: 'Inter'
                },
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.parsed + '%';
                    }
                }
            }
        },
        cutout: '65%'
    }
});


// Toggle Notifications
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('show');
}

// Close notifications when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationDropdown');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (dropdown && !dropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Mark all as read
const markReadBtn = document.querySelector('.mark-read-btn');
if (markReadBtn) {
    markReadBtn.addEventListener('click', function() {
        document.querySelectorAll('.notification-item').forEach(item => {
            item.classList.remove('unread');
        });
        const badge = document.querySelector('.badge');
        if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
    });
}

// Render Dashboard Goals
function renderDashboardGoals() {
    const container = document.getElementById('dashboardGoalsList');
    if (!container) return;
    
    let goals = JSON.parse(localStorage.getItem('userGoals'));
    if (!goals || Object.keys(goals).length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary); font-size:14px;">No goals set yet. Go to your <a href="profile.html" style="color:var(--primary-color);">Profile</a> to set goals.</p>';
        return;
    }
    
    let html = '';
    const icons = { screen_time: '✅', night_usage: '⏰', unlocks: '🔓', app_limit: '📱' };
    const risks = { screen_time: 'low', night_usage: 'medium', unlocks: 'high', app_limit: 'low' };
    const currents = { screen_time: 5.7, night_usage: 1.4, unlocks: 127, app_limit: 2 }; // Mock dashboard current values for demo (5h 42m, etc.)
    
    for (const [key, goal] of Object.entries(goals)) {
        const icon = icons[key] || '🎯';
        const risk = risks[key] || 'low';
        const current = currents[key] || Number(goal.target) * 0.8; // mock 80%
        let percentage = (current / goal.target) * 100;
        if (percentage > 100) percentage = 100;
        
        // Color coding for progress bar on dashboard
        let colorClass = percentage > 90 ? 'risk-high' : (percentage > 70 ? 'risk-medium' : 'risk-low');
        
        let targetText = key === 'unlocks' || key === 'night_usage' ? `< ${goal.target} ${goal.unit}` : `${goal.target} ${goal.unit}`;
        
        html += `
            <div class="goal-item" style="padding: 16px; background: var(--bg-surface, rgba(255,255,255,0.6)); border-radius: 12px; border: 1px solid rgba(14,165,233,0.2); margin-bottom: 8px;">
                <div class="goal-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span class="goal-icon ${colorClass}" style="padding:10px; font-size:18px; border-radius:8px;">${icon}</span>
                        <div>
                            <h4 style="font-size:15px; margin:0; font-weight:600; color:var(--text-primary);">${goal.label}</h4>
                            <span style="font-size:13px; color:var(--text-secondary);">Target: ${targetText}</span>
                        </div>
                    </div>
                </div>
                <div class="goal-progress" style="margin-top:8px;">
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
                        <span style="color:var(--text-secondary);">Current: <strong style="color:var(--text-primary);">${current} ${goal.unit==='hours'?'h':''}</strong></span>
                        <span style="font-weight:700; color:var(--primary);">${Math.round(percentage)}%</span>
                    </div>
                    <div class="progress-bar" style="height:8px; background:rgba(14,165,233,0.1); border-radius:10px; overflow:hidden;">
                        <div class="progress-fill ${colorClass}" style="height:100%; width: ${percentage}%; border-radius:10px; transition:width 1s ease;"></div>
                    </div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    renderDashboardGoals();
});
