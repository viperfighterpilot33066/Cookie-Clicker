/**
 * Status Display Component
 * Shows active pets and effects on the main game screen
 */

class StatusDisplay {
    constructor() {
        this.init();
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
    }
    
    init() {
        // Create status display element when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.createStatusDisplay();
            this.startMonitoring();
        });
    }
    
    createStatusDisplay() {
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
        // Check for active bonuses every second
        setInterval(() => {
            this.updateStatusDisplay();
        }, 1000);
    }
    
    updateStatusDisplay() {
        const statusBar = document.getElementById('bonusStatusBar');
        if (!statusBar) return;
        
        // Get current pet and effect info from localStorage
        const petInfo = this.getEquippedPetInfo();
        const petBonus = this.getPetBonus();
        const effectInfo = this.getActiveEffectInfo();
        const effectTime = this.getActiveEffectTime();
        const pointsPerClick = this.getPointsPerClick();
        
        // Update pet display
        const petNameElem = statusBar.querySelector('.pet-name');
        const petBonusElem = statusBar.querySelector('.pet-bonus');
        const petTierElem = statusBar.querySelector('.pet-tier');
        
        if (petInfo) {
            petNameElem.textContent = petInfo.name;
            petNameElem.classList.add('active-bonus');
            petBonusElem.textContent = petBonus;
            
            // Set tier badge
            petTierElem.textContent = petInfo.tier;
            petTierElem.className = 'pet-tier tier-' + petInfo.tier;
        } else {
            petNameElem.textContent = 'None';
            petNameElem.classList.remove('active-bonus');
            petBonusElem.textContent = '';
            petTierElem.textContent = '';
            petTierElem.className = 'pet-tier';
        }
        
        // Update effect display
        const effectNameElem = statusBar.querySelector('.effect-name');
        const effectTimeElem = statusBar.querySelector('.effect-time');
        const effectTierElem = statusBar.querySelector('.effect-tier');
        
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
        
        // Update points per click
        statusBar.querySelector('.points-value').textContent = pointsPerClick;
    }
    
    getEquippedPetInfo() {
        const inventory = JSON.parse(localStorage.getItem('shopInventory') || '{}');
        if (!inventory.equippedPet) return null;
        
        const pet = this.petsData.find(p => p.id === inventory.equippedPet);
        return pet || null;
    }
    
    getPetBonus() {
        const petProductionBonus = parseFloat(localStorage.getItem('petProductionBonus') || '0');
        const petClickBonus = parseInt(localStorage.getItem('petClickBonus') || '0');
        const petCookieChance = parseFloat(localStorage.getItem('petGoldenCookieChance') || '0');
        const petDiscountRate = parseFloat(localStorage.getItem('petDiscountRate') || '0');
        
        if (petProductionBonus > 0) {
            return `(+${petProductionBonus * 100}% production)`;
        } else if (petClickBonus > 0) {
            return `(+${petClickBonus} per click)`;
        } else if (petCookieChance > 0) {
            return `(${petCookieChance * 100}% golden cookies)`;
        } else if (petDiscountRate > 0) {
            return `(${petDiscountRate * 100}% discount)`;
        }
        
        return '';
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

// Initialize status display
const statusDisplay = new StatusDisplay();
