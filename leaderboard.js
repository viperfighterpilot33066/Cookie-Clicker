import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, push, update, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1vSGtQ5IO1pEgn2BOf1kQFks22NZ-Vzs",
    authDomain: "leaderboard-10f42.firebaseapp.com",
    projectId: "leaderboard-10f42",
    storageBucket: "leaderboard-10f42.firebasestorage.app",
    messagingSenderId: "1097500483722",
    appId: "1:1097500483722:web:f901c50a5ea065ee9f8d73",
    measurementId: "G-T2MMSV42YY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Flag to determine if we're actively watching the leaderboard
let isWatchingLeaderboard = false;

// Function to send points to Firebase leaderboard
function sendPointsToFirebase(userName, points) {
    // Don't update leaderboard for null/empty usernames
    if (!userName || userName === "null" || userName.trim() === "") {
        console.log("Not sending points to leaderboard for empty/null username");
        return;
    }

    const leaderboardRef = ref(database, "leaderboard");

    // Fetch existing leaderboard data to check for duplicates
    onValue(leaderboardRef, (snapshot) => {
        const data = snapshot.val();
        let existingKey = null;

        if (data) {
            Object.keys(data).forEach((key) => {
                const entry = data[key];
                if (entry && entry.userName === userName) {
                    existingKey = key; // Store the key of the existing entry
                }
            });
        }

        const entryData = { 
            userName: userName, 
            points: points,
            lastUpdated: Date.now() // Add timestamp for sorting by recent activity
        };
        
        if (existingKey) {
            // Update the existing entry
            const existingEntryRef = ref(database, `leaderboard/${existingKey}`);
            update(existingEntryRef, entryData).catch((error) => {
                console.error("Error updating points in Firebase:", error);
            });
        } else {
            // Add a new entry
            const newEntryKey = push(leaderboardRef).key;
            const updates = {};
            updates[newEntryKey] = entryData;
            update(leaderboardRef, updates).catch((error) => {
                console.error("Error sending points to Firebase:", error);
            });
        }
    }, { onlyOnce: true });
}

// Function to update leaderboard data without prompting
function updateLeaderboardWithoutPrompt() {
    // Use existing userName from localStorage or fallback to "Player"
    let userName = localStorage.getItem("userName");
    
    // If userName is null or empty, don't update until the user logs in
    if (!userName || userName === "null" || userName.trim() === "") return;
    
    let points = parseInt(localStorage.getItem("points")) || 0;
    sendPointsToFirebase(userName, points);
    return { userName, points };
}

// Replace the old promptForUserData function
function promptForUserData() {
    return updateLeaderboardWithoutPrompt();
}

