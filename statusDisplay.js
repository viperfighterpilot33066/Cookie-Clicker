/**
 * Status Display Component
 * Shows active pets and effects on the main game screen
 */

class StatusDisplay {
    constructor() {
        // List of pages where the status bar should be shown
        this.allowedPages = ['index.html', 'shop.html'];
        
        // Only initialize on allowed pages
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (this.allowedPages.includes(currentPage)) {
            this.init();
        } else {
            console.log("Status bar disabled on this page");
        }
        
        this.petsData = [
            { id: 'cookiePup', name: 'Cookie Pup', tier: 'common' },
            { id: 'sugarDragon', name: 'Sugar Dragon', tier: 'uncommon' },
            { id: 'chocolateChimp', name: 'Chocolate Chimp', tier: 'common' },
            { id: 'goldenHamster', name: 'Golden Hamster', tier: 'rare' },
            { id: 'bakingRabbit', name: 'Baking Rabbit', tier: 'uncommon' },
            { id: 'caramelCat', name: 'Caramel Cat', tier: 'uncommon' },
            { id: 'pastryPenguin', name: 'Pastry Penguin', tier: 'rare' },
            { id: 'frostingFox', name: 'Frosting Fox', tier: 'rare' },
            { id: 'waffleWolf', name: 'Waffle Wolf', tier: 'epic' },
            { id: 'donutDolphin', name: 'Donut Dolphin', tier: 'rare' },
            { id: 'brownieBear', name: 'Brownie Bear', tier: 'epic' },
            { id: 'sundaeSnake', name: 'Sundae Snake', tier: 'epic' },
            { id: 'macaronMouse', name: 'Macaron Mouse', tier: 'epic' },
            { id: 'tiramisuTiger', name: 'Tiramisu Tiger', tier: 'legendary' },
            { id: 'puddingPhoenix', name: 'Pudding Phoenix', tier: 'legendary' }
        ];
        
        this.effectsData = [
            { id: 'sugarRush', name: 'Sugar Rush', tier: 'common' },
            { id: 'bakingFrenzy', name: 'Baking Frenzy', tier: 'common' },
            { id: 'cookieStorm', name: 'Cookie Storm', tier: 'uncommon' },
            { id: 'goldenTouch', name: 'Golden Touch', tier: 'rare' },
            { id: 'cookieNova', name: 'Cookie Nova', tier: 'epic' },
            { id: 'cookieBlizzard', name: 'Cookie Blizzard', tier: 'uncommon' },
            { id: 'sugarHigh', name: 'Sugar High', tier: 'uncommon' },
            { id: 'cookieMultiplication', name: 'Cookie Multiplication', tier: 'rare' },
            { id: 'goldenShower', name: 'Golden Shower', tier: 'rare' },
            { id: 'timeWarp', name: 'Time Warp', tier: 'epic' },
            { id: 'cookieExplosion', name: 'Cookie Explosion', tier: 'epic' },
            { id: 'clickFrenzy', name: 'Click Frenzy', tier: 'rare' },
            { id: 'cookieChain', name: 'Cookie Chain', tier: 'epic' },
            { id: 'luckyFortune', name: 'Lucky Fortune', tier: 'epic' },
            { id: 'divineCookie', name: 'Divine Cookie', tier: 'legendary' }
        ];
        
        this.updateInterval = null;
    }
    
