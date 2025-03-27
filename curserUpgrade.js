console.log("curserUpgrade.js loaded");

document.addEventListener("DOMContentLoaded", function () {
    const curserUpgrade = document.querySelector("#CurserUpgrade");

    if (!curserUpgrade) {
        // Don't show error on pages where this element shouldn't exist
        const currentPath = window.location.pathname;
        if (currentPath.includes('index.html') || currentPath === '/' || currentPath === '') {
            console.error("CurserUpgrade element not found in the DOM.");
        }
        return;
    }

    // Initialize variables
    let curserUpgradeActive = parseInt(localStorage.getItem("curserUpgradeActive")) || 0;
    let pointsPerClick = parseInt(localStorage.getItem("pointsPerClick")) || (1 + curserUpgradeActive); // Points per click increases with upgrades
    let points = parseInt(localStorage.getItem("points")) || 0;

    const baseCost = 100; // Base cost for cursor upgrade
    const costIncrease = 100; // Changed from 50 to 100 for cost increase per upgrade

    console.log("Initial state:");
    console.log("curserUpgradeActive:", curserUpgradeActive);
    console.log("pointsPerClick:", pointsPerClick);
    console.log("points:", points);

    const updateUI = () => {
        const curserUpgradePriceElement = document.getElementById("curserUpgradePrice");
        const cursorUpgradeLevelElement = document.getElementById("cursorUpgradeLevel");
        const cursorUpgradeCostElement = document.getElementById("cursorUpgradeCost"); // Added for powerUps.html
        const curserUpgradeCountElement = document.getElementById("curserUpgradeCount"); 

        // Calculate next upgrade cost
        const nextUpgradeCost = baseCost + (curserUpgradeActive * costIncrease);

        if (curserUpgradePriceElement) {
            curserUpgradePriceElement.innerHTML = nextUpgradeCost;
            console.log("Updated UI: Next upgrade cost:", nextUpgradeCost);
        }

        // Update cursor upgrade cost in powerUps.html
        if (cursorUpgradeCostElement) {
            cursorUpgradeCostElement.textContent = nextUpgradeCost;
            console.log("Updated UI: Cursor upgrade cost display in powerUps.html:", nextUpgradeCost);
        }

        // Update both possible level display elements
        if (cursorUpgradeLevelElement) {
            cursorUpgradeLevelElement.textContent = curserUpgradeActive;
            console.log("Updated UI: Cursor upgrade level displayed:", curserUpgradeActive);
        }
        
        // This is the element in powerUps.html
        if (curserUpgradeCountElement) {
            curserUpgradeCountElement.textContent = curserUpgradeActive;
            console.log("Updated UI: Cursor upgrade count displayed:", curserUpgradeActive);
        }
    };

    // Initialize UI on page load
    updateUI();

    // Update UI whenever curserUpgradeActive changes in localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === "curserUpgradeActive") {
            curserUpgradeActive = parseInt(e.newValue) || 0;
            updateUI();
        }
    });

    curserUpgrade.addEventListener("click", function () {
        // Re-fetch points and curserUpgradeActive from localStorage to ensure consistency
        points = parseInt(localStorage.getItem("points")) || 0;
        curserUpgradeActive = parseInt(localStorage.getItem("curserUpgradeActive")) || 0;

        const upgradeCost = baseCost + (curserUpgradeActive * costIncrease);
        console.log("Before upgrade attempt:");
        console.log("Current points:", points);
        console.log("Upgrade cost:", upgradeCost);
        console.log("Current upgrades:", curserUpgradeActive);

        if (points >= upgradeCost) {
            points -= upgradeCost; // Deduct the upgrade cost

            const pointsElement = document.getElementById("pointsValue");
            if (pointsElement) {
                pointsElement.innerHTML = points; // Update points display in the DOM
                console.log("Updated points in DOM:", points);
            }

            curserUpgradeActive++; // Increment the number of upgrades
            pointsPerClick = 1 + curserUpgradeActive; // Update points per click

            // Save updated values to localStorage
            localStorage.setItem("points", points);
            localStorage.setItem("curserUpgradeActive", curserUpgradeActive);
            localStorage.setItem("pointsPerClick", pointsPerClick);

            console.log("After upgrade:");
            console.log("New points:", points);
            console.log("New upgrades:", curserUpgradeActive);
            console.log("New pointsPerClick:", pointsPerClick);

            updateUI(); // Update the UI after a successful upgrade
        } else {
            console.warn("Not enough points to upgrade Curser Upgrade.");
            console.log("Current points:", points, "Upgrade cost:", upgradeCost);
        }
    });
});
