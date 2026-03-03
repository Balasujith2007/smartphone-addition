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
