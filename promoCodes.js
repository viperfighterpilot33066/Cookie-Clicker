const promoCodes = {
    'Thanks4Helping': {
        used: false,
        reward: {
            type: 'bundle',
            items: [
                {
                    type: 'multiplier',
                    value: 2.0,
                    affects: ['autoClicker', 'manualClicks']
                },
                {
                    type: 'pet',
                    name: 'Ember the Legendary Dragon',
                    // Will use our dynamic image creation instead
                    rarity: 5,
                    description: 'A legendary dragon that commands the power of infernal flames',
                    // Enhanced perks with clear description
                    perk: '+2.0 cookies/second, doubles click power, 15% chance for 5x critical hits'
                }
            ]
        }
    }
};

function initializePromoSystem() {
    const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes')) || [];
    usedCodes.forEach(code => {
        if (promoCodes[code]) {
            promoCodes[code].used = true;
        }
    });
}

// Enhanced redeemPromoCode function with better feedback
function redeemPromoCode(code) {
    const promoCode = promoCodes[code];

    if (!promoCode) {
        return "Invalid promo code. Please try again.";
    }

    // Check if code was already used
    const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes')) || [];
    if (usedCodes.includes(code)) {
        return "You've already redeemed this code.";
    }

    // Apply rewards
    promoCode.used = true;
    usedCodes.push(code);
    localStorage.setItem('usedPromoCodes', JSON.stringify(usedCodes));
    
    // Apply the rewards
    applyPromoRewards(promoCode.reward);
    
    // Special handling for Ember Dragon promo
    if (code === 'Thanks4Helping') {
        // Apply permanent point bonus
        localStorage.setItem('permanentPointsBonus', '0.25');
        localStorage.setItem('clickMultiplier', '2.0');
        localStorage.setItem('autoClickerMultiplier', '2.0');
        
        // Create dragon image if it doesn't exist
        if (!localStorage.getItem('emberDragonImage')) {
            createEmberDragonImage();
        }
        
        // Add dragon to inventory without auto-equipping
        addEmberDragonToInventory(false);
        
        // Play notification sound
        playPromoSound();
        
        // Show notification
        setTimeout(() => {
            showEmberDragonNotification();
        }, 500);
        
        return "Ember the Legendary Dragon has joined your collection! Check the shop to equip it.";
    }
    
    // Return a more detailed success message for Thanks4Helping
    if (code === 'Thanks4Helping') {
        return { 
            success: true, 
            message: 'AWESOME! Ember the Legendary Dragon joins your team! +2 CPS, 2x clicks, 25% permanent bonus & critical hits!' 
        };
    } else {
        return { 
            success: true, 
            message: 'Promo code redeemed successfully!' 
        };
    }
}

// Basic setup function if pet system isn't loaded
function setupEmberDragonBasic() {
    // Set active pet data
    localStorage.setItem('equippedPet', 'Ember the Legendary Dragon');
    localStorage.setItem('petBonusCPS', 2.0);
    localStorage.setItem('petClickBonus', 2.0);
    localStorage.setItem('petCritChance', 0.15);
    localStorage.setItem('petCritMultiplier', 5);
    localStorage.setItem('clickMultiplier', 2.0);
    localStorage.setItem('autoClickerMultiplier', 2.0);
    localStorage.setItem('petProductionBonus', 0.25); // Add the 25% bonus
    localStorage.setItem('permanentPointsBonus', '0.25'); // 25% permanent bonus
    
    // Mark notification as needed
    localStorage.setItem('emberDragonNotificationNeeded', 'true');
}

