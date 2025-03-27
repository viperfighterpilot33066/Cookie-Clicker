// Renamed from curserUpgrade.js to fix the typo
console.log("cursorUpgrade.js loaded");

document.addEventListener("DOMContentLoaded", function () {
    // IMPORTANT: Fix cursor upgrade naming consistency
    // Ensure cursorUpgradeActive is used everywhere (not curserUpgradeActive)
    const oldValue = localStorage.getItem("curserUpgradeActive");
    const newValue = localStorage.getItem("cursorUpgradeActive");
    
    // If the old key exists, migrate its value
    if (oldValue !== null) {
        const bestValue = Math.max(parseInt(oldValue) || 0, parseInt(newValue) || 0);
        localStorage.setItem("cursorUpgradeActive", bestValue);
        localStorage.removeItem("curserUpgradeActive"); // Remove old key
        console.log("Migrated cursor upgrade value:", bestValue);
        
        // Sync the corrected value to server
        syncCursorUpgradeToServer(bestValue);
    }

    // Load current upgrade level - CRITICAL that this is parsed here
    const cursorUpgradeActive = parseInt(localStorage.getItem("cursorUpgradeActive")) || 0;
    
    // Ensure pointsPerClick matches cursor upgrade level
    localStorage.setItem("pointsPerClick", (1 + cursorUpgradeActive).toString());
    
    // IMPORTANT: Update all UI elements immediately on ALL pages
    updateAllCursorUIElements();
    
    // Get cursor upgrade element
    const cursorUpgrade = document.querySelector("#CursorUpgrade") || document.querySelector("#CurserUpgrade");

    if (cursorUpgrade) {
        console.log("Found cursor upgrade button");
        // Add click handler
        cursorUpgrade.addEventListener("click", handleCursorUpgrade);
    }

    // Log initial state for debugging
    console.log("Initial cursor upgrade state:", cursorUpgradeActive, "Cost:", 100 + (cursorUpgradeActive * 100));
});

// Unified function to handle upgrade click
function handleCursorUpgrade() {
    // Get current values from localStorage
    const points = parseInt(localStorage.getItem("points")) || 0;
    const currentLevel = parseInt(localStorage.getItem("cursorUpgradeActive")) || 0;
    const upgradeCost = 100 + (currentLevel * 100);

    console.log("Attempting upgrade - Points:", points, "Cost:", upgradeCost);

    if (points >= upgradeCost) {
        // Deduct points
        localStorage.setItem("points", (points - upgradeCost).toString());
        
        // Increment upgrade level
        const newLevel = currentLevel + 1;
        localStorage.setItem("cursorUpgradeActive", newLevel.toString());
        
        // Update points per click
        localStorage.setItem("pointsPerClick", (1 + newLevel).toString());
        
        // Update UI
        const pointsElement = document.getElementById("pointsValue");
        if (pointsElement) {
            pointsElement.innerHTML = points - upgradeCost;
        }
        
        console.log("Upgrade successful! New level:", newLevel);
        
        // Sync to server immediately
        syncCursorUpgradeToServer(newLevel);
        
        // Update ALL UI displays
        updateAllCursorUIElements();
    } else {
        console.log("Not enough points for upgrade");
    }
}

