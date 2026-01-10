// Smart Tools for MyViralReach Platform
class SmartTools {
    constructor() {
        this.tools = {
            roi: new ROICalculator(),
            matchmaker: new Matchmaker(),
            analytics: new AnalyticsDashboard(),
            scheduler: new CampaignScheduler()
        };
        this.init();
    }
    
    init() {
        this.initCalculators();
        this.initAnalytics();
        this.initScheduler();
        this.initMatchmaker();
    }
    
    initCalculators() {
        // ROI Calculator
        const roiForm = document.getElementById('roi-calculator');
        if (roiForm) {
            roiForm.addEventListener('input', () => this.calculateROI());
            this.calculateROI(); // Initial calculation
        }
        
        // Budget Calculator
        const budgetForm = document.getElementById('budget-calculator');
        if (budgetForm) {
            budgetForm.addEventListener('input', () => this.calculateBudget());
            this.calculateBudget();
        }
        
        // Engagement Predictor
        const engagementForm = document.getElementById('engagement-calculator');
        if (engagementForm) {
            engagementForm.addEventListener('input', () => this.predictEngagement());
            this.predictEngagement();
        }
    }
    
    calculateROI() {
        const form = document.getElementById('roi-calculator');
        if (!form) return;
        
        const budget = parseFloat(form.querySelector('[name="budget"]').value) || 0;
        const platform = form.querySelector('[name="platform"]').value;
        const duration = parseInt(form.querySelector('[name="duration"]').value) || 1;
        const creatorSize = form.querySelector('[name="creator_size"]').value;
        
        // Platform multipliers
        const platformMultipliers = {
            'instagram': 2.5,
            'youtube': 3.0,
            'tiktok': 2.8,
            'twitter': 1.8,
            'multiple': 3.5
        };
        
        // Creator size multipliers
        const sizeMultipliers = {
            'nano': 1.2,
            'micro': 1.5,
            'mid': 2.0,
            'macro': 3.0,
            'mega': 4.0
        };
        
        // Calculate estimated ROI
        const baseROI = 200; // 200% base ROI
        const platformMultiplier = platformMultipliers[platform] || 1;
        const sizeMultiplier = sizeMultipliers[creatorSize] || 1;
        const durationMultiplier = Math.min(duration / 4 + 1, 2); // Max 2x for duration
        
        const estimatedROI = Math.round(baseROI * platformMultiplier * sizeMultiplier * durationMultiplier);
        const estimatedRevenue = Math.round(budget * (estimatedROI / 100));
        
        // Update display
        const roiElement = document.getElementById('roi-result');
        const revenueElement = document.getElementById('revenue-result');
        
        if (roiElement) {
            roiElement.textContent = `${estimatedROI}%`;
            roiElement.style.color = estimatedROI > 300 ? '#10B981' : 
                                    estimatedROI > 200 ? '#F59E0B' : '#EF4444';
        }
        
        if (revenueElement) {
            revenueElement.textContent = `₹${estimatedRevenue.toLocaleString('en-IN')}`;
        }
        
        // Update ROI gauge
        this.updateROIGauge(estimatedROI);
    }
    
