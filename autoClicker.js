// Simplified auto-clicker logic with explicit state verification

// Initialize key variables from localStorage with proper type conversion
let autoClickerPurchased = localStorage.getItem("autoClickerPurchased") === "true";
let autoClickerUpgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
// Auto clicker points should be directly tied to upgrade count, no minimum value
let autoClickerPointsPerSecond = autoClickerUpgradeCount;
let autoClickerBaseCost = 10;
let autoClickerInterval = null;

// Function to purchase or upgrade the auto clicker
function handleAutoClickerPurchase() {
    // Get current points - use consistent method
    const points = parseInt(localStorage.getItem("points")) || 0;
    const rebirthLevel = parseInt(localStorage.getItem("rebirths")) || 0;
    const maxUpgrades = 5 + (rebirthLevel * 5);
    const currentCost = autoClickerBaseCost + (autoClickerUpgradeCount * 45);

    if (points >= currentCost && autoClickerUpgradeCount < maxUpgrades) {
        // Deduct points
        const newPoints = points - currentCost;
        localStorage.setItem("points", newPoints);
        
        // Update display
        const pointsValue = document.getElementById("pointsValue");
        if (pointsValue) {
            pointsValue.textContent = newPoints;
        }

        // Update auto clicker state
        autoClickerUpgradeCount++;
        autoClickerPointsPerSecond = autoClickerUpgradeCount; // Direct relationship
        autoClickerPurchased = true;

        // Save to localStorage with consistent string format
        localStorage.setItem("autoClickerPurchased", "true");
        localStorage.setItem("autoClickerUpgradeCount", autoClickerUpgradeCount);
        localStorage.setItem("autoClickerPointsPerSecond", autoClickerPointsPerSecond);

        // Update UI
        updateAutoClickerDisplay();
        
        // Start the auto clicker if this is the first purchase
        if (autoClickerUpgradeCount === 1) {
            startAutoClicker();
        }
    }
}

// Function to update the display for the auto clicker
function updateAutoClickerDisplay() {
    let currentCost = autoClickerBaseCost + (autoClickerUpgradeCount * 45);
    const upgradeCostElement = document.getElementById("autoClickerCost");
    const upgradeCountElement = document.getElementById("autoClickerUpgradeCount");
    const rebirthLevel = parseInt(localStorage.getItem("rebirths")) || 0;
    const maxUpgrades = 5 + (rebirthLevel * 5);
    const maxUpgradesElement = document.getElementById("autoClickerMaxUpgrades");
    const autoClickerStatus = document.getElementById("autoClickerStatus");

    if (upgradeCostElement) {
        upgradeCostElement.textContent = currentCost;
    }
    
    if (upgradeCountElement) {
        upgradeCountElement.textContent = autoClickerUpgradeCount;
    }
    
    if (maxUpgradesElement) {
        maxUpgradesElement.textContent = maxUpgrades;
    }
    
    if (autoClickerStatus) {
        if (autoClickerPurchased) {
            autoClickerStatus.textContent = `Active (${autoClickerPointsPerSecond}/sec)`;
        } else {
            autoClickerStatus.textContent = "Not Purchased";
        }
    }
}

// IMPORTANT: Don't run autoclicker on powerUps page
function shouldRunAutoClicker() {
    const currentPath = window.location.pathname;
    return !currentPath.includes('powerUps.html') && !currentPath.includes('leaderBoard.html');
}

// Explicit function to run the auto clicker
function runAutoClicker() {
    // Always verify state before adding points
    const isAutoclickerActive = localStorage.getItem("autoClickerPurchased") === "true";
    const upgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
    
    if (!isAutoclickerActive || upgradeCount <= 0) return;
    
    // Calculate points to add
    let autoClickPoints = upgradeCount;
    
    // Apply multipliers
    const autoMultiplier = parseFloat(localStorage.getItem('autoClickerMultiplier')) || 1;
    autoClickPoints *= autoMultiplier;
    
    // Add points
    const currentPoints = parseInt(localStorage.getItem("points")) || 0;
    const newPoints = currentPoints + autoClickPoints;
    localStorage.setItem("points", newPoints);
    
    // Update UI
    const pointsValue = document.getElementById("pointsValue");
    if (pointsValue) {
        pointsValue.textContent = newPoints;
    }
}