// Enhanced function to fetch and update leaderboard data with real-time updates
function updateLeaderboard() {
    // Mark that we're now watching the leaderboard
    isWatchingLeaderboard = true;
    
    const leaderboardRef = ref(database, 'leaderboard');
    
    // Use onValue to create a persistent listener that updates in real-time
    onValue(leaderboardRef, (snapshot) => {
        const data = snapshot.val();
        
        // Get the leaderboard display element
        const leaderboardDisplay = document.getElementById('leaderboardDisplay');
        if (!leaderboardDisplay) return;

        // Ability to sort entries - default to points (highest first)
        const sortOption = localStorage.getItem('leaderboardSortOption') || 'points';

        // Convert data to array and filter out null users and entries with undefined properties
        const sortedEntries = data ? 
            Object.values(data)
                .filter(entry => 
                    entry && 
                    entry.userName && 
                    entry.userName !== "null" && 
                    entry.userName.trim() !== "" &&
                    entry.points !== undefined
                )
                .sort((a, b) => {
                    if (sortOption === 'points') {
                        return b.points - a.points; // Sort by points (descending)
                    } else if (sortOption === 'name') {
                        return a.userName.localeCompare(b.userName); // Sort by name (ascending)
                    } else if (sortOption === 'recent') {
                        return b.lastUpdated - a.lastUpdated; // Sort by most recent update
                    }
                    return b.points - a.points; // Default to points
                }) : [];
                
        // Create the updated leaderboard HTML
        let leaderboardHTML = '';
        
        // Add header
        leaderboardHTML += `
            <div class="leaderboard-header">
                <h2>Top Players</h2>
                <div class="leaderboard-info">Players are ranked by their cookie count</div>
                <div class="leaderboard-sort">
                    <label>Sort by: 
                        <select id="sortLeaderboard">
                            <option value="points" ${sortOption === 'points' ? 'selected' : ''}>Highest Points</option>
                            <option value="name" ${sortOption === 'name' ? 'selected' : ''}>Name</option>
                            <option value="recent" ${sortOption === 'recent' ? 'selected' : ''}>Recently Active</option>
                        </select>
                    </label>
                </div>
            </div>
        `;
        
        // If there are no entries, display a message
        if (sortedEntries.length === 0) {
            leaderboardHTML += '<p>No leaderboard data available.</p>';
        } else {
            // Display each leaderboard entry
            sortedEntries.forEach((entryData, index) => {
                // Create entry with animation-ready classes
                const entryClass = `leaderboard-entry ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`;
                
                // Get user ID (optional) for highlighting current user
                const userId = localStorage.getItem('userId');
                const isCurrentUser = entryData.userId === userId;
                
                leaderboardHTML += `
                    <div class="${entryClass} ${isCurrentUser ? 'current-user' : ''}" data-userid="${entryData.userId || ''}" data-points="${entryData.points}">
                        <span class="leaderboard-rank">${index === 0 ? '<span class="medal gold-medal">🥇</span>' : 
                           index === 1 ? '<span class="medal silver-medal">🥈</span>' : 
                           index === 2 ? '<span class="medal bronze-medal">🥉</span>' : 
                           (index + 1)}</span>
                        <span class="leaderboard-username">${entryData.userName}</span>
                        <span class="leaderboard-points points-value" data-previous="${entryData.points}">${entryData.points.toLocaleString()}</span>
                    </div>
                `;
            });
        }
        
        // Update the leaderboard DOM
        leaderboardDisplay.innerHTML = leaderboardHTML;
        
        // Add event listener to the sort dropdown
        const sortDropdown = document.getElementById('sortLeaderboard');
        if (sortDropdown) {
            sortDropdown.addEventListener('change', (e) => {
                localStorage.setItem('leaderboardSortOption', e.target.value);
                updateLeaderboard(); // Re-fetch and re-sort the leaderboard
            });
        }
    });
}

// Function to sync points to leaderboard immediately when points change
function syncPointsToLeaderboard(points) {
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    
    // Don't update leaderboard for null/empty usernames
    if (!userName || userName === "null" || userName.trim() === "" || !userId) return;
    
    // Send update to Firebase
    const userRef = ref(database, `leaderboard/${userId}`);
    update(userRef, { 
        userName: userName,
        points: points,
        userId: userId, // Include user ID for easier identification 
        lastUpdated: Date.now()
    }).catch((error) => {
        console.error("Error syncing points:", error);
    });
}

// Create a real-time points sync function that will be called from pointsManager.js
window.syncPointsToLeaderboard = syncPointsToLeaderboard;

