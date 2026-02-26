// Weekly Usage Trend Chart
const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
const weeklyChart = new Chart(weeklyCtx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Screen Time (hours)',
            data: [4.5, 5.2, 6.1, 5.8, 5.5, 7.2, 6.8],
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
                    color: '#134e4a'
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