// Enhanced reward application
function applyPromoRewards(reward) {
    if (reward.type === 'bundle') {
        reward.items.forEach(item => {
            if (item.type === 'multiplier') {
                // Store multipliers that will be applied in script
                localStorage.setItem('clickMultiplier', item.value);
                localStorage.setItem('autoClickerMultiplier', item.value);
                
                console.log('Applied multipliers:', item.value);
            } else if (item.type === 'pet') {
                // Show notification immediately
                const dragonImage = localStorage.getItem('emberDragonImage');
                if (dragonImage) {
                    showPetNotification(dragonImage);
                    localStorage.setItem('emberDragonNotificationShown', 'true');
                }
                console.log('Pet will be set up by the pet system');
            }
        });
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function () {
    initializePromoSystem();

    const settingsBtn = document.getElementById('settingsButton');
    const modal = document.getElementById('settingsModal');
    const closeBtn = document.querySelector('.close');
    const redeemBtn = document.getElementById('redeemPromo');

    if (settingsBtn) settingsBtn.onclick = () => modal.style.display = "block";
    if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";

    if (redeemBtn) {
        redeemBtn.onclick = () => {
            const code = document.getElementById('promoInput').value;
            const messageElement = document.getElementById('promoMessage');

            if (messageElement) messageElement.textContent = "Processing...";

            const result = redeemPromoCode(code);
            
            if (messageElement) {
                messageElement.textContent = result.message;
                
                if (result.success) {
                    document.getElementById('promoInput').value = '';
                    messageElement.style.color = '#4CAF50';
                    messageElement.style.fontWeight = 'bold';
                    createConfettiEffect();
                } else {
                    messageElement.style.color = '#f44336';
                }
            }
        };
    }

    if (modal) {
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    }
});

// Fix the error in promoCodes.js where it's trying to access style on null
document.addEventListener("DOMContentLoaded", function() {
    // Get the promo code elements
    const promoInput = document.getElementById('promoInput');
    const redeemButton = document.getElementById('redeemPromo');
    const promoMessage = document.getElementById('promoMessage');
    
    // Only proceed if we have the required elements
    if (redeemButton && promoInput) {
        redeemButton.addEventListener('click', function() {
            redeemPromoCode();
        });
        
        // Also allow Enter key to submit
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                redeemPromoCode();
            }
        });
    }

    // Fix the settings button click handler by adding null check
    const settingsBtn = document.getElementById('settingsButton');
    
    if (settingsBtn) {
        settingsBtn.onclick = function() {
            const settingsMenu = document.querySelector('.settings-menu');
            if (settingsMenu) {
                settingsMenu.style.display = 'block';
            }
        };
    }

    // ... rest of the existing code
});

// Add confetti effect for successful promo redemption
function createConfettiEffect() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';

    document.body.appendChild(confettiContainer);

    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        const size = Math.random() * 10 + 5;

        confetti.style.position = 'absolute';
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-20px';
        confetti.style.opacity = '1';

        confettiContainer.appendChild(confetti);

        // Animate the confetti
        const animation = confetti.animate(
            [
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${Math.random() * 100 - 50}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ],
            {
                duration: Math.random() * 2000 + 1500,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
            }
        );

        animation.onfinish = () => confetti.remove();
    }

    // Remove confetti container after animations are done
    setTimeout(() => {
        if (document.body.contains(confettiContainer)) {
            confettiContainer.remove();
        }
    }, 3500);
}

