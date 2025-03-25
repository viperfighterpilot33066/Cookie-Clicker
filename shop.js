// Shop system for Cookie Clicker

class ShopSystem {
    constructor() {
        // Initialize shop data
        this.pets = [
            {
                id: 'cookiePup',
                name: 'Cookie Pup',
                description: 'Increases cookie production by 5%',
                price: 1000,
                emoji: '🐶',
                bgColor: '#C19A6B',
                effect: { type: 'productionMultiplier', value: 0.05 },
                locked: false,
                achievement: null
            },
            {
                id: 'sugarDragon',
                name: 'Sugar Dragon',
                description: 'Increases cookie production by 10%',
                price: 5000,
                emoji: '🐉',
                bgColor: '#D6EAF8',
                effect: { type: 'productionMultiplier', value: 0.10 },
                locked: true,
                achievement: 'cookieEnthusiast'
            },
            {
                id: 'chocolateChimp',
                name: 'Chocolate Chimp',
                description: 'Increases clicking power by 2',
                price: 3000,
                emoji: '🐵',
                bgColor: '#7B3F00',
                effect: { type: 'clickPower', value: 2 },
                locked: true,
                achievement: 'clickerNovice'
            },
            {
                id: 'goldenHamster',
                name: 'Golden Hamster',
                description: 'Randomly generates golden cookies',
                price: 7500,
                emoji: '🐹',
                bgColor: '#FFD700',
                effect: { type: 'goldenCookieChance', value: 0.05 },
                locked: true,
                achievement: 'cookieMaster'
            },
            {
                id: 'bakingRabbit',
                name: 'Baking Rabbit',
                description: 'Reduces all power-up costs by 5%',
                price: 10000,
                emoji: '🐰',
                bgColor: '#F5F5DC',
                effect: { type: 'discountRate', value: 0.05 },
                locked: true,
                achievement: 'autoMaster'
            },
            // NEW PETS START HERE
            {
                id: 'caramelCat',
                name: 'Caramel Cat',
                description: 'Increases cookie production by 15%',
                price: 15000,
                emoji: '🐱',
                bgColor: '#C17A45',
                effect: { type: 'productionMultiplier', value: 0.15 },
                locked: true,
                achievement: 'petCollector'
            },
            {
                id: 'pastryPenguin',
                name: 'Pastry Penguin',
                description: 'Increases clicking power by 3',
                price: 25000,
                emoji: '🐧',
                bgColor: '#E0E0E0',
                effect: { type: 'clickPower', value: 3 },
                locked: true,
                achievement: 'petMaster'
            },
            {
                id: 'frostingFox',
                name: 'Frosting Fox',
                description: 'Discount on all shop items by 10%',
                price: 35000,
                emoji: '🦊',
                bgColor: '#FF7F50',
                effect: { type: 'discountRate', value: 0.10 },
                locked: true,
                achievement: 'shopaholic'
            },
            {
                id: 'waffleWolf',
                name: 'Waffle Wolf',
                description: '2% chance of critical clicks (3x cookies)',
                price: 50000,
                emoji: '🐺',
                bgColor: '#CD853F',
                effect: { type: 'criticalChance', value: 0.02 },
                locked: true,
                achievement: 'clickingMachine'
            },
            {
                id: 'donutDolphin',
                name: 'Donut Dolphin',
                description: 'Doubles golden cookie spawn rate',
                price: 75000,
                emoji: '🐬',
                bgColor: '#00CED1',
                effect: { type: 'goldenCookieChance', value: 0.10 },
                locked: true,
                achievement: 'goldDigger'
            },
            {
                id: 'brownieBear',
                name: 'Brownie Bear',
                description: 'Increases idle production by 20%',
                price: 100000,
                emoji: '🐻',
                bgColor: '#8B4513',
                effect: { type: 'idleBonus', value: 0.20 },
                locked: true,
                achievement: 'cookieChemist'
            },
            {
                id: 'sundaeSnake',
                name: 'Sundae Snake',
                description: '5% chance of double cookies from clicks',
                price: 150000,
                emoji: '🐍',
                bgColor: '#FFDAB9',
                effect: { type: 'doubleClickChance', value: 0.05 },
                locked: true,
                achievement: 'effectUser'
            },
            {
                id: 'macaronMouse',
                name: 'Macaron Mouse',
                description: 'Passive income of 2 cookies/sec',
                price: 200000,
                emoji: '🐭',
                bgColor: '#F5A9B8',
                effect: { type: 'passiveIncome', value: 2 },
                locked: true,
                achievement: 'cookieGalaxy'
            },
            {
                id: 'tiramisuTiger',
                name: 'Tiramisu Tiger',
                description: '25% boost to all pet effects',
                price: 500000,
                emoji: '🐯',
                bgColor: '#FFDEAD',
                effect: { type: 'petEffectBoost', value: 0.25 },
                locked: true,
                achievement: 'rebirthMaster'
            },
            {
                id: 'puddingPhoenix',
                name: 'Pudding Phoenix',
                description: 'Revival: get 1000 cookies when you hit zero once/day',
                price: 1000000,
                emoji: '🦅',
                bgColor: '#FFA07A',
                effect: { type: 'revival', value: 1000 },
                locked: true,
                achievement: 'cookieUniverse'
            }
        ];
        
        this.effects = [
            {
                id: 'sugarRush',
                name: 'Sugar Rush',
                description: 'Double clicking power for 5 minutes',
                price: 2000,
                emoji: '⚡',
                bgColor: '#E6E6FA',
                effect: { type: 'clickPower', value: 2, duration: 300 },
                locked: false,
                achievement: null
            },
            {
                id: 'bakingFrenzy',
                name: 'Baking Frenzy',
                description: 'Triple cookie production for 2 minutes',
                price: 5000,
                emoji: '🔥',
                bgColor: '#FFCCCB',
                effect: { type: 'productionMultiplier', value: 3, duration: 120 },
                locked: false,
                achievement: null
            },
            {
                id: 'cookieStorm',
                name: 'Cookie Storm',
                description: 'Random cookie bonuses for 3 minutes',
                price: 7500,
                emoji: '🌪️',
                bgColor: '#87CEFA',
                effect: { type: 'randomBonuses', value: 1, duration: 180 },
                locked: true,
                achievement: 'cookieExpert'
            },
            {
                id: 'goldenTouch',
                name: 'Golden Touch',
                description: '10x clicking power for 1 minute',
                price: 15000,
                emoji: '👆',
                bgColor: '#FFD700',
                effect: { type: 'clickPower', value: 10, duration: 60 },
                locked: true,
                achievement: 'clickerMaster'
            },
            {
                id: 'cookieNova',
                name: 'Cookie Nova',
                description: 'Massive cookie explosion - instant 10,000 cookies!',
                price: 25000,
                emoji: '💥',
                bgColor: '#FFA500',
                effect: { type: 'instantCookies', value: 10000 },
                locked: true,
                achievement: 'cookieLegend'
            },
            // NEW EFFECTS START HERE
            {
                id: 'cookieBlizzard',
                name: 'Cookie Blizzard',
                description: 'Random cookie drops for 2 minutes',
                price: 30000,
                emoji: '❄️',
                bgColor: '#F0F8FF',
                effect: { type: 'cookieDrops', value: 200, duration: 120 },
                locked: true,
                achievement: 'cookieEnthusiast'
            },
            {
                id: 'sugarHigh',
                name: 'Sugar High',
                description: 'Triple cookie production for 30 seconds',
                price: 40000,
                emoji: '🍭',
                bgColor: '#FF69B4',
                effect: { type: 'productionMultiplier', value: 3, duration: 30 },
                locked: true,
                achievement: 'cookieExpert'
            },
            {
                id: 'cookieMultiplication',
                name: 'Cookie Multiplication',
                description: 'Doubles your current cookie count instantly',
                price: 100000,
                emoji: '✖️',
                bgColor: '#32CD32',
                effect: { type: 'cookieMultiplier', value: 2 },
                locked: true,
                achievement: 'cookieMaster'
            },
            {
                id: 'goldenShower',
                name: 'Golden Shower',
                description: 'Spawns 5-10 golden cookies',
                price: 125000,
                emoji: '🌟',
                bgColor: '#DAA520',
                effect: { type: 'goldenShower', value: { min: 5, max: 10 } },
                locked: true,
                achievement: 'goldDigger'
            },
            {
                id: 'timeWarp',
                name: 'Time Warp',
                description: 'Simulates 1 hour of idle production instantly',
                price: 150000,
                emoji: '⏰',
                bgColor: '#9370DB',
                effect: { type: 'timeWarp', value: 3600 },
                locked: true,
                achievement: 'autoMaster'
            },
            {
                id: 'cookieExplosion',
                name: 'Cookie Explosion',
                description: 'Instant 25,000 cookies',
                price: 200000,
                emoji: '💣',
                bgColor: '#FF4500',
                effect: { type: 'instantCookies', value: 25000 },
                locked: true,
                achievement: 'cookieGod'
            },
            {
                id: 'clickFrenzy',
                name: 'Click Frenzy',
                description: 'Each click counts as 20 for 30 seconds',
                price: 250000,
                emoji: '👇',
                bgColor: '#FF7F50',
                effect: { type: 'clickPower', value: 20, duration: 30 },
                locked: true,
                achievement: 'clickerMaster'
            },
            {
                id: 'cookieChain',
                name: 'Cookie Chain',
                description: 'Starts a chain of increasing cookie rewards',
                price: 300000,
                emoji: '⛓️',
                bgColor: '#C0C0C0',
                effect: { type: 'cookieChain', value: { start: 100, multiplier: 2, max: 10 } },
                locked: true,
                achievement: 'clickerAdept'
            },
            {
                id: 'luckyFortune',
                name: 'Lucky Fortune',
                description: 'Random chance of 2x, 5x or 10x cookies for 1 minute',
                price: 400000,
                emoji: '🍀',
                bgColor: '#008000',
                effect: { type: 'randomMultiplier', values: [2, 5, 10], duration: 60 },
                locked: true,
                achievement: 'cookieOverlord'
            },
            {
                id: 'divineCookie',
                name: 'Divine Cookie',
                description: '50x cookie production for 10 seconds',
                price: 1000000,
                emoji: '🌈',
                bgColor: '#FFFF00',
                effect: { type: 'productionMultiplier', value: 50, duration: 10 },
                locked: true,
                achievement: 'cookieLegend'
            }
        ];
        
        // Unlock these for testing:
        const testMode = false;
        if (testMode) {
            this.pets.forEach(pet => pet.locked = false);
            this.effects.forEach(effect => effect.locked = false);
        }

        this.inventory = this.loadInventory();
        this.equippedPet = this.inventory.equippedPet;
        this.equippedEffect = this.inventory.equippedEffect;
        this.activeEffectTimer = null;
        this.goldenCookieInterval = null;

        // Initialize shop DOM elements
        this.initShop();
    }

