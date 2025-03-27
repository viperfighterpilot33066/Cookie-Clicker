// New file to handle pets consistently across all pages

// Global pet management system
class PetSystem {
    constructor() {
        this.init();
    }

    init() {
        // Check if notification has been shown
        const notificationShown = localStorage.getItem('emberDragonNotificationShown');
        const petAdded = this.isPetInInventory('Ember the Legendary Dragon');
        
        if (petAdded && !notificationShown) {
            // Show notification only once
            const dragonImage = localStorage.getItem('emberDragonImage');
            if (dragonImage) {
                this.showPetNotification(dragonImage);
                localStorage.setItem('emberDragonNotificationShown', 'true');
            }
        }
        
        // Ensure pet is properly registered
        this.ensureEmberDragonIsSetup();

        // Fix missing images by regenerating them if they're missing
        this.fixMissingPetImages();
        
        // Ensure ember dragon image exists and is properly set
        this.ensureDragonImageExists();

        // Fix any existing inventory display issues
        this.fixInventoryDisplayIssues();
    }
    
    // Add a method to ensure the dragon image exists
    ensureDragonImageExists() {
        // First check if we already have the image
        const emberImage = localStorage.getItem('emberDragonImage');
        if (!emberImage) {
            console.log("Creating ember dragon image as it's missing");
            this.createEmberDragonImageFallback();
            
            // After creating the image, update any inventory references
            this.updateInventoryWithDragonImage();
        } else {
            // If we have the image, ensure inventory references are correct
            this.updateInventoryWithDragonImage();
        }
    }
    
    updateInventoryWithDragonImage() {
        const emberImage = localStorage.getItem('emberDragonImage');
        if (!emberImage) return; // Safety check
        
        const inventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
        
        // Find the Ember Dragon in inventory and update its image
        const emberPet = inventory.pets.find(pet => pet.name === 'Ember the Legendary Dragon');
        if (emberPet) {
            emberPet.icon = emberImage;
            emberPet.imageData = emberImage;
            localStorage.setItem('shopInventory', JSON.stringify(inventory));
            console.log("Updated Ember Dragon image in inventory");
        }
    }

    // New method to fix missing pet images
    fixMissingPetImages() {
        // Check specifically for Ember Dragon
        const inventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
        const emberPet = inventory.pets.find(pet => pet.name === 'Ember the Legendary Dragon');
        
        if (emberPet && (!emberPet.icon || !emberPet.imageData)) {
            console.log("Fixing missing Ember Dragon image...");
            this.createEmberDragonImageFallback();
            
            // Update the pet in inventory
            const emberImage = localStorage.getItem('emberDragonImage');
            if (emberImage) {
                emberPet.icon = emberImage;
                emberPet.imageData = emberImage;
                localStorage.setItem('shopInventory', JSON.stringify(inventory));
                console.log("Ember Dragon image has been restored");
            }
        }
    }
    
    isPetInInventory(petName) {
        const inventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
        return inventory.pets.some(pet => pet.name === petName);
    }
    
    ensureEmberDragonIsSetup() {
        // Check if dragon promo was used but pet isn't properly configured
        const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes')) || [];
        if (usedCodes.includes('Thanks4Helping')) {
            this.setupEmberDragon();
        }
    }

    // New method to fix any display issues in the inventory
    fixInventoryDisplayIssues() {
        const inventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
        let hasChanged = false;
        
        // Check for pets with undefined values or missing fields
        inventory.pets = inventory.pets.map(pet => {
            // Fix Ember Dragon specifically
            if (pet.name === 'Ember the Legendary Dragon') {
                hasChanged = true;
                const emberImage = localStorage.getItem('emberDragonImage');
                
                return {
                    name: 'Ember the Legendary Dragon',
                    icon: emberImage,
                    imageData: emberImage,
                    rarity: 5,
                    tier: 'legendary',
                    description: 'A legendary dragon that commands the power of infernal flames',
                    perk: '+2.0 cookies/second, doubles click power, 15% chance for 5x critical hits',
                    bonusCPS: 2.0,
                    clickMultiplier: 2.0,
                    critChance: 0.15,
                    critMultiplier: 5,
                    equipped: pet.equipped || false
                };
            }
            return pet;
        });
        
        if (hasChanged) {
            localStorage.setItem('shopInventory', JSON.stringify(inventory));
            console.log("Fixed inventory display issues");
        }
    }
    