function getRandomColor() {
    const colors = ['#FF5252', '#FF4081', '#7C4DFF', '#536DFE', '#4CAF50', '#FFEB3B', '#FF9800'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add custom pet notification function for immediate display
function showPetNotification(petImageUrl) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'rgba(0,0,0,0.8)';
    notification.style.color = '#fff';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.boxShadow = '0 0 20px rgba(255, 87, 34, 0.7)';
    notification.style.border = '2px solid #FF5722';
    notification.style.maxWidth = '80%';
    
    // Create dragon image element
    const petImg = document.createElement('img');
    petImg.src = petImageUrl;
    petImg.style.width = '64px';
    petImg.style.height = '64px';
    petImg.style.marginRight = '15px';
    petImg.style.borderRadius = '8px';
    
    // Create text content div
    const textDiv = document.createElement('div');
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Ember the Legendary Dragon';
    title.style.margin = '0 0 5px 0';
    title.style.color = '#FF9800';
    
    // Create description - updated to include permanent 25% bonus
    const desc = document.createElement('p');
    desc.innerHTML = '<strong>Legendary Pet Obtained!</strong><br>+2 cookies/sec, doubles clicks, 25% permanent cookie bonus, 15% chance for 5x crits!';
    desc.style.margin = '0';
    desc.style.fontSize = '14px';
    
    // Assemble the notification
    textDiv.appendChild(title);
    textDiv.appendChild(desc);
    notification.appendChild(petImg);
    notification.appendChild(textDiv);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add animation
    notification.animate([
        { opacity: 0, transform: 'translate(-50%, -20px)' },
        { opacity: 1, transform: 'translate(-50%, 0)' }
    ], {
        duration: 500,
        easing: 'ease-out'
    });
    
    // Remove after 8 seconds
    setTimeout(() => {
        notification.animate([
            { opacity: 1, transform: 'translate(-50%, 0)' },
            { opacity: 0, transform: 'translate(-50%, -20px)' }
        ], {
            duration: 500,
            easing: 'ease-in'
        }).onfinish = () => notification.remove();
    }, 8000);
}

// Enhanced redeemPromoCode function with better feedback and notification sound
function redeemPromoCode() {
    const codeInput = document.getElementById('promoCodeInput');
    const messageDisplay = document.getElementById('promoMessage');
    if (!codeInput || !messageDisplay) return;

    const code = codeInput.value.trim();
    if (!code) {
        messageDisplay.textContent = "Please enter a promo code.";
        messageDisplay.style.color = "#FF5722";
        return;
    }

    // Check if code is already used
    const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
    if (usedCodes.includes(code)) {
        messageDisplay.textContent = "This code has already been redeemed.";
        messageDisplay.style.color = "#FF5722";
        return;
    }

    // Apply promo code effects based on code
    let redeemSuccessful = false;
    let rewardMessage = "";

    switch (code) {
        case "COOKIEFAN2023":
            // Award 500 points
            addPoints(500);
            redeemSuccessful = true;
            rewardMessage = "Redeemed: +500 cookies!";
            break;
            
        case "CLICKMASTER":
            // Permanently increase points per click by 1
            const currentPointsPerClick = parseInt(localStorage.getItem('pointsPerClick')) || 1;
            localStorage.setItem('pointsPerClick', currentPointsPerClick + 1);
            redeemSuccessful = true;
            rewardMessage = "Redeemed: Permanently +1 cookie per click!";
            break;
            
        case "AUTOBOOST":
            // Upgrade auto clicker by 1 level if purchased
            if (localStorage.getItem('autoClickerPurchased') === 'true') {
                const currentUpgrade = parseInt(localStorage.getItem('autoClickerUpgradeCount')) || 0;
                localStorage.setItem('autoClickerUpgradeCount', currentUpgrade + 1);
                redeemSuccessful = true;
                rewardMessage = "Redeemed: Auto Clicker upgraded by 1 level!";
            } else {
                messageDisplay.textContent = "You need to purchase the Auto Clicker first!";
                messageDisplay.style.color = "#FF5722";
                return;
            }
            break;
            
        case "Thanks4Helping":
            // Legendary dragon pet
            setupEmberDragon();
            redeemSuccessful = true;
            rewardMessage = "Redeemed: Ember the Legendary Dragon added to your pets!";
            break;
            
        case "LUCKYCOOKIE":
            // Award random points between 100-10000
            const randomPoints = Math.floor(Math.random() * 9901) + 100; // 100-10000
            addPoints(randomPoints);
            redeemSuccessful = true;
            rewardMessage = `Redeemed: +${randomPoints} cookies!`;
            break;
            
        case "DOUBLEPOINTS":
            // Double current points
            const currentPoints = parseInt(localStorage.getItem('points')) || 0;
            localStorage.setItem('points', currentPoints * 2);
            updatePointsDisplay(currentPoints * 2);
            redeemSuccessful = true;
            rewardMessage = `Redeemed: Points doubled to ${currentPoints * 2}!`;
            break;
            
        case "POINTSBOOSTER":
            // Permanent 5% bonus to all point gains
            localStorage.setItem('permanentPointsBonus', 0.05);
            redeemSuccessful = true;
            rewardMessage = "Redeemed: Permanent 5% bonus to all point gains!";
            break;
            
        default:
            messageDisplay.textContent = "Invalid promo code.";
            messageDisplay.style.color = "#FF5722";
            return;
    }

    if (redeemSuccessful) {
        // Store the used code
        usedCodes.push(code);
        localStorage.setItem('usedPromoCodes', JSON.stringify(usedCodes));
        
        // Update UI
        messageDisplay.textContent = rewardMessage;
        messageDisplay.style.color = "#4CAF50";
        
        // Clear input
        codeInput.value = "";
        
        // Play reward sound
        if (typeof AudioHelper !== 'undefined') {
            AudioHelper.playNotificationSound();
        } else {
            // Fallback sound handling
            try {
                const audio = new Audio('audio/RewardSound.wav');
                audio.volume = 0.4;
                audio.play().catch(e => console.log('Audio not supported or allowed'));
            } catch (err) {
                console.log('Audio not supported');
            }
        }
        
        // If possible, animate the message
        messageDisplay.style.animation = 'none';
        setTimeout(() => {
            messageDisplay.style.animation = 'pulse 1s ease-in-out';
        }, 10);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Get the promo code elements
    const promoInput = document.getElementById('promoInput');
    const redeemBtn = document.getElementById('redeemPromo');
    const promoMessage = document.getElementById('promoMessage');
    
    // Only proceed if we have the required elements
    if (redeemBtn && promoInput) {
        redeemBtn.addEventListener('click', function() {
            redeemPromoCode();
        });
        
        // Also allow Enter key to submit
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                redeemPromoCode();
            }
        });
    }

    // Safely handle settings button click
    const settingsBtn = document.getElementById('settingsButton');
    
    if (settingsBtn) {
        settingsBtn.onclick = function() {
            const settingsMenu = document.querySelector('.settings-menu');
            if (settingsMenu) {
                settingsMenu.style.display = 'block';
            }
        };
    }
    
    // Function to redeem promo code with error handling
    function redeemPromoCode() {
        try {
            const promoInput = document.getElementById('promoInput');
            const promoMessage = document.getElementById('promoMessage');
            
            if (!promoInput) {
                console.error('Promo input element not found');
                return;
            }
            
            const code = promoInput.value.trim();
            if (!code) {
                if (promoMessage) promoMessage.textContent = 'Please enter a promo code';
                return;
            }
            
            // Check if code was already used
            const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
            if (usedCodes.includes(code)) {
                if (promoMessage) promoMessage.textContent = 'This code has already been used';
                return;
            }
            
            // Process the promo code
            let success = handlePromoCode(code);
            
            // If successful, save to used codes
            if (success) {
                usedCodes.push(code);
                localStorage.setItem('usedPromoCodes', JSON.stringify(usedCodes));
                if (promoInput) promoInput.value = ''; // Clear input
            }
        } catch (error) {
            console.error('Error processing promo code:', error);
            const promoMessage = document.getElementById('promoMessage');
            if (promoMessage) {
                promoMessage.textContent = 'An error occurred. Please try again.';
            }
        }
    }
    
    // Attach redeem functionality to button if it exists
    const redeemPromo = document.getElementById('redeemPromo');
    if (redeemPromo) {
        redeemPromo.onclick = redeemPromoCode;
    }
});

