/**
 * Golden Cookie Module
 * Creates floating golden cookies that can be clicked for bonus points
 */

class GoldenCookieGenerator {
    constructor() {
        // Change interval to 60 seconds (1 minute)
        this.interval = 60 * 1000; // 1 minute in milliseconds
        this.minCookies = 1; // Minimum number of cookies per spawn
        this.maxCookies = 5; // Maximum number of cookies per spawn
        this.minReward = 100;
        this.maxReward = 200;
        this.cookieSize = 60; // Size in pixels
        this.floatDuration = 10000; // 10 seconds to float down
        this.activeCookies = [];
        this.allowedPages = ['index.html', '']; // Only allow cookies on main page
        
        // Only initialize if we're on an allowed page
        const currentPage = window.location.pathname.split('/').pop() || '';
        if (this.allowedPages.includes(currentPage)) {
            this.init();
            console.log("Golden Cookie Generator initialized on allowed page:", currentPage);
        } else {
            console.log("Golden Cookie Generator not enabled on this page:", currentPage);
        }
        
        // Add failsafe for missing audio files
        this.audioFailed = false;
    }
    
    init() {
        console.log("Golden Cookie Generator initialized (1-5 cookies every minute)");
        this.scheduleNextCookies();
        
        // Create style for the golden cookies
        const style = document.createElement('style');
        style.textContent = `
            .golden-floating-cookie {
                position: fixed;
                width: ${this.cookieSize}px;
                height: ${this.cookieSize}px;
                background-image: radial-gradient(circle, #ffd700, #ffa500);
                border-radius: 50%;
                box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.6);
                cursor: pointer;
                z-index: 9999;
                animation: shimmerEffect 1.5s infinite alternate;
                pointer-events: auto;
            }
            
            @keyframes shimmerEffect {
                0% { box-shadow: 0 0 10px 2px rgba(255, 215, 0, 0.6); }
                100% { box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.8); }
            }
            
            .golden-cookie-pop {
                animation: popAnimation 0.5s ease-out forwards;
            }
            
            @keyframes popAnimation {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
                100% { transform: scale(0); opacity: 0; }
            }
            
            .golden-cookie-points {
                position: absolute;
                color: #ffd700;
                font-weight: bold;
                font-size: 24px;
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
                pointer-events: none;
                animation: flyUp 1.5s ease-out forwards;
            }
            
            @keyframes flyUp {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-50px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    scheduleNextCookies() {
        setTimeout(() => {
            // Check if we're still on an allowed page before spawning cookies
            const currentPage = window.location.pathname.split('/').pop() || '';
            if (!this.allowedPages.includes(currentPage)) {
                console.log("Page changed, no longer spawning golden cookies");
                return;
            }
            
            // Check if the document is visible (don't spawn if tab is inactive)
            if (document.visibilityState !== "visible") {
                console.log("Page not visible, skipping golden cookie spawn");
                this.scheduleNextCookies(); // Reschedule
                return;
            }
            
            // Randomly decide how many cookies to create (1-5)
            const cookieCount = Math.floor(Math.random() * (this.maxCookies - this.minCookies + 1)) + this.minCookies;
            console.log(`Spawning ${cookieCount} golden cookies`);
            
            // Create cookies with slight delay between each
            for (let i = 0; i < cookieCount; i++) {
                setTimeout(() => {
                    this.createGoldenCookie();
                }, i * 300); // 300ms delay between each cookie
            }
            
            // Schedule the next batch of cookies
            this.scheduleNextCookies();
        }, this.interval);
        
        console.log(`Next batch of golden cookies scheduled in 1 minute`);
    }
    
    createGoldenCookie() {
        // Only create cookies when user is active on the page
        if (document.hidden) {
            console.log("Page not visible, skipping golden cookie");
            return;
        }
        
        const cookie = document.createElement('div');
        cookie.className = 'golden-floating-cookie';
        
        // Random horizontal position
        const leftPosition = Math.random() * (window.innerWidth - this.cookieSize);
        
        // Start above the viewport
        cookie.style.left = `${leftPosition}px`;
        cookie.style.top = `-${this.cookieSize}px`;
        
        // Add to DOM
        document.body.appendChild(cookie);
        
        // Track this cookie
        const cookieInfo = { element: cookie, clicked: false };
        this.activeCookies.push(cookieInfo);
        
        // Animate downward
        const startTime = Date.now();
        const endPosition = window.innerHeight + this.cookieSize; // Just below viewport
        
        const animateCookie = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / this.floatDuration;
            
            if (progress < 1 && !cookieInfo.clicked) {
                const newY = progress * endPosition;
                cookie.style.top = `${newY}px`;
                requestAnimationFrame(animateCookie);
            } else if (!cookieInfo.clicked) {
                // Remove cookie if it wasn't clicked
                this.removeCookie(cookie);
            }
        };
        
        // Start animation
        requestAnimationFrame(animateCookie);
        
        // Add click handler
        cookie.addEventListener('click', () => {
            if (!cookieInfo.clicked) {
                this.handleCookieClick(cookie, cookieInfo);
            }
        });
        
        // Play sound if AudioHelper exists
        if (typeof AudioHelper !== 'undefined') {
            AudioHelper.playSound('sounds/goldencookie.mp3', 0.3).catch(() => {
                // Silently fail if audio can't be played
            });
        }
        
        console.log("Golden cookie created");
    }
    
    handleCookieClick(cookie, cookieInfo) {
        // Mark as clicked to prevent multiple clicks
        cookieInfo.clicked = true;
        
        // Calculate random reward
        const reward = Math.floor(Math.random() * (this.maxReward - this.minReward + 1)) + this.minReward;
        
        // Add points using PointsManager if available, otherwise directly
        if (typeof PointsManager !== 'undefined') {
            PointsManager.addPoints(reward);
        } else {
            const currentPoints = parseInt(localStorage.getItem('points')) || 0;
            localStorage.setItem('points', currentPoints + reward);
            
            // Update points display
            const pointsDisplay = document.getElementById('pointsValue');
            if (pointsDisplay) {
                pointsDisplay.textContent = currentPoints + reward;
            }
        }
        
        // Track golden cookies clicked for achievement
        const goldenClicked = parseInt(localStorage.getItem('goldenCookiesClicked') || '0') + 1;
        localStorage.setItem('goldenCookiesClicked', goldenClicked);
        
        // Track earnings
        const goldenEarnings = parseInt(localStorage.getItem('goldenCookieEarnings') || '0') + reward;
        localStorage.setItem('goldenCookieEarnings', goldenEarnings);
        
        // Show points earned
        this.showPointsEarned(cookie, reward);
        
        // Play pop effect
        cookie.classList.add('golden-cookie-pop');
        
        // Remove after animation
        setTimeout(() => {
            this.removeCookie(cookie);
        }, 500);
        
        // Play bubble pop sound when golden cookie is clicked
        // Add better error handling for missing audio files
        try {
            if (typeof AudioHelper !== 'undefined' && !this.audioFailed) {
                AudioHelper.playPopSound(0.5).catch(e => {
                    this.audioFailed = true;
                });
            } else {
                // Simple fallback without relying on audio files
                const audio = new Audio();
                audio.volume = 0.5;
                const audioTypes = ['audio/bubblePop.mp3', 'audio/click.mp3', 'sounds/pop.mp3'];
                
                // Try different audio files
                for (const src of audioTypes) {
                    try {
                        audio.src = src;
                        audio.play().catch(() => {
                            // Silently fail if autoplay is blocked
                        });
                        break;
                    } catch (err) {
                        // Try next audio file
                    }
                }
            }
        } catch (err) {
            // Completely ignore audio errors
        }
    }
    
    showPointsEarned(cookie, amount) {
        const pointsText = document.createElement('div');
        pointsText.className = 'golden-cookie-points';
        pointsText.textContent = `+${amount}`;
        
        // Position relative to the cookie
        const cookieRect = cookie.getBoundingClientRect();
        pointsText.style.left = `${cookieRect.left + cookieRect.width / 2}px`;
        pointsText.style.top = `${cookieRect.top}px`;
        pointsText.style.transform = 'translate(-50%, -100%)';
        
        document.body.appendChild(pointsText);
        
        // Remove after animation completes
        setTimeout(() => {
            if (document.body.contains(pointsText)) {
                document.body.removeChild(pointsText);
            }
        }, 1500);
    }
    
    removeCookie(cookie) {
        // Remove from activeCookies array
        this.activeCookies = this.activeCookies.filter(info => info.element !== cookie);
        
        // Remove from DOM
        if (document.body.contains(cookie)) {
            document.body.removeChild(cookie);
        }
    }
    
    // Method to test cookie generation immediately (useful for debugging)
    testCookieSpawn() {
        // Check if we're on an allowed page before testing
        const currentPage = window.location.pathname.split('/').pop() || '';
        if (!this.allowedPages.includes(currentPage)) {
            console.log("Cannot test spawn on this page:", currentPage);
            return;
        }
        
        const testCount = Math.floor(Math.random() * 5) + 1;
        console.log(`Testing spawn of ${testCount} golden cookies`);
        
        for (let i = 0; i < testCount; i++) {
            setTimeout(() => {
                this.createGoldenCookie();
            }, i * 300);
        }
    }
    
    // Add a method to clean up any existing cookies when navigating away
    cleanupCookies() {
        this.activeCookies.forEach(cookieInfo => {
            if (document.body.contains(cookieInfo.element)) {
                document.body.removeChild(cookieInfo.element);
            }
        });
        this.activeCookies = [];
    }
}

// Initialize the golden cookie generator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.goldenCookieGenerator = new GoldenCookieGenerator();
    
    // For testing - create a batch of cookies immediately (after 2 seconds)
    // Only if we're on an allowed page
    const currentPage = window.location.pathname.split('/').pop() || '';
    const allowedPages = ['index.html', ''];
    if (allowedPages.includes(currentPage)) {
        setTimeout(() => {
            if (window.goldenCookieGenerator) {
                window.goldenCookieGenerator.testCookieSpawn();
            }
        }, 2000);
    }
    
    // Add navigation event listener to clean up cookies when leaving the page
    window.addEventListener('beforeunload', () => {
        if (window.goldenCookieGenerator) {
            window.goldenCookieGenerator.cleanupCookies();
        }
    });
});
