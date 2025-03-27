/**
 * Promo Code Verifier
 * Ensures promo code rewards are properly applied
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(verifyPromoEffects, 1000);
    });
    
    function verifyPromoEffects() {
        const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
        
        if (usedCodes.includes('Thanks4Helping')) {
            console.log("Verifying Thanks4Helping promo effects...");
            
            // Check all expected effects
            const checks = {
                'permanentPointsBonus': 0.25,
                'clickMultiplier': 2.0,
                'autoClickerMultiplier': 2.0,
                'petBonusCPS': 2.0,
                'petCritChance': 0.15,
                'petCritMultiplier': 5,
                'equippedPet': 'Ember the Legendary Dragon'
            };
            
            let needsFix = false;
            
            // Check each value
            for (const [key, expectedValue] of Object.entries(checks)) {
                const actualValue = key === 'equippedPet' ? 
                    localStorage.getItem(key) : 
                    parseFloat(localStorage.getItem(key) || '0');
                
                if (key === 'equippedPet' ? (actualValue !== expectedValue) : (actualValue < expectedValue)) {
                    console.log(`${key} needs fix: Expected ${expectedValue}, got ${actualValue}`);
                    needsFix = true;
                    
                    // Apply fix immediately
                    if (key === 'equippedPet') {
                        localStorage.setItem(key, expectedValue);
                    } else {
                        localStorage.setItem(key, expectedValue.toString());
                    }
                }
            }
            
            // Check for Ember Dragon in inventory
            const inventory = JSON.parse(localStorage.getItem('shopInventory') || '{"pets":[]}');
            const hasEmber = inventory.pets && inventory.pets.some(pet => pet.name === 'Ember the Legendary Dragon');
            
            if (!hasEmber) {
                console.log("Ember Dragon missing from inventory");
                needsFix = true;
                
                // Call setupEmberDragonComplete if it exists
                if (typeof setupEmberDragonComplete === 'function') {
                    setupEmberDragonComplete();
                } else if (typeof window.setupEmberDragonComplete === 'function') {
                    window.setupEmberDragonComplete();
                } else {
                    console.log("Cannot add Ember Dragon - setup function not found");
                }
            }
            
            if (needsFix) {
                console.log("Applied promo code fixes");
                
                // Force status display update if possible
                if (window.statusDisplay && typeof window.statusDisplay.updateStatusDisplay === 'function') {
                    window.statusDisplay.updateStatusDisplay();
                }
            } else {
                console.log("All promo effects correctly applied");
            }
        }
    }
})();
