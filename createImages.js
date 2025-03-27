// This script creates missing images dynamically

document.addEventListener('DOMContentLoaded', function() {
    // Create Speed Booster image
    createSpeedBoosterImage();
    
    // Check if we need to create the dragon image
    const emberImageNeeded = localStorage.getItem('emberDragonImage') === null && 
                             localStorage.getItem('equippedPet') === 'Ember the Legendary Dragon';
    
    if (emberImageNeeded) {
        createEmberDragonImage();
    }
    
    // Setup the dragon pet in the game
    setupEmberDragonPet();

    // Create Cost Reducer image
    createCostReducerImage();
});

// Add error handling for missing image files
function createSpeedBoosterImage() {
    try {
        console.log("Speed Booster image doesn't exist, creating one...");
        
        // Create canvas for the image
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 100);
        gradient.addColorStop(0, '#F44336'); // Red
        gradient.addColorStop(1, '#D32F2F'); // Darker red
        
        // Fill background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 100, 100);
        
        // Add lightning bolt icon
        ctx.fillStyle = '#FFEB3B'; // Yellow
        ctx.beginPath();
        ctx.moveTo(60, 20);
        ctx.lineTo(40, 55);
        ctx.lineTo(55, 55);
        ctx.lineTo(40, 80);
        ctx.lineTo(70, 45);
        ctx.lineTo(55, 45);
        ctx.lineTo(60, 20);
        ctx.closePath();
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = '#FFCA28';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#FFEB3B';
        ctx.shadowBlur = 15;
        ctx.stroke();
        
        // Convert to image URL and store
        const imageUrl = canvas.toDataURL('image/png');
        localStorage.setItem('speedBoosterImg', imageUrl);
        
        console.log("Speed Booster image created successfully");
        return imageUrl;
        
    } catch (error) {
        console.error("Error creating Speed Booster image:", error);
        // Return a fallback - simple colored square
        return createFallbackImage('#F44336', 'SB');
    }
}

// Add a fallback image generator
function createFallbackImage(color, text) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        // Fill with color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 100, 100);
        
        // Add text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 50, 50);
        
        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error("Error creating fallback image:", error);
        return '';
    }
}

// Function to create the dragon image
function createEmberDragonImage() {
    console.log("Creating Ember Dragon image...");
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
    ctx.moveTo(60, 40);
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
    
    // Save the image URL to localStorage for persistence
    localStorage.setItem('emberDragonImage', imageUrl);
    console.log('Ember Dragon image created and saved to localStorage');
    
    // Update all instances of this image on the page
    updateDragonImages(imageUrl);
}

// Function to update all dragon images on the page
function updateDragonImages(imageUrl) {
    // Update any existing pet images
    const shopInventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
    const emberPet = shopInventory.pets.find(pet => pet.name === 'Ember the Legendary Dragon');
    if (emberPet) {
        emberPet.icon = imageUrl;
        emberPet.imageData = imageUrl;
        localStorage.setItem('shopInventory', JSON.stringify(shopInventory));
    }
    
    // If we have the pet system available, use it to setup the dragon
    if (window.petSystem) {
        window.petSystem.setupEmberDragon();
    }
}

// Function to set up the dragon as a real pet in the game system
function setupEmberDragonPet() {
    // CRITICAL: Check if the dragon is blocked by initializer
    if (localStorage.getItem('emberDragonBlocked') === 'true') {
        console.log("Ember Dragon setup blocked by game initializer - unauthorized promo");
        return;
    }

    // Check if we have the proper promo code
    const usedCodes = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
    const hasEmberDragonCode = usedCodes.includes('Thanks4Helping');
    
    if (!hasEmberDragonCode) {
        console.log("Ember Dragon setup skipped - missing promo code");
        return;
    }
    
    const inventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
    
    // Check if Ember Dragon already exists
    const emberExists = inventory.pets.some(pet => pet.name === 'Ember the Legendary Dragon');
    
    if (!emberExists) {
        const emberImage = localStorage.getItem('emberDragonImage');
        
        // Add the pet with detailed perks that will be visible in shop/inventory
        inventory.pets.push({
            name: 'Ember the Legendary Dragon',
            icon: emberImage,
            imageData: emberImage, // Store the actual image data
            rarity: 5,
            description: 'A legendary dragon that commands the power of infernal flames',
            perk: '+2.0 cookies/second, doubles click power, 15% chance for 5x critical hits',
            bonusCPS: 2.0,
            critChance: 0.15,
            critMultiplier: 5,
            equipped: true
        });
        
        localStorage.setItem('shopInventory', JSON.stringify(inventory));
        
        // Set active pet bonuses
        localStorage.setItem('petBonusCPS', 2.0);
        localStorage.setItem('petCritChance', 0.15);
        localStorage.setItem('petCritMultiplier', 5);
        localStorage.setItem('equippedPet', 'Ember the Legendary Dragon');
        localStorage.setItem('clickMultiplier', 2.0);
        localStorage.setItem('autoClickerMultiplier', 2.0);
        
        console.log('Ember Dragon pet configured in game');
    }
}

// Create a notification to show the player they got a pet
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

// Also add fallback for Cost Reducer image
function createCostReducerImage() {
    try {
        console.log("Cost Reducer image doesn't exist, creating one...");
        
        // Create canvas for the image
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 100);
        gradient.addColorStop(0, '#4CAF50'); // Green
        gradient.addColorStop(1, '#388E3C'); // Darker green
        
        // Fill background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 100, 100);
        
        // Add dollar sign
        ctx.fillStyle = '#FFEB3B'; // Yellow
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 50, 50);
        
        // Add down arrow
        ctx.beginPath();
        ctx.moveTo(30, 70);
        ctx.lineTo(70, 70);
        ctx.lineTo(50, 90);
        ctx.closePath();
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = '#FFCA28';
        ctx.lineWidth = 3;
        ctx.strokeRect(5, 5, 90, 90);
        
        // Convert to image URL and store
        const imageUrl = canvas.toDataURL('image/png');
        localStorage.setItem('costReducerImg', imageUrl);
        
        console.log("Cost Reducer image created successfully");
        return imageUrl;
        
    } catch (error) {
        console.error("Error creating Cost Reducer image:", error);
        // Return a fallback
        return createFallbackImage('#4CAF50', 'CR');
    }
}
