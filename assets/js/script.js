// Carica i contenuti delle viste
async function loadContent() {
    try {
        const overviewContent = await fetch('views/overview-content.html').then(r => r.text());
        const analysisContent = await fetch('views/analysis-content.html').then(r => r.text());
        const demoContent = await fetch('views/demo-content.html').then(r => r.text());
        const designContent = await fetch('views/design-content.html').then(r => r.text());
        const gdprContent = await fetch('views/gdpr-content.html').then(r => r.text());

        document.getElementById('overview').innerHTML = overviewContent;
        document.getElementById('analysis').innerHTML = analysisContent;
        document.getElementById('design').innerHTML = designContent;
        document.getElementById('gdpr').innerHTML = gdprContent;
        document.getElementById('demo').innerHTML = demoContent;
        
        // Initialize calendar if we're on demo tab
        if (document.querySelector('.tab-content.active#demo')) {
            initCalendar();
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Gestione tab
function showTab(tabId) {
    // Update tab content
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
        if (tabId === 'demo') {
            setTimeout(initCalendar, 100); // Initialize calendar when switching to demo tab
        }
    }

    // Update navigation buttons
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    const activeButton = document.getElementById(`nav-${tabId}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Demo functionality
let selectedDate = null;
const statusData = {};

// Initialize calendar
function initCalendar() {
    const calendar = document.querySelector('.calendar-grid');
    if (!calendar) return;
    
    calendar.innerHTML = '';
    
    // Add day headers
    ['L', 'M', 'M', 'G', 'V', 'S', 'D'].forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.className = 'text-center font-medium text-gray-600';
        calendar.appendChild(dayHeader);
    });

    // Add calendar days
    for (let i = 1; i <= 31; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        day.dataset.day = i; // Aggiungiamo un data attribute per identificare il giorno
        day.onclick = () => selectDate(i);
        calendar.appendChild(day);
    }
}

// Select date
function selectDate(day) {
    // Rimuovi la selezione precedente
    const allDays = document.querySelectorAll('.calendar-day');
    allDays.forEach(d => d.style.border = 'none');
    
    // Trova il giorno corretto usando il data attribute
    const selectedDay = document.querySelector(`.calendar-day[data-day="${day}"]`);
    if (selectedDay) {
        selectedDay.style.border = '2px solid #2563eb';
        selectedDate = day;
    }
}

// Update status
function updateStatus(status) {
    if (!selectedDate) return;
    
    // Trova il giorno corretto usando il data attribute
    const day = document.querySelector(`.calendar-day[data-day="${selectedDate}"]`);
    if (!day) return;
    
    if (status === 'dry') {
        day.style.backgroundColor = '#bbf7d0'; // green-200
        day.style.color = '#166534'; // green-800
    } else {
        day.style.backgroundColor = '#fef08a'; // yellow-200
        day.style.color = '#854d0e'; // yellow-800
    }
    
    statusData[selectedDate] = status;
    updateChart();
}

// Update statistics chart
function updateChart() {
    const container = document.querySelector('#chartContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    let dryCount = 0;
    let wetCount = 0;
    
    Object.values(statusData).forEach(status => {
        if (status === 'dry') dryCount++;
        else wetCount++;
    });
    
    const total = Object.keys(statusData).length;
    if (total === 0) return;
    
    // Create bars
    const dryBar = document.createElement('div');
    dryBar.className = 'chart-bar bg-green-500';
    dryBar.style.left = '30%';
    dryBar.style.height = `${(dryCount/total * 100)}%`;
    
    const wetBar = document.createElement('div');
    wetBar.className = 'chart-bar bg-yellow-500';
    wetBar.style.left = '60%';
    wetBar.style.height = `${(wetCount/total * 100)}%`;
    
    container.appendChild(dryBar);
    container.appendChild(wetBar);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    showTab('overview');
});