    loadInventory() {
        const savedInventory = JSON.parse(localStorage.getItem('shopInventory')) || {
            pets: [],
            effects: [],
            equippedPet: null,
            equippedEffect: null,
            activeEffect: null
        };
        return savedInventory;
    }

    saveInventory() {
        localStorage.setItem('shopInventory', JSON.stringify(this.inventory));
    }

    initShop() {
        document.addEventListener('DOMContentLoaded', () => {
            // Tab navigation
            this.setupTabs();
            // Category navigation
            this.setupCategories();
            // Initialize shop items
            this.renderShopItems();
            // Initialize inventory
            this.renderInventory();
            // Check for active effects on load
            this.checkActiveEffect();
        });
    }

    setupTabs() {
        const shopTabBtn = document.getElementById('shopTabBtn');
        const inventoryTabBtn = document.getElementById('inventoryTabBtn');
        const shopTab = document.getElementById('shopTab');
        const inventoryTab = document.getElementById('inventoryTab');

        shopTabBtn.addEventListener('click', () => {
            shopTabBtn.classList.add('active');
            inventoryTabBtn.classList.remove('active');
            shopTab.classList.add('active');
            inventoryTab.classList.remove('active');
        });

        inventoryTabBtn.addEventListener('click', () => {
            inventoryTabBtn.classList.add('active');
            shopTabBtn.classList.remove('active');
            inventoryTab.classList.add('active');
            shopTab.classList.remove('active');
        });
    }