// Function to handle different promo codes
function handlePromoCode(code) {
    const promoMessage = document.getElementById('promoMessage');
    let points = parseInt(localStorage.getItem('points')) || 0;
    let success = false;
    
    // Take promoCode and check for different cases
    switch(code.toLowerCase()) {
        case 'cookie2023':
            points += 1000;
            localStorage.setItem('points', points);
            if (promoMessage) promoMessage.textContent = 'Added 1,000 cookies!';
            success = true;
            break;
            
        case 'speedrun':
            points += 5000;
            localStorage.setItem('points', points);
            if (promoMessage) promoMessage.textContent = 'Added 5,000 cookies for speedrunning!';
            success = true;
            break;
            
        case 'cookiemonster':
            points += 10000;
            localStorage.setItem('points', points);
            if (promoMessage) promoMessage.textContent = 'Added 10,000 cookies! Om nom nom!';
            success = true;
            break;
            
        case 'thanks4helping':
            // Add the legendary pet - Ember the Dragon
            setupEmberDragon();
            if (promoMessage) promoMessage.textContent = 'Added Legendary Pet: Ember the Dragon!';
            success = true;
            break;
            
        default:
            if (promoMessage) promoMessage.textContent = 'Invalid promo code';
            success = false;
    }
    
    // Update points display if available
    const pointsDisplay = document.getElementById('pointsValue');
    if (pointsDisplay) {
        pointsDisplay.textContent = points;
    }
    
    return success;
}