// Initialize leaderboard listeners on EVERY page, not just the leaderboard page
function initGlobalLeaderboardListeners() {
    // Create a hidden leaderboard container element for data storage on non-leaderboard pages
    let hiddenContainer = document.getElementById('hiddenLeaderboardContainer');
    
    if (!hiddenContainer) {
        hiddenContainer = document.createElement('div');
        hiddenContainer.id = 'hiddenLeaderboardContainer';
        hiddenContainer.style.display = 'none';
        document.body.appendChild(hiddenContainer);
    }
    
    // Set up the real-time database listener for the leaderboard regardless of which page we're on
    const leaderboardRef = ref(database, 'leaderboard');
    onValue(leaderboardRef, (snapshot) => {
        const data = snapshot.val();
        
        // Only process if we have data
        if (!data) return;
        
        // Filter out null/empty usernames before storing
        let filteredData = {};
        Object.keys(data).forEach(key => {
            const entry = data[key];
            if (entry && 
                entry.userName && 
                entry.userName !== "null" && 
                entry.userName.trim() !== "") {
                filteredData[key] = entry;
            }
        });
        
        // Store the latest leaderboard data in localStorage
        localStorage.setItem('latestLeaderboardData', JSON.stringify(filteredData));
        
        // If we're on the leaderboard page, the updateLeaderboard function will handle UI updates
        // Otherwise, we just keep the data updated in localStorage
        
        // Check if any leaderboard displays exist on the current page
        const leaderboardDisplay = document.getElementById('leaderboardDisplay');
        if (leaderboardDisplay && !isWatchingLeaderboard) {
            // If we're on the leaderboard page but haven't initialized yet, do so now
            updateLeaderboard();
        }
        
        // Dispatch an event that other parts of the app can listen for
        const leaderboardUpdateEvent = new CustomEvent('leaderboardUpdated', { 
            detail: { leaderboardData: filteredData }
        });
        document.dispatchEvent(leaderboardUpdateEvent);
    });
}

// When the leaderboard page is loaded, start watching
if (window.location.pathname.includes('leaderBoard.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        updateLeaderboard();
        
        // Add visual effects to make score changes noticeable
        setInterval(function() {
            const pointElements = document.querySelectorAll('.leaderboard-points');
            pointElements.forEach(element => {
                const currentPoints = parseInt(element.textContent.replace(/,/g, ''));
                const previousPoints = parseInt(element.getAttribute('data-previous') || '0');
                
                // If points changed, animate the change
                if (currentPoints !== previousPoints) {
                    // Store the new value as previous for next check
                    element.setAttribute('data-previous', currentPoints);
                    
                    // Add animation class based on whether points increased or decreased
                    if (currentPoints > previousPoints) {
                        element.classList.add('points-increased');
                        setTimeout(() => element.classList.remove('points-increased'), 2000);
                    } else if (currentPoints < previousPoints) {
                        element.classList.add('points-decreased');
                        setTimeout(() => element.classList.remove('points-decreased'), 2000);
                    }
                }
            });
        }, 2000); // Check every 2 seconds
    });
}

// Auto-update own score to leaderboard every 5 seconds if it changed
setInterval(function() {
    // Only update if we're logged in and have points
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const points = parseInt(localStorage.getItem("points")) || 0;
    const lastSyncedPoints = parseInt(localStorage.getItem("lastSyncedPoints") || "0");
    
    // Only sync if points changed since last sync AND username is valid
    if (userId && points !== lastSyncedPoints && userName && userName !== "null" && userName.trim() !== "") {
        syncPointsToLeaderboard(points);
        localStorage.setItem("lastSyncedPoints", points.toString());
    }
}, 5000);

