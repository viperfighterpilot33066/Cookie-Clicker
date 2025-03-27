/**
 * Ember Dragon Module
 * Handles the creation and management of the Ember Dragon pet
 */

(function() {
    // Generate the dragon image immediately on script load
    createEmberDragonImage();
    
    // Function to create the Ember Dragon image
    function createEmberDragonImage() {
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
        
        // Convert to an image and save to localStorage
        const imageData = canvas.toDataURL('image/png');
        localStorage.setItem('emberDragonImage', imageData);
        
        // Update any existing references in inventory
        updateEmberDragonReferences(imageData);
    }
    
    // Update all Ember Dragon references in the inventory
    function updateEmberDragonReferences(imageData) {
        const inventory = JSON.parse(localStorage.getItem('shopInventory')) || { pets: [] };
        const emberPet = inventory.pets.find(pet => pet.name === 'Ember the Legendary Dragon');
        
        if (emberPet) {
            emberPet.icon = imageData;
            emberPet.imageData = imageData;
            localStorage.setItem('shopInventory', JSON.stringify(inventory));
            console.log('Updated Ember Dragon image references in inventory');
        }
    }
})();
