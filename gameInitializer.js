/**
 * Game Initializer
 * Runs at the start to clean up any inconsistent game state
 */
(function() {
    // Default game state values
    const defaultValues = {
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

    // Run fixes immediately when script loads
    console.log("🎮 Game Initializer starting...");
    fixGameState();

    function fixGameState() {
        // Add a counter for changes made
        let changesMade = 0;
        
        // 1. Check if this is a new game - if so, initialize defaults
        if (!localStorage.getItem("gameInitialized")) {
            initializeNewGame();
            return;
        }
        
        // 2. Fix inconsistency: cursor upgrade naming
        if (fixCursorUpgradeNaming()) {
            changesMade++;
        }
        
        // 3. Fix auto clicker inconsistencies
        if (fixAutoClickerState()) {
            changesMade++;
        }
        
        // 4. Fix unauthorized promo code rewards
        if (fixUnauthorizedPromoRewards()) {
            changesMade++;
        }
        
        // 5. Fix pet inconsistencies
        if (fixPetInconsistencies()) {
            changesMade++;
        }
        
        console.log(`🎮 Game Initializer completed: ${changesMade} issues fixed`);
        
        // Set flag to prevent race conditions with other scripts
        localStorage.setItem("gameInitializerRan", Date.now().toString());
    }

    function initializeNewGame() {
        console.log("Initializing new game with default values");
        
        // Set default values
        Object.entries(defaultValues).forEach(([key, value]) => {
            localStorage.setItem(key, typeof value === 'boolean' ? value.toString() : value);
        });
        
        // Mark as initialized
        localStorage.setItem("gameInitialized", "true");
    }

    // Return true if changes were made
    function fixCursorUpgradeNaming() {
        let changed = false;
        
        // Check if the old key exists
        const oldValue = localStorage.getItem("curserUpgradeActive");
        if (oldValue !== null) {
            // Get the best value between old and new (if new exists)
            const newValue = localStorage.getItem("cursorUpgradeActive");
            const bestValue = Math.max(
                parseInt(oldValue) || 0,
                parseInt(newValue) || 0
            );
            
            // Set the correct key and value
            localStorage.setItem("cursorUpgradeActive", bestValue);
            
            // Clean up old key to prevent future confusion
            localStorage.removeItem("curserUpgradeActive");
            
            console.log("Fixed cursor upgrade naming inconsistency, value:", bestValue);
            changed = true;
        }
        
        return changed;
    }

    // Add return value to each fix function
    function fixAutoClickerState() {
        let changed = false;
        
        // Get current values
        const purchased = localStorage.getItem("autoClickerPurchased") === "true";
        const upgradeCount = parseInt(localStorage.getItem("autoClickerUpgradeCount")) || 0;
        const pointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 0;
        
        // Fix inconsistencies
        if (!purchased && upgradeCount > 0) {
            localStorage.setItem("autoClickerPurchased", "true");
            console.log("Fixed auto clicker purchased state: true");
            changed = true;
        }
        
        if (purchased && upgradeCount <= 0) {
            localStorage.setItem("autoClickerPurchased", "false");
            console.log("Fixed auto clicker purchased state: false");
            changed = true;
        }
        
        // Points per second should exactly match upgrade count
        if (pointsPerSecond !== upgradeCount) {
            localStorage.setItem("autoClickerPointsPerSecond", upgradeCount.toString());
            console.log("Fixed auto clicker points per second:", upgradeCount);
            changed = true;
        }
        
        return changed;
    }

    function fixUnauthorizedPromoRewards() {
        let changed = false;
        
        // Check if promo code was used
        const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
        const hasEmberDragonCode = usedCodes.includes('Thanks4Helping');
        
        if (!hasEmberDragonCode) {
            // Mark as blocked first to prevent recreation
            localStorage.setItem('emberDragonBlocked', 'true');
            
            // CRITICAL: More thorough cleanup of all Ember Dragon related values
            const emberRelatedKeys = [
                'clickMultiplier', 
                'autoClickerMultiplier',
                'permanentPointsBonus',
                'petBonusCPS',
                'petCritChance',
                'petCritMultiplier',
                'petClickBonus',
                'equippedPet',
                'petProductionBonus',
                'emberDragonNotificationShown',
                'emberDragonNotificationNeeded'
            ];
            
            // Reset all dragon-related values
            emberRelatedKeys.forEach(key => {
                // Only reset if it exists
                if (localStorage.getItem(key) !== null) {
                    if (key === 'equippedPet' && localStorage.getItem(key) === 'Ember the Legendary Dragon') {
                        localStorage.removeItem(key);
                        changed = true;
                    } else if (key !== 'equippedPet') {
                        if (key === 'clickMultiplier' || key === 'autoClickerMultiplier') {
                            localStorage.setItem(key, '1');
                        } else {
                            localStorage.setItem(key, '0');
                        }
                        changed = true;
                    }
                }
            });
            
            // Clean up shop inventory - remove Ember Dragon if present
            const shopInventory = JSON.parse(localStorage.getItem('shopInventory') || '{"pets":[]}');
            const hadEmberDragon = shopInventory.pets && 
                                  shopInventory.pets.some(pet => pet.name === 'Ember the Legendary Dragon');
            
            if (hadEmberDragon) {
                shopInventory.pets = shopInventory.pets.filter(pet => pet.name !== 'Ember the Legendary Dragon');
                localStorage.setItem('shopInventory', JSON.stringify(shopInventory));
                console.log("Removed unauthorized Ember Dragon from inventory");
                changed = true;
            }
            
            // Also clean up any old token that might be used to bypass security
            localStorage.removeItem('emberDragonImage');
            
            if (changed) {
                console.log("Fixed unauthorized promo perks with enhanced cleanup");
            }
        }
        
        return changed;
    }

    function fixPetInconsistencies() {
        let changed = false;
        
        // Check if there's an equipped pet that doesn't exist in inventory
        const equippedPet = localStorage.getItem('equippedPet');
        if (!equippedPet) return changed;
        
        // Check if pet exists in inventory
        const shopInventory = JSON.parse(localStorage.getItem('shopInventory') || '{"pets":[]}');
        const petExists = shopInventory.pets && 
                         shopInventory.pets.some(pet => pet.name === equippedPet);
        
        // If pet is equipped but doesn't exist in inventory, clear pet data
        if (!petExists) {
            localStorage.removeItem('equippedPet');
            localStorage.removeItem('petBonusCPS');
            localStorage.removeItem('petClickBonus');
            localStorage.removeItem('petCritChance');
            localStorage.removeItem('petCritMultiplier');
            console.log("Removed reference to non-existent pet:", equippedPet);
            changed = true;
        }
        
        return changed;
    }
    
    console.log("🎮 Game Initializer completed");
})();
