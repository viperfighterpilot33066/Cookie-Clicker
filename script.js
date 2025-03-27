// Add this at the beginning of the file to initialize key game state variables consistently
document.addEventListener("DOMContentLoaded", function() {
    // Initialize core game state with default values if not set
    if (!localStorage.getItem("gameInitialized")) {
        // First-time initialization - set default values
        localStorage.setItem("points", "0");
        localStorage.setItem("pointsPerClick", "1");
        localStorage.setItem("autoClickerPurchased", "false");
        localStorage.setItem("autoClickerUpgradeCount", "0"); 
        localStorage.setItem("autoClickerPointsPerSecond", "0"); // Should start at 0, not 1
        localStorage.setItem("cursorUpgradeActive", "0"); // Fixed the typo from "curser" to "cursor"
        
        // Mark as initialized to avoid resetting on refresh
        localStorage.setItem("gameInitialized", "true");
    }
    
    // Initialize points value display
    updatePointsDisplay();
});

// Add this at the beginning of the file (or near the top, before the click handling logic)

document.addEventListener("DOMContentLoaded", function() {
    // If PointsManager exists, use it to sync points
    if (typeof PointsManager !== 'undefined') {
        PointsManager.syncFromServer();
        const currentPoints = PointsManager.getPoints();
        
        // Update UI
        const pointsValue = document.getElementById("pointsValue");
        if (pointsValue) {
            pointsValue.innerHTML = currentPoints;
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Add class to prevent transitions on load
    document.body.classList.add('no-transition');
    
    // Remove the class after a small delay
    setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 100);

    // Initialize Firebase
    const database = firebase.database();
    
    // Initialize dark mode globally
    initDarkMode();

    const pointsValue = document.getElementById("pointsValue");
    if (!pointsValue) {
        console.warn("Points value element not found.");
        return;
    }
    
    // IMPORTANT: Removed built-in auto clicker from script.js
    // We'll rely on autoClicker.js to handle this functionality
    
    // CRITICAL: Kill any existing auto clicker intervals
    if (window.scriptAutoClickerInterval) {
        clearInterval(window.scriptAutoClickerInterval);
        console.log("Cleared existing script.js auto clicker interval");
    }
    
    // Track when we need to clear the autoClicker to prevent duplicates
    let autoClickerClearingNeeded = true;
    
    // After a short delay, check if we need to clear any auto clicker intervals
    setTimeout(() => {
        if (autoClickerClearingNeeded && window.clearDuplicateIntervals) {
            window.clearDuplicateIntervals();
            autoClickerClearingNeeded = false;
        }
    }, 500);

    // IMPORTANT: Don't attach cookie click handlers here if eventCleanup.js is loaded
    const cookie = document.getElementById("cookie");
    if (cookie && !window._cookieElement) { // Only attach if eventCleanup hasn't run
        cookie.addEventListener("click", function () {
            // Get cursor upgrade level from localStorage
            const cursorUpgradeActive = parseInt(localStorage.getItem('cursorUpgradeActive')) || 0; // ADDED THIS LINE
            
            // Get current multiplier values
            const clickMultiplier = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
            let pointsPerClick = (1 + cursorUpgradeActive) * clickMultiplier;
            
            // Apply permanent bonus from Thanks4Helping promo code
            const permanentBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
            if (permanentBonus > 0) {
                pointsPerClick = Math.floor(pointsPerClick * (1 + permanentBonus));
            }
            
            // Add points using PointsManager for consistency
            PointsManager.addPoints(pointsPerClick);
        });
    }

    // Apply pet bonuses to point calculations
    function applyPetBonuses() {
        // Check for pet CPS bonus
        const petBonusCPS = parseFloat(localStorage.getItem('petBonusCPS')) || 0;
        const petProductionBonus = parseFloat(localStorage.getItem('petProductionBonus')) || 0;
        
        if (petBonusCPS > 0) {
            // Add flat CPS bonus
            const baseAutoClickerPointsPerSecond = 1;
            const boostedPointsPerSecond = baseAutoClickerPointsPerSecond + petBonusCPS;
            localStorage.setItem('autoClickerPointsPerSecond', boostedPointsPerSecond);
            
            console.log(`Applied pet CPS bonus: +${petBonusCPS}`);
        }
        
        // Apply production percentage bonus
        if (petProductionBonus > 0) {
            const currentMultiplier = parseFloat(localStorage.getItem('autoClickerMultiplier')) || 1;
            // Only apply if it hasn't been applied already
            if (currentMultiplier < (1 + petProductionBonus)) {
                const newMultiplier = currentMultiplier * (1 + petProductionBonus);
                localStorage.setItem('autoClickerMultiplier', newMultiplier);
                console.log(`Applied pet production bonus: +${petProductionBonus * 100}%`);
            }
        }
    }
    
    // Initialize pet system
    if (!window.petSystem && typeof PetSystem !== 'undefined') {
        window.petSystem = new PetSystem();
    }
    
    // Apply pet bonuses
    applyPetBonuses();
    
    // Update display if status bar exists
    if (window.statusDisplay) {
        window.statusDisplay.updateStatusDisplay();
    } else if (typeof StatusDisplay !== 'undefined') {
        window.statusDisplay = new StatusDisplay();
        window.statusDisplay.createStatusDisplay();
        window.statusDisplay.startMonitoring();
    }
});

// Add click sound to cookie clicks
document.addEventListener("DOMContentLoaded", function () {
    const cookie = document.getElementById("cookie");
    const pointsElement = document.getElementById("pointsValue");
    
    if (cookie) {
        // Add backup click handler if clickEffects isn't loaded
        if (typeof clickEffects === 'undefined') {
            cookie.addEventListener("click", function () {
                // Play click sound
                if (typeof AudioHelper !== 'undefined') {
                    AudioHelper.playClickSound(0.3);
                } else {
                    try {
                        const audio = new Audio('audio/click.mp3');
                        audio.volume = 0.3;
                        audio.play().catch(e => console.log('Audio not supported or allowed'));
                    } catch (err) {
                        console.log('Audio not supported');
                    }
                }
                
                // Handle point accumulation
                let points = parseInt(localStorage.getItem("points")) || 0;
                let pointsPerClick = parseInt(localStorage.getItem("cursorUpgradeActive")) || 1;
                points += pointsPerClick;
                localStorage.setItem("points", points);
                if (pointsElement) pointsElement.textContent = points;
            });
        }
    }
});

// Global dark mode initialization function
function initDarkMode() {
    // Apply dark mode setting from localStorage immediately on page load
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Handle any dark mode toggles in the document
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkMode;
        
        darkModeToggle.addEventListener('change', () => {
            const enabled = darkModeToggle.checked;
            localStorage.setItem('darkMode', enabled);
            document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
        });
    }
}

