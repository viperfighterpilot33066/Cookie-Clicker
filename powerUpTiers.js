console.log("powerUpTiers.js loaded");

// Define simple costs and behavior for each power-up
const powerUpsConfig = {
    autoClicker: {
        purchased: false,
        cost: 10,
        effectPerSecond: 1
    },
    // Remove superAutoClicker and clickSpeedBooster that were causing issues
    sabotage: {
        cost: 30000,
        effect: 0.30
    },
    curserUpgrade: {
        baseCost: 100,
        costMultiplier: 1.75,
        baseEffect: 1,
        effectMultiplier: 1.5,
        maxTier: 10,
        getTierCost: function(tier) {
            return Math.floor(this.baseCost * Math.pow(this.costMultiplier, tier - 1));
        },
        getTierEffect: function(tier) {
            return Math.floor(this.baseEffect * Math.pow(this.effectMultiplier, tier - 1) * 10) / 10;
        }
    },
    shield: {
        baseCost: 15000,
        costMultiplier: 2,
        baseDuration: 6, // hours
        durationMultiplier: 1.5,
        maxTier: 5,  // Keep max tier for internal calculations
        getTierCost: function(tier) {
            return Math.floor(this.baseCost * Math.pow(this.costMultiplier, tier - 1));
        },
        getTierDuration: function(tier) {
            return Math.floor(this.baseDuration * Math.pow(this.durationMultiplier, tier - 1));
        }
    },
    costReducer: {
        baseCost: 500,
        costIncrease: 300,  // Fixed increase instead of multiplier
        maxTier: 3,
        effects: [0.10, 0.15, 0.20],  // 10%, 15%, 20% reduction
        getTierCost: function(tier) {
            return this.baseCost + (this.costIncrease * (tier - 1));
        },
        getTierEffect: function(tier) {
            return this.effects[Math.min(tier, this.maxTier) - 1];
        }
    },
    divineCookie: {
        name: 'Divine Cookie',
        description: '50x cookie production for 20 seconds',
        price: 1000000,
        emoji: '🌈',
        bgColor: '#FFFF00',
        effect: { type: 'productionMultiplier', value: 50, duration: 20 }, // Increased from 10 to 20 seconds
        locked: true,
        achievement: 'cookieLegend'
    }
};

// Load tiers from localStorage
function loadTiers() {
    const tiers = {
        curserUpgrade: parseInt(localStorage.getItem("curserUpgradeTier")) || 1,
        shield: parseInt(localStorage.getItem("shieldTier")) || 1,
        costReducer: parseInt(localStorage.getItem("costReducerTier")) || 1
    };
    
    return tiers;
}

// Save tiers to localStorage
function saveTiers(tiers) {
    localStorage.setItem("curserUpgradeTier", tiers.curserUpgrade);
    localStorage.setItem("shieldTier", tiers.shield);
    localStorage.setItem("costReducerTier", tiers.costReducer);
}