// Start auto clicker with proper verification
function startAutoClicker() {
    // Clear any existing interval
    if (autoClickerInterval) {
        clearInterval(autoClickerInterval);
    }
    
    // Only start if purchased and has at least one upgrade - STRICTER CHECK
    const isAutoclickerActive = localStorage.getItem("autoClickerPurchased") === "true";
    const upgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
    
    // More explicit logging to help debug
    console.log("Auto clicker check - Purchased:", isAutoclickerActive, 
               "Upgrade count:", upgradeCount, 
               "Should start:", isAutoclickerActive && upgradeCount > 0);
               
    if (isAutoclickerActive && upgradeCount > 0) {
        // Double check one more time
        if (localStorage.getItem("autoClickerPurchased") !== "true" || 
            (parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0) <= 0) {
            console.log("Failed safety check - not starting auto clicker");
            return;
        }
        
        autoClickerInterval = setInterval(runAutoClicker, 1000);
        console.log("Auto clicker started with " + upgradeCount + " upgrade(s)");
    } else {
        console.log("Auto clicker not started - conditions not met");
    }
}

// Verify and reset autoClicker state if inconsistent
function verifyAutoClickerState() {
    // Get saved values
    const savedPurchased = localStorage.getItem("autoClickerPurchased") === "true";
    const savedUpgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
    const savedPointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 0;
    
    // Check for inconsistencies
    let needsFix = false;
    
    // If not purchased but has upgrades, fix it
    if (!savedPurchased && savedUpgradeCount > 0) {
        localStorage.setItem("autoClickerPurchased", "true");
        needsFix = true;
    }
    
    // If purchased but no upgrades, fix it
    if (savedPurchased && savedUpgradeCount <= 0) {
        localStorage.setItem("autoClickerPurchased", "false");
        needsFix = true;
    }
    
    // Make sure points per second matches upgrade count
    if (savedPointsPerSecond !== savedUpgradeCount) {
        localStorage.setItem("autoClickerPointsPerSecond", savedUpgradeCount.toString());
        needsFix = true;
    }
    
    // If inconsistencies were fixed, reload variables
    if (needsFix) {
        autoClickerPurchased = localStorage.getItem("autoClickerPurchased") === "true";
        autoClickerUpgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
        autoClickerPointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 0;
        console.log("Auto clicker state fixed:", {
            purchased: autoClickerPurchased,
            upgradeCount: autoClickerUpgradeCount,
            pointsPerSecond: autoClickerPointsPerSecond
        });
    }
    
    return needsFix;
}

// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // IMPORTANT: Verify state at the beginning
    verifyAutoClickerState();
    
    // Force variables to match localStorage exactly
    autoClickerPurchased = localStorage.getItem("autoClickerPurchased") === "true";
    autoClickerUpgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
    autoClickerPointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 0;
    
    // Log current state to help debug
    console.log("Auto clicker initialization - Purchased:", autoClickerPurchased,
               "Upgrade count:", autoClickerUpgradeCount,
               "Points per second:", autoClickerPointsPerSecond);
    
    const autoClickerElement = document.getElementById("autoClicker");
    if (autoClickerElement) {
        autoClickerElement.addEventListener("click", handleAutoClickerPurchase);
    }

    // Retrieve autoClickerPointsPerSecond from localStorage on page load
    autoClickerPointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 1;

    // Initialize the display on page load
    updateAutoClickerDisplay();
    
    // Start the auto clicker if purchased AND has upgrades AND on appropriate page
    if (autoClickerPurchased && autoClickerUpgradeCount > 0 && shouldRunAutoClicker()) {
        startAutoClicker();
    } else {
        console.log("Auto clicker not started. Purchased:", autoClickerPurchased, 
                  "Upgrade count:", autoClickerUpgradeCount, 
                  "On appropriate page:", shouldRunAutoClicker());
    }

    // Add a rebirth event listener that immediately stops the autoclicker
    window.addEventListener('storage', function(e) {
        if (e.key === 'lastRebirthTimestamp') {
            // Immediately stop autoclicker on rebirth
            if (autoClickerInterval) {
                clearInterval(autoClickerInterval);
                autoClickerInterval = null;
            }
            // Update local variables
            autoClickerPurchased = false;
            autoClickerUpgradeCount = 0;
            localStorage.setItem("autoClickerPurchased", "false");
            localStorage.setItem("autoClickerUpgradeCount", "0");
            console.log("Rebirth detected: Auto clicker stopped and reset");
        }
    });
});

