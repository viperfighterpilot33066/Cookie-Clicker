const achievements = {
    cookieBeginner: {
        name: "First Crumb",
        description: "Collect your first 10 cookies",
        reward: 25,
        check: () => parseInt(localStorage.getItem('points')) >= 10
    },
    cookieNovice: {
        name: "Cookie Novice",
        description: "Collect 100 cookies",
        reward: 50,
        check: () => parseInt(localStorage.getItem('points')) >= 100
    },
    cookieEnthusiast: {
        name: "Cookie Enthusiast",
        description: "Collect 500 cookies",
        reward: 100,
        check: () => parseInt(localStorage.getItem('points')) >= 500
    },
    cookieMaster: {
        name: "Cookie Master",
        description: "Collect 1,000 cookies",
        reward: 200,
        check: () => parseInt(localStorage.getItem('points')) >= 1000
    },
    cookieExpert: {
        name: "Cookie Expert",
        description: "Collect 5,000 cookies",
        reward: 500,
        check: () => parseInt(localStorage.getItem('points')) >= 5000
    },
    cookieLegend: {
        name: "Cookie Legend",
        description: "Collect 10,000 cookies",
        reward: 1000,
        check: () => parseInt(localStorage.getItem('points')) >= 10000
    },
    cookieGod: {
        name: "Cookie God",
        description: "Collect 50,000 cookies",
        reward: 2500,
        check: () => parseInt(localStorage.getItem('points')) >= 50000
    },
    cookieOverlord: {
        name: "Cookie Overlord",
        description: "Collect 100,000 cookies",
        reward: 5000,
        check: () => parseInt(localStorage.getItem('points')) >= 100000
    },
    clickerNovice: {
        name: "Click Novice",
        description: "Upgrade cursor 3 times",
        reward: 150,
        check: () => parseInt(localStorage.getItem('curserUpgradeActive')) >= 3
    },
    clickerAdept: {
        name: "Click Adept",
        description: "Upgrade cursor 5 times",
        reward: 300,
        check: () => parseInt(localStorage.getItem('curserUpgradeActive')) >= 5
    },
    clickerMaster: {
        name: "Click Master",
        description: "Upgrade cursor 10 times",
        reward: 1000,
        check: () => parseInt(localStorage.getItem('curserUpgradeActive')) >= 10
    },
    autoBegin: {
        name: "Automation Begins",
        description: "Buy your first Auto Clicker",
        reward: 100,
        check: () => JSON.parse(localStorage.getItem('autoClickerPurchased')) === true
    },
    autoApprentice: {
        name: "Auto Apprentice",
        description: "Upgrade Auto Clicker 3 times",
        reward: 200,
        check: () => parseInt(localStorage.getItem('autoClickerUpgradeCount')) >= 3
    },
    autoMaster: {
        name: "Auto Master",
        description: "Max out Auto Clicker upgrades",
        reward: 500,
        check: () => parseInt(localStorage.getItem('autoClickerUpgradeCount')) >= 5
    },
    rebirthNovice: {
        name: "New Beginning",
        description: "Complete your first rebirth",
        reward: 2000,
        check: () => parseInt(localStorage.getItem('rebirths')) >= 1
    },
    rebirthAdept: {
        name: "Rebirth Adept",
        description: "Complete 3 rebirths",
        reward: 5000,
        check: () => parseInt(localStorage.getItem('rebirths')) >= 3
    },
    rebirthMaster: {
        name: "Rebirth Master",
        description: "Complete 5 rebirths",
        reward: 10000,
        check: () => parseInt(localStorage.getItem('rebirths')) >= 5
    },
    defender: {
        name: "Shield Bearer",
        description: "Buy your first shield",
        reward: 1000,
        check: () => localStorage.getItem('shieldPurchased') === 'true'
    },
    saboteur: {
        name: "Saboteur",
        description: "Successfully sabotage another player",
        reward: 2000,
        check: () => localStorage.getItem('sabotageDone') === 'true'
    },
    masterSaboteur: {
        name: "Master Saboteur",
        description: "Sabotage 3 different players",
        reward: 5000,
        check: () => parseInt(localStorage.getItem('sabotageCount')) >= 3
    },
    // Ultra Hard Achievements
    cookieGalaxy: {
        name: "Cookie Galaxy",
        description: "Collect 1,000,000 cookies",
        reward: 50000,
        check: () => parseInt(localStorage.getItem('points')) >= 1000000
    },
    cookieUniverse: {
        name: "Cookie Universe",
        description: "Collect 10,000,000 cookies",
        reward: 500000,
        check: () => parseInt(localStorage.getItem('points')) >= 10000000
    },
    rebirthLegend: {
        name: "Rebirth Legend",
        description: "Complete 10 rebirths",
        reward: 100000,
        check: () => parseInt(localStorage.getItem('rebirths')) >= 10
    },
    rebirthGod: {
        name: "Rebirth God",
        description: "Complete 20 rebirths",
        reward: 1000000,
        check: () => parseInt(localStorage.getItem('rebirths')) >= 20
    },
    supremeSaboteur: {
        name: "Supreme Saboteur",
        description: "Sabotage 10 different players",
        reward: 50000,
        check: () => parseInt(localStorage.getItem('sabotageCount')) >= 10
    },
    shieldMaster: {
        name: "Shield Master",
        description: "Block 5 sabotage attempts with shield",
        reward: 25000,
        check: () => parseInt(localStorage.getItem('blockedSabotages')) >= 5
    },
    clickingMachine: {
        name: "Clicking Machine",
        description: "Click 100,000 times",
        reward: 100000,
        check: () => parseInt(localStorage.getItem('totalClicks')) >= 100000
    },
    speedRunner: {
        name: "Speed Runner",
        description: "Reach 1M cookies in under 1 hour",
        reward: 1000000,
        check: () => {
            const startTime = parseInt(localStorage.getItem('gameStartTime')) || Date.now();
            const points = parseInt(localStorage.getItem('points')) || 0;
            return points >= 1000000 && (Date.now() - startTime) < 3600000;
        }
    },
    perfectionist: {
        name: "Perfectionist",
        description: "Max out all upgrades in a single run",
        reward: 200000,
        check: () => {
            const autoMax = parseInt(localStorage.getItem('autoClickerUpgradeCount')) >= 5;
            const cursorMax = parseInt(localStorage.getItem('curserUpgradeActive')) >= 10;
            return autoMax && cursorMax;
        }
    },
    invincible: {
        name: "Invincible",
        description: "Maintain shield for 24 consecutive hours",
        reward: 500000,
        check: () => {
            const shieldStartTime = parseInt(localStorage.getItem('shieldStartTime')) || 0;
            const shieldActive = localStorage.getItem('shieldActive') === 'true';
            return shieldActive && (Date.now() - shieldStartTime) >= 86400000;
        }
    },
    sabotageKing: {
        name: "Sabotage King",
        description: "Successfully reduce 1M total points from other players",
        reward: 1000000,
        check: () => parseInt(localStorage.getItem('totalSabotagePoints')) >= 1000000
    },
    // Pet and Effect Achievements - add these to the achievements object
    petCollector: {
        name: "Pet Collector",
        description: "Own 3 different pets",
        reward: 1500,
        check: () => {
            const inventory = JSON.parse(localStorage.getItem('shopInventory')) || {};
            return inventory.pets && inventory.pets.length >= 3;
        }
    },
    petMaster: {
        name: "Pet Master",
        description: "Own all available pets",
        reward: 5000,
        check: () => {
            const inventory = JSON.parse(localStorage.getItem('shopInventory')) || {};
            return inventory.pets && inventory.pets.length >= 5; // Total number of pets
        }
    },
    effectUser: {
        name: "Effect Enthusiast", 
        description: "Use 3 different effects",
        reward: 2000,
        check: () => {
            const usedEffects = JSON.parse(localStorage.getItem('usedEffects') || '[]');
            return usedEffects.length >= 3;
        }
    },
    cookieChemist: {
        name: "Cookie Chemist",
        description: "Experience all available effects",
        reward: 7500,
        check: () => {
            const usedEffects = JSON.parse(localStorage.getItem('usedEffects') || '[]');
            return usedEffects.length >= 5; // Total number of effects
        }
    },
    shopaholic: {
        name: "Shopaholic",
        description: "Spend 50,000 cookies in the shop",
        reward: 10000,
        check: () => parseInt(localStorage.getItem('shopSpending') || '0') >= 50000
    },
    goldDigger: {
        name: "Gold Digger",
        description: "Earn 30,000 cookies from Golden Hamster",
        reward: 15000,
        check: () => parseInt(localStorage.getItem('goldenHamsterEarnings') || '0') >= 30000
    },
    sugarRush: {
        name: "Sugar Addict",
        description: "Use the Sugar Rush effect 10 times",
        reward: 3000,
        check: () => {
            const effectCounts = JSON.parse(localStorage.getItem('effectCounts') || '{}');
            return (effectCounts['sugarRush'] || 0) >= 10;
        }
    },
    bestFriend: {
        name: "Best Friend",
        description: "Have the same pet equipped for 24 hours",
        reward: 8000,
        check: () => {
            const petEquipTime = parseInt(localStorage.getItem('petEquipTime') || '0');
            return petEquipTime >= 24 * 60 * 60 * 1000;
        }
    },
    petWhisperer: {
        name: "Pet Whisperer",
        description: "Have 10 different pets in your collection",
        reward: 20000,
        check: () => {
            const inventory = JSON.parse(localStorage.getItem('shopInventory')) || {};
            return inventory.pets && inventory.pets.length >= 10;
        }
    },
    effectWizard: {
        name: "Effect Wizard",
        description: "Use 10 different effects",
        reward: 25000,
        check: () => {
            const usedEffects = JSON.parse(localStorage.getItem('usedEffects') || '[]');
            return usedEffects.length >= 10;
        }
    },
    cookieEconomy: {
        name: "Cookie Economy",
        description: "Earn 1,000,000 cookies from pets and effects combined",
        reward: 50000,
        check: () => {
            const petEarnings = parseInt(localStorage.getItem('petTotalEarnings') || '0');
            const effectEarnings = parseInt(localStorage.getItem('effectTotalEarnings') || '0');
            return petEarnings + effectEarnings >= 1000000;
        }
    },
    goldenHunter: {
        name: "Golden Hunter",
        description: "Click on 50 golden cookies",
        reward: 15000,
        check: () => {
            return parseInt(localStorage.getItem('goldenCookiesClicked') || '0') >= 50;
        }
    },
    criticalCookie: {
        name: "Critical Cookie",
        description: "Get 100 critical clicks",
        reward: 10000,
        check: () => {
            return parseInt(localStorage.getItem('criticalClicks') || '0') >= 100;
        }
    },
    chainMaster: {
        name: "Chain Master",
        description: "Complete 5 cookie chains",
        reward: 20000,
        check: () => {
            return parseInt(localStorage.getItem('completedCookieChains') || '0') >= 5;
        }
    },
    petZookeeper: {
        name: "Pet Zookeeper",
        description: "Own all pets in the shop",
        reward: 100000,
        check: () => {
            const inventory = JSON.parse(localStorage.getItem('shopInventory')) || {};
            // There are 15 total pets
            return inventory.pets && inventory.pets.length >= 15;
        }
    },
    effectCollector: {
        name: "Effect Collector",
        description: "Use all effects in the shop",
        reward: 150000,
        check: () => {
            const usedEffects = JSON.parse(localStorage.getItem('usedEffects') || '[]');
            // There are 15 total effects
            return usedEffects.length >= 15;
        }
    },
    phoenixPower: {
        name: "Phoenix Power",
        description: "Be resurrected by the Pudding Phoenix",
        reward: 30000,
        check: () => {
            return localStorage.getItem('hasBeenResurrected') === 'true';
        }
    },
    cookieEmpire: {
        name: "Cookie Empire",
        description: "Have 5 different pets equipped at different times",
        reward: 50000,
        check: () => {
            const equippedPets = JSON.parse(localStorage.getItem('historicalEquippedPets') || '[]');
            return new Set(equippedPets).size >= 5;
        }
    },
    criticalMaster: {
        name: "Critical Master",
        description: "Get 1000 critical clicks",
        reward: 100000,
        check: () => {
            return parseInt(localStorage.getItem('criticalClicks') || '0') >= 1000;
        }
    }
};

