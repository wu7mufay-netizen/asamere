// API endpoint for jokes
const JOKE_API = 'https://official-joke-api.appspot.com/random_joke';
const CATEGORY_API = 'https://official-joke-api.appspot.com/types';
const CATEGORY_JOKE_API = 'https://official-joke-api.appspot.com/jokes';

let jokeHistory = [];
let selectedCategory = null;
let isDarkMode = false;

// Initialize the page
window.addEventListener('DOMContentLoaded', () => {
    initializeCategories();
    loadDarkModePreference();
    loadJokeHistory();
});

// Fetch random joke
async function fetchJoke() {
    const jokeCard = document.getElementById('jokeCard');
    const jokeText = document.getElementById('jokeText');
    const jokeCategory = document.getElementById('jokeCategory');
    const btn = document.getElementById('newJokeBtn');
    
    // Show loading state
    jokeText.innerHTML = '<span class="loading"></span> Loading cosmic joke...';
    btn.disabled = true;
    
    try {
        let url = selectedCategory 
            ? `${CATEGORY_JOKE_API}/${selectedCategory}/random`
            : JOKE_API;
        
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch joke');
        
        const data = await response.json();
        const joke = Array.isArray(data) ? data[0] : data;
        
        // Display joke
        const fullJoke = joke.setup ? `${joke.setup}\n\n${joke.punchline}` : joke.joke;
        jokeText.textContent = fullJoke;
        jokeCategory.textContent = joke.type?.toUpperCase() || 'GENERAL';
        
        // Add to history
        addToHistory(fullJoke, joke.type || 'general');
        
        // Add animation
        jokeCard.style.animation = 'none';
        setTimeout(() => {
            jokeCard.style.animation = 'slideIn 0.6s ease-out';
        }, 10);
        
    } catch (error) {
        jokeText.innerHTML = `<span class="error">😅 Oops! Couldn't fetch a joke. Error: ${error.message}</span>`;
        jokeCategory.textContent = '';
        console.error('Error fetching joke:', error);
    } finally {
        btn.disabled = false;
    }
}

// Initialize category buttons
async function initializeCategories() {
    try {
        const response = await fetch(CATEGORY_API);
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const categories = await response.json();
        const container = document.getElementById('categoryButtons');
        container.innerHTML = '';
        
        // Add "All" button
        const allBtn = document.createElement('button');
        allBtn.className = 'category-btn active';
        allBtn.textContent = '🎭 All';
        allBtn.onclick = () => selectCategory(null, allBtn);
        container.appendChild(allBtn);
        
        // Add category buttons
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = `${getCategoryEmoji(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`;
            btn.onclick = () => selectCategory(category, btn);
            container.appendChild(btn);
        });
        
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Get emoji for category
function getCategoryEmoji(category) {
    const emojis = {
        'general': '😂',
        'knock-knock': '🚪',
        'programming': '💻',
        'knock': '🚪'
    };
    return emojis[category] || '😄';
}

// Select category
function selectCategory(category, button) {
    selectedCategory = category;
    
    // Update active state
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Add joke to history
function addToHistory(joke, category) {
    const historyItem = {
        text: joke.substring(0, 100) + (joke.length > 100 ? '...' : ''),
        fullText: joke,
        category: category
    };
    
    jokeHistory.unshift(historyItem);
    if (jokeHistory.length > 10) {
        jokeHistory.pop();
    }
    
    saveJokeHistory();
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const jokeList = document.getElementById('jokeList');
    jokeList.innerHTML = '';
    
    if (jokeHistory.length === 0) {
        jokeList.innerHTML = '<p style="text-align: center; color: #999;">No jokes yet!</p>';
        return;
    }
    
    jokeHistory.forEach((item, index) => {
        const jokeItem = document.createElement('div');
        jokeItem.className = 'joke-item';
        jokeItem.innerHTML = `<strong>${item.category.toUpperCase()}</strong>: ${item.text}`;
        jokeItem.title = item.fullText;
        jokeItem.onclick = () => {
            document.getElementById('jokeText').textContent = item.fullText;
            document.getElementById('jokeCategory').textContent = item.category.toUpperCase();
        };
        jokeList.appendChild(jokeItem);
    });
}

// Save to localStorage
function saveJokeHistory() {
    localStorage.setItem('jokeHistory', JSON.stringify(jokeHistory));
}

// Load from localStorage
function loadJokeHistory() {
    const saved = localStorage.getItem('jokeHistory');
    if (saved) {
        try {
            jokeHistory = JSON.parse(saved);
            updateHistoryDisplay();
        } catch (error) {
            console.error('Error loading history:', error);
        }
    }
}

// Share joke
function shareJoke() {
    const jokeText = document.getElementById('jokeText').textContent;
    
    if (jokeText === 'Click the button to get a cosmic joke!' || jokeText.includes('Oops')) {
        alert('Generate a joke first!');
        return;
    }
    
    const text = `Check out this cosmic joke: "${jokeText}" 😂`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Cosmic Joke',
            text: text
        }).catch(err => console.log('Share cancelled'));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Joke copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Load dark mode preference
function loadDarkModePreference() {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
    }
}

// Go back to universe
function goBackToUniverse() {
    window.location.href = 'index.html';
}

// Auto-fetch a joke on page load
window.addEventListener('load', () => {
    setTimeout(fetchJoke, 500);
});