    updateROIGauge(roi) {
        const gauge = document.getElementById('roi-gauge');
        if (!gauge) return;
        
        const percentage = Math.min(roi / 500 * 100, 100); // Cap at 500% ROI
        
        gauge.innerHTML = `
            <div class="gauge-container">
                <div class="gauge-background"></div>
                <div class="gauge-fill" style="transform: rotate(${percentage * 1.8}deg);"></div>
                <div class="gauge-center">
                    <span class="gauge-value">${roi}%</span>
                </div>
            </div>
        `;
        
        // Add gauge styles
        if (!document.querySelector('#gauge-styles')) {
            const style = document.createElement('style');
            style.id = 'gauge-styles';
            style.textContent = `
                .gauge-container {
                    position: relative;
                    width: 200px;
                    height: 100px;
                    margin: 0 auto;
                    overflow: hidden;
                }
                
                .gauge-background {
                    position: absolute;
                    width: 200px;
                    height: 100px;
                    background: conic-gradient(
                        #EF4444 0deg,
                        #F59E0B 90deg,
                        #10B981 180deg,
                        #EF4444 360deg
                    );
                    border-radius: 100px 100px 0 0;
                    transform: rotate(180deg);
                }
                
                .gauge-fill {
                    position: absolute;
                    width: 180px;
                    height: 90px;
                    background: white;
                    border-radius: 100px 100px 0 0;
                    top: 10px;
                    left: 10px;
                    transform-origin: bottom center;
                    transition: transform 1s ease;
                }
                
                .gauge-center {
                    position: absolute;
                    width: 140px;
                    height: 70px;
                    background: white;
                    border-radius: 100px 100px 0 0;
                    top: 30px;
                    left: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .gauge-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    transform: rotate(180deg);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    calculateBudget() {
        const form = document.getElementById('budget-calculator');
        if (!form) return;
        
        const reach = parseInt(form.querySelector('[name="reach"]').value) || 0;
        const engagement = parseFloat(form.querySelector('[name="engagement"]').value) || 0;
        const conversions = parseFloat(form.querySelector('[name="conversions"]').value) || 0;
        const industry = form.querySelector('[name="industry"]').value;
        
        // Industry cost per impression (CPI) in paise
        const industryCPM = {
            'gaming': 25,
            'tech': 30,
            'fashion': 35,
            'beauty': 40,
            'food': 20,
            'travel': 45,
            'finance': 50,
            'education': 15
        };
        
        const cpm = industryCPM[industry] || 25;
        const estimatedImpressions = reach * (engagement / 100);
        const estimatedBudget = Math.round((estimatedImpressions * cpm) / 1000); // Convert to rupees
        const estimatedConversions = Math.round(estimatedImpressions * (conversions / 100));
        const costPerConversion = estimatedConversions > 0 ? Math.round(estimatedBudget / estimatedConversions) : 0;
        
        // Update display
        this.updateElement('budget-result', `₹${estimatedBudget.toLocaleString('en-IN')}`);
        this.updateElement('impressions-result', estimatedImpressions.toLocaleString('en-IN'));
        this.updateElement('conversions-result', estimatedConversions.toLocaleString('en-IN'));
        this.updateElement('cpa-result', `₹${costPerConversion.toLocaleString('en-IN')}`);
    }
    
    predictEngagement() {
        const form = document.getElementById('engagement-calculator');
        if (!form) return;
        
        const creatorFollowers = parseInt(form.querySelector('[name="creator_followers"]').value) || 0;
        const avgEngagement = parseFloat(form.querySelector('[name="avg_engagement"]').value) || 0;
        const contentType = form.querySelector('[name="content_type"]').value;
        const postingFrequency = form.querySelector('[name="posting_frequency"]').value;
        
        // Content type multipliers
        const typeMultipliers = {
            'video': 1.5,
            'reels': 1.8,
            'story': 1.2,
            'post': 1.0,
            'live': 2.0
        };
        
        // Frequency multipliers
        const frequencyMultipliers = {
            'daily': 1.3,
            'weekly': 1.0,
            'biweekly': 0.8,
            'monthly': 0.6
        };
        
        // Calculate predicted engagement
        const baseEngagement = avgEngagement;
        const typeMultiplier = typeMultipliers[contentType] || 1;
        const frequencyMultiplier = frequencyMultipliers[postingFrequency] || 1;
        const sizePenalty = Math.max(0.1, 1 - (creatorFollowers / 1000000) * 0.5); // Penalty for larger creators
        
        const predictedEngagement = Math.round(baseEngagement * typeMultiplier * frequencyMultiplier * sizePenalty * 10) / 10;
        const predictedReach = Math.round(creatorFollowers * (predictedEngagement / 100));
        const predictedImpressions = Math.round(predictedReach * 1.5); // Assumed 1.5 impressions per reach
        
        // Update display
        this.updateElement('engagement-result', `${predictedEngagement}%`);
        this.updateElement('reach-result', predictedReach.toLocaleString('en-IN'));
        this.updateElement('impressions-predicted', predictedImpressions.toLocaleString('en-IN'));
        
        // Update engagement chart
        this.updateEngagementChart(predictedEngagement, avgEngagement);
    }
    
    updateEngagementChart(predicted, average) {
        const canvas = document.getElementById('engagement-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw chart
        const maxHeight = 150;
        const predictedHeight = (predicted / 10) * maxHeight;
        const averageHeight = (average / 10) * maxHeight;
        
        // Predicted bar
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(50, canvas.height - predictedHeight, 80, predictedHeight);
        
        // Average bar
        ctx.fillStyle = '#9CA3AF';
        ctx.fillRect(150, canvas.height - averageHeight, 80, averageHeight);
        
        // Labels
        ctx.fillStyle = '#374151';
        ctx.font = '14px Inter';
        ctx.fillText('Predicted', 50, canvas.height - 10);
        ctx.fillText('Average', 150, canvas.height - 10);
        
        // Values
        ctx.fillText(`${predicted}%`, 70, canvas.height - predictedHeight - 10);
        ctx.fillText(`${average}%`, 170, canvas.height - averageHeight - 10);
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    initAnalytics() {
        // Initialize analytics dashboard if present
        const analyticsDashboard = document.getElementById('analytics-dashboard');
        if (analyticsDashboard) {
            this.createAnalyticsDashboard();
        }
    }
    
    createAnalyticsDashboard() {
        // Create performance metrics
        const metrics = [
            { label: 'Campaigns Running', value: '24', change: '+12%', trend: 'up' },
            { label: 'Avg. Engagement', value: '4.8%', change: '+0.3%', trend: 'up' },
            { label: 'ROI This Month', value: '285%', change: '+15%', trend: 'up' },
            { label: 'Cost Per Click', value: '₹8.50', change: '-₹1.20', trend: 'down' }
        ];
        
        const container = document.getElementById('analytics-metrics');
        if (container) {
            container.innerHTML = metrics.map(metric => `
                <div class="metric-card glass-card">
                    <div class="metric-label">${metric.label}</div>
                    <div class="metric-value">${metric.value}</div>
                    <div class="metric-change ${metric.trend}">
                        <i class="fas fa-arrow-${metric.trend}"></i>
                        ${metric.change}
                    </div>
                </div>
            `).join('');
        }
        
        // Create performance chart
        this.createPerformanceChart();
    }
    
    createPerformanceChart() {
        const canvas = document.getElementById('performance-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = [65, 59, 80, 81, 56, 55, 40, 75, 90, 85, 95, 88];
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw line chart
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - (data[0] / 100 * canvas.height));
        
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * canvas.width;
            const y = canvas.height - (value / 100 * canvas.height);
            ctx.lineTo(x, y);
        });
        
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw data points
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * canvas.width;
            const y = canvas.height - (value / 100 * canvas.height);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#3B82F6';
            ctx.fill();
        });
    }
    
    initScheduler() {
        const scheduler = document.getElementById('campaign-scheduler');
        if (scheduler) {
            this.createScheduler();
        }
    }
    
    createScheduler() {
        // Create calendar view
        const calendar = document.getElementById('campaign-calendar');
        if (!calendar) return;
        
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        
        // Generate calendar
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let calendarHTML = '<div class="calendar-header">';
        calendarHTML += `<div class="calendar-month">${today.toLocaleString('default', { month: 'long' })} ${year}</div>`;
        calendarHTML += '</div><div class="calendar-grid">';
        
        // Day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });
        
        // Empty days for start of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const hasCampaign = day % 5 === 0; // Mock data
            const isToday = day === today.getDate();
            
            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasCampaign ? 'has-campaign' : ''}">
                    ${day}
                    ${hasCampaign ? '<div class="campaign-dot"></div>' : ''}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        calendar.innerHTML = calendarHTML;
        
        // Add campaign form
        this.createCampaignForm();
    }
    
    createCampaignForm() {
        const form = document.getElementById('campaign-form');
        if (!form) return;
        
        // Add date picker
        const dateInput = form.querySelector('[type="date"]');
        if (dateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.min = tomorrow.toISOString().split('T')[0];
        }
        
        // Add time slot selection
        const timeSlots = document.getElementById('time-slots');
        if (timeSlots) {
            const slots = ['09:00', '12:00', '15:00', '18:00', '21:00'];
            timeSlots.innerHTML = slots.map(slot => `
                <label class="time-slot">
                    <input type="radio" name="time" value="${slot}">
                    <span>${slot}</span>
                </label>
            `).join('');
        }
    }
    
    initMatchmaker() {
        const matchmaker = document.getElementById('ai-matchmaker');
        if (matchmaker) {
            this.createMatchmaker();
        }
    }
    
    createMatchmaker() {
        // Create matchmaker interface
        const interfaceDiv = document.getElementById('matchmaker-interface');
        if (!interfaceDiv) return;
        
        interfaceDiv.innerHTML = `
            <div class="matchmaker-step active" id="step-1">
                <h3>Step 1: Define Your Goals</h3>
                <div class="goal-options">
                    <label class="goal-option">
                        <input type="radio" name="goal" value="awareness" checked>
                        <div class="goal-icon"><i class="fas fa-bullhorn"></i></div>
                        <div class="goal-label">Brand Awareness</div>
                    </label>
                    <label class="goal-option">
                        <input type="radio" name="goal" value="sales">
                        <div class="goal-icon"><i class="fas fa-shopping-cart"></i></div>
                        <div class="goal-label">Sales & Conversions</div>
                    </label>
                    <label class="goal-option">
                        <input type="radio" name="goal" value="leads">
                        <div class="goal-icon"><i class="fas fa-users"></i></div>
                        <div class="goal-label">Lead Generation</div>
                    </label>
                </div>
                <button class="btn-primary next-step" data-next="2">Next</button>
            </div>
            
            <div class="matchmaker-step" id="step-2">
                <h3>Step 2: Select Platforms</h3>
                <div class="platform-options">
                    <label class="platform-option">
                        <input type="checkbox" name="platform" value="instagram" checked>
                        <div class="platform-icon"><i class="fab fa-instagram"></i></div>
                        <div class="platform-label">Instagram</div>
                    </label>
                    <label class="platform-option">
                        <input type="checkbox" name="platform" value="youtube">
                        <div class="platform-icon"><i class="fab fa-youtube"></i></div>
                        <div class="platform-label">YouTube</div>
                    </label>
                    <label class="platform-option">
                        <input type="checkbox" name="platform" value="tiktok">
                        <div class="platform-icon"><i class="fab fa-tiktok"></i></div>
                        <div class="platform-label">TikTok</div>
                    </label>
                </div>
                <div class="step-buttons">
                    <button class="btn-ghost prev-step" data-prev="1">Back</button>
                    <button class="btn-primary next-step" data-next="3">Next</button>
                </div>
            </div>
            
            <div class="matchmaker-step" id="step-3">
                <h3>Step 3: Set Budget</h3>
                <div class="budget-slider">
                    <input type="range" min="10000" max="1000000" value="100000" step="10000" id="budget-slider">
                    <div class="budget-value">₹<span id="budget-amount">1,00,000</span></div>
                </div>
                <div class="budget-presets">
                    <button class="budget-preset" data-budget="50000">₹50K</button>
                    <button class="budget-preset" data-budget="100000">₹1L</button>
                    <button class="budget-preset" data-budget="250000">₹2.5L</button>
                    <button class="budget-preset" data-budget="500000">₹5L</button>
                </div>
                <div class="step-buttons">
                    <button class="btn-ghost prev-step" data-prev="2">Back</button>
                    <button class="btn-primary" id="find-matches">Find Matches</button>
                </div>
            </div>
            
            <div class="matchmaker-results" id="step-4">
                <h3>AI Matches Found!</h3>
                <div class="match-score">
                    <div class="score-circle">
                        <div class="score-value">95%</div>
                        <div class="score-label">Match Score</div>
                    </div>
                </div>
                <div class="match-details">
                    <div class="match-detail">
                        <i class="fas fa-users"></i>
                        <div>
                            <div class="detail-label">Recommended Creators</div>
                            <div class="detail-value">5-8 creators</div>
                        </div>
                    </div>
                    <div class="match-detail">
                        <i class="fas fa-chart-line"></i>
                        <div>
                            <div class="detail-label">Expected ROI</div>
                            <div class="detail-value">250-350%</div>
                        </div>
                    </div>
                    <div class="match-detail">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <div class="detail-label">Time to Launch</div>
                            <div class="detail-value">48-72 hours</div>
                        </div>
                    </div>
                </div>
                <button class="btn-primary" id="view-matches">View Detailed Matches</button>
            </div>
        `;
        
        // Initialize matchmaker interactions
        this.initMatchmakerInteractions();
    }
    
    initMatchmakerInteractions() {
        // Step navigation
        document.querySelectorAll('.next-step').forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.matchmaker-step');
                const nextStepId = btn.getAttribute('data-next');
                
                currentStep.classList.remove('active');
                document.getElementById(`step-${nextStepId}`).classList.add('active');
            });
        });
        
        document.querySelectorAll('.prev-step').forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.matchmaker-step');
                const prevStepId = btn.getAttribute('data-prev');
                
                currentStep.classList.remove('active');
                document.getElementById(`step-${prevStepId}`).classList.add('active');
            });
        });
        
        // Budget slider
        const budgetSlider = document.getElementById('budget-slider');
        const budgetAmount = document.getElementById('budget-amount');
        
        if (budgetSlider && budgetAmount) {
            budgetSlider.addEventListener('input', () => {
                const value = parseInt(budgetSlider.value);
                budgetAmount.textContent = value.toLocaleString('en-IN');
            });
        }
        
        // Budget presets
        document.querySelectorAll('.budget-preset').forEach(preset => {
            preset.addEventListener('click', () => {
                const budget = preset.getAttribute('data-budget');
                budgetSlider.value = budget;
                budgetAmount.textContent = budget.toLocaleString('en-IN');
            });
        });
        
        // Find matches
        const findMatchesBtn = document.getElementById('find-matches');
        if (findMatchesBtn) {
            findMatchesBtn.addEventListener('click', () => {
                // Simulate AI processing
                findMatchesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Finding Matches...';
                findMatchesBtn.disabled = true;
                
                setTimeout(() => {
                    document.getElementById('step-3').classList.remove('active');
                    document.getElementById('step-4').classList.add('active');
                    
                    // Reset button
                    findMatchesBtn.innerHTML = 'Find Matches';
                    findMatchesBtn.disabled = false;
                }, 2000);
            });
        }
        
        // View matches
        const viewMatchesBtn = document.getElementById('view-matches');
        if (viewMatchesBtn) {
            viewMatchesBtn.addEventListener('click', () => {
                window.location.href = 'creators.html#ai-matches';
            });
        }
    }
}

// Sub-classes for specific tools
class ROICalculator {
    calculate(campaignData) {
        // Advanced ROI calculation logic
        return {
            roi: 285,
            revenue: campaignData.budget * 2.85,
            breakdown: this.getBreakdown(campaignData)
        };
    }
    
    getBreakdown(data) {
        return {
            mediaCost: data.budget * 0.6,
            creatorFees: data.budget * 0.3,
            platformFees: data.budget * 0.1,
            expectedRevenue: data.budget * 2.85
        };
    }
}

class Matchmaker {
    findMatches(criteria) {
        // AI matching algorithm
        return {
            matches: this.generateMatches(criteria),
            confidence: 0.95,
            recommendations: this.getRecommendations(criteria)
        };
    }
    
    generateMatches(criteria) {
        // Generate mock matches based on criteria
        return Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            name: `Creator ${i + 1}`,
            matchScore: 90 - i * 5,
            audienceMatch: 85 + i * 3,
            engagementRate: 4.5 + i * 0.5,
            estimatedROI: 250 + i * 25
        }));
    }
    
    getRecommendations(criteria) {
        return {
            bestPlatform: this.determineBestPlatform(criteria),
            optimalBudget: criteria.budget * 1.2,
            recommendedDuration: 4 // weeks
        };
    }
    
    determineBestPlatform(criteria) {
        const platforms = {
            instagram: { score: 0 },
            youtube: { score: 0 },
            tiktok: { score: 0 }
        };
        
        // Scoring logic based on criteria
        if (criteria.goal === 'awareness') {
            platforms.instagram.score += 3;
            platforms.tiktok.score += 2;
        } else if (criteria.goal === 'sales') {
            platforms.youtube.score += 3;
            platforms.instagram.score += 2;
        }
        
        return Object.entries(platforms)
            .sort((a, b) => b[1].score - a[1].score)[0][0];
    }
}

class AnalyticsDashboard {
    constructor() {
        this.metrics = {
            campaigns: 24,
            engagement: 4.8,
            roi: 285,
            cpc: 8.5
        };
    }
    
    getPerformanceTrend(period = 'month') {
        // Get performance trend data
        return {
            labels: this.getTimeLabels(period),
            datasets: this.generateDataset(period)
        };
    }
    
    getTimeLabels(period) {
        if (period === 'week') {
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        }
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    
    generateDataset(period) {
        // Generate mock dataset
        const data = [];
        const length = period === 'week' ? 7 : 12;
        
        for (let i = 0; i < length; i++) {
            data.push(Math.floor(Math.random() * 100) + 50);
        }
        
        return [{
            label: 'Performance',
            data: data,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }];
    }
}

class CampaignScheduler {
    scheduleCampaign(data) {
        // Schedule campaign logic
        return {
            id: Date.now(),
            status: 'scheduled',
            scheduledDate: data.date,
            timeSlot: data.time,
            reminders: this.setReminders(data)
        };
    }
    
    setReminders(data) {
        return {
            '24_hours': new Date(data.date.getTime() - 24 * 60 * 60 * 1000),
            '1_hour': new Date(data.date.getTime() - 60 * 60 * 1000),
            '15_minutes': new Date(data.date.getTime() - 15 * 60 * 1000)
        };
    }
    
    getCalendar(month, year) {
        // Generate calendar data
        return {
            month: month,
            year: year,
            days: this.generateDays(month, year),
            events: this.getEvents(month, year)
        };
    }
    
    generateDays(month, year) {
        const days = [];
        const date = new Date(year, month, 1);
        
        while (date.getMonth() === month) {
            days.push({
                date: new Date(date),
                hasCampaign: Math.random() > 0.7
            });
            date.setDate(date.getDate() + 1);
        }
        
        return days;
    }
    
    getEvents(month, year) {
        // Get scheduled events
        return Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            title: `Campaign ${i + 1}`,
            date: new Date(year, month, Math.floor(Math.random() * 28) + 1),
            type: ['instagram', 'youtube', 'tiktok'][i % 3]
        }));
    }
}

// Initialize tools when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.smartTools = new SmartTools();
    
    // Add styles for tools
    const toolStyles = document.createElement('style');
    toolStyles.textContent = `
        .calculator-container {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            padding: 2rem;
            margin-bottom: 2rem;
        }
        
        .calculator-result {
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
            border-radius: var(--radius-lg);
            margin-top: 2rem;
        }
        
        .matchmaker-step {
            display: none;
            animation: fadeIn 0.3s ease;
        }
        
        .matchmaker-step.active {
            display: block;
        }
        
        .goal-options, .platform-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .goal-option, .platform-option {
            text-align: center;
            padding: 1.5rem;
            border: 2px solid var(--gray-300);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: var(--transition-normal);
        }
        
        .goal-option:hover, .platform-option:hover {
            border-color: var(--primary);
            transform: translateY(-2px);
        }
        
        .goal-option input:checked + .goal-icon,
        .platform-option input:checked + .platform-icon {
            background: var(--gradient-primary);
            color: white;
        }
        
        .goal-icon, .platform-icon {
            width: 60px;
            height: 60px;
            background: var(--gray-100);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 1.5rem;
            transition: var(--transition-normal);
        }
        
        .budget-slider {
            margin: 2rem 0;
        }
        
        .budget-slider input {
            width: 100%;
        }
        
        .budget-value {
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary);
            margin: 1rem 0;
        }
        
        .budget-presets {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 1rem 0 2rem;
        }
        
        .budget-preset {
            padding: 0.5rem 1rem;
            background: var(--gray-100);
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: var(--transition-fast);
        }
        
        .budget-preset:hover {
            background: var(--primary);
            color: white;
        }
        
        .step-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
        
        .matchmaker-results {
            text-align: center;
            padding: 2rem;
        }
        
        .score-circle {
            width: 150px;
            height: 150px;
            background: conic-gradient(var(--primary) ${0.95 * 360}deg, var(--gray-200) 0deg);
            border-radius: 50%;
            margin: 2rem auto;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .score-circle::before {
            content: '';
            position: absolute;
            width: 120px;
            height: 120px;
            background: white;
            border-radius: 50%;
        }
        
        .score-value {
            position: relative;
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary);
        }
        
        .score-label {
            position: relative;
            color: var(--gray-600);
            margin-top: 0.5rem;
        }
        
        .match-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .match-detail {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--gray-50);
            border-radius: var(--radius-md);
        }
        