    init() {
        // Only run initialization if we're on allowed pages
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (!this.allowedPages.includes(currentPage)) {
            return;
        }
        
        // Create status display element when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Check if status bar already exists before creating a new one
            if (!document.getElementById('bonusStatusBar')) {
                this.createStatusDisplay();
            }
            this.startMonitoring();
        });
    }
    
    createStatusDisplay() {
        // First check if the status bar already exists
        if (document.getElementById('bonusStatusBar')) {
            return; // Don't create a duplicate
        }
        
        // Create the status bar element
        const statusBar = document.createElement('div');
        statusBar.id = 'bonusStatusBar';
        statusBar.className = 'bonus-status-bar';
        statusBar.innerHTML = `
            <div class="pet-status">
                <span class="status-label">Pet:</span>
                <span class="pet-name">None</span>
                <span class="pet-tier"></span>
                <span class="pet-bonus"></span>
            </div>
            <div class="effect-status">
                <span class="status-label">Effect:</span>
                <span class="effect-name">None</span>
                <span class="effect-tier"></span>
                <span class="effect-time"></span>
            </div>
            <div class="points-per-click">
                <span class="points-value">1</span> per click
            </div>
        `;
        
        // Add it to the document
        document.body.appendChild(statusBar);
    }
    
    startMonitoring() {
        // Update status display immediately
        this.updateStatusDisplay();
        
        // Then update every 1 second
        this.updateInterval = setInterval(() => {
            this.updateStatusDisplay();
        }, 1000);
    }
    
    updateStatusDisplay() {
        // Get elements with more precise selectors
        const petName = document.querySelector('#bonusStatusBar .pet-name');
        const petBonus = document.querySelector('#bonusStatusBar .pet-bonus');
        const petTier = document.querySelector('#bonusStatusBar .pet-tier');
        const effectName = document.querySelector('#bonusStatusBar .effect-name');
        const effectTimeDisplay = document.querySelector('#bonusStatusBar .effect-time');
        const effectTier = document.querySelector('#bonusStatusBar .effect-tier');
        const pointsValue = document.querySelector('#bonusStatusBar .points-value');
        
        if (!petName || !petBonus || !petTier || !effectName || !effectTimeDisplay || !effectTier || !pointsValue) {
            console.log("Status bar elements not found", {petName, petBonus, petTier});
            return;
        }

        // Check pet directly from equippedPet in localStorage
        const equippedPetName = localStorage.getItem('equippedPet');
        
        // Create a class property to track the current pet
        this.currentPet = equippedPetName;
        
        // Special handling for Ember Dragon
        if (equippedPetName === 'Ember the Legendary Dragon') {
            // Always show Ember Dragon if it's equipped, regardless of inventory
            petName.textContent = 'Ember the Legendary Dragon';
            petBonus.textContent = '+2.0 CPS, 2× Click, 15% Crit';
            petTier.textContent = 'Legendary';
            petTier.className = 'pet-tier tier-legendary';
            console.log("Ember Dragon displayed in status bar");
            return;
        }
        
        // Regular pet handling for non-Ember pets
        const shopInventory = JSON.parse(localStorage.getItem('shopInventory') || '{"pets":[]}');
        
        const petExists = equippedPetName && 
                         shopInventory.pets && 
                         shopInventory.pets.some(pet => pet.name === equippedPetName);
        
        if (petExists) {
            const pet = shopInventory.pets.find(p => p.name === equippedPetName);
            petName.textContent = equippedPetName;
            
            if (pet) {
                // Set bonuses based on found pet
                let bonusText = '';
                if (pet.bonusCPS) bonusText += `+${pet.bonusCPS} CPS `;
                if (pet.clickMultiplier) bonusText += `${pet.clickMultiplier}x Click `;
                if (pet.critChance) bonusText += `${pet.critChance*100}% Crit `;
                petBonus.textContent = bonusText || 'No bonus';
                
                // Set tier if available
                petTier.textContent = pet.tier ? pet.tier.charAt(0).toUpperCase() + pet.tier.slice(1) : '';
            } else {
                petBonus.textContent = 'Stats unknown';
                petTier.textContent = '';
            }
        } else {
            // No valid pet equipped
            petName.textContent = 'None';
            petBonus.textContent = '';
            petTier.textContent = '';
            
            // IMPORTANT: Clear pet-related localStorage values if no valid pet
            if (equippedPetName) {
                // Clear equipped pet since it's not valid
                localStorage.removeItem('equippedPet');
                localStorage.removeItem('petBonusCPS');
                localStorage.removeItem('petClickBonus');
                localStorage.removeItem('petCritChance');
                localStorage.removeItem('petCritMultiplier');
            }
        }

        // Get current pet and effect info from localStorage
        const effectInfo = this.getActiveEffectInfo();
        const effectTime = this.getActiveEffectTime();
        
        // Update effect display
        const effectNameElem = document.querySelector('.effect-name');
        const effectTimeElem = document.querySelector('.effect-time');
        const effectTierElem = document.querySelector('.effect-tier'); // ADDED THIS MISSING DEFINITION
        
        if (effectInfo) {
            effectNameElem.textContent = effectInfo.name;
            effectNameElem.classList.add('active-bonus');
            effectTimeElem.textContent = effectTime ? `(${effectTime})` : '';
            
            // Set tier badge
            effectTierElem.textContent = effectInfo.tier;
            effectTierElem.className = 'effect-tier tier-' + effectInfo.tier;
        } else {
            effectNameElem.textContent = 'None';
            effectNameElem.classList.remove('active-bonus');
            effectTimeElem.textContent = '';
            effectTierElem.textContent = '';
            effectTierElem.className = 'effect-tier';
        }
        
        // Update points per click with more specific selector
        const cursorUpgradeActive = parseInt(localStorage.getItem('cursorUpgradeActive')) || 0;
        const clickMultiplier = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
        let basePointsPerClick = 1 + cursorUpgradeActive;
        let finalPointsPerClick = basePointsPerClick * clickMultiplier;
        
        // Apply permanent bonus if exists
        const permanentBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
        if (permanentBonus > 0) {
            finalPointsPerClick = Math.floor(finalPointsPerClick * (1 + permanentBonus));
        }
        
        // CRITICAL FIX: Cache the correct value to avoid override from other selectors
        pointsValue.setAttribute('data-original', finalPointsPerClick);
        pointsValue.textContent = finalPointsPerClick;
    }
    
    getEquippedPetInfo() {
        // Check for equipped pet
        const equippedPetName = localStorage.getItem('equippedPet');
        if (!equippedPetName) return null;
        
        // Get pet from inventory
        const inventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
        const pet = inventory.pets.find(p => p.name === equippedPetName);
        
        // Fallback for Ember Dragon if inventory entry is missing
        if (equippedPetName === 'Ember the Legendary Dragon' && !pet) {
            return {
                name: 'Ember the Legendary Dragon',
                tier: 'legendary',
                rarity: 5,
                description: 'A legendary dragon that commands the power of infernal flames',
                perk: '+2.0 cookies/second, doubles click power, 15% chance for 5x critical hits'
            };
        }
        
        return pet || null;
    }
    
    getPetBonus() {
        const equippedPet = this.getEquippedPetInfo();
        if (!equippedPet) return '';
        
        // Check for different bonus types
        const petBonusCPS = parseFloat(localStorage.getItem('petBonusCPS')) || 0;
        const petClickBonus = parseFloat(localStorage.getItem('petClickBonus')) || 0;
        const productionBonus = parseFloat(localStorage.getItem('petProductionBonus')) || 0;
        
        let bonusText = [];
        
        if (petBonusCPS > 0) bonusText.push(`+${petBonusCPS} CPS`);
        if (petClickBonus > 0) bonusText.push(`×${petClickBonus} clicks`);
        if (productionBonus > 0) bonusText.push(`+${productionBonus * 100}% production`);
        
        return bonusText.length > 0 ? `(${bonusText.join(', ')})` : '';
    }
    
    getActiveEffectInfo() {
        const inventory = JSON.parse(localStorage.getItem('shopInventory') || '{}');
        if (!inventory.activeEffect) return null;
        
        const effect = this.effectsData.find(e => e.id === inventory.activeEffect.id);
        return effect || null;
    }
    
    getActiveEffectTime() {
        const inventory = JSON.parse(localStorage.getItem('shopInventory') || '{}');
        if (!inventory.activeEffect || !inventory.activeEffect.endTime) return null;
        
        const timeLeft = Math.max(0, Math.floor((inventory.activeEffect.endTime - Date.now()) / 1000));
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    
    getPointsPerClick() {
        let pointsPerClick = parseInt(localStorage.getItem('pointsPerClick')) || 1;
        const petClickBonus = parseInt(localStorage.getItem('petClickBonus')) || 0;
        const effectClickBonus = parseInt(localStorage.getItem('effectClickBonus')) || 1;
        
        // Apply bonuses
        pointsPerClick += petClickBonus;
        pointsPerClick *= effectClickBonus;
        
        return pointsPerClick;
    }
}

