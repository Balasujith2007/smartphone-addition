
const periodData = {
    today: {
        label: 'Today',
        metrics: { screenTime: '5h 38m', unlocks: 124, avgSession: '22 min', nightUsage: '1h 8m', screenTrend: '+8%', unlockTrend: '+5%', sessionTrend: '-2%', nightTrend: '+10%', screenUp: true, unlockUp: true, sessionUp: false, nightUp: true },
        apps: [
            { icon: '📱', name: 'Social Media', sub: 'Instagram, Twitter', time: '1h 48m', pct: 32, color: '#06b6d4' },
            { icon: '🎮', name: 'Gaming', sub: 'Mobile games', time: '1h 01m', pct: 18, color: '#6366f1' },
            { icon: '💼', name: 'Productivity', sub: 'Email, Notes', time: '1h 07m', pct: 20, color: '#10b981' },
            { icon: '🎬', name: 'Entertainment', sub: 'YouTube, Spotify', time: '1h 14m', pct: 22, color: '#f59e0b' },
            { icon: '📚', name: 'Others', sub: 'Various apps', time: '0h 28m', pct: 8, color: '#7c3aed' }
        ],
        heatmap: [5, 2, 8, 45, 65, 60, 55, 90],
        weekly: [
            { day: 'Today', screenTime: '5h 38m', unlocks: 124, avgSession: '22m', night: '1h 8m', status: 'warn' }
        ],
        insights: [
            { icon: '⚠️', title: 'Peak Hour', body: 'Highest usage tonight between 9 PM – 11 PM. Consider winding down earlier.' },
            { icon: '📱', title: 'Unlock Pattern', body: 'You\'ve unlocked your phone 53 times already — above your daily average.' },
            { icon: '✅', title: 'Morning Win', body: 'No screen usage before 6 AM today — excellent sleep hygiene!' },
            { icon: '🌙', title: 'Night Check', body: 'You used your phone 1h 8m after 10 PM. Try a bedtime mode.' }
        ]
    },
    week: {
        label: 'This Week',
        metrics: { screenTime: '38h 45m', unlocks: 892, avgSession: '28 min', nightUsage: '9h 12m', screenTrend: '+15%', unlockTrend: '+8%', sessionTrend: '-3%', nightTrend: '+12%', screenUp: true, unlockUp: true, sessionUp: false, nightUp: true },
        apps: [
            { icon: '📱', name: 'Social Media', sub: 'Instagram, Facebook, Twitter', time: '12h 30m', pct: 32, color: '#06b6d4' },
            { icon: '🎮', name: 'Gaming', sub: 'Mobile games', time: '8h 15m', pct: 21, color: '#6366f1' },
            { icon: '💼', name: 'Productivity', sub: 'Email, Calendar, Notes', time: '6h 45m', pct: 17, color: '#10b981' },
            { icon: '🎬', name: 'Entertainment', sub: 'YouTube, Netflix, Spotify', time: '7h 30m', pct: 19, color: '#f59e0b' },
            { icon: '📚', name: 'Others', sub: 'Various apps', time: '3h 45m', pct: 11, color: '#7c3aed' }
        ],
        heatmap: [15, 5, 20, 45, 60, 55, 75, 90],
        weekly: [
            { day: 'Monday', screenTime: '5h 12m', unlocks: 118, avgSession: '26m', night: '1h 10m', status: 'warn' },
            { day: 'Tuesday', screenTime: '6h 06m', unlocks: 134, avgSession: '30m', night: '1h 22m', status: 'risk' },
            { day: 'Wednesday', screenTime: '5h 48m', unlocks: 124, avgSession: '28m', night: '0h 50m', status: 'warn' },
            { day: 'Thursday', screenTime: '6h 30m', unlocks: 142, avgSession: '31m', night: '1h 35m', status: 'risk' },
            { day: 'Friday', screenTime: '5h 54m', unlocks: 129, avgSession: '27m', night: '1h 05m', status: 'warn' },
            { day: 'Saturday', screenTime: '7h 12m', unlocks: 121, avgSession: '35m', night: '1h 45m', status: 'risk' },
            { day: 'Sunday', screenTime: '6h 48m', unlocks: 124, avgSession: '29m', night: '1h 25m', status: 'warn' }
        ],
        insights: [
            { icon: '⚠️', title: 'Peak Usage Time', body: 'Highest usage between 8 PM – 11 PM. Consider setting app limits during this window.' },
            { icon: '📈', title: 'Increasing Trend', body: 'Screen time increased 15% this week. Stay mindful of your daily patterns.' },
            { icon: '🌙', title: 'Night Usage Alert', body: 'You used your phone 1.5h after bedtime. This may negatively impact sleep quality.' },
            { icon: '✅', title: 'Positive Change', body: 'Average session length decreased 3% — a healthy improvement. Keep it up!' }
        ]
    },
    month: {
        label: 'This Month',
        metrics: { screenTime: '155h 24m', unlocks: '3,821', avgSession: '30 min', nightUsage: '38h 4m', screenTrend: '+11%', unlockTrend: '+6%', sessionTrend: '+4%', nightTrend: '+9%', screenUp: true, unlockUp: true, sessionUp: true, nightUp: true },
        apps: [
            { icon: '📱', name: 'Social Media', sub: 'Instagram, Facebook, Twitter', time: '49h 44m', pct: 32, color: '#06b6d4' },
            { icon: '🎮', name: 'Gaming', sub: 'Mobile games', time: '31h 5m', pct: 20, color: '#6366f1' },
            { icon: '💼', name: 'Productivity', sub: 'Email, Calendar, Notes', time: '29h 32m', pct: 19, color: '#10b981' },
            { icon: '🎬', name: 'Entertainment', sub: 'YouTube, Netflix, Spotify', time: '31h 5m', pct: 20, color: '#f59e0b' },
            { icon: '📚', name: 'Others', sub: 'Various apps', time: '13h 58m', pct: 9, color: '#7c3aed' }
        ],
        heatmap: [18, 7, 22, 50, 65, 58, 80, 95],
        weekly: [
            { day: 'Week 1', screenTime: '36h 30m', unlocks: 924, avgSession: '28m', night: '9h 0m', status: 'warn' },
            { day: 'Week 2', screenTime: '39h 12m', unlocks: 978, avgSession: '31m', night: '9h 48m', status: 'risk' },
            { day: 'Week 3', screenTime: '41h 0m', unlocks: 1012, avgSession: '32m', night: '10h 12m', status: 'risk' },
            { day: 'Week 4', screenTime: '38h 42m', unlocks: 907, avgSession: '29m', night: '9h 4m', status: 'warn' }
        ],
        insights: [
            { icon: '📊', title: 'Monthly Trend', body: 'Screen time peaked in Week 3. Identify what caused the spike and plan digital breaks.' },
            { icon: '🎯', title: 'Goal Progress', body: 'You met your daily screen time goal on 18 out of 30 days this month — 60% success rate.' },
            { icon: '🌙', title: 'Night Pattern', body: 'Night usage consistently high across all weeks. A structured bedtime routine is recommended.' },
            { icon: '✅', title: 'Best Day', body: 'Sundays show your lowest average screen time — great offline day habit!' }
        ]
    },
    quarter: {
        label: 'Last 3 Months',
        metrics: { screenTime: '468h 6m', unlocks: '11,402', avgSession: '29 min', nightUsage: '114h 20m', screenTrend: '+7%', unlockTrend: '+3%', sessionTrend: '-1%', nightTrend: '+6%', screenUp: true, unlockUp: true, sessionUp: false, nightUp: true },
        apps: [
            { icon: '📱', name: 'Social Media', sub: 'Instagram, Facebook, Twitter', time: '145h 8m', pct: 31, color: '#06b6d4' },
            { icon: '🎮', name: 'Gaming', sub: 'Mobile games', time: '103h 0m', pct: 22, color: '#6366f1' },
            { icon: '💼', name: 'Productivity', sub: 'Email, Calendar, Notes', time: '84h 15m', pct: 18, color: '#10b981' },
            { icon: '🎬', name: 'Entertainment', sub: 'YouTube, Netflix, Spotify', time: '84h 15m', pct: 18, color: '#f59e0b' },
            { icon: '📚', name: 'Others', sub: 'Various apps', time: '51h 28m', pct: 11, color: '#7c3aed' }
        ],
        heatmap: [20, 8, 25, 52, 66, 60, 82, 97],
        weekly: [
            { day: 'January', screenTime: '150h 12m', unlocks: 3720, avgSession: '28m', night: '37h 0m', status: 'warn' },
            { day: 'February', screenTime: '162h 30m', unlocks: 3882, avgSession: '31m', night: '40h 36m', status: 'risk' },
            { day: 'March', screenTime: '155h 24m', unlocks: 3800, avgSession: '29m', night: '37h 44m', status: 'warn' }
        ],
        insights: [
            { icon: '📈', title: 'Quarterly Growth', body: 'Usage grew 7% quarter over quarter. Consider a structured digital wellness plan.' },
            { icon: '🔓', title: 'Unlock Habit', body: 'Over 11,000 unlocks in 3 months — averaging 126 per day. A strong habit trigger count.' },
            { icon: '🌙', title: 'Night Trend', body: 'Night usage increased each month this quarter. Prioritize a consistent digital sunset routine.' },
            { icon: '✅', title: 'Session Stability', body: 'Average session length stayed stable at ~29 min — showing good per-session discipline.' }
        ]
    }
};