        .match-detail i {
            font-size: 1.5rem;
            color: var(--primary);
        }
        
        .detail-label {
            font-size: 0.9rem;
            color: var(--gray-600);
        }
        
        .detail-value {
            font-weight: 600;
            color: var(--dark);
        }
        
        .calendar-header {
            text-align: center;
            padding: 1rem;
            border-bottom: 1px solid var(--gray-200);
        }
        
        .calendar-month {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--dark);
        }
        
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0.5rem;
            padding: 1rem;
        }
        
        .calendar-day-header {
            text-align: center;
            padding: 0.5rem;
            font-weight: 600;
            color: var(--gray-600);
        }
        
        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-sm);
            cursor: pointer;
            position: relative;
            transition: var(--transition-fast);
        }
        
        .calendar-day:hover {
            background: var(--gray-100);
        }
        
        .calendar-day.today {
            background: var(--primary);
            color: white;
        }
        
        .calendar-day.has-campaign .campaign-dot {
            position: absolute;
            bottom: 5px;
            width: 6px;
            height: 6px;
            background: var(--success);
            border-radius: 50%;
        }
        
        .calendar-day.empty {
            background: transparent;
            cursor: default;
        }
        
        .time-slot {
            display: inline-block;
            padding: 0.5rem 1rem;
            margin: 0.25rem;
            background: var(--gray-100);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: var(--transition-fast);
        }
        
        .time-slot input:checked + span {
            background: var(--primary);
            color: white;
        }
        
        .metric-card {
            padding: 1.5rem;
            text-align: center;
        }
        
        .metric-label {
            font-size: 0.9rem;
            color: var(--gray-600);
            margin-bottom: 0.5rem;
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 0.5rem;
        }
        
        .metric-change {
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .metric-change.up {
            color: var(--success);
        }
        
        .metric-change.down {
            color: var(--danger);
        }
    `;
    document.head.appendChild(toolStyles);
});