// Clear auto-adding points in script.js by overriding the interval
document.addEventListener("DOMContentLoaded", function() {
    // Find and clear any autoclicker intervals from script.js
    const scriptIntervals = [];
    const originalSetInterval = window.setInterval;
    
    // Store the original setInterval reference
    window.setInterval = function(callback, delay) {
        const intervalId = originalSetInterval(callback, delay);
        
        // If this is an auto clicker interval from script.js, track it
        if (delay === 1000 && callback.toString().includes('autoClickerPurchased')) {
            scriptIntervals.push(intervalId);
            console.log("Detected and tracking script.js auto clicker interval:", intervalId);
        }
        
        return intervalId;
    };
    
    // After a short delay, clear any tracked intervals
    setTimeout(() => {
        scriptIntervals.forEach(id => {
            clearInterval(id);
            console.log("Cleared duplicate auto clicker interval:", id);
        });
        
        // Restore original setInterval
        window.setInterval = originalSetInterval;
        
        // Now start our own proper auto clicker if needed
        if (autoClickerPurchased && autoClickerUpgradeCount > 0 && shouldRunAutoClicker()) {
            startAutoClicker();
        }
    }, 1000);
});

// Listen for changes to localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'autoClickerPurchased' || e.key === 'autoClickerUpgradeCount') {
        // Update local variables
        autoClickerPurchased = JSON.parse(localStorage.getItem("autoClickerPurchased")) || false;
        autoClickerUpgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
        
        console.log("Auto clicker status changed. Purchased:", autoClickerPurchased, "Upgrade count:", autoClickerUpgradeCount);
        
        // Only start autoclicker if it's purchased AND has upgrades
        if (autoClickerPurchased && autoClickerUpgradeCount > 0 && shouldRunAutoClicker()) {
            startAutoClicker();
        } else if ((!autoClickerPurchased || autoClickerUpgradeCount <= 0) && autoClickerInterval) {
            // Stop autoclicker if no longer purchased or has no upgrades
            clearInterval(autoClickerInterval);
            autoClickerInterval = null;
            console.log("Auto clicker stopped due to status change");
        }
    } else if (e.key === 'lastRebirthTimestamp') {
        // Reset states when rebirth happens
        autoClickerPurchased = JSON.parse(localStorage.getItem("autoClickerPurchased")) || false;
        autoClickerUpgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
        autoClickerPointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 1;
        
        // Stop existing interval and restart if needed
        if (autoClickerInterval) {
            clearInterval(autoClickerInterval);
            autoClickerInterval = null;
        }
        
        // Only start if conditions are met after rebirth
        if (autoClickerPurchased && autoClickerUpgradeCount > 0 && shouldRunAutoClicker()) {
            startAutoClicker();
        } else {
            console.log("Auto clicker not restarted after rebirth. Purchased:", autoClickerPurchased, 
                      "Upgrade count:", autoClickerUpgradeCount);
        }
    }
});