const statusLabel = { good: 'Good', warn: 'Moderate', risk: 'High Risk' };

let activePeriod = 'week';
function renderAppUsage(apps) {
    const container = document.getElementById('appUsageList');
    if (!container) return;
    container.innerHTML = apps.map((a, i) => `
        <div class="app-progress-item">
            <div class="app-progress-header">
                <span class="app-progress-name">
                    <span style="font-size:18px;">${a.icon}</span>${a.name}
                </span>
                <span class="app-progress-meta">${a.time} &nbsp;·&nbsp; <strong style="color:var(--text-primary);">${a.pct}%</strong></span>
            </div>
            <div class="app-progress-bar-wrap">
                <div class="app-progress-bar" id="bar-${i}" style="width:0%; background:${a.color};"></div>
            </div>
        </div>
    `).join('');

    setTimeout(() => {
        apps.forEach((a, i) => {
            const bar = document.getElementById(`bar-${i}`);
            if (bar) bar.style.width = a.pct + '%';
        });
    }, 80);
}


function renderHeatmap(data) {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;
    const max = Math.max(...data);
    grid.innerHTML = data.map((v, i) => {
        const intensity = v / max;
        const alpha = 0.08 + intensity * 0.92;
        const tip = `${v} min`;
        return `<div class="heatmap-cell" style="background:rgba(6,182,212,${alpha.toFixed(2)});" title="${tip}">${v}</div>`;
    }).join('');
}