// Ember Dragon setup function
function setupEmberDragon() {
    // Check if we already have the shop inventory system
    const inventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
    
    // Check if Ember Dragon already exists
    const hasEmberDragon = inventory.pets.some(pet => pet.name === 'Ember the Legendary Dragon');
    if (hasEmberDragon) return; // Don't add twice
    
    // Create the dragon image
    const emberDragonImageData = createEmberDragonImageData();
    localStorage.setItem('emberDragonImage', emberDragonImageData);
    
    // Add to inventory
    inventory.pets.push({
        name: 'Ember the Legendary Dragon',
        icon: emberDragonImageData,
        imageData: emberDragonImageData,
        rarity: 5,
        tier: 'legendary',
        description: 'A legendary dragon that commands the power of infernal flames',
        perk: '+2.0 cookies/second, doubles click power, 15% chance for 5x critical hits',
        bonusCPS: 2.0,
        clickMultiplier: 2.0,
        critChance: 0.15,
        critMultiplier: 5,
        equipped: false
    });
    
    localStorage.setItem('shopInventory', JSON.stringify(inventory));
    localStorage.setItem('permanentPointsBonus', 0.1); // 10% permanent points bonus
    
    // Show notification if window.petSystem exists
    if (window.petSystem && typeof window.petSystem.showPetNotification === 'function') {
        window.petSystem.showPetNotification(emberDragonImageData);
    }
}

// Create Ember Dragon image
function createEmberDragonImageData() {
    // Canvas creation for dragon image
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Red-orange gradient background
    const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 70);
    gradient.addColorStop(0, '#FF5722');
    gradient.addColorStop(1, '#BF360C');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    // Dragon body
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.bezierCurveTo(50, 30, 70, 30, 80, 40);
    ctx.bezierCurveTo(90, 50, 90, 70, 80, 80);
    ctx.bezierCurveTo(70, 90, 50, 90, 40, 80);
    ctx.bezierCurveTo(30, 70, 30, 50, 40, 40);
    ctx.fill();
    
    // Draw wings, eyes, fire breath, etc.
    
    // Get image data URL
    return canvas.toDataURL('image/png');
}

// Make functions available globally
window.redeemPromoCode = function() {
    const promoInput = document.getElementById('promoInput');
    if (promoInput) {
        handlePromoCode(promoInput.value.trim());
    }
};

// Add validation function to check if promo perks are active without being redeemed
function validatePromoPerks() {
    // If the game initializer has run recently, skip this check to avoid race conditions
    const initRan = parseInt(localStorage.getItem('gameInitializerRan') || '0');
    if (Date.now() - initRan < 5000) { // Within 5 seconds
        console.log("Skipping promo validation - game initializer already ran");
        return false;
    }
    
    // Check if Ember Dragon perks are active
    const clickMultiplier = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
    const autoClickerMultiplier = parseFloat(localStorage.getItem('autoClickerMultiplier')) || 1;
    const permanentPointsBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
    
    // Check if these values are set despite no promo code used
    const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
    const hasRedeemedEmberCode = usedCodes.includes('Thanks4Helping');
    
    // Check for dragon in inventory
    const inventory = JSON.parse(localStorage.getItem('shopInventory') || '{"pets":[]}');
    const hasEmberDragon = inventory.pets && 
                          inventory.pets.some(pet => pet.name === 'Ember the Legendary Dragon');
    
    // If perks exist but no promo code was used, remove them
    if ((clickMultiplier > 1 || autoClickerMultiplier > 1 || permanentPointsBonus > 0 || hasEmberDragon) && !hasRedeemedEmberCode) {
        console.log("Detected improperly activated promo perks - resetting");
        
        // Reset multipliers to default
        localStorage.setItem('clickMultiplier', '1');
        localStorage.setItem('autoClickerMultiplier', '1');
        localStorage.setItem('permanentPointsBonus', '0');
        
        // Block future attempts until proper code used
        localStorage.setItem('emberDragonBlocked', 'true');
        
        // Remove dragon if present
        if (hasEmberDragon) {
            inventory.pets = inventory.pets.filter(pet => pet.name !== 'Ember the Legendary Dragon');
            localStorage.setItem('shopInventory', JSON.stringify(inventory));
            
            // Also clear equipped pet data if it's the dragon
            if (localStorage.getItem('equippedPet') === 'Ember the Legendary Dragon') {
                localStorage.removeItem('equippedPet');
                localStorage.removeItem('petBonusCPS');
                localStorage.removeItem('petClickBonus');
                localStorage.removeItem('petCritChance');
                localStorage.removeItem('petCritMultiplier');
            }
        }
        
        return true; // Fixes were made
    }
    
    return false; // No issues found
}

