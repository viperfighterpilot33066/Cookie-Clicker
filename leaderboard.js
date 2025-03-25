import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, push, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
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

// Function to send points to Firebase leaderboard
function sendPointsToFirebase(userName, points) {
    const leaderboardRef = ref(database, "leaderboard");

    // Fetch existing leaderboard data to check for duplicates
    onValue(leaderboardRef, (snapshot) => {
        const data = snapshot.val();
        let existingKey = null;

        if (data) {
            Object.keys(data).forEach((key) => {
                const entry = data[key];
                if (entry.userName === userName) {
                    existingKey = key; // Store the key of the existing entry
                }
            });
        }

        const entryData = { userName: userName, points: points };
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

// Function to prompt for user data and send points to Firebase
function promptForUserData() {
    let userName = localStorage.getItem("userName");
    let points = parseInt(localStorage.getItem("points")) || 0;

    if (!userName) {
        userName = prompt("Please enter your name:");
        if (userName) {
            localStorage.setItem("userName", userName);
        }
    }

    if (!points) {
        points = parseInt(prompt("Please enter your score:"), 10) || 0;
        localStorage.setItem("points", points);
    }

    sendPointsToFirebase(userName, points);

    return { userName, userScore: points };
}

// Function to fetch and update leaderboard data
function updateLeaderboard() {
    const leaderboardRef = ref(database, 'leaderboard');
    onValue(leaderboardRef, (snapshot) => {
        const data = snapshot.val();
        console.log("Fetched leaderboard data:", data); // Debugging log

        const leaderboardDisplay = document.getElementById('leaderboardDisplay');
        if (!leaderboardDisplay) {
            console.error("Leaderboard display element not found in the DOM.");
            return; // Exit if the element is missing
        }

        leaderboardDisplay.innerHTML = ''; // Clear previous content

        if (data) {
            // Convert data to an array and sort by points in descending order
            const sortedEntries = Object.values(data).sort((a, b) => b.points - a.points);

            sortedEntries.forEach((entryData) => {
                if (!entryData || !entryData.userName || entryData.userName === "null" || entryData.points === undefined || entryData.points === null) {
                    console.warn("Skipping invalid entry:", entryData); // Debugging log
                    return; // Skip invalid entries
                }

                const entry = document.createElement('div');
                const userName = entryData.userName;
                const points = entryData.points;
                console.log(`Displaying entry - UserName: ${userName}, Points: ${points}`); // Debugging log
                entry.textContent = `${userName}: ${points}`;
                leaderboardDisplay.appendChild(entry);
            });
        } else {
            leaderboardDisplay.textContent = "No leaderboard data available.";
        }
    });
}

// Automatically update the leaderboard every second
setInterval(() => {
    updateLeaderboard();
}, 1000); // Update every second

// Function to send points to Firebase and update leaderboard in real-time
function syncPointsToLeaderboard(userName, points) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const updates = {};
    updates[`users/${userId}/points`] = points;
    updates[`users/${userId}/autoClickerPurchased`] = localStorage.getItem("autoClickerPurchased");
    updates[`users/${userId}/autoClickerUpgradeCount`] = localStorage.getItem("autoClickerUpgradeCount");
    updates[`users/${userId}/curserUpgradeActive`] = localStorage.getItem("curserUpgradeActive");
    updates[`leaderboard/${userId}`] = { userName, points };
    
    update(ref(database), updates).catch((error) => {
        console.error("Error syncing data:", error);
    });
}

// Fetch leaderboard data
const leaderboardRef = ref(database, 'leaderboard');
onValue(leaderboardRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Fetched leaderboard data:", data); // Debugging log

    const leaderboardDisplay = document.getElementById('leaderboardDisplay');
    if (!leaderboardDisplay) {
        console.error("Leaderboard display element not found in the DOM.");
        return; // Exit if the element is missing
    }

    leaderboardDisplay.innerHTML = ''; // Clear previous content

    if (data) {
        Object.keys(data).forEach((key) => {
            const entryData = data[key];
            if (!entryData || entryData.userName === "null" || !entryData.userName || entryData.points === undefined || entryData.points === null) {
                console.warn(`Skipping invalid entry: ${key}`, entryData); // Debugging log
                return; // Skip invalid entries
            }

            const entry = document.createElement('div');
            const userName = entryData.userName;
            const points = entryData.points;
            console.log(`Displaying entry - UserName: ${userName}, Points: ${points}`); // Debugging log
            entry.textContent = `${userName}: ${points}`;
            leaderboardDisplay.appendChild(entry);
        });
    } else {
        leaderboardDisplay.textContent = "No leaderboard data available.";
    }
});

// Function to update the displayed points
function updateDisplayedPoints() {
    const pointsValue = document.getElementById('pointsValue'); // Updated to use pointsValue
    if (!pointsValue) {
        // Gracefully handle missing pointsValue element
        console.warn("Points value element not found in the DOM. Skipping points update.");
        return;
    }

    const currentPoints = parseInt(localStorage.getItem("points")) || 0;
    pointsValue.innerText = `Points: ${currentPoints}`; // Update the points display
    console.log(`Displayed points updated: ${currentPoints}`);
}

// Function to handle user login and registration
function handleUserLogin() {
    const loginTab = document.getElementById('loginTab');
    const loginContainer = document.getElementById('loginContainer');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const nameInput = document.getElementById('nameInput');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');

    if (!loginTab || !loginContainer || !emailInput || !passwordInput || !nameInput || !loginButton || !registerButton) {
        console.error("Login elements not found in the DOM.");
        return;
    }

    // Show login form when login tab is clicked
    loginTab.addEventListener('click', () => {
        loginContainer.style.display = 'block'; // Show the login form
    });

    // Login functionality
    loginButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const name = nameInput.value.trim();

        if (email && password && name) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    localStorage.setItem("userName", name);
                    localStorage.setItem("userId", user.uid);
                    
                    // Get user data from Firebase
                    const userRef = ref(database, `users/${user.uid}`);
                    onValue(userRef, (snapshot) => {
                        const userData = snapshot.val() || {};
                        
                        // Set all user-specific data
                        localStorage.setItem("points", userData.points || 0);
                        localStorage.setItem("autoClickerPurchased", userData.autoClickerPurchased || false);
                        localStorage.setItem("autoClickerUpgradeCount", userData.autoClickerUpgradeCount || 0);
                        localStorage.setItem("curserUpgradeActive", userData.curserUpgradeActive || 0);
                        
                        updateDisplayedPoints();
                        loginTab.textContent = `Welcome, ${name}`;
                        loginContainer.style.display = 'none';
                    });
                })
                .catch((error) => {
                    if (error.code === 'auth/user-not-found') {
                        alert("Account not found. Please register first.");
                    } else {
                        console.error("Error logging in:", error.message);
                        alert("Login failed. Please check your credentials.");
                    }
                });
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Registration functionality
    registerButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const name = nameInput.value.trim();

        if (email && password && name) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    localStorage.setItem("userName", name);
                    loginTab.textContent = `Welcome, ${name}`;
                    loginContainer.style.display = 'none'; // Hide login form
                    updateLeaderboard(); // Refresh leaderboard
                    alert(`Account created successfully for ${name}!`);
                })
                .catch((error) => {
                    console.error("Error registering:", error.message);
                    alert("Registration failed. Please try again.");
                });
        } else {
            alert("Please fill in all fields.");
        }
    });
}

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userName = localStorage.getItem("userName") || "User";
        const loginTab = document.getElementById('loginTab');
        if (loginTab) {
            loginTab.textContent = `Welcome, ${userName}`;
        }
        updateLeaderboard(); // Refresh leaderboard when user logs in
    }
});