class AchievementManager {
    constructor() {
        this.unlockedAchievements = new Set(JSON.parse(localStorage.getItem('unlockedAchievements') || '[]'));
        this.init();

        // Initialize game start time if not set
        if (!localStorage.getItem('gameStartTime')) {
            localStorage.setItem('gameStartTime', Date.now().toString());
        }
        this.initializeAchievements();
    }

    init() {
        this.createAchievementElements();
        this.checkAchievements();
        // Check achievements more frequently
        setInterval(() => this.checkAchievements(), 100);
        this.updateUI();
    }

    createAchievementElements() {
        const container = document.getElementById('achievementsContainer');
        if (!container) return;

        container.innerHTML = ''; // Clear existing content

        // Create an element for each achievement
        Object.entries(achievements).forEach(([id, achievement]) => {
            const div = document.createElement('div');
            div.className = 'achievement locked';
            div.id = id;
            div.innerHTML = `
                <h3>???</h3>
                <p class="description">???</p>
                <p class="reward">Reward: ${achievement.reward} points</p>
            `;
            container.appendChild(div);
        });

        // Update unlocked achievements
        this.updateUI();
    }

    checkAchievements() {
        const points = parseInt(localStorage.getItem('points')) || 0;
        const rebirths = parseInt(localStorage.getItem('rebirths')) || 0;
        
        for (const [id, achievement] of Object.entries(achievements)) {
            if (!this.unlockedAchievements.has(id) && achievement.check()) {
                this.unlockAchievement(id, achievement);
            }
        }
    }