// Run validation on page load
document.addEventListener('DOMContentLoaded', function() {
    const fixesMade = validatePromoPerks();
    if (fixesMade) {
        console.log("Fixed incorrectly applied promo perks");
    }
    
    // Initialize existing promo code system
    initializePromoSystem();
});

// ...existing code...

function redeemPromoCode(code) {
    const promoCode = promoCodes[code];

    if (!promoCode) {
        return "Invalid promo code. Please try again.";
    }

    // Check if code was already used
    const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
    if (usedCodes.includes(code)) {
        return "You've already redeemed this code.";
    }

    // Apply rewards
    promoCode.used = true;
    usedCodes.push(code);
    localStorage.setItem('usedPromoCodes', JSON.stringify(usedCodes));
    
    // Apply the rewards
    applyPromoRewards(promoCode.reward);
    
    // Apply special permanent 25% points bonus for Thanks4Helping
    if (code === 'Thanks4Helping') {
        localStorage.setItem('permanentPointsBonus', '0.25');
        
        // Mark notification as needed
        localStorage.setItem('emberDragonNotificationNeeded', 'true');
        
        // Play special notification sound
        if (window.AudioHelper && typeof window.AudioHelper.playNotificationSound === 'function') {
            window.AudioHelper.playNotificationSound(0.5);
        } else {
            // Fallback sound handling
            try {
                const audio = new Audio('audio/RewardSound.wav');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Audio not supported or allowed'));
            } catch (err) {
                console.log('Audio not supported');
            }
        }
        
        // Show special dragon notification immediately
        showEmberDragonNotification();
    }
    
    // ...existing code...
}

// Add new function to show a special notification for Ember Dragon
function showEmberDragonNotification() {
    // Get dragon image, fallback to creating a simple one if needed
    let dragonImageUrl = localStorage.getItem('emberDragonImage');
    
    if (!dragonImageUrl) {
        // We'll create a simple colored square as fallback
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 64, 64);
        gradient.addColorStop(0, '#FF5722');
        gradient.addColorStop(1, '#F44336');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        // Add a simple dragon shape
        ctx.fillStyle = '#4a0';
        ctx.beginPath();
        ctx.moveTo(32, 15);
        ctx.lineTo(50, 30);
        ctx.lineTo(32, 45);
        ctx.lineTo(15, 30);
        ctx.closePath();
        ctx.fill();
        
        dragonImageUrl = canvas.toDataURL('image/png');
    }
    
    // Create notification container
    const notification = document.createElement('div');
    notification.className = 'promo-notification';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    notification.style.color = '#fff';
    notification.style.padding = '20px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 0 20px rgba(255, 152, 0, 0.7)';
    notification.style.border = '2px solid #FF9800';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.maxWidth = '90%';
    notification.style.width = '450px';
    
    // Create image element
    const image = document.createElement('img');
    image.src = dragonImageUrl;
    image.style.width = '64px';
    image.style.height = '64px';
    image.style.marginRight = '15px';
    image.style.borderRadius = '5px';
    
    // Create content container
    const content = document.createElement('div');
    content.style.flex = 1;
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Legendary Rewards Unlocked!';
    title.style.margin = '0 0 10px 0';
    title.style.color = '#FF9800';
    
    // Create description
    const description = document.createElement('div');
    description.innerHTML = `
        <p style="margin:0 0 8px 0"><strong>Ember the Legendary Dragon</strong> has joined your team!</p>
        <p style="margin:0 0 8px 0">• +2.0 cookies/second passive bonus</p>
        <p style="margin:0 0 8px 0">• 2× click power multiplier</p>
        <p style="margin:0 0 8px 0">• 15% chance for 5× critical hits</p>
        <p style="margin:0;color:#FFD700">• 25% permanent points bonus</p>
    `;
    
    // Add sparkle effects around the notification
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.width = '10px';
        sparkle.style.height = '10px';
        sparkle.style.background = '#FFD700';
        sparkle.style.borderRadius = '50%';
        sparkle.style.opacity = '0.7';
        
        // Animate sparkle
        sparkle.animate([
            { transform: 'scale(1)', opacity: 0.7 },
            { transform: 'scale(0)', opacity: 0 }
        ], {
            duration: 1500,
            iterations: Infinity,
            delay: Math.random() * 1000
        });
        
        notification.appendChild(sparkle);
    }
    
    // Add flame animation at the bottom
    const flame = document.createElement('div');
    flame.style.position = 'absolute';
    flame.style.bottom = '-10px';
    flame.style.left = '0';
    flame.style.width = '100%';
    flame.style.height = '20px';
    flame.style.background = 'linear-gradient(to top, #FF9800, transparent)';
    flame.style.borderRadius = '0 0 10px 10px';
    
    flame.animate([
        { opacity: 0.7, height: '20px' },
        { opacity: 0.3, height: '10px' },
        { opacity: 0.7, height: '20px' }
    ], {
        duration: 1500,
        iterations: Infinity
    });
    
    // Assemble the notification
    content.appendChild(title);
    content.appendChild(description);
    notification.appendChild(image);
    notification.appendChild(content);
    notification.appendChild(flame);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '8px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = '#AAA';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '0';
    closeButton.style.width = '25px';
    closeButton.style.height = '25px';
    closeButton.style.lineHeight = '25px';
    closeButton.style.textAlign = 'center';
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(notification);
        localStorage.setItem('emberDragonNotificationShown', 'true');
    });
    
    notification.appendChild(closeButton);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate entrance
    notification.animate([
        { transform: 'translate(-50%, -100px)', opacity: 0 },
        { transform: 'translate(-50%, 0)', opacity: 1 }
    ], {
        duration: 600,
        easing: 'ease-out',
        fill: 'forwards'
    });
    
    // Auto-close after 15 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.animate([
                { transform: 'translate(-50%, 0)', opacity: 1 },
                { transform: 'translate(-50%, -20px)', opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-in',
                fill: 'forwards'
            }).onfinish = () => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
                localStorage.setItem('emberDragonNotificationShown', 'true');
            };
        }
    }, 15000);
    
    // Play special dragon roar sound
    try {
        const roarSound = new Audio('audio/dragon-roar.mp3');
        roarSound.volume = 0.4;
        roarSound.play().catch(e => console.log('Dragon roar sound not played:', e));
    } catch (err) {
        console.log('Audio playback not supported');
    }
    
    // Create confetti effect
    createConfettiEffect();
    
    // Mark notification as shown
    localStorage.setItem('emberDragonNotificationShown', 'true');
    localStorage.removeItem('emberDragonNotificationNeeded');
}