    setupEmberDragon() {
        // Create the image if it doesn't exist
        if (!localStorage.getItem('emberDragonImage')) {
            if (typeof createEmberDragonImage === 'function') {
                createEmberDragonImage();
            } else {
                this.createEmberDragonImageFallback();
            }
        }
        
        // Set up pet data
        const inventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
        
        // Remove any existing version to avoid duplicates
        const filteredPets = inventory.pets.filter(pet => pet.name !== 'Ember the Legendary Dragon');
        
        // Add the enhanced pet with correct bonuses and image
        const emberImage = localStorage.getItem('emberDragonImage');
        filteredPets.push({
            name: 'Ember the Legendary Dragon',
            icon: emberImage,
            imageData: emberImage,
            rarity: 5,
            tier: 'legendary',
            description: 'A legendary dragon that commands the power of infernal flames',
            perk: '+2.0 cookies/second, doubles click power, 15% chance for 5x critical hits',
            bonusCPS: 2.0,
            clickMultiplier: 2.0,
            critChance: 0.15,
            critMultiplier: 5,
            equipped: true
        });
        
        inventory.pets = filteredPets;
        localStorage.setItem('shopInventory', JSON.stringify(inventory));
        
        // Set active pet data
        localStorage.setItem('equippedPet', 'Ember the Legendary Dragon');
        localStorage.setItem('petBonusCPS', 2.0);
        localStorage.setItem('petClickBonus', 2.0);
        localStorage.setItem('petCritChance', 0.15);
        localStorage.setItem('petCritMultiplier', 5);
        localStorage.setItem('clickMultiplier', 2.0);
        localStorage.setItem('autoClickerMultiplier', 2.0);
        localStorage.setItem('petProductionBonus', 0.25); // Add the 25% bonus
    }
    
    createEmberDragonImageFallback() {
        // Create a more visible dragon image
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Improved dragon image with better visibility
        // Red-orange gradient background
        const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 70);
        gradient.addColorStop(0, '#FF5722');
        gradient.addColorStop(1, '#BF360C');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        
        // Dragon body (better defined)
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.moveTo(40, 40);
        ctx.bezierCurveTo(50, 30, 70, 30, 80, 40);
        ctx.bezierCurveTo(90, 50, 90, 70, 80, 80);
        ctx.bezierCurveTo(70, 90, 50, 90, 40, 80);
        ctx.bezierCurveTo(30, 70, 30, 50, 40, 40);
        ctx.fill();
        
        // Dragon wings
        ctx.beginPath();
        ctx.moveTo(30, 50);
        ctx.bezierCurveTo(10, 30, 20, 10, 40, 20);
        ctx.bezierCurveTo(50, 30, 40, 40, 30, 50);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(90, 50);
        ctx.bezierCurveTo(110, 30, 100, 10, 80, 20);
        ctx.bezierCurveTo(70, 30, 80, 40, 90, 50);
        ctx.fill();
        
        // Dragon eyes (glowing yellow)
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.arc(55, 50, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(75, 50, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Fire breath
        ctx.beginPath();
        ctx.moveTo(64, 35);
        for(let i = 0; i < 5; i++) {
            const x = 60 - 15 * Math.cos(i * Math.PI / 2.5);
            const y = 30 - 15 * Math.sin(i * Math.PI / 2.5) - i * 3;
            ctx.lineTo(x, y);
        }
        for(let i = 5; i >= 0; i--) {
            const x = 70 + 15 * Math.cos(i * Math.PI / 2.5);
            const y = 30 - 15 * Math.sin(i * Math.PI / 2.5) - i * 2;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        
        const fireGradient = ctx.createLinearGradient(60, 40, 60, 0);
        fireGradient.addColorStop(0, '#FF5722');
        fireGradient.addColorStop(0.5, '#FFEB3B');
        fireGradient.addColorStop(1, '#FFEB3B');
        ctx.fillStyle = fireGradient;
        ctx.fill();
        
        // Convert to an image
        const imageUrl = canvas.toDataURL('image/png');
        localStorage.setItem('emberDragonImage', imageUrl);
    }

    showPetNotification(petImageUrl) {
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
        
        // Create description
        const desc = document.createElement('p');
        desc.innerHTML = '<strong>Legendary Pet Obtained!</strong><br>+2 cookies/sec, doubles clicks, 15% chance for 5x crits!';
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
}

// Initialize the pet system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure we clean up the inventory first to fix any display issues
    const petSystem = new PetSystem();
    window.petSystem = petSystem;
});

// Even before DOM is loaded, fix the inventory data to prevent display issues
(function() {
    try {
        const inventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
        const emberPet = inventory.pets.find(pet => pet.name === 'Ember the Legendary Dragon');
        
        // If the dragon exists but has undefined parts, fix it
        if (emberPet && 
            (emberPet.description === undefined || 
             emberPet.icon === undefined || 
             emberPet.perk === undefined)) {
            
            console.log("Pre-load fix: Found Ember Dragon with undefined parts");
            
            // Get the image data or create it
            let emberImage = localStorage.getItem('emberDragonImage');
            if (!emberImage) {
                // We'll create a temporary image here for immediate use
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FF5722';
                ctx.fillRect(0, 0, 128, 128);
                emberImage = canvas.toDataURL('image/png');
                localStorage.setItem('emberDragonImage', emberImage);
            }
            
            // Fix the pet data
            emberPet.icon = emberImage;
            emberPet.imageData = emberImage;
            emberPet.rarity = 5;
            emberPet.tier = 'legendary';
            emberPet.description = 'A legendary dragon that commands the power of infernal flames';
            emberPet.perk = '+2.0 cookies/second, doubles click power, 15% chance for 5x critical hits';
            
            // Save the fixed inventory
            localStorage.setItem('shopInventory', JSON.stringify(inventory));
            console.log("Pre-load fix: Ember Dragon data repaired");
        }
    } catch (e) {
        console.error("Error in pre-load pet system fix:", e);
    }
})();
