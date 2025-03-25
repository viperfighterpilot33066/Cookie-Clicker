class RebirthSystem {
    constructor() {
        this.rebirthCost = 100000;
        this.rebirths = parseInt(localStorage.getItem('rebirths')) || 0;
        this.maxUpgrades = 5 + (this.rebirths * 10);
        this.init();
    }

    init() {
        this.updateRebirthUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const rebirthButton = document.getElementById('rebirthButton');
        if (rebirthButton) {
            rebirthButton.addEventListener('click', () => this.rebirth());
        }
    }

    canRebirth() {
        const points = parseInt(localStorage.getItem('points')) || 0;
        const autoClickerLevel = parseInt(localStorage.getItem('autoClickerUpgradeCount')) || 0;
        const maxCurrentLevel = 5 + (this.rebirths * 5); // Changed from 10 to 5
        return points >= this.rebirthCost && autoClickerLevel >= maxCurrentLevel;
    }

    rebirth() {
        if (!this.canRebirth()) {
            const points = parseInt(localStorage.getItem('points')) || 0;
            const autoClickerLevel = parseInt(localStorage.getItem('autoClickerUpgradeCount')) || 0;
            const maxCurrentLevel = 5 + (this.rebirths * 5); // Changed from 10 to 5
            
            let message = 'Requirements for rebirth:\n';
            message += `- 100,000 points (you have ${points})\n`;
            message += `- Max auto clicker level ${maxCurrentLevel} (you have level ${autoClickerLevel})\n`;
            message += `Rebirth will unlock 5 more upgrade levels!`;
            
            alert(message);
            return false;
        }

        this.rebirths++;
        localStorage.setItem('rebirths', this.rebirths);
        this.maxUpgrades = 5 + (this.rebirths * 5); // Changed from 10 to 5

        // Reset progress
        localStorage.setItem('points', '0');
        localStorage.setItem('autoClickerUpgradeCount', '0');
        localStorage.setItem('autoClickerPurchased', 'false');
        localStorage.setItem('curserUpgradeActive', '0');

        // Trigger achievement
        if (window.achievementManager) {
            window.achievementManager.incrementStat('rebirths');
        }

        // Update UI
        this.updateRebirthUI();
        alert(`Rebirth successful! You can now upgrade your Auto Clicker ${this.maxUpgrades} times!`);
        return true;
    }

    updateRebirthUI() {
        const rebirthLevel = document.getElementById('rebirthLevel');
        if (rebirthLevel) {
            rebirthLevel.textContent = this.rebirths;
        }

        const rebirthButton = document.getElementById('rebirthButton');
        if (rebirthButton) {
            if (this.canRebirth()) {
                rebirthButton.classList.add('ready');
            } else {
                rebirthButton.classList.remove('ready');
            }
        }
    }
}

// Initialize rebirth system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.rebirthSystem = new RebirthSystem();
});
