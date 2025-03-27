/**
 * Anti-Cheat Helper
 * Monitors and cleans up unauthorized game state changes
 */
(function() {
    // Run initial check
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a moment to ensure other scripts have run
        setTimeout(verifyGameState, 1000);
        
        // Then check periodically
        setInterval(verifyGameState, 10000);
    });
    
    function verifyGameState() {
        // Check for unauthorized promo rewards
        const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
        const hasEmberDragonCode = usedCodes.includes('Thanks4Helping');
        
        if (!hasEmberDragonCode) {
            let cleanupNeeded = false;
            
            // Check for unauthorized multipliers
            const multipliers = [
                'clickMultiplier', 
                'autoClickerMultiplier'
            ];
            
            multipliers.forEach(key => {
                const value = parseFloat(localStorage.getItem(key) || '1');
                if (value > 1) {
                    localStorage.setItem(key, '1');
                    cleanupNeeded = true;
                }
            });
            
            // Check for unauthorized bonuses
            if (parseFloat(localStorage.getItem('permanentPointsBonus') || '0') > 0) {
                localStorage.setItem('permanentPointsBonus', '0');
                cleanupNeeded = true;
            }
            
            // Check for unauthorized pet
            const equippedPet = localStorage.getItem('equippedPet');
            if (equippedPet === 'Ember the Legendary Dragon') {
                localStorage.removeItem('equippedPet');
                localStorage.removeItem('petBonusCPS');
                localStorage.removeItem('petCritChance');
                localStorage.removeItem('petCritMultiplier');
                cleanupNeeded = true;
            }
            
            // Check shop inventory
            const shopInventory = JSON.parse(localStorage.getItem('shopInventory') || '{"pets":[]}');
            if (shopInventory.pets && shopInventory.pets.some(pet => pet.name === 'Ember the Legendary Dragon')) {
                shopInventory.pets = shopInventory.pets.filter(pet => pet.name !== 'Ember the Legendary Dragon');
                localStorage.setItem('shopInventory', JSON.stringify(shopInventory));
                cleanupNeeded = true;
            }
            
            if (cleanupNeeded) {
                console.log("Anti-cheat: Fixed unauthorized game state");
                
                // Force UI update if we're on the right page
                if (window.statusDisplay && typeof window.statusDisplay.updateStatusDisplay === 'function') {
                    window.statusDisplay.updateStatusDisplay();
                }
            }
        }
        
        // Verify auto-clicker state consistency
        const autoClickerPurchased = localStorage.getItem('autoClickerPurchased') === 'true';
        const autoClickerUpgradeCount = parseInt(localStorage.getItem('autoClickerUpgradeCount') || '0');
        
        if (!autoClickerPurchased && autoClickerUpgradeCount > 0) {
            localStorage.setItem('autoClickerUpgradeCount', '0');
            localStorage.setItem('autoClickerPointsPerSecond', '0');
            console.log("Anti-cheat: Fixed inconsistent auto clicker state");
        }
    }
})();