// Create and add a global dark mode initialization script to ensure it's available on all pages
document.addEventListener('DOMContentLoaded', initDarkMode);

// Add settings menu functionality
document.addEventListener("DOMContentLoaded", function() {
    // Settings menu functionality
    const settingsButton = document.getElementById("settingsButton");
    const settingsMenu = document.querySelector(".settings-menu");
    const closeSettings = document.getElementById("closeSettings");
    
    if (settingsButton && settingsMenu) {
        // Open settings menu when the gear icon is clicked
        settingsButton.addEventListener("click", function() {
            settingsMenu.style.display = "block";
        });
        
        // Close settings menu when the X button is clicked
        if (closeSettings) {
            closeSettings.addEventListener("click", function() {
                settingsMenu.style.display = "none";
            });
        }
        
        // Close settings menu when clicking outside of it
        document.addEventListener("click", function(event) {
            if (!settingsMenu.contains(event.target) && event.target !== settingsButton) {
                settingsMenu.style.display = "none";
            }
        });
    }
    
    // Initialize points value display
    const pointsValue = document.getElementById("pointsValue");
    if (pointsValue) {
        const savedPoints = localStorage.getItem("points") || "0";
        pointsValue.innerHTML = savedPoints;
    }
    
    // Cookie click functionality 
    const cookie = document.getElementById("cookie");
    if (cookie) {
        cookie.addEventListener("click", function() {
            // Get current points
            let points = parseInt(localStorage.getItem("points")) || 0;
            let pointsPerClick = parseInt(localStorage.getItem("cursorUpgradeActive")) || 1;
            
            // Add points
            points += pointsPerClick;
            
            // Update localStorage
            localStorage.setItem("points", points);
            
            // Update display
            if (pointsValue) {
                pointsValue.innerHTML = points;
            }
            
            // Track total clicks for achievements
            const totalClicks = parseInt(localStorage.getItem('totalClicks') || '0') + 1;
            localStorage.setItem('totalClicks', totalClicks);
            
            // Increment achievement tracking if manager exists
            if (window.achievementManager) {
                window.achievementManager.incrementClicks();
            }
        });
    }
    
    // Fix the Firebase reference
    // Only try to use Firebase if it's properly initialized through the module import
    if (window.firebase) {
        try {
            // Use the globally available firebase object
            console.log("Firebase initialized successfully");
        } catch (e) {
            console.error("Error initializing Firebase:", e);
        }
    } else {
        console.log("Firebase not available or initialized differently - using module imports");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Initialize points and UI
    updateUI();
    
    // Only sync from server if PointsManager is available and has the method
    if (window.PointsManager && typeof window.PointsManager.syncFromServer === 'function') {
        try {
            window.PointsManager.syncFromServer();
        } catch (e) {
            console.error("Error syncing from server:", e);
        }
    } else {
        console.log("PointsManager.syncFromServer not available");
    }

    // Settings menu functionality
    const settingsButton = document.getElementById("settingsButton");
    const settingsMenu = document.querySelector(".settings-menu");
    const closeSettings = document.getElementById("closeSettings");
    
    if (settingsButton && settingsMenu) {
        settingsButton.addEventListener("click", function() {
            settingsMenu.style.display = "block";
        });
        
        if (closeSettings) {
            closeSettings.addEventListener("click", function() {
                settingsMenu.style.display = "none";
            });
        }
        
        document.addEventListener("click", function(event) {
            if (!settingsMenu.contains(event.target) && event.target !== settingsButton) {
                settingsMenu.style.display = "none";
            }
        });
    }

    // Game initialization
    initializeGame();
    
    // Apply pet CPS bonus if available
    applyPetCPSBonus();
});

// Consolidated point click handling to ensure consistency
function handleCookieClick() {
    // Get base click value - starts at 1
    let basePointsPerClick = 1;
    
    // Add cursor upgrade bonus (1 point per upgrade level)
    const cursorUpgradeLevel = parseInt(localStorage.getItem("cursorUpgradeActive")) || 0;
    basePointsPerClick += cursorUpgradeLevel;
    
    // Check for click multiplier from promo codes
    const clickMultiplier = parseFloat(localStorage.getItem("clickMultiplier")) || 1;
    
    // Apply multiplier
    let finalPointsPerClick = basePointsPerClick * clickMultiplier;
    
    // Apply permanent bonus only if it exists (from promo code)
    const permanentBonus = parseFloat(localStorage.getItem("permanentPointsBonus")) || 0;
    if (permanentBonus > 0) {
        finalPointsPerClick = Math.floor(finalPointsPerClick * (1 + permanentBonus));
    }
    
    // Add points using PointsManager or fallback to localStorage
    if (window.PointsManager && typeof window.PointsManager.addPoints === 'function') {
        window.PointsManager.addPoints(finalPointsPerClick);
    } else {
        // Fallback to direct localStorage
        const currentPoints = parseInt(localStorage.getItem("points")) || 0;
        localStorage.setItem("points", currentPoints + finalPointsPerClick);
        updatePointsDisplay();
    }
    
    // Track total clicks for achievements
    const totalClicks = parseInt(localStorage.getItem('totalClicks') || '0') + 1;
    localStorage.setItem('totalClicks', totalClicks);
    
    // Update achievements if manager exists
    if (window.achievementManager) {
        window.achievementManager.incrementClicks();
    }

    // Update only the points display, not the status bar
    const pointsDisplay = document.getElementById('pointsValue');
    if (pointsDisplay) {
        pointsDisplay.textContent = parseInt(localStorage.getItem('points')) || 0;
    }
    
    // Ensure status bar shows the correct points per click
    const statusPointsValue = document.querySelector('.status-section .points-value');
    if (statusPointsValue && statusPointsValue.getAttribute('data-original')) {
        statusPointsValue.textContent = statusPointsValue.getAttribute('data-original');
    }
}

// Function to update UI with current points
function updateUI() {
    const pointsValue = document.getElementById("pointsValue");
    if (pointsValue) {
        const savedPoints = localStorage.getItem("points") || "0";
        pointsValue.innerHTML = savedPoints;
    }
}

// Update points display function
function updatePointsDisplay() {
    const pointsValue = document.getElementById("pointsValue");
    if (pointsValue) {
        pointsValue.textContent = localStorage.getItem("points") || "0";
    }
}

// Initialize core game functionality
function initializeGame() {
    const cookie = document.getElementById("cookie");
    if (!cookie) return;
    
    cookie.addEventListener("click", function() {
        // Get current points using PointsManager if available
        let currentPoints;
        let pointsPerClick = parseInt(localStorage.getItem("pointsPerClick")) || 1;
        
        if (window.PointsManager && typeof window.PointsManager.addPoints === 'function') {
            window.PointsManager.addPoints(pointsPerClick);
        } else {
            // Fallback to local storage
            currentPoints = parseInt(localStorage.getItem("points")) || 0;
            currentPoints += pointsPerClick;
            localStorage.setItem("points", currentPoints);
            updateUI();
        }
        
        // Track total clicks for achievements
        const totalClicks = parseInt(localStorage.getItem('totalClicks') || '0') + 1;
        localStorage.setItem('totalClicks', totalClicks);
        
        // Update achievements if available
        if (window.achievementManager && typeof window.achievementManager.incrementClicks === 'function') {
            window.achievementManager.incrementClicks();
        }
    });
}

// Apply pet CPS bonus if available
function applyPetCPSBonus() {
    const petBonus = parseFloat(localStorage.getItem('petBonusCPS')) || 0;
    
    if (petBonus > 0) {
        console.log(`Applied pet CPS bonus: +${petBonus}`);
        
        // Add CPS bonus every second
        setInterval(function() {
            if (window.PointsManager && typeof window.PointsManager.addPoints === 'function') {
                window.PointsManager.addPoints(petBonus, true);
            } else {
                const currentPoints = parseInt(localStorage.getItem("points")) || 0;
                localStorage.setItem("points", currentPoints + petBonus);
                updateUI();
            }
        }, 1000);
    }
}

// Watch for authentication changes and handle cookie click handlers
document.addEventListener('userAuthenticated', function() {
    console.log("Auth change detected in script.js");
    
    // Avoid reattaching event handlers
    const cookie = document.getElementById("cookie");
    if (cookie && window._cookieElement !== cookie) {
        console.log("Cookie element changed - letting eventCleanup handle it");
    }
});

// Add a click event filter to prevent wrong updates
document.addEventListener("click", function(event) {
    // Only run this after small delay
    setTimeout(() => {
        // Check if any status bar point values might have been overwritten
        const statusPointsValue = document.querySelector('.status-section .points-value');
        if (statusPointsValue && statusPointsValue.getAttribute('data-original')) {
            const originalValue = statusPointsValue.getAttribute('data-original');
            if (statusPointsValue.textContent !== originalValue) {
                console.log("Fixing status bar display: restoring points per click");
                statusPointsValue.textContent = originalValue;
            }
        }
    }, 10);
}, true);

// Enhanced cookie click handler with isolation
document.addEventListener("DOMContentLoaded", function() {
    // Set a flag to track if we've already attached our handler
    window._cookieClickHandlerAttached = window._cookieClickHandlerAttached || false;
    
    if (window._cookieClickHandlerAttached) {
        return; // Don't attach multiple handlers
    }
    
    // Get the cookie element
    const cookie = document.getElementById("cookie");
    if (!cookie) return;
    
    // Remove any existing click event handlers by cloning
    const newCookie = cookie.cloneNode(true);
    if (cookie.parentNode) {
        cookie.parentNode.replaceChild(newCookie, cookie);
    }
    
    // Add our isolated click handler
    newCookie.addEventListener("click", function(e) {
        // Use a single unified function for handling clicks
        handleIsolatedCookieClick(e);
    });
    
    // Mark that we've attached our handler
    window._cookieClickHandlerAttached = true;
    console.log("Isolated cookie click handler attached");
});

// Isolated cookie click handler function
function handleIsolatedCookieClick(e) {
    // 1. Play click sound
    playClickSound();
    
    // 2. Create visual effects
    createClickVisuals(e);
    
    // 3. Calculate points to add
    const cursorUpgradeActive = parseInt(localStorage.getItem('cursorUpgradeActive')) || 0;
    const clickMultiplier = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
    let pointsToAdd = (1 + cursorUpgradeActive) * clickMultiplier;
    
    // Apply permanent bonus
    const permanentBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
    if (permanentBonus > 0) {
        pointsToAdd *= (1 + permanentBonus);
    }
    
    // 4. Add points using PointsManager if available
    if (window.PointsManager && typeof window.PointsManager.addPoints === 'function') {
        window.PointsManager.addPoints(Math.floor(pointsToAdd));
    } else {
        // Fallback to direct localStorage method
        const currentPoints = parseInt(localStorage.getItem('points')) || 0;
        localStorage.setItem('points', currentPoints + Math.floor(pointsToAdd));
        
        // Update only the points display, NOT the status bar
        const pointsValue = document.getElementById('pointsValue');
        if (pointsValue) {
            pointsValue.textContent = currentPoints + Math.floor(pointsToAdd);
        }
    }
    
    // 5. Track total clicks for achievements
    const totalClicks = parseInt(localStorage.getItem('totalClicks') || '0') + 1;
    localStorage.setItem('totalClicks', totalClicks);
    
    // 6. Fix status bar display after a short delay
    setTimeout(() => {
        fixStatusBarDisplay();
    }, 10);
}

// Play click sound function
function playClickSound() {
    try {
        if (window.AudioHelper && typeof window.AudioHelper.playClickSound === 'function') {
            window.AudioHelper.playClickSound(0.3);
        } else {
            const audio = new Audio('audio/click.mp3');
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Audio not supported or allowed'));
        }
    } catch (err) {
        console.log('Audio not supported');
    }
}

// Create click visuals function
function createClickVisuals(e) {
    // Only if the element is the cookie
    if (e.target.id !== "cookie" && e.currentTarget.id !== "cookie") return;
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255,255,255,0.4)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    
    // Position ripple relative to click
    const rect = e.currentTarget.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left - 10) + 'px';
    ripple.style.top = (e.clientY - rect.top - 10) + 'px';
    ripple.style.pointerEvents = 'none';
    
    // Append to cookie
    e.currentTarget.appendChild(ripple);
    
    // Animate and remove
    const anim = ripple.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(3)', opacity: 0 }
    ], { duration: 600 });
    
    anim.onfinish = () => ripple.remove();
    
    // Create number popup showing points gained
    createPointsPopup(e);
}

