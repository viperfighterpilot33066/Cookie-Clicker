/**
 * Game Sync Utility
 * Handles synchronizing the entire game state with the server
 */
(function() {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for other scripts to initialize
        setTimeout(initGameSync, 1000);
    });
    
    function initGameSync() {
        // Load initial state from server
        syncFromServer();
        
        // Set up periodic sync
        setInterval(syncToServer, 30000); // Every 30 seconds
        
        // Set up listeners for state changes that need immediate sync
        listenForStateChanges();
    }
    
    function syncToServer() {
        // Skip sync for guest users
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        
        // Collect current game state
        const gameState = {
            points: parseInt(localStorage.getItem('points')) || 0,
            cursorUpgradeActive: parseInt(localStorage.getItem('cursorUpgradeActive')) || 0,
            autoClickerPurchased: localStorage.getItem('autoClickerPurchased') === 'true',
            autoClickerUpgradeCount: parseInt(localStorage.getItem('autoClickerUpgradeCount')) || 0,
            pointsPerClick: parseInt(localStorage.getItem('pointsPerClick')) || 1,
            rebirths: parseInt(localStorage.getItem('rebirths')) || 0,
            lastSync: Date.now()
        };
        
        // Sync to server using available methods
        if (window.PointsManager && typeof window.PointsManager.syncGameStateToServer === 'function') {
            window.PointsManager.syncGameStateToServer(gameState);
        } else if (window.firebase && window.firebase.database) {
            try {
                const userRef = window.firebase.database().ref(`users/${userId}`);
                userRef.update(gameState);
                console.log("Synced game state to server via Firebase");
            } catch (e) {
                console.error("Error syncing game state to Firebase:", e);
            }
        } else {
            console.log("No sync method available");
        }
    }
    
    function syncFromServer() {
        // Skip sync for guest users
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        
        // Try to load game state from server
        if (window.PointsManager && typeof window.PointsManager.fetchGameStateFromServer === 'function') {
            window.PointsManager.fetchGameStateFromServer()
                .then(processServerState)
                .catch(err => console.log("Could not fetch game state:", err));
        } else if (window.firebase && window.firebase.database) {
            try {
                const userRef = window.firebase.database().ref(`users/${userId}`);
                userRef.once('value', (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        processServerState(userData);
                    }
                });
            } catch (e) {
                console.error("Error fetching game state from Firebase:", e);
            }
        }
    }
    
    function processServerState(serverState) {
        // Skip if no state or no userId match
        if (!serverState) return;
        
        const userId = localStorage.getItem('userId');
        if (serverState.userId && serverState.userId !== userId) return;
        
        console.log("Processing server state:", serverState);
        
        // Check for cursor upgrade level
        if (serverState.cursorUpgradeActive !== undefined) {
            const localLevel = parseInt(localStorage.getItem('cursorUpgradeActive')) || 0;
            const serverLevel = parseInt(serverState.cursorUpgradeActive) || 0;
            
            // Use the higher level between local and server
            if (serverLevel > localLevel) {
                localStorage.setItem('cursorUpgradeActive', serverLevel);
                localStorage.setItem('pointsPerClick', (1 + serverLevel).toString());
                console.log("Updated cursor upgrade level from server:", serverLevel);
            }
        }
        
        // Other state synchronization can be added here
    }
    
    function listenForStateChanges() {
        // Listen for cursor upgrade changes
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            // Call the original function first
            originalSetItem.apply(this, arguments);
            
            // When cursorUpgradeActive changes, trigger a sync
            if (key === 'cursorUpgradeActive') {
                const newLevel = parseInt(value);
                console.log("Detected cursor upgrade change:", newLevel);
                
                // Trigger server sync
                if (window.PointsManager && typeof window.PointsManager.syncCursorUpgrade === 'function') {
                    window.PointsManager.syncCursorUpgrade(newLevel);
                } else {
                    // Use the standalone function if available
                    if (typeof syncCursorUpgradeToServer === 'function') {
                        syncCursorUpgradeToServer(newLevel);
                    } else {
                        // Fallback to full state sync
                        setTimeout(syncToServer, 100);
                    }
                }
            }
        };
    }
    
    // Make functions available globally
    window.syncGameStateToServer = syncToServer;
    window.syncGameStateFromServer = syncFromServer;
})();