// Function to handle user login and registration
function handleUserLogin() {
    // Only try to initialize login functionality if we're on the leaderboard page
    const currentPath = window.location.pathname;
    if (!currentPath.includes('leaderBoard.html')) {
        // Skip login setup on non-leaderboard pages
        return;
    }

    const loginTab = document.getElementById('loginTab');
    const loginContainer = document.getElementById('loginContainer');
    const modalOverlay = document.getElementById('modalOverlay');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const nameInput = document.getElementById('nameInput');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const closeLoginButton = document.getElementById('closeLoginButton');
    const loginTabButton = document.getElementById('loginTabButton');
    const registerTabButton = document.getElementById('registerTabButton');
    const loginMessage = document.getElementById('loginMessage');

    if (!loginTab || !loginContainer) {
        console.error("Login elements not found in the DOM. Check if you're on the leaderboard page.");
        return;
    }

    // Check if user is already logged in
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    if (userName && userId && userName !== 'null' && userId !== 'null') {
        loginTab.innerHTML = `<span class="login-icon">👤</span> <span class="login-text">${userName}</span>`;
        loginTab.classList.add('logged-in');
    }

    // Show login form when login tab is clicked
    loginTab.addEventListener('click', () => {
        loginContainer.style.display = 'block';
        modalOverlay.style.display = 'block';
        
        // Reset form
        emailInput.value = '';
        passwordInput.value = '';
        nameInput.value = userName || '';
        loginMessage.textContent = '';
        
        // Focus on email input
        setTimeout(() => emailInput.focus(), 100);
    });

    // Close login form when close button is clicked
    if (closeLoginButton) {
        closeLoginButton.addEventListener('click', () => {
            closeLoginForm();
        });
    }

    // Also close when clicking overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            closeLoginForm();
        });
    }
    
    // Function to close login form
    function closeLoginForm() {
        // Add fade-out animation
        loginContainer.classList.add('fade-out');
        modalOverlay.classList.add('fade-out');
        
        // Remove after animation completes
        setTimeout(() => {
            loginContainer.style.display = 'none';
            modalOverlay.style.display = 'none';
            loginContainer.classList.remove('fade-out');
            modalOverlay.classList.remove('fade-out');
        }, 300);
    }

    // Tab switching
    loginTabButton.addEventListener('click', () => {
        loginTabButton.classList.add('active');
        registerTabButton.classList.remove('active');
        loginButton.style.display = 'block';
        registerButton.style.display = 'none';
        loginMessage.textContent = '';
    });

    registerTabButton.addEventListener('click', () => {
        registerTabButton.classList.add('active');
        loginTabButton.classList.remove('active');
        registerButton.style.display = 'block';
        loginButton.style.display = 'none';
        loginMessage.textContent = '';
    });

    // Login functionality
    loginButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const name = nameInput.value.trim();

        // Form validation
        if (!email || !password || !name) {
            showLoginMessage('Please fill in all fields.', 'error');
            return;
        }

        // Show loading state
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
        
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem("userName", name);
                localStorage.setItem("userId", user.uid);
                
                // Update the login tab
                loginTab.innerHTML = `<span class="login-icon">👤</span> <span class="login-text">${name}</span>`;
                loginTab.classList.add('logged-in');
                
                // Get user data from Firebase
                const userRef = ref(database, `users/${user.uid}`);
                onValue(userRef, (snapshot) => {
                    const userData = snapshot.val() || {};
                    
                    // Set all user-specific data
                    localStorage.setItem("points", userData.points || 0);
                    localStorage.setItem("autoClickerPurchased", userData.autoClickerPurchased || false);
                    localStorage.setItem("autoClickerUpgradeCount", userData.autoClickerUpgradeCount || 0);
                    localStorage.setItem("cursorUpgradeActive", userData.cursorUpgradeActive || 0);
                    
                    closeLoginForm();
                    
                    // Show success message briefly before closing
                    showLoginMessage('Login successful!', 'success');
                    
                    // IMPORTANT: Dispatch authentication event for other scripts
                    document.dispatchEvent(new CustomEvent('userAuthenticated', {
                        detail: { userName: name, userId: user.uid }
                    }));
                    
                    // Clean up event handlers to prevent duplicates
                    setTimeout(() => {
                        if (typeof cleanupEventHandlers === 'function') {
                            cleanupEventHandlers();
                        } else if (window.eventCleanup && typeof window.eventCleanup.cleanupEventHandlers === 'function') {
                            window.eventCleanup.cleanupEventHandlers();
                        }
                        
                        // Refresh leaderboard
                        updateLeaderboard();
                    }, 500);
                });
            })
            .catch((error) => {
                console.error("Login error:", error.code, error.message);
                
                // Show specific error message based on error code
                if (error.code === 'auth/user-not-found') {
                    showLoginMessage('Account not found. Please register first.', 'error');
                } else if (error.code === 'auth/wrong-password') {
                    showLoginMessage('Incorrect password. Please try again.', 'error');
                } else if (error.code === 'auth/invalid-email') {
                    showLoginMessage('Invalid email format.', 'error');
                } else {
                    showLoginMessage('Login failed. Please check your credentials.', 'error');
                }
            })
            .finally(() => {
                // Reset button state
                loginButton.disabled = false;
                loginButton.textContent = 'Login';
            });
    });

    // Registration functionality
    registerButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const name = nameInput.value.trim();

        // Form validation
        if (!email || !password || !name) {
            showLoginMessage('Please fill in all fields.', 'error');
            return;
        }
        
        if (password.length < 6) {
            showLoginMessage('Password must be at least 6 characters.', 'error');
            return;
        }

        // Show loading state
        registerButton.disabled = true;
        registerButton.textContent = 'Registering...';
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem("userName", name);
                localStorage.setItem("userId", user.uid);
                
                // Update the login tab
                loginTab.innerHTML = `<span class="login-icon">👤</span> <span class="login-text">${name}</span>`;
                loginTab.classList.add('logged-in');
                
                // Initialize user data in the database
                const userRef = ref(database, `users/${user.uid}`);
                set(userRef, {
                    userName: name,
                    email: email,
                    points: 0,
                    createdAt: Date.now(),
                    lastLogin: Date.now()
                });
                
                // Also create a leaderboard entry
                const leaderboardRef = ref(database, `leaderboard/${user.uid}`);
                set(leaderboardRef, {
                    userName: name,
                    userId: user.uid,
                    points: 0,
                    lastUpdated: Date.now()
                });
                
                // Show success message
                showLoginMessage('Account created successfully!', 'success');
                
                // Close form after a short delay
                setTimeout(() => {
                    closeLoginForm();
                    
                    // Refresh leaderboard
                    updateLeaderboard();
                    
                    // Dispatch auth event
                    document.dispatchEvent(new CustomEvent('userAuthenticated', {
                        detail: { userName: name, userId: user.uid }
                    }));
                }, 1500);
            })
            .catch((error) => {
                console.error("Registration error:", error.code, error.message);
                
                // Show user-friendly error messages
                if (error.code === 'auth/email-already-in-use') {
                    showLoginMessage('Email already in use. Try logging in instead.', 'error');
                } else if (error.code === 'auth/invalid-email') {
                    showLoginMessage('Invalid email format.', 'error');
                } else if (error.code === 'auth/weak-password') {
                    showLoginMessage('Password is too weak. Use at least 6 characters.', 'error');
                } else {
                    showLoginMessage('Registration failed. Please try again.', 'error');
                }
            })
            .finally(() => {
                // Reset button state
                registerButton.disabled = false;
                registerButton.textContent = 'Register';
            });
    });
    
    // Helper function to show login messages
    function showLoginMessage(message, type = 'error') {
        loginMessage.textContent = message;
        loginMessage.className = 'login-message';
        
        if (type === 'success') {
            loginMessage.classList.add('success');
        }
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (loginContainer.style.display === 'block') {
            // Close on escape
            if (e.key === 'Escape') {
                closeLoginForm();
            }
            
            // Submit on enter when in password field
            if (e.key === 'Enter' && document.activeElement === passwordInput) {
                if (loginButton.style.display !== 'none') {
                    loginButton.click();
                } else if (registerButton.style.display !== 'none') {
                    registerButton.click();
                }
            }
        }
    });
}