// Ensure the DOM is fully loaded before accessing elements
window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded. Initializing login functionality...");
    handleUserLogin();
    setInterval(() => {
        updateDisplayedPoints();
    }, 1000); // Update points display every second
});

// Prompt for user data when the page loads
window.addEventListener('load', () => {
    console.log("Page loaded. Prompting for user data...");
    promptForUserData();
});

// Function to handle the sabotage power-up
export function handleSabotagePowerUp(reductionPercentage) {
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

// Add event listener for the sabotage power-up button
window.addEventListener('DOMContentLoaded', () => {
    const sabotageButton = document.getElementById('sabotagePowerUp');
    if (sabotageButton) {
        sabotageButton.addEventListener('click', () => {
            handleSabotagePowerUp(0.2); // Reduce points by 20%
        });
    }
});

// Add a function to save user progress
function saveUserProgress() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const userRef = ref(database, `users/${userId}`);
    const updates = {
        points: localStorage.getItem("points"),
        autoClickerPurchased: localStorage.getItem("autoClickerPurchased"),
        autoClickerUpgradeCount: localStorage.getItem("autoClickerUpgradeCount"),
        curserUpgradeActive: localStorage.getItem("curserUpgradeActive")
    };

    update(userRef, updates).catch((error) => {
        console.error("Error saving progress:", error);
    });
}

// Add auto-save functionality
setInterval(saveUserProgress, 5000); // Save every 5 seconds
