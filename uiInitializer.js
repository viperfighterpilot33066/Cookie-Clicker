/**
 * UI Initializer - Ensures consistent display across all pages
 * Loads and displays values from localStorage for all persistent UI elements
 */
(function() {
    // Execute when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log("UI Initializer running");
        // Initialize all UI elements
        initializeUI();
        
        // Also listen for any localStorage changes
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            // Call the original function
            originalSetItem.apply(this, arguments);
            
            // Check if this is a key that affects the UI
            if (key === 'cursorUpgradeActive' || key === 'points' || key === 'curserUpgradeActive') {
                // Update UI after a brief delay to ensure the value is saved
                setTimeout(initializeUI, 10);
            }
        };
    });
    
    function initializeUI() {
        // Initialize cursor upgrade display
        initializeCursorDisplay();
        
        // Initialize points display
        initializePointsDisplay();
        
        // Initialize other displays as needed
        // (auto-clicker, pets, effects etc.)
    }
    
    function initializeCursorDisplay() {
        // Get current level directly from localStorage
        const cursorUpgradeActive = parseInt(localStorage.getItem("cursorUpgradeActive")) || 0;
        const nextUpgradeCost = 100 + (cursorUpgradeActive * 100);
        
        // All possible element IDs for level display
        const levelElementIds = [
            "cursorUpgradeLevel", "curserUpgradeLevel", "curserUpgradeCount", 
            "cursorUpgradeCount", "clickUpgradeLevel"
        ];
        
        // All possible element IDs for cost display
        const costElementIds = [
            "cursorUpgradePrice", "curserUpgradePrice", "cursorUpgradeCost", 
            "curserUpgradeCost", "upgradeCost"
        ];
        
        // Update level elements
        levelElementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = cursorUpgradeActive;
                console.log(`Initialized ${id} element with level ${cursorUpgradeActive}`);
            }
        });
        
        // Update cost elements
        costElementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = nextUpgradeCost;
                console.log(`Initialized ${id} element with cost ${nextUpgradeCost}`);
            }
        });
        
        // Ensure the cursor upgrade button is correctly labeled
        const upgradeButtons = document.querySelectorAll(
            '#CursorUpgrade, #CurserUpgrade, [data-upgrade="cursor"]'
        );
        
        upgradeButtons.forEach(button => {
            // Set the button text if it doesn't have complex HTML content
            if (button.children.length === 0) {
                button.textContent = `Upgrade Cursor (${nextUpgradeCost})`;
            }
            
            // If there's a cost element inside, update it
            const costElement = button.querySelector('.cost, .price');
            if (costElement) {
                costElement.textContent = nextUpgradeCost;
            }
        });
    }
    
    function initializePointsDisplay() {
        // Update points display
        const points = parseInt(localStorage.getItem("points")) || 0;
        const pointsElements = document.querySelectorAll('#pointsValue, .points-value');
        
        // pointsElements.forEach(element => {
        //     element.textContent = points;
        // });
    }
})();