// Monitor authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userName = localStorage.getItem("userName") || "User";
        const loginTab = document.getElementById('loginTab');
        if (loginTab) {
            loginTab.textContent = `Welcome, ${userName}`;
        }
        
        // If leaderboard page, update the display
        if (window.location.pathname.includes('leaderBoard.html') && !isWatchingLeaderboard) {
            updateLeaderboard();
        }
        
        // Force sync current points to leaderboard on login
        const points = parseInt(localStorage.getItem("points")) || 0;
        syncPointsToLeaderboard(points);
        localStorage.setItem("lastSyncedPoints", points.toString());
    }
});

// Clean up null or empty usernames from the leaderboard
function cleanupLeaderboard() {
    const leaderboardRef = ref(database, 'leaderboard');
    onValue(leaderboardRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        // Find entries with null or empty usernames and process them one by one
        Object.entries(data).forEach(([key, entry]) => {
            if (!entry || !entry.userName || entry.userName === "null" || entry.userName.trim() === "") {
                // Remove invalid entries using set(null) instead of update(null)
                const invalidEntryRef = ref(database, `leaderboard/${key}`);
                set(invalidEntryRef, null)
                    .then(() => console.log(`Removed invalid entry ${key} from leaderboard`))
                    .catch(error => console.error(`Failed to remove invalid entry: ${error}`));
            }
        });
    }, { onlyOnce: true });
}