// ...existing code...

// Also add this check to show notifications when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we need to show an Ember Dragon notification (e.g., if redemption happened on another page)
    if (localStorage.getItem('emberDragonNotificationNeeded') === 'true' && 
        localStorage.getItem('emberDragonNotificationShown') !== 'true') {
        // Wait a moment to let the page load completely
        setTimeout(showEmberDragonNotification, 1000);
    }
});

// ...existing code...

// Add this function to force promo code application
function forceApplyPromoCode(code) {
    console.log("Force applying promo code: " + code);
    
    if (code === 'Thanks4Helping') {
        // Show debug info about current values
        console.log("Before applying Ember Dragon promo:");
        console.log("- Permanent bonus:", localStorage.getItem('permanentPointsBonus'));
        console.log("- Click multiplier:", localStorage.getItem('clickMultiplier'));
        console.log("- Auto multiplier:", localStorage.getItem('autoClickerMultiplier'));
        console.log("- Equipped pet:", localStorage.getItem('equippedPet'));
        
        // Set all required values directly
        localStorage.setItem('permanentPointsBonus', '0.25');
        localStorage.setItem('clickMultiplier', '2');
        localStorage.setItem('autoClickerMultiplier', '2');
        
        // Add to used codes if not already there
        const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
        if (!usedCodes.includes('Thanks4Helping')) {
            usedCodes.push('Thanks4Helping');
            localStorage.setItem('usedPromoCodes', JSON.stringify(usedCodes));
        }
        
        // Force pet setup
        setupEmberDragonComplete();
        
        // Show notification
        showEmberDragonNotification();
        
        // Log all changes
        console.log("After applying Ember Dragon promo:");
        console.log("- Permanent bonus:", localStorage.getItem('permanentPointsBonus'));
        console.log("- Click multiplier:", localStorage.getItem('clickMultiplier'));
        console.log("- Auto multiplier:", localStorage.getItem('autoClickerMultiplier'));
        console.log("- Equipped pet:", localStorage.getItem('equippedPet'));
        
        // Verify the image is created
        if (!localStorage.getItem('emberDragonImage')) {
            createEmberDragonImage();
        }
        
        return "Ember the Legendary Dragon has joined your team! All bonuses applied.";
    }
    
    return "Unknown promo code.";
}

