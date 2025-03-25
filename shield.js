console.log("shield.js script loaded."); // Log when the script is loaded

// Utility: get latest points from the DOM
function getCurrentPoints() {
    const elem = document.getElementById("pointsValue");
    const val = elem ? Number(elem.textContent) : 0;
    console.log("Current points from DOM:", val);
    return val;
}

let shieldCost = 1; // shield costs 1 point for testing
let shields = parseInt(localStorage.getItem("shields")) || 0;

function initShield() {
    console.log("Initializing shield functionality.");
    const shieldButton = document.querySelector("#shieldPowerUpDiv");
    if (shieldButton) {
        shieldButton.addEventListener("click", () => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                alert("Please login to use shield!");
                return;
            }

            let currentPoints = parseInt(localStorage.getItem("points")) || 0;
            if (currentPoints >= shieldCost) {
                currentPoints -= shieldCost;
                localStorage.setItem("points", currentPoints);
                
                // Update shield status in Firebase
                const userRef = ref(database, `users/${userId}`);
                const shieldExpiration = Date.now() + (6 * 60 * 60 * 1000); // 6 hours
                update(userRef, {
                    shieldActive: true,
                    shieldExpiration: shieldExpiration
                });

                alert("Shield activated for 6 hours!");
            } else {
                alert("Not enough points!");
            }
        });
    } else {
        console.error("Shield button not found in the DOM.");
    }
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShield);
} else {
    initShield();
}