function renderWeeklyTable(rows, label) {
    const tbody = document.getElementById('weeklyTableBody');
    const subtitle = document.getElementById('weeklySubtitle');
    if (!tbody) return;
    if (subtitle) subtitle.textContent = `${label} breakdown`;
    tbody.innerHTML = rows.map(r => `
        <tr>
            <td>${r.day}</td>
            <td>${r.screenTime}</td>
            <td>${r.unlocks}</td>
            <td>${r.avgSession}</td>
            <td>${r.night}</td>
            <td><span class="status-badge status-${r.status}">${statusLabel[r.status]}</span></td>
        </tr>
    `).join('');
}
function renderAppDetailList(apps) {
    const el = document.getElementById('appDetailList');
    if (!el) return;
    el.innerHTML = apps.map(a => `
        <div class="app-item">
            <div class="app-info">
                <span class="app-icon">${a.icon}</span>
                <div>
                    <h4>${a.name}</h4>
                    <p>${a.sub}</p>
                </div>
            </div>
            <div class="app-stats">
                <span class="app-time">${a.time}</span>
                <span class="app-percentage">${a.pct}%</span>
            </div>
        </div>
    `).join('');
}
function renderInsights(insights) {
    const el = document.getElementById('insightsGrid');
    if (!el) return;
    el.innerHTML = insights.map(ins => `
        <div class="insight-item">
            <span class="insight-icon">${ins.icon}</span>
            <div>
                <h4>${ins.title}</h4>
                <p>${ins.body}</p>
            </div>
        </div>
    `).join('');
}

function renderMetrics(m, label) {
    const suffix = label === 'Today' ? 'yesterday' : 'prev. period';
    const cards = document.querySelectorAll('.metric-card');
    const map = [
        { value: m.screenTime, trend: m.screenTrend, up: m.screenUp },
        { value: m.unlocks, trend: m.unlockTrend, up: m.unlockUp },
        { value: m.avgSession, trend: m.sessionTrend, up: m.sessionUp },
        { value: m.nightUsage, trend: m.nightTrend, up: m.nightUp }
    ];
    cards.forEach((card, i) => {
        if (!map[i]) return;
        const { value, trend, up } = map[i];
        const valEl = card.querySelector('.metric-value');
        const trendEl = card.querySelector('.metric-trend');
        if (valEl) {
            valEl.style.opacity = '0';
            valEl.style.transform = 'translateY(8px)';
            setTimeout(() => {
                valEl.textContent = value;
                valEl.style.transition = 'opacity 0.35s, transform 0.35s';
                valEl.style.opacity = '1';
                valEl.style.transform = 'translateY(0)';
            }, 120);
        }
        if (trendEl) {
            trendEl.textContent = `${trend} vs ${suffix}`;
            trendEl.className = 'metric-trend ' + (up ? 'increase' : 'decrease');
        }
    });
}
function applyPeriod(key) {
    activePeriod = key;
    const pd = periodData[key];
    renderMetrics(pd.metrics, pd.label);
    renderAppUsage(pd.apps);
    renderHeatmap(pd.heatmap);
    renderWeeklyTable(pd.weekly, pd.label);
    renderAppDetailList(pd.apps);
    renderInsights(pd.insights);
}

const periodMap = { 'Today': 'today', 'This Week': 'week', 'This Month': 'month', 'Last 3 Months': 'quarter' };

document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        this.style.transform = 'scale(1.05)';
        setTimeout(() => { this.style.transform = ''; }, 200);
        applyPeriod(periodMap[this.textContent.trim()] || 'week');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Load user info
    const user = UserData.get();
    const navName = document.getElementById('navName');
    const navAvatar = document.getElementById('navAvatar');
    if (navName) navName.textContent = `${user.firstName} ${user.lastName}`;
    if (navAvatar && user.avatar) navAvatar.src = user.avatar;

    // Default period
    applyPeriod('week');
});
