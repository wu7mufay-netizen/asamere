// Wonder messages for shooting stars
const wonderMessages = [
    "Every star in the sky is a memory of your love",
    "In the infinity of space, you are my only constant",
    "Two hearts beating in sync with the universe",
    "You are the light that guides me through darkness",
    "Our love transcends time and space",
    "In every galaxy, I find traces of you",
    "You make my heart dance like shooting stars",
    "Forever is written in the constellations"
];

// Planet quotes
const planetQuotes = {
    mercury: [
        "Swift as Mercury, my love travels to you",
        "Quick-witted exchanges, deeper connections",
        "Messenger of the heart"
    ],
    venus: [
        "Venus smiles upon our love",
        "The goddess of love approves of you",
        "Beauty and grace in every moment"
    ],
    earth: [
        "On this beautiful earth, we found each other",
        "Home is wherever you are",
        "Our love grounds me"
    ],
    mars: [
        "Mars ignites the passion in my soul",
        "Your energy drives me forward",
        "Warriors of love, fighting for forever"
    ],
    jupiter: [
        "As vast as Jupiter, so is my love for you",
        "A giant among the stars, yet small before you",
        "Infinite possibilities with you"
    ]
};

// Initialize shooting stars on wonder page
function initShootingStars() {
    const container = document.getElementById('shootingStarsContainer');
    container.innerHTML = '';
    
    wonderMessages.forEach((message, index) => {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.innerHTML = `
            <h3>✨ Wonder ${index + 1}</h3>
            <div class="message">${message}</div>
        `;
        star.onclick = (e) => {
            e.stopPropagation();
            // Remove expanded class from other stars
            document.querySelectorAll('.shooting-star').forEach(s => s.classList.remove('expanded'));
            star.classList.add('expanded');
        };
        container.appendChild(star);
    });
}

// Initialize planet cards
function initPlanetCards(planetName) {
    const quotes = planetQuotes[planetName];
    const containerId = planetName + 'Cards';
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    container.innerHTML = '';
    
    quotes.forEach((quote, index) => {
        const card = document.createElement('div');
        card.className = 'planet-card';
        card.innerHTML = `
            <h3>💫 ${String.fromCharCode(9679)} Truth ${index + 1}</h3>
            <p>${quote}</p>
        `;
        container.appendChild(card);
    });
}

// Navigation
function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Initialize content based on page
    if (pageId === 'wonder-page') {
        initShootingStars();
    } else if (pageId === 'mercury' || pageId === 'venus' || pageId === 'earth' || pageId === 'mars' || pageId === 'jupiter') {
        initPlanetCards(pageId);
    }
}

function goBack() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

// Planet click handlers
function setupPlanetListeners() {
    document.querySelectorAll('.planet').forEach(planet => {
        planet.addEventListener('click', (e) => {
            e.stopPropagation();
            const pageId = planet.dataset.page;
            navigateTo(pageId);
        });
    });
}

// Sun click handler for Big Bang
function setupSunListener() {
    const sun = document.getElementById('sunButton');
    sun.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerBigBang();
    });
}

function triggerBigBang() {
    const sun = document.getElementById('sunButton');
    sun.classList.add('active');
    
    // Hide universe container
    setTimeout(() => {
        document.querySelector('.universe-container').style.display = 'none';
        navigateTo('bigbang');
        createConstellation();
    }, 800);
}

function createConstellation() {
    const constellation = document.getElementById('constellation');
    constellation.innerHTML = '';
    
    // Create "I LOVE U ARSEMA" text
    const textLength = 15;
    const text = 'I LOVE U ARSEMA';
    const chars = text.split('');
    
    // Create star dots in circular pattern
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 150;
    
    chars.forEach((char, index) => {
        const angle = (index / chars.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        const dot = document.createElement('div');
        dot.className = 'star-dot';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.animationDelay = (index * 0.1) + 's';
        constellation.appendChild(dot);
    });
    
    // Add text constellation
    const textEl = document.createElement('div');
    textEl.className = 'constellation-text';
    textEl.textContent = '💫 I LOVE U ARSEMA 💫';
    textEl.style.left = '50%';
    textEl.style.top = '50%';
    textEl.style.transform = 'translate(-50%, -50%)';
    constellation.appendChild(textEl);
}

// Wonder card click handler
function setupWonderCardListener() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.wonder-card a')) {
            navigateTo('wonder-page');
        }
    });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    setupPlanetListeners();
    setupSunListener();
    setupWonderCardListener();
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        goBack();
        document.querySelector('.universe-container').style.display = 'flex';
        const sun = document.getElementById('sunButton');
        sun.classList.remove('active');
    }
});
