/**
 * Points Manager
 * Manages all point-related operations with Firebase sync
 */

const PointsManager = (function() {
    // Private variables
    let points = parseInt(localStorage.getItem('points')) || 0;
    let listeners = [];
    let lastServerSync = 0;
    let syncLock = false; // Lock to prevent race conditions
    let pendingSync = null; // For deferred sync
    let database = null; // Firebase database reference
    
    /**
     * Initialize Firebase connection
     */
    function initFirebase() {
        try {
            if (window.firebase && window.firebase.database) {
                database = window.firebase.database();
                console.log("Firebase database initialized in PointsManager");
            } else if (window.firebaseApp) {
                // Try new Firebase SDK import
                import("https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js")
                    .then((firebaseDatabase) => {
                        database = firebaseDatabase.getDatabase(window.firebaseApp);
                        console.log("Firebase database initialized via module import");
                    })
                    .catch(e => console.error("Error importing Firebase database module:", e));
            } else {
                console.warn("Firebase not available for PointsManager");
            }
        } catch (e) {
            console.error("Error initializing Firebase in PointsManager:", e);
        }
    }
    
    /**
     * Get current points
     * @returns {number} Current points
     */
    function getPoints() {
        // Return the latest value from localStorage, don't sync during this call
        return parseInt(localStorage.getItem('points')) || 0;
    }
    
    /**
     * Set points to a specific value
     * @param {number} newPoints - The new points value
     * @param {boolean} sync - Whether to sync to server (default: true)
     * @param {boolean} isServerAuthoritative - Whether server has priority over local
     */
    function setPoints(newPoints, sync = true, isServerAuthoritative = false) {
        if (isNaN(newPoints)) return;
        
        // Skip if syncLock is active and this is a server update
        if (syncLock && isServerAuthoritative) {
            console.log("Sync lock active, ignoring server update");
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('points', newPoints);
        points = newPoints;
        
        // Update display
        updatePointsDisplay(newPoints);
        
        // Notify listeners
        notifyListeners(newPoints);
        
        // Direct server updates without intermediate local storage
        if (sync) {
            directServerUpdate(newPoints);
        }
    }
    
    /**
     * Direct server update without using local storage as intermediary
     * @param {number} points - Points to update on the server
     */
    function directServerUpdate(points) {
        // Clear any pending sync
        if (pendingSync) {
            clearTimeout(pendingSync);
            pendingSync = null;
        }
        
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.log("No user ID for server update");
            return;
        }
        
        try {
            if (database) {
                // Direct update to Firebase Realtime Database
                const userRef = database.ref(`leaderboard/${userId}`);
                
                // Get user data first to preserve other fields
                userRef.once('value', (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        
                        // Only update the points field, preserve all other data
                        userRef.update({
                            points: points,
                            lastUpdated: Date.now()
                        });
                        
                        console.log(`Updated Firebase directly: ${points} points`);
                        localStorage.setItem("lastSyncedPoints", points.toString());
                        lastServerSync = Date.now();
                    } else {
                        // If user doesn't exist, create a new entry
                        const userName = localStorage.getItem('userName') || 'Anonymous';
                        userRef.set({
                            userName: userName,
                            userId: userId,
                            points: points,
                            lastUpdated: Date.now()
                        });
                        console.log(`Created new user in Firebase with ${points} points`);
                    }
                });
            } else if (typeof window.syncPointsToLeaderboard === 'function') {
                // Fallback to legacy function
                window.syncPointsToLeaderboard(points);
                localStorage.setItem("lastSyncedPoints", points.toString());
                lastServerSync = Date.now();
                console.log(`Used legacy syncPointsToLeaderboard: ${points} points`);
            } else {
                // Queue for later
                queueLeaderboardSync(points);
            }
        } catch (e) {
            console.error("Error updating server:", e);
            queueLeaderboardSync(points);
        }
    }
    
    /**
     * Sync points from server (leaderboard) data
     * Only used for initialization or periodic checks, not for critical operations
     */
    function syncFromServer() {
        // Skip if syncLock is active
        if (syncLock) {
            console.log("Sync lock active, skipping server sync");
            return;
        }
        
        // Don't sync too frequently
        if (Date.now() - lastServerSync < 5000) return;
        
        // Check for recent rebirth or purchase
        if (checkRebirthReset() || checkRecentPurchase()) {
            console.log("Recent activity detected, skipping server sync");
            return;
        }
        
        // Get user ID
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.log("No user ID available for sync");
            return;
        }
        
        // Direct Firebase query instead of relying on stored leaderboard data
        try {
            if (database) {
                console.log("Syncing directly from Firebase database");
                const userRef = database.ref(`leaderboard/${userId}`);
                userRef.once('value', (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        const serverPoints = userData.points || 0;
                        const localPoints = parseInt(localStorage.getItem('points')) || 0;
                        
                        console.log(`Server sync: Server has ${serverPoints}, local has ${localPoints}`);
                        
                        // Handle point discrepancy
                        if (serverPoints !== localPoints) {
                            if (checkRebirthReset() || checkRecentPurchase()) {
                                // Local state should be trusted during critical operations
                                console.log("Critical operation detected, using local value");
                                directServerUpdate(localPoints);
                            } else {
                                console.log(`Syncing points from server: ${serverPoints} (local had ${localPoints})`);
                                // Update localStorage and UI
                                localStorage.setItem('points', serverPoints);
                                updatePointsDisplay(serverPoints);
                                notifyListeners(serverPoints);
                            }
                        }
                        
                        lastServerSync = Date.now();
                    } else {
                        console.log("User data not found in database");
                    }
                });
            } else {
                console.warn("Firebase database not available for direct sync");
            }
        } catch (e) {
            console.error("Error syncing from Firebase:", e);
        }
    }
    
    /**
     * Check if a recent rebirth occurred
     */
    function checkRebirthReset() {
        const lastRebirthTimestamp = parseInt(localStorage.getItem('lastRebirthTimestamp') || '0');
        return Date.now() - lastRebirthTimestamp < 10000; // 10-second window after rebirth
    }
    
    /**
     * Check if a recent purchase occurred
     */
    function checkRecentPurchase() {
        const lastPurchaseTimestamp = parseInt(localStorage.getItem('lastPurchaseTimestamp') || '0');
        return Date.now() - lastPurchaseTimestamp < 5000; // 5-second window after purchase
    }
    
    /**
     * Acquire sync lock to prevent server overriding our values
     * @param {number} duration - Lock duration in milliseconds
     */
    function acquireSyncLock(duration = 10000) {
        syncLock = true;
        console.log("Sync lock acquired");
        setTimeout(() => {
            syncLock = false;
            console.log("Sync lock released");
        }, duration);
    }
    
    /**
     * Queue a leaderboard sync for when the function becomes available
     */
    function queueLeaderboardSync(pointsToSync) {
        // Store the points that need to be synced
        localStorage.setItem("pendingLeaderboardSync", pointsToSync.toString());
        
        if (pendingSync) {
            clearTimeout(pendingSync);
        }
        
        // Try again in 500ms
        pendingSync = setTimeout(() => {
            const pendingPoints = parseInt(localStorage.getItem("pendingLeaderboardSync"));
            if (!isNaN(pendingPoints)) {
                directServerUpdate(pendingPoints);
                localStorage.removeItem("pendingLeaderboardSync");
            }
        }, 500);
    }
    
    /**
     * Add points to current total
     * @param {number} amount - Amount to add
     * @param {boolean} sync - Whether to sync to server
     */
    function addPoints(amount, sync = true) {
        if (isNaN(amount)) return;
        const currentPoints = getPoints();
        
        // Apply permanent points bonus if applicable
        const permanentBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
        if (permanentBonus > 0) {
            const bonusAmount = Math.floor(amount * permanentBonus);
            amount += bonusAmount;
        }
        
        // Set with priority over server values for a period
        setPoints(currentPoints + amount, sync);
    }
    
    /**
     * Subtract points from current total
     * @param {number} amount - Amount to subtract
     * @param {boolean} sync - Whether to sync to server
     * @returns {boolean} Whether subtraction was successful
     */
    function subtractPoints(amount, sync = true) {
        if (isNaN(amount)) return false;
        
        const currentPoints = getPoints();
        
        if (currentPoints >= amount) {
            // Record purchase timestamp to protect local value
            localStorage.setItem('lastPurchaseTimestamp', Date.now().toString());
            
            // Lock sync briefly to prevent server override
            acquireSyncLock(5000);
            
            // Update points
            setPoints(currentPoints - amount, sync);
            return true;
        }
        return false;
    }
    
    /**
     * Force points to zero for rebirth
     */
    function forceResetPoints() {
        // Lock sync for 10 seconds to prevent server override
        acquireSyncLock(10000);
        
        // Update localStorage directly
        localStorage.setItem('points', '0');
        
        // Ensure UI is updated
        updatePointsDisplay(0);
        notifyListeners(0);
        
        // Force server update with higher priority
        directServerUpdate(0);
        
        console.log("Points forcibly reset to 0");
    }
    
    /**
     * Update points display in UI
     * @param {number} points - The current points to display
     */
    function updatePointsDisplay(points) {
        // Use specific selector for points value elements that should show total points
        const pointsDisplays = document.querySelectorAll('[id="pointsValue"]:not(.points-value)');
        pointsDisplays.forEach(display => {
            if (display) {
                display.textContent = points;
            }
        });
        
        // If the points display is not a part of the status bar, update it
        const standalonePoints = document.getElementById('pointsValue');
        if (standalonePoints && !standalonePoints.classList.contains('points-value')) {
            standalonePoints.textContent = points;
        }
    }
    
    /**
     * Add a listener for points changes
     * @param {function} listener - Callback function that receives new points value
     */
    function addListener(listener) {
        if (typeof listener === 'function') {
            listeners.push(listener);
        }
    }
    
    /**
     * Remove a previously added listener
     * @param {function} listener - The listener function to remove
     */
    function removeListener(listener) {
        listeners = listeners.filter(l => l !== listener);
    }
    
    /**
     * Notify all listeners of points change
     * @param {number} newPoints - The new points value
     */
    function notifyListeners(newPoints) {
        listeners.forEach(listener => {
            try {
                listener(newPoints);
            } catch (e) {
                console.error('Error in points listener:', e);
            }
        });
    }
    
    /**
     * Sync game state to server - enhanced to handle cursor upgrades and other state
     * @param {Object} stateData - Game state data to sync
     */
    function syncGameStateToServer(stateData) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.log("No user ID for server update");
            return;
        }
        
        try {
            if (database) {
                // Direct update to Firebase Realtime Database
                const userRef = database.ref(`users/${userId}`);
                
                // Get user data first to preserve other fields
                userRef.once('value', (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val() || {};
                        
                        // Update with new state data, preserving existing data
                        userRef.update({
                            ...stateData,
                            lastUpdated: Date.now()
                        });
                        
                        console.log(`Updated Firebase with game state:`, stateData);
                    } else {
                        // If user doesn't exist, create a new entry with all state data
                        const userName = localStorage.getItem('userName') || 'Anonymous';
                        userRef.set({
                            ...stateData,
                            userName: userName,
                            userId: userId,
                            lastUpdated: Date.now()
                        });
                        console.log(`Created new user in Firebase with game state:`, stateData);
                    }
                });
                
                // Also update leaderboard entry if points are included
                if (stateData.points !== undefined) {
                    const leaderboardRef = database.ref(`leaderboard/${userId}`);
                    leaderboardRef.update({
                        userName: localStorage.getItem('userName') || 'Anonymous',
                        userId: userId,
                        points: stateData.points,
                        lastUpdated: Date.now()
                    });
                }
            } else {
                console.warn("Firebase database not available for game state sync");
            }
        } catch (e) {
            console.error("Error updating game state to server:", e);
        }
    }
    
    /**
     * Fetch complete game state from server
     * @returns {Promise} Promise that resolves with the game state
     */
    function fetchGameStateFromServer() {
        return new Promise((resolve, reject) => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                reject("No user ID available");
                return;
            }
            
            try {
                if (database) {
                    const userRef = database.ref(`users/${userId}`);
                    userRef.once('value', (snapshot) => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            resolve(userData);
                        } else {
                            reject("User data not found in database");
                        }
                    });
                } else {
                    reject("Firebase database not available");
                }
            } catch (e) {
                reject("Error fetching game state: " + e.message);
            }
        });
    }
    
    /**
     * Sync cursor upgrade level to server
     * @param {number} level - New cursor upgrade level
     */
    function syncCursorUpgrade(level) {
        syncGameStateToServer({
            cursorUpgradeActive: level,
            pointsPerClick: 1 + level,
            lastCursorUpgradeTime: Date.now()
        });
    }
    
    /**
     * Get points per click
     * @returns {number} Points per click
     */
    function getPointsPerClick() {
        const baseClickValue = parseInt(localStorage.getItem('baseClickValue') || '1');
        const cursorUpgrades = parseInt(localStorage.getItem('cursorUpgradeActive') || '0');
        return baseClickValue + cursorUpgrades;
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize Firebase
        initFirebase();
        
        // Update display with current points
        const currentPoints = getPoints();
        updatePointsDisplay(currentPoints);
        
        // Set up sync interval with proper checks
        setInterval(() => {
            // Only sync if not locked and no recent activity
            if (!syncLock && !checkRebirthReset() && !checkRecentPurchase()) {
                syncFromServer();
            }
        }, 10000); // Every 10 seconds
    });
    
    // Return public API
    return {
        getPoints,
        setPoints,
        addPoints,
        subtractPoints,
        updatePointsDisplay,
        forceResetPoints,
        directServerUpdate,
        acquireSyncLock,
        syncFromServer,
        syncGameStateToServer,
        fetchGameStateFromServer,
        syncCursorUpgrade,
        getPointsPerClick
    };
})();

// Make PointsManager available globally
window.PointsManager = PointsManager;
