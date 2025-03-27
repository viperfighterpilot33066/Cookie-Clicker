class RebirthSystem {
    constructor() {
        this.rebirthCost = 100000;
        this.rebirths = parseInt(localStorage.getItem('rebirths')) || 0;
        this.maxUpgrades = 5 + (this.rebirths * 5);
        this.init();
    }

    init() {
        this.updateRebirthUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const rebirthButton = document.getElementById('rebirthButton');
        if (rebirthButton) {
            rebirthButton.addEventListener('click', () => this.rebirth());
        }
    }

    canRebirth() {
        const points = parseInt(localStorage.getItem('points')) || 0;
        const autoClickerLevel = parseInt(localStorage.getItem('autoClickerUpgradeCount')) || 0;
        const maxCurrentLevel = 5 + (this.rebirths * 5); // Changed from 10 to 5
        return points >= this.rebirthCost && autoClickerLevel >= maxCurrentLevel;
    }

    rebirth() {
        if (!this.canRebirth()) {
            const points = parseInt(localStorage.getItem('points')) || 0;
            const autoClickerLevel = parseInt(localStorage.getItem('autoClickerUpgradeCount')) || 0;
            const maxCurrentLevel = 5 + (this.rebirths * 5);
            
            let message = 'Requirements for rebirth:\n';
            message += `- 100,000 points (you have ${points})\n`;
            message += `- Max auto clicker level ${maxCurrentLevel} (you have level ${autoClickerLevel})\n`;
            message += `Rebirth will unlock 5 more upgrade levels!`;
            
            alert(message);
            return false;
        }

        // Increment rebirth count and update max upgrades
        this.rebirths++;
        localStorage.setItem('rebirths', this.rebirths);
        this.maxUpgrades = 5 + (this.rebirths * 5);

        // Save cost reducer tier before reset
        const costReducerTier = parseInt(localStorage.getItem('costReducerTier')) || 1;

        // CRITICAL: Create a rebirth timestamp to prevent conflicts
        const rebirthTimestamp = Date.now();
        localStorage.setItem('lastRebirthTimestamp', rebirthTimestamp);

        // IMPORTANT: First stop the autoclicker in all open tabs by dispatching a custom event
        this.stopAutoClickerInAllTabs();
        
        // Set these values BEFORE updating the timestamp, to avoid race conditions
        localStorage.setItem('autoClickerPurchased', 'false');
        localStorage.setItem('autoClickerUpgradeCount', '0');
        localStorage.setItem('autoClickerPointsPerSecond', '1');

        // IMPORTANT: Acquire sync lock first to prevent server override
        if (window.PointsManager && typeof window.PointsManager.acquireSyncLock === 'function') {
            window.PointsManager.acquireSyncLock(20000); // 20-second lock
        }
        
        // Get user ID for direct database update
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        
        // DIRECT DATABASE UPDATE - priority over any other methods
        try {
            if (window.firebase && window.firebase.database) {
                const db = window.firebase.database();
                const userRef = db.ref(`leaderboard/${userId}`);
                
                // Get complete user data first
                userRef.once('value', (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        
                        // Update only points, preserve other fields
                        userRef.update({
                            points: 0,
                            lastUpdated: Date.now(),
                            rebirthCount: this.rebirths
                        });
                        
                        console.log("Points reset on Firebase database with rebirth data");
                    } else {
                        // Create new user if needed
                        userRef.set({
                            userName: userName || 'Anonymous',
                            userId: userId,
                            points: 0,
                            rebirthCount: this.rebirths,
                            lastUpdated: Date.now()
                        });
                    }
                });
            } else if (window.PointsManager && typeof window.PointsManager.forceResetPoints === 'function') {
                // Use PointsManager as fallback
                window.PointsManager.forceResetPoints();
            }
        } catch (e) {
            console.error("Error updating Firebase in rebirth:", e);
        }

        // Update localStorage
        localStorage.setItem('points', '0');
        
        // Reset upgrade states and power-ups
        localStorage.setItem('autoClickerUpgradeCount', '0');
        localStorage.setItem('autoClickerPurchased', 'false');
        localStorage.setItem('autoClickerPointsPerSecond', '1');
        localStorage.setItem('curserUpgradeActive', '0');
        localStorage.setItem('pointsPerClick', '1');
        
        // Restore cost reducer tier
        localStorage.setItem('costReducerTier', costReducerTier);

        // Mark the last synced points as 0 to prevent re-sync issues
        localStorage.setItem('lastSyncedPoints', '0');
        
        // Trigger achievement check
        if (window.achievementManager) {
            try {
                // Use checkAchievements instead of incrementStat
                window.achievementManager.checkAchievements();
                
                // Track rebirth count for achievements if needed
                const rebirthCount = parseInt(localStorage.getItem('rebirthCount') || '0');
                localStorage.setItem('rebirthCount', rebirthCount + 1);
            } catch (e) {
                console.error("Error updating achievements:", e);
            }
        }

        // Update UI immediately without requiring page refresh
        this.updateRebirthUI();
        this.updateGameState();
        
        // Force display update
        const pointsValue = document.getElementById('pointsValue');
        if (pointsValue) {
            pointsValue.textContent = '0';
        }
        
        alert(`Rebirth successful! You can now upgrade your Auto Clicker ${this.maxUpgrades} times!`);
        
        // Force one more Firebase update right before reload
        setTimeout(() => {
            try {
                if (window.firebase && window.firebase.database) {
                    const db = window.firebase.database();
                    const userRef = db.ref(`leaderboard/${userId}`);
                    userRef.update({ points: 0, lastUpdated: Date.now() });
                }
            } catch (e) {
                console.error("Error with final Firebase update:", e);
            }
            
            // Dispatch one more event to ensure autoclicker is stopped
            this.stopAutoClickerInAllTabs();
            
            window.location.reload();
        }, 1000);
        
        return true;
    }
    
    // New method to update game state after rebirth without requiring page refresh
    updateGameState() {
        // Update points display
        const pointsValue = document.getElementById('pointsValue');
        if (pointsValue) {
            pointsValue.textContent = '0';
        }
        
        // Update auto clicker display
        const autoClickerStatus = document.getElementById('autoClickerStatus');
        if (autoClickerStatus) {
            autoClickerStatus.textContent = 'Not Purchased';
        }
        
        const autoClickerUpgradeCount = document.getElementById('autoClickerUpgradeCount');
        if (autoClickerUpgradeCount) {
            autoClickerUpgradeCount.textContent = '0';
        }
        
        // Update cursor upgrade display
        const cursorUpgradeLevel = document.getElementById('cursorUpgradeLevel');
        if (cursorUpgradeLevel) {
            cursorUpgradeLevel.textContent = '0';
        }
        
        // Update max upgrades display
        const autoClickerMaxUpgrades = document.getElementById('autoClickerMaxUpgrades');
        if (autoClickerMaxUpgrades) {
            autoClickerMaxUpgrades.textContent = this.maxUpgrades;
        }
        
        // Reset points per click
        localStorage.setItem('pointsPerClick', '1');
    }

    updateRebirthUI() {
        const rebirthLevel = document.getElementById('rebirthLevel');
        if (rebirthLevel) {
            rebirthLevel.textContent = this.rebirths;
        }

        const rebirthButton = document.getElementById('rebirthButton');
        if (rebirthButton) {
            if (this.canRebirth()) {
                rebirthButton.classList.add('ready');
            } else {
                rebirthButton.classList.remove('ready');
            }
        }
    }

    // Helper method to stop the autoclicker in all tabs by firing an event
    stopAutoClickerInAllTabs() {
        // First, stop in the current tab
        if (window.autoClickerInterval) {
            clearInterval(window.autoClickerInterval);
            window.autoClickerInterval = null;
        }
        
        // Ensure we have autoclicker set to false and upgrades to 0
        const stopEvent = new StorageEvent('storage', {
            key: 'autoClickerPurchased',
            newValue: 'false',
            url: window.location.href
        });
        window.dispatchEvent(stopEvent);
        
        const resetUpgradeEvent = new StorageEvent('storage', {
            key: 'autoClickerUpgradeCount',
            newValue: '0',
            url: window.location.href
        });
        window.dispatchEvent(resetUpgradeEvent);
    }
}

// Initialize rebirth system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.rebirthSystem = new RebirthSystem();
});