// Create points popup
function createPointsPopup(e) {
    // Calculate points to show
    const cursorUpgradeActive = parseInt(localStorage.getItem('cursorUpgradeActive')) || 0;
    const clickMultiplier = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
    let points = (1 + cursorUpgradeActive) * clickMultiplier;
    
    // Apply permanent bonus
    const permanentBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
    if (permanentBonus > 0) {
        points *= (1 + permanentBonus);
    }
    
    // Create popup element
    const popup = document.createElement('div');
    popup.textContent = '+' + Math.floor(points);
    popup.style.position = 'absolute';
    popup.style.color = 'white';
    popup.style.fontSize = '16px';
    popup.style.fontWeight = 'bold';
    popup.style.textShadow = '0 0 3px #000';
    popup.style.pointerEvents = 'none';
    
    // Position popup at click location
    const rect = e.currentTarget.getBoundingClientRect();
    popup.style.left = (e.clientX - rect.left) + 'px';
    popup.style.top = (e.clientY - rect.top) + 'px';
    
    // Add to cookie
    e.currentTarget.appendChild(popup);
    
    // Animate and remove
    popup.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-30px)', opacity: 0 }
    ], { duration: 1000 }).onfinish = () => popup.remove();
}

// Function to fix status bar display
function fixStatusBarDisplay() {
    // Get status bar points value
    const statusPointsValue = document.getElementById('statusPointsValue') || 
                             document.querySelector('#bonusStatusBar .points-value');
                             
    if (!statusPointsValue) return;
    
    // Calculate correct points per click
    const cursorUpgradeActive = parseInt(localStorage.getItem('cursorUpgradeActive')) || 0;
    const clickMultiplier = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
    let pointsPerClick = (1 + cursorUpgradeActive) * clickMultiplier;
    
    // Apply permanent bonus
    const permanentBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
    if (permanentBonus > 0) {
        pointsPerClick *= (1 + permanentBonus);
    }
    
    // Set the correct value
    statusPointsValue.textContent = Math.floor(pointsPerClick);
    
    // Store the correct value in a data attribute for recovery
    statusPointsValue.setAttribute('data-correct-value', Math.floor(pointsPerClick));
}