// More thorough Ember Dragon setup
function setupEmberDragonComplete() {
    console.log("Setting up Ember Dragon completely...");
    
    // Create image if needed
    if (!localStorage.getItem('emberDragonImage')) {
        createEmberDragonImage();
    }
    
    // Get the dragon image
    const dragonImage = localStorage.getItem('emberDragonImage');
    
    // Set up shop inventory
    const inventory = JSON.parse(localStorage.getItem('shopInventory') || '{"pets":[]}');
    
    // Remove any existing Ember Dragon to avoid duplicates
    inventory.pets = inventory.pets.filter(pet => pet.name !== 'Ember the Legendary Dragon');
    
    // Add updated Ember Dragon pet
    inventory.pets.push({
        name: 'Ember the Legendary Dragon',
        icon: dragonImage,
        imageData: dragonImage,
        rarity: 5,
        tier: 'legendary',
        description: 'A legendary dragon that commands the power of infernal flames',
        perk: '+2.0 cookies/second, doubles click power, 15% chance for 5x critical hits, 25% permanent points bonus',
        bonusCPS: 2.0,
        critChance: 0.15,
        critMultiplier: 5,
        clickMultiplier: 2.0,
        permanentBonus: 0.25
    });
    
    // Save inventory
    localStorage.setItem('shopInventory', JSON.stringify(inventory));
    
    // Set active pet
    localStorage.setItem('equippedPet', 'Ember the Legendary Dragon');
    
    // Set all pet-related bonuses
    localStorage.setItem('petBonusCPS', '2.0');
    localStorage.setItem('petCritChance', '0.15');
    localStorage.setItem('petCritMultiplier', '5');
    localStorage.setItem('petClickBonus', '2.0');
    localStorage.setItem('petProductionBonus', '0.25');
    
    // Set global multipliers
    localStorage.setItem('clickMultiplier', '2.0');
    localStorage.setItem('autoClickerMultiplier', '2.0');
    localStorage.setItem('permanentPointsBonus', '0.25');
    
    console.log("Ember Dragon setup complete!");
    
    // Update status display if available
    if (window.statusDisplay && typeof window.statusDisplay.updateStatusDisplay === 'function') {
        window.statusDisplay.updateStatusDisplay();
    }
}

// Function to create Ember Dragon image
function createEmberDragonImage() {
    console.log("Creating Ember Dragon image...");
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Create a gradient background
    const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 70);
    gradient.addColorStop(0, '#FF5722');
    gradient.addColorStop(1, '#BF360C');
    
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    // Draw dragon silhouette
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.bezierCurveTo(50, 30, 70, 30, 80, 40);
    ctx.bezierCurveTo(90, 50, 90, 70, 80, 80);
    ctx.bezierCurveTo(70, 90, 50, 90, 40, 80);
    ctx.bezierCurveTo(30, 70, 30, 50, 40, 40);
    ctx.fill();
    
    // Draw dragon eyes
    ctx.fillStyle = '#FFEB3B';
    ctx.beginPath();
    ctx.arc(55, 50, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(75, 50, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Add fire effect
    ctx.fillStyle = '#FFEB3B';
    ctx.beginPath();
    ctx.moveTo(64, 35);
    ctx.lineTo(50, 10);
    ctx.lineTo(64, 20);
    ctx.lineTo(78, 10);
    ctx.lineTo(64, 35);
    ctx.fill();
    
    // Convert to data URL and save
    const imageUrl = canvas.toDataURL('image/png');
    localStorage.setItem('emberDragonImage', imageUrl);
    console.log("Ember Dragon image created!");
    
    return imageUrl;
}

// Remove the fix promo button when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Remove any fix buttons that might exist
    const fixButton = document.getElementById('fixPromoButton');
    if (fixButton && fixButton.parentNode) {
        fixButton.parentNode.removeChild(fixButton);
    }
});

// ...existing code...
