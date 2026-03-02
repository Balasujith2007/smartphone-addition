// Daily Screen Time Trend Chart
const dailyTrendCtx = document.getElementById('dailyTrendChart').getContext('2d');
const dailyTrendChart = new Chart(dailyTrendCtx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Screen Time (hours)',
            data: [5.2, 6.1, 5.8, 6.5, 5.9, 7.2, 6.8],
            borderColor: '#14b8a6',
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#14b8a6',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            borderWidth: 3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: {
            legend: {
                display: false
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
                max: 10,
                ticks: {
                    font: {
                        size: 12,
                        family: 'Inter'
                    },
                    color: '#6b7280',
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
                    color: '#6b7280'
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            }
        }
    }
});

// Hourly Usage Pattern Chart
const hourlyPatternCtx = document.getElementById('hourlyPatternChart').getContext('2d');
const hourlyPatternChart = new Chart(hourlyPatternCtx, {
    type: 'bar',
    data: {
        labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
        datasets: [{
            label: 'Usage (minutes)',
            data: [15, 5, 20, 45, 60, 55, 75, 90],
            backgroundColor: 'rgba(20, 184, 166, 0.8)',
            borderColor: '#14b8a6',
            borderWidth: 2,
            borderRadius: 8
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: {
            legend: {
                display: false
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
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return 'Usage: ' + context.parsed.y + ' min';
                    }
                }
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
                    color: '#6b7280',
                    callback: function(value) {
                        return value + 'm';
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
                    color: '#6b7280'
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            }
        }
    }
});

// Top Apps Chart
const topAppsCtx = document.getElementById('topAppsChart').getContext('2d');
const topAppsChart = new Chart(topAppsCtx, {
    type: 'doughnut',
    data: {
        labels: ['Social Media', 'Gaming', 'Productivity', 'Entertainment', 'Others'],
        datasets: [{
            data: [32, 21, 17, 19, 11],
            backgroundColor: [
                '#14b8a6',
                '#0d9488',
                '#06b6d4',
                '#10b981',
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
                position: 'bottom',
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 13,
                        family: 'Inter',
                        weight: '500'
                    },
                    color: '#134e4a'
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

// Period button functionality
document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});
