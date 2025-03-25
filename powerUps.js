console.log("powerUps.js loaded"); // Debugging log

// Use points from localStorage
let points = parseInt(localStorage.getItem("points")) || 0; // Initialize points from localStorage

// Initial cost of the sabotage power-up (set to 1 for testing)
let sabotagePowerUpCost = 30000; // Changed from 1 to 30000
// Initial cost of the shield power-up (set to 1 for testing)
let shieldPowerUpCost = 15000; // Changed from 1 to 15000

// Utility: update points in localStorage and DOM
function updatePoints(newPoints) {
    points = newPoints; // Update the points variable
    localStorage.setItem("points", points); // Update localStorage
    const pointsValue = document.getElementById("pointsValue");
    if (pointsValue) {
        pointsValue.textContent = points; // Update DOM
    }
}

// Fetch and display the current points on page load
function initializePoints() {
    console.log("Fetched points from localStorage:", points); // Debugging log
    updatePoints(points); // Ensure the DOM is updated
}

// Call initializePoints when the DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePoints);
} else {
    initializePoints();
}

// Function to handle the purchase of the sabotage power-up
function purchaseSabotagePowerUp() {
    console.log("Sabotage power-up div clicked.");
    console.log("Current points from localStorage:", points); // Debugging log
    if (points >= sabotagePowerUpCost) {
        const updatedPoints = points - sabotagePowerUpCost;
        updatePoints(updatedPoints); // Update points in localStorage and DOM
        const sabotageCostElement = document.querySelector("#sabotagePowerUpDiv p:nth-child(2)");
        if (sabotageCostElement) {
            sabotageCostElement.textContent = "Cost: -1 point";
        }
        console.log("Sabotage power-up purchased successfully.");
        // Trigger the screen to choose someone
        showSabotageSelectionScreen();
    } else {
        alert("You do not have enough points to purchase this power-up.");
    }
}

// Function to show the sabotage selection screen
async function showSabotageSelectionScreen() {
    console.log("Displaying sabotage selection screen...");
    const selectionScreen = document.createElement("div");
    selectionScreen.id = "sabotageSelectionScreen";
    selectionScreen.style.position = "fixed";
    selectionScreen.style.top = "50%";
    selectionScreen.style.left = "50%";
    selectionScreen.style.transform = "translate(-50%, -50%)";
    selectionScreen.style.background = "#1a1a1a";
    selectionScreen.style.color = "#fff";
    selectionScreen.style.border = "2px solid #4CAF50";
    selectionScreen.style.borderRadius = "10px";
    selectionScreen.style.padding = "20px";
    selectionScreen.style.zIndex = "1000";
    selectionScreen.style.minWidth = "300px";
    selectionScreen.style.boxShadow = "0 0 10px rgba(76, 175, 80, 0.5)";

    const users = await fetchUsersForSabotage();

    let content = "<h3 style='color: #4CAF50; text-align: center; margin-bottom: 20px;'>Select a user to sabotage:</h3><ul style='list-style: none; padding: 0;'>";
    users.forEach(user => {
        const isProtected = user.shieldActive ? " (Protected by Shield)" : "";
        const disabled = user.shieldActive ? "disabled" : "";
        const reducedPoints = Math.floor(user.points * 0.7); // Calculate 70% of current points
        const pointsReduction = user.points - reducedPoints; // Calculate point reduction
        content += `
            <li style='margin: 10px 0; padding: 10px; border: 1px solid #4CAF50; border-radius: 5px;'>
                ${user.name} - Current Points: ${user.points}
                <br>After Sabotage: ${reducedPoints} (-${pointsReduction} points)${isProtected}
                <button ${disabled} 
                    onclick="sabotageUser('${user.id}')"
                    style='
                        float: right;
                        background-color: ${disabled ? '#666' : '#4CAF50'};
                        color: white;
                        border: none;
                        padding: 5px 15px;
                        border-radius: 3px;
                        cursor: ${disabled ? 'not-allowed' : 'pointer'};
                    '
                >Sabotage</button>
            </li>
        `;
    });
    content += `</ul>
        <button 
            onclick='closeSabotageScreen()'
            style='
                display: block;
                margin: 20px auto 0;
                background-color: #666;
                color: white;
                border: none;
                padding: 8px 20px;
                border-radius: 3px;
                cursor: pointer;
            '
        >Cancel</button>`;
    selectionScreen.innerHTML = content;

    document.body.appendChild(selectionScreen);
}