// Comprehensive function to update all cursor-related UI elements on all pages
function updateAllCursorUIElements() {
    // Get current level directly from localStorage for consistency
    const cursorUpgradeActive = parseInt(localStorage.getItem("cursorUpgradeActive")) || 0;
    const nextUpgradeCost = 100 + (cursorUpgradeActive * 100);
    
    console.log("Updating all cursor UI elements - Level:", cursorUpgradeActive, "Cost:", nextUpgradeCost);
    
    // Create a comprehensive list of all possible elements that might exist on different pages
    const elementsToUpdate = [
        // Level displays
        { id: "cursorUpgradeLevel", value: cursorUpgradeActive, property: "textContent" },
        { id: "curserUpgradeLevel", value: cursorUpgradeActive, property: "textContent" }, // Legacy support
        { id: "curserUpgradeCount", value: cursorUpgradeActive, property: "textContent" }, // In powerUps.html
        { id: "cursorUpgradeCount", value: cursorUpgradeActive, property: "textContent" }, // In case of naming switch
        { id: "clickUpgradeLevel", value: cursorUpgradeActive, property: "textContent" }, // Another possible name
        
        // Cost displays
        { id: "cursorUpgradePrice", value: nextUpgradeCost, property: "textContent" },
        { id: "curserUpgradePrice", value: nextUpgradeCost, property: "textContent" }, // Legacy support
        { id: "cursorUpgradeCost", value: nextUpgradeCost, property: "textContent" }, // In powerUps.html
        { id: "curserUpgradeCost", value: nextUpgradeCost, property: "textContent" }, // Legacy support
        { id: "upgradeCost", value: nextUpgradeCost, property: "textContent" } // Another possible name
    ];
    
    // Update each element if it exists
    elementsToUpdate.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) {
            element[item.property] = item.value;
            console.log(`Updated ${item.id} to ${item.value}`);
        }
    });
    
    // Also check for any elements with data-upgrade="cursor" attribute
    const upgradeElements = document.querySelectorAll('[data-upgrade="cursor"]');
    upgradeElements.forEach(el => {
        const levelEl = el.querySelector('.upgrade-level');
        const costEl = el.querySelector('.upgrade-cost');
        
        if (levelEl) {
            levelEl.textContent = cursorUpgradeActive;
            console.log(`Updated dynamic level element to ${cursorUpgradeActive}`);
        }
        
        if (costEl) {
            costEl.textContent = nextUpgradeCost;
            console.log(`Updated dynamic cost element to ${nextUpgradeCost}`);
        }
    });
    
    // Also update any spans with specific class names
    const levelSpans = document.querySelectorAll('.cursor-level, .cursor-count');
    const costSpans = document.querySelectorAll('.cursor-cost, .cursor-price');
    
    levelSpans.forEach(span => {
        span.textContent = cursorUpgradeActive;
        console.log(`Updated level span to ${cursorUpgradeActive}`);
    });
    
    costSpans.forEach(span => {
        span.textContent = nextUpgradeCost;
        console.log(`Updated cost span to ${nextUpgradeCost}`);
    });
    
    // Persist in sessionStorage as well for cross-page access
    sessionStorage.setItem('cursorUpgradeLevel', cursorUpgradeActive);
    sessionStorage.setItem('cursorUpgradeCost', nextUpgradeCost);
}

// Function to sync cursor upgrade level to server
function syncCursorUpgradeToServer(level) {
    // Add a timestamp to track when the upgrade happened
    const timestamp = Date.now();
    localStorage.setItem('lastCursorUpgradeTime', timestamp.toString());
    localStorage.setItem('lastCursorUpgradeLevel', level.toString());
    
    // Method 1: Use PointsManager if available
    if (window.PointsManager && typeof window.PointsManager.syncGameStateToServer === 'function') {
        window.PointsManager.syncGameStateToServer({
            cursorUpgradeActive: level,
            pointsPerClick: 1 + level,
            lastCursorUpgradeTime: timestamp
        });
        console.log("Synced cursor upgrade to server via PointsManager:", level);
        return;
    }
    
    // Method 2: Use Firebase directly if available
    const userId = localStorage.getItem('userId');
    if (userId && window.firebase && window.firebase.database) {
        try {
            const userRef = window.firebase.database().ref(`users/${userId}`);
            userRef.update({
                cursorUpgradeActive: level,
                pointsPerClick: 1 + level,
                lastCursorUpgradeTime: timestamp
            });
            console.log("Synced cursor upgrade to server via Firebase:", level);
            return;
        } catch (e) {
            console.error("Error syncing cursor upgrade to Firebase:", e);
        }
    }
    
    // Method 3: Use global function if exists
    if (typeof window.syncGameStateToServer === 'function') {
        window.syncGameStateToServer({
            cursorUpgradeActive: level,
            pointsPerClick: 1 + level
        });
        console.log("Synced cursor upgrade to server via global function:", level);
        return;
    }
    
    console.log("Unable to sync cursor upgrade to server - no sync method available");
}

// Listen for storage changes to keep UI in sync across tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'cursorUpgradeActive' || e.key === 'curserUpgradeActive') {
        console.log("Detected cursor upgrade change in storage event", e.newValue);
        updateAllCursorUIElements();
    }
});

// Make update function globally accessible
window.updateCursorUI = updateAllCursorUIElements;