    setupCategories() {
        // Shop categories
        const petsBtn = document.getElementById('petsBtn');
        const effectsBtn = document.getElementById('effectsBtn');
        const petItems = document.getElementById('petItems');
        const effectItems = document.getElementById('effectItems');

        petsBtn.addEventListener('click', () => {
            petsBtn.classList.add('active');
            effectsBtn.classList.remove('active');
            petItems.classList.remove('hidden');
            effectItems.classList.add('hidden');
        });

        effectsBtn.addEventListener('click', () => {
            effectsBtn.classList.add('active');
            petsBtn.classList.remove('active');
            effectItems.classList.remove('hidden');
            petItems.classList.add('hidden');
        });

        // Inventory categories
        const invPetsBtn = document.getElementById('invPetsBtn');
        const invEffectsBtn = document.getElementById('invEffectsBtn');
        const petInventory = document.getElementById('petInventory');
        const effectInventory = document.getElementById('effectInventory');

        invPetsBtn.addEventListener('click', () => {
            invPetsBtn.classList.add('active');
            invEffectsBtn.classList.remove('active');
            petInventory.classList.remove('hidden');
            effectInventory.classList.add('hidden');
        });

        invEffectsBtn.addEventListener('click', () => {
            invEffectsBtn.classList.add('active');
            invPetsBtn.classList.remove('active');
            effectInventory.classList.remove('hidden');
            petInventory.classList.add('hidden');
        });
    }

    renderShopItems() {
        const petItems = document.getElementById('petItems');
        const effectItems = document.getElementById('effectItems');

        // Clear shop items
        petItems.innerHTML = '';
        effectItems.innerHTML = '';

        // Render pets
        this.pets.forEach(pet => {
            const isUnlocked = this.checkItemUnlockStatus(pet);
            const isOwned = this.inventory.pets.some(p => p.id === pet.id);

            const petElement = document.createElement('div');
            petElement.className = `shop-item ${!isUnlocked ? 'locked' : ''} ${pet.id === 'goldenHamster' ? 'rare' : ''} ${pet.id === 'bakingRabbit' ? 'legendary' : ''}`;
            const emoji = this.createEmojiElement(pet.emoji, pet.bgColor);

            petElement.innerHTML = `
                ${emoji.outerHTML}
                <h3>${pet.name}</h3>
                <p class="item-description">${pet.description}</p>
                <p class="item-price">${pet.price} cookies</p>
                ${!isUnlocked ? `<p class="lock-message">Unlock: ${this.getAchievementName(pet.achievement)}</p>` : ''}
                <button class="item-button" ${!isUnlocked || isOwned ? 'disabled' : ''}>${isOwned ? 'Owned' : 'Buy'}</button>
                <div class="item-tooltip">
                    <strong>${pet.name}</strong><br>
                    ${pet.description}<br>
                    <span style="color: #8bc34a">Effect: ${this.getEffectDescription(pet.effect)}</span>
                    ${pet.id === 'goldenHamster' ? '<br><span style="color: #ffc107">⭐ Rare Pet</span>' : ''}
                    ${pet.id === 'bakingRabbit' ? '<br><span style="color: #ff9800">⭐⭐⭐ Legendary Pet</span>' : ''}
                </div>
            `;

            const buyButton = petElement.querySelector('.item-button');
            if (isUnlocked && !isOwned) {
                buyButton.addEventListener('click', () => this.buyItem(pet, 'pets'));
            }

            petItems.appendChild(petElement);
        });

        // Render effects
        this.effects.forEach(effect => {
            const isUnlocked = this.checkItemUnlockStatus(effect);

            const effectElement = document.createElement('div');
            effectElement.className = `shop-item ${!isUnlocked ? 'locked' : ''} ${effect.id === 'goldenTouch' ? 'rare' : ''} ${effect.id === 'cookieNova' ? 'legendary' : ''}`;
            const emoji = this.createEmojiElement(effect.emoji, effect.bgColor);

            effectElement.innerHTML = `
                ${emoji.outerHTML}
                <h3>${effect.name}</h3>
                <p class="item-description">${effect.description}</p>
                <p class="item-price">${effect.price} cookies</p>
                ${!isUnlocked ? `<p class="lock-message">Unlock: ${this.getAchievementName(effect.achievement)}</p>` : ''}
                <button class="item-button" ${!isUnlocked ? 'disabled' : ''}>Buy</button>
                <div class="item-tooltip">
                    <strong>${effect.name}</strong><br>
                    ${effect.description}<br>
                    <span style="color: #8bc34a">Effect: ${this.getEffectDescription(effect.effect)}</span>
                    ${effect.effect.duration ? `<br>Duration: ${this.formatDuration(effect.effect.duration)}` : ''}
                    ${effect.id === 'goldenTouch' ? '<br><span style="color: #ffc107">⭐ Rare Effect</span>' : ''}
                    ${effect.id === 'cookieNova' ? '<br><span style="color: #ff9800">⭐⭐⭐ Legendary Effect</span>' : ''}
                </div>
            `;

            const buyButton = effectElement.querySelector('.item-button');
            if (isUnlocked) {
                buyButton.addEventListener('click', () => this.buyItem(effect, 'effects'));
            }

            effectItems.appendChild(effectElement);
        });
    }

    createEmojiElement(emoji, bgColor) {
        const emojiElement = document.createElement('div');
        emojiElement.className = 'item-image emoji-placeholder';
        emojiElement.style.backgroundColor = bgColor;
        emojiElement.style.display = 'flex';
        emojiElement.style.alignItems = 'center';
        emojiElement.style.justifyContent = 'center';
        emojiElement.style.fontSize = '50px';
        emojiElement.textContent = emoji;
        return emojiElement;
    }

    getEffectDescription(effect) {
        switch(effect.type) {
            case 'productionMultiplier':
                return `${effect.value}x production rate`;
            case 'clickPower':
                return `${effect.value}x click power`;
            case 'goldenCookieChance':
                return `${effect.value * 100}% chance of golden cookies`;
            case 'discountRate':
                return `${effect.value * 100}% discount on power-ups`;
            case 'instantCookies':
                return `Instant ${effect.value} cookies`;
            case 'randomBonuses':
                return `Random cookie bonuses`;
            case 'criticalChance':
                return `${effect.value * 100}% chance of critical clicks`;
            case 'doubleClickChance':
                return `${effect.value * 100}% chance of double cookies on click`;
            case 'idleBonus':
                return `${effect.value * 100}% bonus to idle production`;
            case 'passiveIncome':
                return `${effect.value} cookies/sec passive income`;
            case 'petEffectBoost':
                return `${effect.value * 100}% boost to all pet effects`;
            case 'revival':
                return `Revival with ${effect.value} cookies when at zero`;
            case 'cookieDrops':
                return `Random cookie drops worth ${effect.value} cookies`;
            case 'cookieMultiplier':
                return `Multiply current cookies by ${effect.value}`;
            case 'goldenShower':
                return `Spawn ${effect.value.min}-${effect.value.max} golden cookies`;
            case 'timeWarp':
                return `${effect.value} seconds of idle production now`;
            case 'cookieChain':
                return `Chain of cookie rewards up to ${effect.value.max} clicks`;
            case 'randomMultiplier':
                return `Random multiplier among ${effect.values.join('x, ')}x`;
            default:
                return 'Unknown effect';
        }
    }