// Updated function to fetch users for sabotage using the "leaderboard" node
async function fetchUsersForSabotage() {
    try {
        const snapshot = await database.ref("leaderboard").get(); // Fetch leaderboard data
        if (!snapshot.exists()) {
            console.error("Leaderboard data not found in Firebase.");
            return [];
        }
        const leaderboard = snapshot.val();
        const users = Object.keys(leaderboard)
            .filter(userId => leaderboard[userId] && leaderboard[userId].userName) // Exclude null entries
            .map(userId => ({
                id: userId,
                name: leaderboard[userId].userName,
                points: leaderboard[userId].points || 0,
                shieldActive: leaderboard[userId].shieldActive || false
            }));
        console.log("Fetched users for sabotage from Firebase:", users);
        return users;
    } catch (error) {
        console.error("Error fetching leaderboard data from Firebase:", error);
        return [];
    }
}

// Function to sabotage a user (updated)
function sabotageUser(userId) {
    console.log(`Sabotaging user with ID: ${userId}`);
    const userRef = database.ref("leaderboard/" + userId);
    userRef.once("value")
        .then(snapshot => {
            if (!snapshot.exists()) {
                console.error("User data not found for sabotage.");
                return;
            }
            const currentPoints = snapshot.val().points || 0;
            const newPoints = Math.floor(currentPoints * 0.7); // Reduce to 70% (30% reduction)
            return userRef.update({ points: newPoints });
        })
        .then(() => {
            alert("User sabotaged! Points reduced by 30%");
            closeSabotageScreen();
        })
        .catch(error => {
            console.error("Error updating user during sabotage:", error);
            alert("Failed to sabotage the user. Please try again.");
        });
}

// Function to close the sabotage selection screen
function closeSabotageScreen() {
    const selectionScreen = document.getElementById("sabotageSelectionScreen");
    if (selectionScreen) {
        selectionScreen.remove();
    }
}

// Function to handle the purchase of the shield power-up
function purchaseShieldPowerUp() {
    console.log("Shield power-up div clicked.");
    console.log("Current points from localStorage:", points); // Debugging log
    if (points >= shieldPowerUpCost) {
        const updatedPoints = points - shieldPowerUpCost;
        updatePoints(updatedPoints); // Update points in localStorage and DOM
        console.log("Activating shield protection for 6 hours...");
        const shieldExpiration = Date.now() + 6 * 60 * 60 * 1000;
        database.ref("shieldExpiration").set(shieldExpiration);
        const shieldCostElement = document.querySelector("#shieldPowerUpDiv p:nth-child(2)");
        if (shieldCostElement) {
            shieldCostElement.textContent = `Cost: -${shieldPowerUpCost} points`;
        }
        alert("Shield activated! You are protected from sabotage for the next 6 hours.");
    } else {
        alert("You do not have enough points to purchase this power-up.");
    }
}

// Function to check if the shield is active
async function isShieldActive() {
    try {
        const snapshot = await database.ref("shieldExpiration").get();
        const shieldExpiration = snapshot.exists() ? snapshot.val() : 0;
        return Date.now() < shieldExpiration;
    } catch (error) {
        console.error("Error checking shield status:", error);
        return false;
    }
}

if (typeof handleSabotagePowerUp === "undefined") {
    async function handleSabotagePowerUp(reductionPercentage) {
        if (await isShieldActive()) {
            alert("Sabotage failed! The user is protected by a shield.");
            console.log("Sabotage attempt blocked by shield.");
            return;
        }
        console.log("Sabotage executed successfully.");
    }
}

// Add event listeners once the DOM is ready
window.addEventListener("DOMContentLoaded", () => {
    const sabotageDiv = document.getElementById("sabotagePowerUpDiv");
    if (sabotageDiv) {
        sabotageDiv.addEventListener("click", purchaseSabotagePowerUp);
    } else {
        console.error("Sabotage power-up div not found in the DOM.");
    }
    // (Shield event listener removed—handled in shield.js)
});

// --- UPDATED CODE: continuously update shield timer display every second ---
function updateShieldTimer() {
    const shieldDiv = document.getElementById("shieldPowerUpDiv");
    if (!shieldDiv) return;
    // Select the first <p> element inside the shield div
    const costElem = shieldDiv.querySelector("p");
    if (!costElem) return;
    // Fetch the shieldExpiration from Firebase once, then update timer locally every second
    database.ref("shieldExpiration").once("value").then(snapshot => {
        const shieldExpiration = snapshot.exists() ? snapshot.val() : 0;
        if (shieldExpiration > Date.now()) {
            setInterval(() => {
                const now = Date.now();
                const diff = shieldExpiration - now;
                if (diff <= 0) {
                    costElem.textContent = `Cost: -${shieldPowerUpCost} points`;
                } else {
                    let remaining = Math.floor(diff / 1000);
                    const hours = Math.floor(remaining / 3600);
                    remaining %= 3600;
                    const minutes = Math.floor(remaining / 60);
                    const seconds = remaining % 60;
                    costElem.textContent = `Time remaining: ${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
                }
            }, 1000);
        } else {
            costElem.textContent = `Cost: -${shieldPowerUpCost} points`;
        }
    });
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateShieldTimer);
} else {
    updateShieldTimer();
}
