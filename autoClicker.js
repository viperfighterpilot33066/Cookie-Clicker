let autoClickerPurchased = JSON.parse(localStorage.getItem("autoClickerPurchased")) || false;
let autoClickerUpgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
let autoClickerPointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 1;
let autoClickerBaseCost = 10;

// Function to purchase or upgrade the auto clicker
function handleAutoClickerPurchase() {
    let points = parseInt(localStorage.getItem("points")) || 0;
    const rebirthLevel = parseInt(localStorage.getItem("rebirths")) || 0;
    const maxUpgrades = 5 + (rebirthLevel * 5); // Changed from 10 to 5 to add 5 levels per rebirth
    let currentCost = autoClickerBaseCost + (autoClickerUpgradeCount * 45);

    if (points >= currentCost && autoClickerUpgradeCount < maxUpgrades) {
        points -= currentCost;
        localStorage.setItem("points", points);

        autoClickerUpgradeCount++;
        autoClickerPointsPerSecond = 1 + autoClickerUpgradeCount;
        autoClickerPurchased = true;

        // Save updated values to localStorage
        localStorage.setItem("autoClickerPurchased", JSON.stringify(autoClickerPurchased));
        localStorage.setItem("autoClickerUpgradeCount", autoClickerUpgradeCount);
        localStorage.setItem("autoClickerPointsPerSecond", autoClickerPointsPerSecond);

        updateAutoClickerDisplay();
    } else if (autoClickerUpgradeCount >= maxUpgrades) {
        alert(`Maximum upgrades (${maxUpgrades}) reached for your rebirth level. Rebirth to unlock 5 more levels!`);
    } else {
        alert("Not enough points!");
    }
}

// Function to update the display for the auto clicker
function updateAutoClickerDisplay() {
    let currentCost = autoClickerBaseCost + (autoClickerUpgradeCount * 45);
    const upgradeCostElement = document.getElementById("autoClickerUpgradeCost");
    const upgradeCountElement = document.getElementById("autoClickerUpgradeCount");
    const rebirthLevel = parseInt(localStorage.getItem("rebirths")) || 0;
    const maxUpgrades = 5 + (rebirthLevel * 5);

    if (upgradeCostElement) {
        upgradeCostElement.textContent = currentCost;
    }
    if (upgradeCountElement) {
        upgradeCountElement.textContent = `${autoClickerUpgradeCount}/${maxUpgrades}`;
    }
}

// Auto clicker logic
setInterval(function () {
    if (autoClickerPurchased) {
        let points = parseInt(localStorage.getItem("points")) || 0;
        points += autoClickerPointsPerSecond;
        localStorage.setItem("points", points);
    }
}, 1000);

// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const autoClickerElement = document.getElementById("autoClicker");
    if (autoClickerElement) {
        autoClickerElement.addEventListener("click", handleAutoClickerPurchase);
    } else {
        console.error("AutoClicker element not found in the DOM.");
    }

    // Retrieve autoClickerPointsPerSecond from localStorage on page load
    autoClickerPointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 1;

    // Initialize the display on page load
    updateAutoClickerDisplay();
});
