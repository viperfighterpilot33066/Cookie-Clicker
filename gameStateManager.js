/**
 * Game State Manager
 * Central place for managing game state to ensure consistency across components
 */
const GameStateManager = (function() {
    // Default values for new players
    const defaultState = {
        points: 0,
        pointsPerClick: 1,
        autoClickerPurchased: false,
        autoClickerUpgradeCount: 0,
        autoClickerPointsPerSecond: 0,
        cursorUpgradeActive: 0,
        clickMultiplier: 1,
        autoClickerMultiplier: 1,
        permanentPointsBonus: 0
    };
    
    // Initialize game state
    function initialize() {
        // Check if this is a first-time load
        if (!localStorage.getItem("gameInitialized")) {
            // Set all default values
            Object.entries(defaultState).forEach(([key, value]) => {
                localStorage.setItem(key, typeof value === 'boolean' ? value.toString() : value);
            });
            
            // Mark as initialized
            localStorage.setItem("gameInitialized", "true");
            console.log("Game initialized with default values");
        }
        
        // Verify game state consistency
        verifyStateConsistency();
    }
    
    // Verify that game state is consistent
    function verifyStateConsistency() {
        // Fix auto clicker issues
        const autoClickerPurchased = localStorage.getItem("autoClickerPurchased") === "true";
        const autoClickerUpgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
        const autoClickerPointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 0;
        
        // Auto clicker points should match upgrade count exactly
        if (autoClickerPointsPerSecond !== autoClickerUpgradeCount) {
            localStorage.setItem("autoClickerPointsPerSecond", autoClickerUpgradeCount.toString());
            console.log("Fixed auto clicker points per second");
        }
        
        // If no upgrades, auto clicker should not be purchased
        if (autoClickerUpgradeCount <= 0 && autoClickerPurchased) {
            localStorage.setItem("autoClickerPurchased", "false");
            console.log("Fixed auto clicker purchase status");
        }
        
        // Fix cursor upgrade issues
        const cursorUpgrade = parseInt(localStorage.getItem("cursorUpgradeActive")) || 0;
        const pointsPerClick = parseInt(localStorage.getItem("pointsPerClick")) || 1;
        const expectedPointsPerClick = 1 + cursorUpgrade;
        
        // Points per click should be 1 + cursor upgrade level
        if (pointsPerClick !== expectedPointsPerClick) {
            localStorage.setItem("pointsPerClick", expectedPointsPerClick.toString());
            console.log("Fixed points per click");
        }
        
        // Verify promo code benefits
        validatePromoCodeBenefits();
    }
    
    // Validate promo code benefits are only active if redeemed
    function validatePromoCodeBenefits() {
        const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
        const hasRedeemedEmberCode = usedCodes.includes('Thanks4Helping');
        
        // Only allow promo benefits if code was redeemed
        const clickMultiplier = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
        const autoClickerMultiplier = parseFloat(localStorage.getItem('autoClickerMultiplier')) || 1;
        const permanentPointsBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
        
        if (!hasRedeemedEmberCode && (clickMultiplier > 1 || autoClickerMultiplier > 1 || permanentPointsBonus > 0)) {
            localStorage.setItem('clickMultiplier', '1');
            localStorage.setItem('autoClickerMultiplier', '1');
            localStorage.setItem('permanentPointsBonus', '0');
            console.log("Fixed promo code benefits");
        }
        
        // Check for unauthorized Ember Dragon
        const shopInventory = JSON.parse(localStorage.getItem('shopInventory') || '{"pets":[]}');
        const hasEmberDragon = shopInventory.pets.some(pet => pet.name === 'Ember the Legendary Dragon');
        
        if (hasEmberDragon && !hasRedeemedEmberCode) {
            shopInventory.pets = shopInventory.pets.filter(pet => pet.name !== 'Ember the Legendary Dragon');
            localStorage.setItem('shopInventory', JSON.stringify(shopInventory));
            console.log("Removed unauthorized Ember Dragon");
        }
    }
    
    // Return public API
    return {
        initialize,
        verifyStateConsistency
    };
})();

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    GameStateManager.initialize();
    console.log("Game state verified and ready");
});