// Ensure the DOM is fully loaded before accessing elements
window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded. Initializing login functionality...");
    
    // Only run handleUserLogin if we're on the leaderboard page
    const currentPath = window.location.pathname;
    if (currentPath.includes('leaderBoard.html')) {
        handleUserLogin();
    }
    
    initGlobalLeaderboardListeners();
    cleanupLeaderboard(); // Clean up the leaderboard on page load
});

// Define the handleSabotagePowerUp function properly before exporting it
function handleSabotagePowerUp(reductionPercentage) {
    console.log("handleSabotagePowerUp function called."); // Debugging log
    const leaderboardRef = ref(database, 'leaderboard');
    onValue(leaderboardRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            alert("No players available to sabotage.");
            return;
        }

        console.log("Creating sabotage screen..."); // Debugging log
        // Create a temporary screen for sabotage
        const sabotageScreen = document.createElement('div');
        sabotageScreen.id = 'sabotageScreen';
        sabotageScreen.style.position = 'fixed';
        sabotageScreen.style.top = '0';
        sabotageScreen.style.left = '0';
        sabotageScreen.style.width = '100%';
        sabotageScreen.style.height = '100%';
        sabotageScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        sabotageScreen.style.color = 'white';
        sabotageScreen.style.zIndex = '1000';
        sabotageScreen.style.display = 'flex';
        sabotageScreen.style.flexDirection = 'column';
        sabotageScreen.style.alignItems = 'center';
        sabotageScreen.style.justifyContent = 'center';

        const title = document.createElement('h2');
        title.textContent = "Select a player to sabotage:";
        sabotageScreen.appendChild(title);

        const playerList = document.createElement('div');
        playerList.style.maxHeight = '50%';
        playerList.style.overflowY = 'auto';
        sabotageScreen.appendChild(playerList);

        Object.keys(data).forEach((key) => {
            const entry = data[key];
            if (entry && entry.userName && entry.userName !== "null" && entry.points !== undefined && entry.points !== null) {
                console.log(`Adding player to sabotage screen: ${entry.userName}`); // Debugging log
                const playerButton = document.createElement('button');
                playerButton.textContent = `${entry.userName} - ${entry.points} points`;
                playerButton.style.margin = '5px';
                playerButton.addEventListener('click', () => {
                    const updatedPoints = Math.floor(entry.points * (1 - reductionPercentage)); // Reduce points by the given percentage
                    const playerRef = ref(database, `leaderboard/${key}`);
                    update(playerRef, { points: updatedPoints })
                        .then(() => {
                            alert(`${entry.userName} has been sabotaged! Their points are now ${updatedPoints}.`);
                            document.body.removeChild(sabotageScreen);
                        })
                        .catch((error) => {
                            console.error("Error sabotaging player:", error);
                            alert("Failed to sabotage the player. Please try again.");
                        });
                });
                playerList.appendChild(playerButton);
            } else {
                console.warn(`Skipping invalid or null player: ${key}`, entry); // Debugging log
            }
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = "Cancel";
        cancelButton.style.marginTop = '20px';
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(sabotageScreen);
        });
        sabotageScreen.appendChild(cancelButton);

        document.body.appendChild(sabotageScreen);
        console.log("Sabotage screen displayed."); // Debugging log
    }, { onlyOnce: true });
}

// Export necessary functions - now handleSabotagePowerUp is properly defined
export { handleSabotagePowerUp, syncPointsToLeaderboard, updateLeaderboard };