    checkItemUnlockStatus(item) {
        if (!item.locked) return true;
        if (!item.achievement) return true;
        const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        return unlockedAchievements.includes(item.achievement);
    }

    getAchievementName(achievementId) {
        if (!achievementId) return 'Unknown Achievement';
        // This references the achievements object from achievements.js
        const achievement = achievements[achievementId];
        return achievement ? achievement.name : 'Unknown Achievement';
    }

    buyItem(item, itemType) {
        const points = parseInt(localStorage.getItem('points')) || 0;
        
        if (points >= item.price) {
            // Deduct points
            const newPoints = points - item.price;
            localStorage.setItem('points', newPoints);
            
            // Update points display
            const pointsValue = document.getElementById('pointsValue');
            if (pointsValue) {
                pointsValue.textContent = newPoints;
            }
            
            // Track spending for achievements
            const shopSpending = parseInt(localStorage.getItem('shopSpending') || '0') + item.price;
            localStorage.setItem('shopSpending', shopSpending);
            
            if (itemType === 'pets') {
                // Add pet to inventory
                this.inventory.pets.push({...item});
            } else {
                // For effects, we handle them directly
                if (item.effect.duration) {
                    // Timed effect
                    this.activateEffect(item);
                } else {
                    // Instant effect
                    this.applyInstantEffect(item);
                }
                
                // Track used effects for achievements
                let usedEffects = JSON.parse(localStorage.getItem('usedEffects') || '[]');
                if (!usedEffects.includes(item.id)) {
                    usedEffects.push(item.id);
                    localStorage.setItem('usedEffects', JSON.stringify(usedEffects));
                }
                
                // Track effect usage count
                let effectCounts = JSON.parse(localStorage.getItem('effectCounts') || '{}');
                effectCounts[item.id] = (effectCounts[item.id] || 0) + 1;
                localStorage.setItem('effectCounts', JSON.stringify(effectCounts));
            }
            
            // Save inventory
            this.saveInventory();
            
            // Update UI
            this.renderShopItems();
            this.renderInventory();
            
            // Show success message
            this.showNotification(`${item.name} purchased!`);
        } else {
            this.showNotification('Not enough cookies!', true);
        }
    }

    activateEffect(effect) {
        // If we already have an active effect, don't allow another one
        if (this.inventory.activeEffect) {
            this.showNotification('You already have an active effect!', true);
            return;
        }
        this.inventory.activeEffect = {
            ...effect,
            startTime: Date.now(),
            endTime: Date.now() + (effect.effect.duration * 1000)
        };
        this.inventory.equippedEffect = effect.id;
        this.saveInventory();
        this.applyEffectBonus(effect);
        this.startEffectCountdown(effect);
    }