// Update UI with current tier values
function updateTierUI() {
    try {
        const tiers = loadTiers();
        const costReduction = getCostReduction();
        console.log("Current tiers:", tiers);
        console.log("Cost reduction:", costReduction);
        
        // Update the points display first
        const currentPoints = parseInt(localStorage.getItem("points")) || 0;
        updatePointsDisplay(currentPoints);
        
        // Cursor Upgrade (show max tier)
        if (document.getElementById("curserUpgradeTier")) {
            document.getElementById("curserUpgradeTier").textContent = 
                `${tiers.curserUpgrade}/${powerUpsConfig.curserUpgrade.maxTier}`;
        }
        if (document.getElementById("curserUpgradePrice")) {
            document.getElementById("curserUpgradePrice").textContent = 
                `-${applyDiscount(powerUpsConfig.curserUpgrade.getTierCost(tiers.curserUpgrade), costReduction)}`;
        }
        if (document.getElementById("curserUpgradeEffect")) {
            document.getElementById("curserUpgradeEffect").textContent = 
                powerUpsConfig.curserUpgrade.getTierEffect(tiers.curserUpgrade);
        }
        if (document.getElementById("curserUpgradeCount")) {
            document.getElementById("curserUpgradeCount").textContent = 
                `${tiers.curserUpgrade-1}/${powerUpsConfig.curserUpgrade.maxTier-1}`;
        }
        
        // Shield (no max tier display)
        if (document.getElementById("shieldTier")) {
            document.getElementById("shieldTier").textContent = tiers.shield;
        }
        if (document.getElementById("shieldCost")) {
            document.getElementById("shieldCost").textContent = 
                `-${applyDiscount(powerUpsConfig.shield.getTierCost(tiers.shield), costReduction)}`;
        }
        if (document.getElementById("shieldDuration")) {
            document.getElementById("shieldDuration").textContent = 
                powerUpsConfig.shield.getTierDuration(tiers.shield);
        }
        
        // Cost Reducer (show max tier)
        if (document.getElementById("costReducerTier")) {
            document.getElementById("costReducerTier").textContent = 
                `${tiers.costReducer}/${powerUpsConfig.costReducer.maxTier}`;
        }
        
        // Cost Reducer display in powerUps.html
        if (document.getElementById("costReducerLevel")) {
            document.getElementById("costReducerLevel").textContent = tiers.costReducer;
        }
        
        // Cost reducer doesn't get its own discount
        if (document.getElementById("costReducerCost")) {
            document.getElementById("costReducerCost").textContent = 
                powerUpsConfig.costReducer.getTierCost(tiers.costReducer);
        }
        if (document.getElementById("costReducerEffect")) {
            document.getElementById("costReducerEffect").textContent = 
                Math.floor(powerUpsConfig.costReducer.getTierEffect(tiers.costReducer) * 100);
        }
    } catch (error) {
        console.error("Error in updateTierUI:", error);
    }
}

// Helper function to get the current cost reduction percentage
function getCostReduction() {
    const tiers = loadTiers();
    return powerUpsConfig.costReducer.getTierEffect(tiers.costReducer);
}

// Helper function to apply discount to a cost
function applyDiscount(cost, discountPercentage) {
    return Math.floor(cost * (1 - discountPercentage));
}

// Buy normal autoClicker
function buyAutoClicker() {
    const currentPoints = parseInt(localStorage.getItem("points")) || 0;
    if (powerUpsConfig.autoClicker.purchased) {
        alert("AutoClicker already purchased!");
        return;
    }
    if (currentPoints < powerUpsConfig.autoClicker.cost) {
        alert(`Not enough points. Need ${powerUpsConfig.autoClicker.cost}.`);
        return;
    }
    localStorage.setItem("points", currentPoints - powerUpsConfig.autoClicker.cost);
    powerUpsConfig.autoClicker.purchased = true;
    localStorage.setItem("autoClickerPurchased", true);
    alert("AutoClicker purchased!");
    updatePointsDisplay(currentPoints - powerUpsConfig.autoClicker.cost);
}

// Upgrade a power-up tier
function upgradeTier(powerUpType) {
    try {
        const tiers = loadTiers();
        const currentPoints = parseInt(localStorage.getItem("points")) || 0;
        const tierConfig = powerUpsConfig[powerUpType];
        const currentTier = tiers[powerUpType];
        
        if (currentTier >= tierConfig.maxTier) {
            alert(`${powerUpType} is already at maximum tier (${tierConfig.maxTier})!`);
            return false;
        }
        
        let upgradeCost = tierConfig.getTierCost(currentTier);
        
        // Apply cost reduction for everything except the cost reducer itself
        if (powerUpType !== 'costReducer') {
            const costReduction = getCostReduction();
            upgradeCost = applyDiscount(upgradeCost, costReduction);
        }
        
        if (currentPoints < upgradeCost) {
            alert(`Not enough points to upgrade ${powerUpType}. Need ${upgradeCost} points.`);
            return false;
        }
        
        // Deduct points
        const newPoints = currentPoints - upgradeCost;
        localStorage.setItem("points", newPoints);
        
        // Increase tier
        tiers[powerUpType] += 1;
        saveTiers(tiers);
        
        // Update UI
        updateTierUI();
        updatePointsDisplay(newPoints);
        
        console.log(`${powerUpType} upgraded to tier ${tiers[powerUpType]}!`);
        
        // Make sure Cost Reducer settings take effect immediately
        if (powerUpType === 'costReducer') {
            applyTierEffects(); // Apply the new cost reduction immediately
        }
        
        return true;
        
    } catch (error) {
        console.error(`Error upgrading ${powerUpType}:`, error);
        return false;
    }
}

