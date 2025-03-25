let autoclickerLevel = parseInt(localStorage.getItem("autoclickerLevel")) || 0; // Track autoclicker level
let pointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || autoclickerLevel; // Sync with localStorage

function upgradeAutoclicker() {
    if (autoclickerLevel < 5) { // Cap upgrades at level 5
        autoclickerLevel += 1; // Increment autoclicker level
        pointsPerSecond = autoclickerLevel; // Update points per second
        localStorage.setItem("autoclickerLevel", autoclickerLevel); // Save level to localStorage
        localStorage.setItem("autoClickerPointsPerSecond", pointsPerSecond); // Sync points per second
        console.log(`Autoclicker upgraded to level ${autoclickerLevel}. Points per second: ${pointsPerSecond}`);
    } else {
        console.log("Autoclicker is already at the maximum level (5).");
    }
}

function startAutoClick() {
    setInterval(() => {
        let currentPoints = parseInt(localStorage.getItem("points")) || 0;
        pointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 0; // Sync with localStorage
        if (pointsPerSecond > 0) {
            currentPoints += pointsPerSecond; // Add points based on pointsPerSecond
            localStorage.setItem("points", currentPoints); // Save updated points
            console.log(`AutoClick added ${pointsPerSecond} points. Total points: ${currentPoints}`);
        } else {
            console.log("AutoClick is inactive. No points added.");
        }
    }, 1000); // Run every second
}

// Example button to upgrade autoclicker (ensure this exists in your HTML)
const upgradeButton = document.getElementById('upgradeAutoclickerButton');
if (upgradeButton) {
    upgradeButton.addEventListener('click', () => {
        upgradeAutoclicker();
    });
} else {
    console.error("Upgrade Autoclicker button not found in the DOM.");
}

// Start the autoclick logic when the script loads
startAutoClick();