    applyInstantEffect(effect) {
        if (effect.effect.type === 'instantCookies') {
            const currentPoints = parseInt(localStorage.getItem('points')) || 0;
            const newPoints = currentPoints + effect.effect.value;
            localStorage.setItem('points', newPoints);
            
            const pointsValue = document.getElementById('pointsValue');
            if (pointsValue) {
                pointsValue.textContent = newPoints;
            }
            
            this.showNotification(`+${effect.effect.value} cookies!`);
        } else if (effect.effect.type === 'cookieMultiplier') {
            const currentPoints = parseInt(localStorage.getItem('points')) || 0;
            const multiplier = effect.effect.value;
            const newPoints = currentPoints * multiplier;
            const gain = newPoints - currentPoints;
            localStorage.setItem('points', newPoints);
            
            const pointsValue = document.getElementById('pointsValue');
            if (pointsValue) {
                pointsValue.textContent = newPoints;
            }
            
            this.showNotification(`Cookies multiplied by ${multiplier}x! +${gain} cookies!`);
        } else if (effect.effect.type === 'goldenShower') {
            const count = Math.floor(Math.random() * (effect.effect.value.max - effect.effect.value.min + 1)) + effect.effect.value.min;
            this.showNotification(`Spawning ${count} golden cookies!`);
            // Spawn multiple golden cookies with slight delay between each
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    this.spawnGoldenCookie();
                }, i * 500);
            }
        } else if (effect.effect.type === 'timeWarp') {
            const seconds = effect.effect.value;
            const autoClickerPointsPerSecond = parseInt(localStorage.getItem('autoClickerPointsPerSecond')) || 0;
            const petIdleBonus = parseFloat(localStorage.getItem('petIdleBonus') || '0');
            const totalPointsPerSecond = autoClickerPointsPerSecond * (1 + petIdleBonus);
            const reward = Math.floor(totalPointsPerSecond * seconds);
            const currentPoints = parseInt(localStorage.getItem('points')) || 0;
            const newPoints = currentPoints + reward;
            localStorage.setItem('points', newPoints);
            
            const pointsValue = document.getElementById('pointsValue');
            if (pointsValue) {
                pointsValue.textContent = newPoints;
            }
            
            this.showNotification(`Time Warp: ${this.formatDuration(seconds)} of production! +${reward} cookies!`);
        } else if (effect.effect.type === 'cookieChain') {
            this.startCookieChain(effect.effect.value);
        }
    }

    applyEffectBonus(effect) {
        const effectType = effect.effect.type;
        const effectValue = effect.effect.value;
        
        switch (effectType) {
            case 'clickPower':
                localStorage.setItem('effectClickBonus', effectValue);
                break;
            case 'productionMultiplier':
                localStorage.setItem('effectProductionBonus', effectValue);
                break;
            case 'randomBonuses':
                // Start random bonus generation
                this.startRandomBonuses();
                break;
        }
    }

    startRandomBonuses() {
        const randomBonusInterval = setInterval(() => {
            if (!this.inventory.activeEffect) {
                clearInterval(randomBonusInterval);
                return;
            }
            
            // 10% chance every 10 seconds to get random bonus
            if (Math.random() < 0.1) {
                const bonusAmount = Math.floor(Math.random() * 1000) + 500;
                const currentPoints = parseInt(localStorage.getItem('points')) || 0;
                const newPoints = currentPoints + bonusAmount;
                localStorage.setItem('points', newPoints);
                
                const pointsValue = document.getElementById('pointsValue');
                if (pointsValue) {
                    pointsValue.textContent = newPoints;
                }
                
                this.showNotification(`Random bonus: +${bonusAmount} cookies!`);
            }
        }, 10000);
    }

    startEffectCountdown(effect) {
        // Simple countdown using setInterval; keeps track of effect endTime
        const interval = setInterval(() => {
            const now = Date.now();
            if (now >= this.inventory.activeEffect.endTime) {
                clearInterval(interval);
                this.inventory.activeEffect = null;
                this.inventory.equippedEffect = null;
                this.saveInventory();
                this.showNotification(`${effect.name} has ended.`, false);
                // Revert any bonuses if needed
            }
        }, 1000);
    }

    updateEffectTimerDisplay() {
        const effectInventory = document.getElementById('effectInventory');
        if (!effectInventory) return;

        const activeEffectEl = effectInventory.querySelector('.timer-badge');
        if (activeEffectEl && this.inventory.activeEffect) {
            const timeLeft = Math.max(0, Math.floor((this.inventory.activeEffect.endTime - Date.now()) / 1000));
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            activeEffectEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }

    endEffect() {
        if (!this.inventory.activeEffect) return;
        this.inventory.equippedEffect = null;
        const effect = this.inventory.activeEffect;

        // Remove effect bonuses
        localStorage.removeItem('effectClickBonus');
        localStorage.removeItem('effectProductionBonus');
        // Update UI
        // Clear active effect
        this.inventory.activeEffect = null;
        this.inventory.equippedEffect = null;
        this.equippedEffect = null;

        // Save
        this.saveInventory();
        // Update UI
        this.renderInventory();
        // Show message
        this.showNotification(`${effect.name} has expired!`);
        // Clear interval
        if (this.activeEffectTimer) {
            clearInterval(this.activeEffectTimer);
            this.activeEffectTimer = null;
        }
    }

    checkActiveEffect() {
        if (!this.inventory.activeEffect) return;
        const now = Date.now();
        if (now >= this.inventory.activeEffect.endTime) {
            this.endEffect();
        } else {
            // Reapply effect and restart countdown
            this.applyEffectBonus(this.inventory.activeEffect);
            this.startEffectCountdown(this.inventory.activeEffect);
        }
    }

    renderInventory() {
        const petInventory = document.getElementById('petInventory');
        const effectInventory = document.getElementById('effectInventory');
        if (!petInventory || !effectInventory) return;

        // Render pets inventory
        petInventory.innerHTML = '';
        if (this.inventory.pets.length > 0) {
            this.inventory.pets.forEach(pet => {
                const isEquipped = this.equippedPet === pet.id;
                const petFromList = this.pets.find(p => p.id === pet.id);
                const emoji = petFromList ? this.createEmojiElement(petFromList.emoji, petFromList.bgColor) : '';
                const petElement = document.createElement('div');
                petElement.className = `inventory-item ${isEquipped ? 'equipped' : ''}`;
                petElement.innerHTML = `
                    ${emoji.outerHTML}
                    <h3>${pet.name}</h3>
                    <p class="item-description">${pet.description}</p>
                    ${isEquipped ? '<div class="equipped-badge">Equipped</div>' : ''}
                    <button class="equip-button ${isEquipped ? 'unequip-button' : ''}">${isEquipped ? 'Unequip' : 'Equip'}</button>
                `;

                const equipButton = petElement.querySelector('.equip-button');
                equipButton.addEventListener('click', () => {
                    if (isEquipped) {
                        this.unequipItem('pet', pet.id);
                    } else {
                        this.equipItem('pet', pet.id);
                    }
                });

                petInventory.appendChild(petElement);
            });
        } else {
            petInventory.innerHTML = '<p class="empty-inventory">You don\'t own any pets yet.</p>';
        }

        // Render effects inventory
        effectInventory.innerHTML = '';
        // Check if we have an active effect
        if (this.inventory.activeEffect) {
            const effect = this.inventory.activeEffect;
            
            // Make sure we have all the data we need for the effect
            let effectFromList = this.effects.find(e => e.id === effect.id);
            if (!effectFromList) {
                console.error(`Effect not found: ${effect.id}`);
                effectInventory.innerHTML = '<p class="empty-inventory">No active effects.</p>';
                return;
            }
            
            // Check if we have the necessary properties
            const effectName = effect.name || effectFromList.name;
            const effectDescription = effect.description || effectFromList.description;
            
            const timeLeft = effect.endTime ? Math.max(0, Math.floor((effect.endTime - Date.now()) / 1000)) : 0;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const emoji = this.createEmojiElement(effectFromList.emoji, effectFromList.bgColor);
            const effectElement = document.createElement('div');
            effectElement.className = 'inventory-item equipped';
            effectElement.innerHTML = `
                ${emoji.outerHTML}
                <h3>${effectName}</h3>
                <p class="item-description">${effectDescription}</p>
                <div class="timer-badge">${minutes}:${seconds < 10 ? '0' : ''}${seconds}</div>
                <button class="equip-button unequip-button" disabled>Active</button>
            `;

            effectInventory.appendChild(effectElement);
            console.log("Rendered active effect:", effect);
        } else {
            effectInventory.innerHTML = '<p class="empty-inventory">No active effects.</p>';
        }
    }

    equipItem(type, itemId) {
        if (type === 'pet') {
            // Unequip any current pet first to remove its bonuses
            if (this.inventory.equippedPet) {
                const oldPet = this.pets.find(p => p.id === this.inventory.equippedPet);
                if (oldPet) {
                    this.removePetBonus(oldPet);
                }
            }
            
            // Set new pet
            this.inventory.equippedPet = itemId;
            this.equippedPet = itemId;
            
            // Set pet equip time for achievement tracking
            localStorage.setItem('petEquipStartTime', Date.now());
            
            // Track all pets that have been equipped for the Cookie Empire achievement
            let historicalPets = JSON.parse(localStorage.getItem('historicalEquippedPets') || '[]');
            if (!historicalPets.includes(itemId)) {
                historicalPets.push(itemId);
                localStorage.setItem('historicalEquippedPets', JSON.stringify(historicalPets));
            }
            
            // Apply pet bonus
            const pet = this.pets.find(p => p.id === itemId);
            if (pet) {
                this.applyPetBonus(pet);
            }
            
            // Show notification about equipped pet
            this.showNotification(`${pet?.name || 'Pet'} equipped! Bonus activated.`);
        }
        
        this.saveInventory();
        this.renderInventory();
        // Force update the points immediately to see the bonus
        this.updatePointsDisplay();
    }

    unequipItem(type, itemId) {
        if (type === 'pet') {
            // Remove pet bonus
            const pet = this.pets.find(p => p.id === itemId);
            if (pet) {
                this.removePetBonus(pet);
            }
            
            this.inventory.equippedPet = null;
            this.equippedPet = null;
            
            // Show notification
            this.showNotification(`Pet unequipped. Bonus removed.`);
        }
        
        this.saveInventory();
        this.renderInventory();
        // Force update the points immediately to see the removed bonus
        this.updatePointsDisplay();
    }

    applyPetBonus(pet) {
        console.log(`Applying pet bonus: ${pet.name}, type: ${pet.effect.type}, value: ${pet.effect.value}`);
        const effectType = pet.effect.type;
        const effectValue = pet.effect.value;
        
        switch (effectType) {
            case 'productionMultiplier':
                localStorage.setItem('petProductionBonus', effectValue);
                console.log(`Production bonus set to ${effectValue}`);
                break;
            case 'clickPower':
                localStorage.setItem('petClickBonus', effectValue);
                console.log(`Click bonus set to ${effectValue}`);
                break;
            case 'goldenCookieChance':
                localStorage.setItem('petGoldenCookieChance', effectValue);
                if (pet.id === 'goldenHamster' || pet.id === 'donutDolphin') {
                    this.startGoldenCookies();
                }
                console.log(`Golden cookie chance set to ${effectValue}`);
                break;
            case 'discountRate':
                localStorage.setItem('petDiscountRate', effectValue);
                console.log(`Discount rate set to ${effectValue}`);
                break;
            case 'criticalChance':
                localStorage.setItem('petCriticalChance', effectValue);
                console.log(`Critical chance set to ${effectValue}`);
                break;
            case 'doubleClickChance':
                localStorage.setItem('petDoubleClickChance', effectValue);
                console.log(`Double click chance set to ${effectValue}`);
                break;
            case 'idleBonus':
                localStorage.setItem('petIdleBonus', effectValue);
                console.log(`Idle production bonus set to ${effectValue}`);
                break;
            case 'passiveIncome':
                localStorage.setItem('petPassiveIncome', effectValue);
                this.startPassiveIncome(effectValue);
                console.log(`Passive income set to ${effectValue}`);
                break;
            case 'petEffectBoost':
                localStorage.setItem('petEffectBoost', effectValue);
                this.applyPetEffectBoost(effectValue);
                console.log(`Pet effect boost set to ${effectValue}`);
                break;
            case 'revival':
                localStorage.setItem('petRevivalAmount', effectValue);
                localStorage.setItem('petRevivalAvailable', 'true');
                console.log(`Revival amount set to ${effectValue}`);
                break;
        }
    }

    removePetBonus(pet) {
        const effectType = pet.effect.type;
        
        switch (effectType) {
            case 'productionMultiplier':
                localStorage.removeItem('petProductionBonus');
                break;
            case 'clickPower':
                localStorage.removeItem('petClickBonus');
                break;
            case 'goldenCookieChance':
                localStorage.removeItem('petGoldenCookieChance');
                if (this.goldenCookieInterval) {
                    clearInterval(this.goldenCookieInterval);
                }
                break;
            case 'discountRate':
                localStorage.removeItem('petDiscountRate');
                break;
            case 'criticalChance':
                localStorage.removeItem('petCriticalChance');
                break;
            case 'doubleClickChance':
                localStorage.removeItem('petDoubleClickChance');
                break;
            case 'idleBonus':
                localStorage.removeItem('petIdleBonus');
                break;
            case 'passiveIncome':
                localStorage.removeItem('petPassiveIncome');
                if (this.passiveIncomeInterval) {
                    clearInterval(this.passiveIncomeInterval);
                }
                break;
            case 'petEffectBoost':
                localStorage.removeItem('petEffectBoost');
                break;
            case 'revival':
                localStorage.removeItem('petRevivalAmount');
                localStorage.removeItem('petRevivalAvailable');
                break;
        }
    }

    startGoldenCookies() {
        // Cancel any existing interval
        if (this.goldenCookieInterval) {
            clearInterval(this.goldenCookieInterval);
        }
        this.goldenCookieInterval = setInterval(() => {
            const chance = parseFloat(localStorage.getItem('petGoldenCookieChance')) || 0;
            if (chance > 0 && Math.random() < chance) {
                // Generate a golden cookie bonus
                const bonus = Math.floor(Math.random() * 500) + 100;
                const currentPoints = parseInt(localStorage.getItem('points')) || 0;
                const newPoints = currentPoints + bonus;
                localStorage.setItem('points', newPoints);
                
                // Update points display
                const pointsValue = document.getElementById('pointsValue');
                if (pointsValue) {
                    pointsValue.textContent = newPoints;
                }
                
                // Track golden hamster earnings for achievement
                const earnings = parseInt(localStorage.getItem('goldenHamsterEarnings') || '0') + bonus;
                localStorage.setItem('goldenHamsterEarnings', earnings);
                
                // Show golden cookie notification
                this.showNotification(`Golden Cookie: +${bonus} cookies!`, false, true);
                
                // Spawn visual golden cookie effect
                this.spawnGoldenCookie();
            }
        }, 30000); // Check every 30 seconds
    }

    spawnGoldenCookie() {
        const goldCookie = document.createElement('div');
        goldCookie.className = 'golden-cookie';
        goldCookie.style.position = 'absolute';
        goldCookie.style.width = '60px';
        goldCookie.style.height = '60px';
        goldCookie.style.borderRadius = '50%';
        goldCookie.style.backgroundImage = 'radial-gradient(circle, #ffd700, #ffa500)';
        goldCookie.style.boxShadow = '0 0 20px 5px rgba(255, 215, 0, 0.6)';
        goldCookie.style.cursor = 'pointer';
        
        // Random position
        goldCookie.style.top = `${Math.random() * 70 + 10}%`;
        goldCookie.style.left = `${Math.random() * 70 + 10}%`;
        goldCookie.style.zIndex = '1000';
        
        // Add shimmer effect
        goldCookie.style.animation = 'shimmer 1.5s infinite';
        
        document.body.appendChild(goldCookie);
        
        // Remove after 10 seconds if not clicked
        setTimeout(() => {
            if (document.body.contains(goldCookie)) {
                document.body.removeChild(goldCookie);
            }
        }, 10000);
        
        // Click event
        goldCookie.addEventListener('click', () => {
            const bonus = Math.floor(Math.random() * 1000) + 500;
            const currentPoints = parseInt(localStorage.getItem('points')) || 0;
            const newPoints = currentPoints + bonus;
            localStorage.setItem('points', newPoints);
            
            // Update points display
            const pointsValue = document.getElementById("pointsValue");
            if (pointsValue) {
                pointsValue.textContent = newPoints;
            }
            
            // Track golden hamster earnings for achievement
            const earnings = parseInt(localStorage.getItem('goldenHamsterEarnings') || '0') + bonus;
            localStorage.setItem('goldenHamsterEarnings', earnings);
            
            // Track golden cookies clicked for achievement
            const goldenClicked = parseInt(localStorage.getItem('goldenCookiesClicked') || '0') + 1;
            localStorage.setItem('goldenCookiesClicked', goldenClicked);
            
            // Show notification
            this.showNotification(`Golden Cookie: +${bonus} cookies!`, false, true);
            
            // Remove the golden cookie
            document.body.removeChild(goldCookie);
        });
    }

    startCookieChain(chainParams) {
        // Store chain parameters for later use
        localStorage.setItem('cookieChainActive', 'true');
        localStorage.setItem('cookieChainParams', JSON.stringify(chainParams));
        localStorage.setItem('cookieChainStep', '1');
        
        this.showNotification('Cookie Chain started! Click quickly to build the chain!');
        
        // Apply visual indicator that chain is active
        const cookie = document.getElementById('cookie');
        if (cookie) {
            cookie.classList.add('chain-active');
               
            // Add an event listener for the first click
            const chainClickHandler = () => {
                this.handleChainClick();
            };
            
            // Store reference to the handler for removal
            localStorage.setItem('chainClickHandlerActive', 'true');
            cookie.addEventListener('click', chainClickHandler);
            
            // Set timeout to end chain if not clicked
            this.cookieChainTimeout = setTimeout(() => {
                this.endCookieChain();
            }, 5000);
        }
    }

    handleChainClick() {
        if (localStorage.getItem('cookieChainActive') !== 'true') return;
        
        // Clear existing timeout and set a new one
        if (this.cookieChainTimeout) {
            clearTimeout(this.cookieChainTimeout);
        }
        
        // Get chain parameters
        const chainParams = JSON.parse(localStorage.getItem('cookieChainParams'));
        const step = parseInt(localStorage.getItem('cookieChainStep'));
        
        // Calculate reward for this step
        const reward = chainParams.start * Math.pow(chainParams.multiplier, step - 1);
        
        // Add to points
        const currentPoints = parseInt(localStorage.getItem('points')) || 0;
        const newPoints = currentPoints + reward;
        localStorage.setItem('points', newPoints);
        
        // Update points display
        const pointsValue = document.getElementById('pointsValue');
        if (pointsValue) {
            pointsValue.textContent = newPoints;
        }
        
        // Show notification
        this.showNotification(`Chain x${step}: +${reward} cookies!`);
        
        // Increment step
        if (step < chainParams.max) {
            localStorage.setItem('cookieChainStep', String(step + 1));
            
            // Set new timeout for next click
            this.cookieChainTimeout = setTimeout(() => {
                this.endCookieChain();
            }, 3000);
        } else {
            // End chain at max step
            this.showNotification(`Cookie Chain complete! Maximum multiplier reached!`, false, true);
            this.endCookieChain();
        }
    }

    endCookieChain() {
        if (localStorage.getItem('cookieChainActive') === 'true') {
            const step = parseInt(localStorage.getItem('cookieChainStep') || '1');
            const chainParams = JSON.parse(localStorage.getItem('cookieChainParams') || '{}');
            clearTimeout(this.cookieChainTimeout);
            // If we reached max or got close, count it as a completed chain
            if (step >= chainParams.max || step >= chainParams.max - 2) {
                const completedChains = parseInt(localStorage.getItem('completedCookieChains') || '0') + 1;
                localStorage.setItem('completedCookieChains', completedChains);
            }
        }
        localStorage.removeItem('cookieChainActive');
        localStorage.removeItem('cookieChainParams');
        localStorage.removeItem('cookieChainStep');
        
        const cookie = document.getElementById('cookie');
        if (cookie) {
            cookie.classList.remove('chain-active');
            // Remove the event handler if it was added
            if (localStorage.getItem('chainClickHandlerActive') === 'true') {
                cookie.removeEventListener('click', this.handleChainClick);
                localStorage.removeItem('chainClickHandlerActive');
            }
        }
        if (this.cookieChainTimeout) {
            clearTimeout(this.cookieChainTimeout);
        }
    }

    updatePointsDisplay() {
        // Update the UI to reflect bonus changes
        const autoClickPointsBase = parseInt(localStorage.getItem('autoClickerPointsPerSecond')) || 0;
        const petBonus = parseFloat(localStorage.getItem('petProductionBonus')) || 0;
        const effectBonus = parseFloat(localStorage.getItem('effectProductionBonus')) || 1;
        
        // Display current bonus in a notification
        if (petBonus > 0) {
            const bonusPercentage = petBonus * 100;
            const totalPoints = Math.floor(autoClickPointsBase * (1 + petBonus) * effectBonus);
            
            this.showNotification(`Production bonus active: +${bonusPercentage}% (${totalPoints} cookies/sec)`);
        }
    }

    showNotification(message, isError = false, isGolden = false) {
        const notification = document.createElement('div');
        notification.className = `shop-notification ${isError ? 'error' : 'success'} ${isGolden ? 'golden' : ''}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after a delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    formatDuration(seconds) {
        if (seconds < 60) {
            return `${seconds} second${seconds !== 1 ? 's' : ''}`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
    }
}

// Create placeholder images directories
function createPlaceholderEmojis() {
    console.log("Using emoji placeholders instead of image files for all pets and effects");
}

// Initialize the shop system
const shopSystem = new ShopSystem();
createPlaceholderEmojis();

// This function applies bonuses from pets and effects when clicking
function applyBonusesToCookie() {
    // Wait for DOM content to load
    document.addEventListener('DOMContentLoaded', function() {
        const cookie = document.getElementById('cookie');
        if (!cookie) return;
        
        // The original click handler is in script.js, we need to modify it
        // This is our custom handler to apply bonuses
        function applyBonusesOnClick() {
            let pointsPerClick = parseInt(localStorage.getItem('pointsPerClick')) || 1;
            const petClickBonus = parseInt(localStorage.getItem('petClickBonus')) || 0;
            const effectClickBonus = parseInt(localStorage.getItem('effectClickBonus')) || 1;
            const criticalChance = parseFloat(localStorage.getItem('petCriticalChance')) || 0;
            const doubleClickChance = parseFloat(localStorage.getItem('petDoubleClickChance')) || 0;
                
            // Apply bonuses
            pointsPerClick += petClickBonus;
            pointsPerClick *= effectClickBonus;
            
            // Check for critical click (3x)
            let isCritical = false;
            if (criticalChance > 0 && Math.random() < criticalChance) {
                pointsPerClick *= 3;
                isCritical = true;
                // Track critical clicks for achievement
                const criticalClicks = parseInt(localStorage.getItem('criticalClicks') || '0') + 1;
                localStorage.setItem('criticalClicks', criticalClicks);
            }
            
            // Check for double click chance
            if (doubleClickChance > 0 && Math.random() < doubleClickChance) {
                pointsPerClick *= 2;
                // Show notification for double click
                if (Math.random() < 0.3) { // Only show sometimes to avoid spam
                    shopSystem.showNotification('Double cookies!', false);
                }
            }
            
            let points = parseInt(localStorage.getItem("points")) || 0;
            points += pointsPerClick;
            localStorage.setItem("points", points);
            
            const pointsValue = document.getElementById("pointsValue");
            if (pointsValue) {
                pointsValue.innerText = points;
            }
            
            // For cookie chain clicks
            if (localStorage.getItem('cookieChainActive') === 'true') {
                shopSystem.handleChainClick();
            }
            
            // Show critical click notification and animation
            if (isCritical) {
                shopSystem.showNotification('CRITICAL CLICK! x3 cookies!', false, true);
                // Add critical click animation
                const criticalAnimation = document.createElement('div');
                criticalAnimation.className = 'critical-animation';
                criticalAnimation.textContent = 'CRITICAL!';
                criticalAnimation.style.position = 'absolute';
                criticalAnimation.style.top = '50%';
                criticalAnimation.style.left = '50%';
                criticalAnimation.style.transform = 'translate(-50%, -50%)';
                criticalAnimation.style.color = '#FF0000';
                criticalAnimation.style.fontWeight = 'bold';
                criticalAnimation.style.fontSize = '32px';
                criticalAnimation.style.textShadow = '0 0 10px #FFD700';
                criticalAnimation.style.animation = 'criticalAnim 1s forwards';
                cookie.appendChild(criticalAnimation);
                setTimeout(() => {
                    if (cookie.contains(criticalAnimation)) {
                        cookie.removeChild(criticalAnimation);
                    }
                }, 1000);
            }
            
            // Only show click bonus notification occasionally (1/20 chance)
            if (Math.random() < 0.05 && (petClickBonus > 0 || effectClickBonus > 1)) {
                shopSystem.showNotification(`Click bonus: ${pointsPerClick} cookies per click`, false);
            }
        }
        
        // Add our custom click handler
        cookie.addEventListener('click', applyBonusesOnClick);
        
        // Revival feature from Pudding Phoenix
        setInterval(() => {
            const points = parseInt(localStorage.getItem('points')) || 0;
            const revivalAvailable = localStorage.getItem('petRevivalAvailable') === 'true';
            const revivalAmount = parseInt(localStorage.getItem('petRevivalAmount')) || 0;
            if (points <= 0 && revivalAvailable && revivalAmount > 0) {
                // Grant the revival bonus
                localStorage.setItem('points', revivalAmount);
                localStorage.setItem('petRevivalAvailable', 'false');
                localStorage.setItem('hasBeenResurrected', 'true');
                localStorage.setItem('petRevivalTimestamp', Date.now().toString());
                
                // Update points display
                const pointsValue = document.getElementById("pointsValue");
                if (pointsValue) {
                    pointsValue.innerText = revivalAmount;
                }
                
                // Show notification
                shopSystem.showNotification('Phoenix Revival! +' + revivalAmount + ' cookies!', false, true);
            }
            
            // Check if revival should be available again (once per day)
            const revivalTimestamp = parseInt(localStorage.getItem('petRevivalTimestamp') || '0');
            if (Date.now() - revivalTimestamp > 24 * 60 * 60 * 1000) {
                localStorage.setItem('petRevivalAvailable', 'true');
            }
        }, 1000);
    });
}

// Apply bonuses to auto clicker points
function applyBonusesToAutoClicker() {
    console.log("Starting auto clicker bonus system...");
    // Check every second if there's an active production bonus
    setInterval(() => {
        const petProductionBonus = parseFloat(localStorage.getItem('petProductionBonus')) || 0;
        const effectProductionBonus = parseFloat(localStorage.getItem('effectProductionBonus')) || 1;
        
        if (petProductionBonus > 0 || effectProductionBonus > 1) {
            // Get the auto clicker base points
            const autoClickerPointsPerSecond = parseInt(localStorage.getItem('autoClickerPointsPerSecond')) || 0;
            const autoClickerPurchased = JSON.parse(localStorage.getItem('autoClickerPurchased')) || false;
            
            if (autoClickerPointsPerSecond > 0 && autoClickerPurchased) {
                // Calculate bonus points
                let bonusPoints = autoClickerPointsPerSecond;
                let bonusFromPet = Math.floor(autoClickerPointsPerSecond * petProductionBonus);
                bonusPoints += bonusFromPet;
                bonusPoints = Math.floor(bonusPoints * effectProductionBonus);
                
                // Add the bonus directly to points
                let points = parseInt(localStorage.getItem("points")) || 0;
                points += bonusFromPet; // Add only the bonus from pet
                localStorage.setItem("points", points);
                
                // Update points display
                const pointsValue = document.getElementById("pointsValue");
                if (pointsValue) {
                    pointsValue.innerText = points;
                }
                
                // Only log occasionally to avoid console spam
                if (Math.random() < 0.01) {
                    console.log(`Applied production bonus: Base=${autoClickerPointsPerSecond}, Pet Bonus=${petProductionBonus}, Effect Bonus=${effectProductionBonus}, Total=${bonusPoints}`);
                }
            }
        }
    }, 1000);
}

// Initialize
createPlaceholderEmojis();
applyBonusesToCookie();
applyBonusesToAutoClicker();