// Enhanced helper function to update points display and sync to server
function updatePointsDisplay(points) {
  try {
    // Update DOM element if it exists
    const pointsDisplay = document.getElementById("pointsValue");
    if (pointsDisplay) {
      pointsDisplay.textContent = points;
    }
    
    // Sync to server if available
    if (typeof syncPointsToServer === 'function') {
      syncPointsToServer(points);
    }
  } catch (error) {
    console.error("Error updating points display:", error);
  }
}

// Enhanced sabotage function that works with the server
function sabotagePlayer(targetId) {
  try {
    const currentPoints = parseInt(localStorage.getItem("points")) || 0;
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("You need to be logged in to perform sabotage");
      return;
    }
    
    // Check if player has enough points to pay sabotage cost
    if (currentPoints < powerUpsConfig.sabotage.cost) {
      alert(`Not enough points to sabotage. Need ${powerUpsConfig.sabotage.cost}.`);
      return;
    }
    
    // Check if target exists and has a shield active
    const targetRef = firebase.database().ref(`users/${targetId}`);
    targetRef.once('value').then(snapshot => {
      if (!snapshot.exists()) {
        alert("Target player does not exist!");
        return;
      }
      
      const targetData = snapshot.val();
      const targetShieldExpiration = targetData.shieldExpiration || 0;
      
      if (targetShieldExpiration > Date.now()) {
        alert("Target player is protected by a shield!");
        return;
      }
      
      // Deduct points from the current user
      const newPoints = currentPoints - powerUpsConfig.sabotage.cost;
      localStorage.setItem("points", newPoints);
      updatePointsDisplay(newPoints);
      
      // Calculate amount to steal
      const targetPoints = targetData.points || 0;
      const amountToSteal = Math.floor(targetPoints * powerUpsConfig.sabotage.effect);
      const newTargetPoints = targetPoints - amountToSteal;
      
      // Update target's points on the server
      targetRef.update({ points: newTargetPoints });
      
      // Update leaderboard as well
      firebase.database().ref(`leaderboard/${targetId}`).update({ 
        points: newTargetPoints
      });
      
      // Record the sabotage in history
      const sabotageHistoryRef = firebase.database().ref('sabotageHistory').push();
      sabotageHistoryRef.set({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        saboteur: userId,
        target: targetId,
        amountReduced: amountToSteal
      });
      
      // Track for achievements
      localStorage.setItem('sabotageDone', 'true');
      const sabotageCount = parseInt(localStorage.getItem('sabotageCount') || '0') + 1;
      localStorage.setItem('sabotageCount', sabotageCount);
      const totalSabotagePoints = parseInt(localStorage.getItem('totalSabotagePoints') || '0') + amountToSteal;
      localStorage.setItem('totalSabotagePoints', totalSabotagePoints);
      
      alert(`Sabotage successful! Reduced ${targetData.userName}'s points by ${amountToSteal}!`);
    });
  } catch (error) {
    console.error("Error during sabotage:", error);
    alert("There was an error during sabotage. Please try again.");
  }
}