    unlockAchievement(id, achievement) {
        this.unlockedAchievements.add(id);
        localStorage.setItem('unlockedAchievements', JSON.stringify([...this.unlockedAchievements]));
        
        // Add reward
        let currentPoints = parseInt(localStorage.getItem('points')) || 0;
        currentPoints += achievement.reward;
        localStorage.setItem('points', currentPoints);

        // Update UI
        const achievementElement = document.getElementById(id);
        if (achievementElement) {
            achievementElement.classList.remove('locked');
            achievementElement.classList.add('unlocked');
            achievementElement.querySelector('h3').textContent = achievement.name;
            achievementElement.querySelector('.description').textContent = achievement.description;
        }

        this.showNotification(achievement);
    }

    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <h3>Achievement Unlocked!</h3>
            <p>${achievement.name}</p>
            <p>+${achievement.reward} points</p>
        `;
        document.body.appendChild(notification);
        
        // Add notification sound
        const audio = new Audio('achievement.mp3'); // Optional: Add sound
        audio.play().catch(e => console.log('Audio not supported'));
        
        // Animate and remove notification
        notification.style.animation = 'slideIn 0.5s ease-out';
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    setupAutoCheck() {
        setInterval(() => this.checkAchievements(), 1000);
    }

    updateUI() {
        // Update each achievement element
        Object.entries(achievements).forEach(([id, achievement]) => {
            const element = document.getElementById(id);
            if (!element) return;

            if (this.unlockedAchievements.has(id)) {
                element.classList.remove('locked');
                element.classList.add('unlocked');
                element.querySelector('h3').textContent = achievement.name;
                element.querySelector('.description').textContent = achievement.description;
            } else {
                element.classList.add('locked');
                element.classList.remove('unlocked');
                element.querySelector('h3').textContent = '???';
                element.querySelector('.description').textContent = '???';
            }
        });
    }

    // Add method to track clicks
    incrementClicks() {
        const clicks = parseInt(localStorage.getItem('totalClicks') || '0') + 1;
        localStorage.setItem('totalClicks', clicks);
        this.checkAchievements();
    }

    // Add method to track sabotage points
    addSabotagePoints(points) {
        const totalPoints = parseInt(localStorage.getItem('totalSabotagePoints') || '0') + points;
        localStorage.setItem('totalSabotagePoints', totalPoints);
        this.checkAchievements();
    }

    initializeAchievements() {
        const container = document.getElementById('achievementsContainer');
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Create a div for each achievement
        Object.entries(achievements).forEach(([id, achievement]) => {
            const achievementDiv = document.createElement('div');
            achievementDiv.className = 'achievement locked';
            achievementDiv.id = id;
            
            achievementDiv.innerHTML = `
                <h3>???</h3>
                <p class="description">???</p>
                <p class="reward">Reward: ${achievement.reward} points</p>
            `;
            
            container.appendChild(achievementDiv);
        });

        // Update UI to show any already unlocked achievements
        this.updateUI();
    }
}

// Initialize achievement manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.achievementManager = new AchievementManager();
});