// Add this function to force refresh the pet display
function forceRefreshPetDisplay() {
    // Get elements
    const petName = document.querySelector('.pet-name');
    const petBonus = document.querySelector('.pet-bonus');
    const petTier = document.querySelector('.pet-tier');
    
    if (!petName || !petBonus || !petTier) {
        return; // Elements not found
    }
    
    // Get equipped pet
    const equippedPetName = localStorage.getItem('equippedPet');
    if (!equippedPetName) {
        petName.textContent = 'None';
        petBonus.textContent = '';
        petTier.textContent = '';
        return;
    }
    
    // Check if it's Ember Dragon
    if (equippedPetName === 'Ember the Legendary Dragon') {
        // Force display values
        petName.textContent = 'Ember the Legendary Dragon';
        petBonus.textContent = '+2.0 CPS, 2× Click, 15% Crit';
        petTier.textContent = 'Legendary';
        petTier.className = 'pet-tier tier-legendary';
        
        console.log("Forced Ember Dragon display in status bar");
    }
}

// Patch the original updateStatusDisplay method
const originalUpdateStatusDisplay = StatusDisplay.prototype.updateStatusDisplay;

StatusDisplay.prototype.updateStatusDisplay = function() {
    // Call the original method
    originalUpdateStatusDisplay.call(this);
    
    // Check for Ember Dragon specifically to ensure it's showing
    const equippedPetName = localStorage.getItem('equippedPet');
    const petName = document.querySelector('.pet-name');
    
    if (equippedPetName === 'Ember the Legendary Dragon' && 
        (!petName || petName.textContent !== 'Ember the Legendary Dragon')) {
        forceRefreshPetDisplay();
    }
    
    // Check point value to ensure permanent bonus is applied
    const pointsValue = document.querySelector('.status-section .points-value');
    if (pointsValue) {
        const cursorUpgradeActive = parseInt(localStorage.getItem('cursorUpgradeActive')) || 0;
        const clickMultiplier = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
        const permanentBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
        
        // Calculate expected value
        let basePointsPerClick = 1 + cursorUpgradeActive;
        let finalPointsPerClick = basePointsPerClick * clickMultiplier;
        
        if (permanentBonus > 0) {
            finalPointsPerClick = Math.floor(finalPointsPerClick * (1 + permanentBonus));
        }
        
        // Update display if needed
        if (parseInt(pointsValue.textContent) !== finalPointsPerClick) {
            pointsValue.textContent = finalPointsPerClick;
        }
    }
};