// Set up event listeners for upgrade buttons
document.addEventListener("DOMContentLoaded", function() {
    try {
        // Initialize UI
        updateTierUI();
        
        // Set up event listeners
        if (document.getElementById("upgradeCurser")) {
            document.getElementById("upgradeCurser").addEventListener("click", function() {
                upgradeTier("curserUpgrade");
            });
        }
        
        if (document.getElementById("upgradeShield")) {
            document.getElementById("upgradeShield").addEventListener("click", function() {
                upgradeTier("shield");
            });
        }
        
        if (document.getElementById("upgradeCostReducer")) {
            document.getElementById("upgradeCostReducer").addEventListener("click", function() {
                upgradeTier("costReducer");
            });
        }
        
        // Apply tier effects to existing power-ups
        applyTierEffects();
        
        // Handle rebirth - preserve cost reducer tier
        const rebirthButton = document.getElementById("rebirthButton");
        if (rebirthButton) {
            const originalClickHandler = rebirthButton.onclick;
            rebirthButton.onclick = function(event) {
                // Save cost reducer tier before rebirth
                const costReducerTier = parseInt(localStorage.getItem("costReducerTier")) || 1;
                
                // Call the original handler
                if (originalClickHandler) originalClickHandler.call(this, event);
                
                // Restore cost reducer tier after rebirth
                setTimeout(() => {
                    localStorage.setItem("costReducerTier", costReducerTier);
                    console.log("Restored cost reducer tier after rebirth:", costReducerTier);
                }, 500); // Small delay to ensure it happens after rebirth
            };
        }

        const buyAutoClickerBtn = document.getElementById("buyAutoClicker");
        if (buyAutoClickerBtn) {
            buyAutoClickerBtn.addEventListener("click", buyAutoClicker);
        }

        const sabotageBtn = document.getElementById("upgradeSabotage");
        if (sabotageBtn) {
            sabotageBtn.addEventListener("click", function() {
                // For example, sabotage "Friend1" or some target
                sabotagePlayer("Friend1");
            });
        }
    } catch (error) {
        console.error("Error in DOMContentLoaded:", error);
    }
});

// Apply tier effects to existing functionality
function applyTierEffects() {
    const tiers = loadTiers();
    
    // Update cursor power based on tier
    const clickPower = powerUpsConfig.curserUpgrade.getTierEffect(tiers.curserUpgrade);
    localStorage.setItem("clickPower", clickPower);
    
    // Update shield duration based on tier
    const shieldDuration = powerUpsConfig.shield.getTierDuration(tiers.shield) * 60 * 60 * 1000; // Convert hours to ms
    localStorage.setItem("shieldDuration", shieldDuration);
}

// Adjust cookie results using multipliers from localStorage
function getEffectiveClickValue(baseValue) {
    const clickMul = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
    return baseValue * clickMul;
}

function getEffectiveAutoValue(baseValue) {
    const autoMul = parseFloat(localStorage.getItem('autoClickerMultiplier')) || 1;
    const petBonus = parseFloat(localStorage.getItem('petBonusCPS')) || 0; // from Ember the Epic Dragon
    return (baseValue * autoMul) + petBonus;
}

// Fix divine cookie effect application
function applyEffectBonus(effect) {
    const effectType = effect.effect.type;
    const effectValue = effect.effect.value;
    
    console.log(`Applying effect bonus: ${effectType} with value ${effectValue}`);
    
    switch (effectType) {
        case 'clickPower':
            localStorage.setItem('effectClickBonus', effectValue);
            break;
        case 'productionMultiplier':
            localStorage.setItem('effectProductionBonus', effectValue);
            
            // For the Divine Cookie effect, also update the display
            if (effectValue === 50) { // Divine Cookie has 50x multiplier
                console.log("Divine Cookie effect activated: 50x production for 20 seconds");
                // Show notification about divine cookie activation
                if (typeof shopSystem !== 'undefined') {
                    shopSystem.showNotification('Divine Cookie activated: 50x production for 20 seconds!', false, true);
                }
            }
            break;
        case 'randomBonuses':
            // Start random bonus generation
            startRandomBonuses();
            break;
    }
}