// Add check on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if Ember Dragon should be equipped but isn't showing
    setTimeout(() => {
        const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
        if (usedCodes.includes('Thanks4Helping')) {
            const equippedPet = localStorage.getItem('equippedPet');
            const petNameDisplay = document.querySelector('.pet-name');
            
            if (equippedPet === 'Ember the Legendary Dragon' && 
                (!petNameDisplay || petNameDisplay.textContent !== 'Ember the Legendary Dragon')) {
                console.log("Fixing Ember Dragon display");
                forceRefreshPetDisplay();
            }
        }
    }, 1000);
});

// Initialize status display - make sure we don't create duplicates and only on allowed pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page that should show the status bar
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allowedPages = ['index.html', 'shop.html'];
    
    if (allowedPages.includes(currentPage)) {
        if (!window.statusDisplay) {
            window.statusDisplay = new StatusDisplay();
        }
    } else {
        // Remove status bar if it exists on non-allowed pages
        const statusBar = document.getElementById('bonusStatusBar');
        if (statusBar) {
            statusBar.remove();
        }
    }
});

function getPointsPerClick() {
    const baseClickValue = 1;
    const upgrades = parseInt(localStorage.getItem('cursorUpgradeActive') || '0');
    const multiplier = parseFloat(localStorage.getItem('clickMultiplier') || '1');
    return (baseClickValue + upgrades) * multiplier;
}

function updateStatusDisplay() {
    const pointsValue = document.getElementById("pointsValue");
    if (pointsValue) {
        pointsValue.textContent = getPointsPerClick();
    }
}

function updateStatusDisplay() {
    const pointsValue = document.getElementById("pointsValue");
    if (pointsValue) {
        const totalPoints = parseInt(localStorage.getItem("points")) || 0;
        pointsValue.textContent = totalPoints;
    }
}
