/**
 * Click Effects
 * Handles visual effects and sounds for cookie clicks
 */
class ClickEffects {
    constructor() {
        this.initialize();
        
        // Track if we've already initialized
        this.initialized = false;
    }
    
    initialize() {
        // Prevent duplicate initialization
        if (this.initialized) return;
        this.initialized = true;
        
        // Get the cookie element
        this.cookie = document.getElementById("cookie");
        if (!this.cookie) return;
        
        // CRITICAL: Remove any existing click handlers before adding new ones
        // Clone the cookie element to remove all event listeners
        const oldCookie = this.cookie;
        const newCookie = oldCookie.cloneNode(true);
        oldCookie.parentNode.replaceChild(newCookie, oldCookie);
        this.cookie = newCookie;
        
        // Add our click handler
        this.cookie.addEventListener("click", (e) => this.handleCookieClick(e));
        
        console.log("Click effects initialized");
    }
    
    handleCookieClick(e) {
        // Play click sound
        if (typeof AudioHelper !== 'undefined') {
            AudioHelper.playClickSound(0.3);
        }
        
        // Create visual effect
        this.createClickEffect(e.pageX, e.pageY);
        
        // Calculate points to add
        const cursorUpgradeLevel = parseInt(localStorage.getItem('cursorUpgradeActive')) || 0;
        const clickMultiplier = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
        let pointsToAdd = (1 + cursorUpgradeLevel) * clickMultiplier;
        
        // Check for permanent bonus
        const permanentBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
        if (permanentBonus > 0) {
            pointsToAdd *= (1 + permanentBonus);
        }
        
        // Use PointsManager if available, otherwise fallback to direct localStorage
        if (window.PointsManager && typeof window.PointsManager.addPoints === 'function') {
            window.PointsManager.addPoints(Math.floor(pointsToAdd));
        } else {
            // Fallback method
            const currentPoints = parseInt(localStorage.getItem('points')) || 0;
            localStorage.setItem('points', currentPoints + Math.floor(pointsToAdd));
            this.updatePointsDisplay(currentPoints + Math.floor(pointsToAdd));
        }
        
        // Track total clicks
        const totalClicks = parseInt(localStorage.getItem('totalClicks') || '0') + 1;
        localStorage.setItem('totalClicks', totalClicks);
    }

    // Create particle explosion effect
    createParticles(event, isCritical) {
        const cookie = event.currentTarget;
        const rect = cookie.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const particleCount = isCritical ? 30 : 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            // Set styles for particle
            particle.style.position = 'absolute';
            particle.style.width = (Math.random() * 8 + 3) + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = isCritical ? 
                '#FFD700' : this.colors[Math.floor(Math.random() * this.colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            
            // Start position (relative to cookie)
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            // Append to the cookie (to keep positions relative to cookie)
            cookie.appendChild(particle);
            
            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + (isCritical ? 7 : 3);
            const xVel = Math.cos(angle) * velocity;
            const yVel = Math.sin(angle) * velocity;
            
            // Animation
            const startTime = Date.now();
            const lifetime = Math.random() * 1000 + 500;
            
            const animateParticle = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / lifetime;
                
                if (progress < 1) {
                    const moveX = xVel * progress * 20;
                    const moveY = yVel * progress * 20 + (progress * progress * 60); // Add gravity
                    const scale = 1 - progress;
                    
                    particle.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
                    particle.style.opacity = 1 - progress;
                    
                    requestAnimationFrame(animateParticle);
                } else {
                    cookie.removeChild(particle);
                }
            };
            
            requestAnimationFrame(animateParticle);
        }
    }
    
    // Create ripple effect
    createRipple(event, isCritical) {
        const cookie = event.currentTarget;
        const rect = cookie.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.pointerEvents = 'none';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'transparent';
        
        // Color based on critical
        const color = isCritical ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
        ripple.style.border = `2px solid ${color}`;
        
        cookie.appendChild(ripple);
        
        const startTime = Date.now();
        const animateRipple = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 700;
            
            if (progress < 1) {
                const size = progress * (isCritical ? 150 : 100);
                ripple.style.width = size + 'px';
                ripple.style.height = size + 'px';
                ripple.style.left = (x - size/2) + 'px';
                ripple.style.top = (y - size/2) + 'px';
                ripple.style.opacity = 1 - progress;
                
                requestAnimationFrame(animateRipple);
            } else {
                cookie.removeChild(ripple);
            }
        };
        
        requestAnimationFrame(animateRipple);
    }
    
    // Create number popup showing points
    createNumberPopup(event, points, isCritical) {
        const cookie = event.currentTarget;
        const rect = cookie.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const pointsPopup = document.createElement('div');
        pointsPopup.style.position = 'absolute';
        pointsPopup.style.left = x + 'px';
        pointsPopup.style.top = y + 'px';
        pointsPopup.style.pointerEvents = 'none';
        pointsPopup.style.fontWeight = 'bold';
        pointsPopup.style.fontSize = isCritical ? '24px' : '16px';
        pointsPopup.style.color = isCritical ? '#FFD700' : '#FFFFFF';
        pointsPopup.style.textShadow = isCritical ? 
            '0 0 10px rgba(255, 215, 0, 0.7)' : '0 0 5px rgba(0, 0, 0, 0.7)';
        pointsPopup.style.zIndex = '100';
        pointsPopup.textContent = `+${points}`;
        
        cookie.appendChild(pointsPopup);
        
        const startTime = Date.now();
        const animatePoints = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 1500;
            
            if (progress < 1) {
                pointsPopup.style.transform = `translate(-50%, ${-progress * 50}px) scale(${1 + progress/2})`;
                pointsPopup.style.opacity = 1 - progress;
                
                requestAnimationFrame(animatePoints);
            } else {
                cookie.removeChild(pointsPopup);
            }
        };
        
        requestAnimationFrame(animatePoints);
    }
    
    // Create critical hit effect
    createCriticalEffect(event) {
        const cookie = event.currentTarget;
        
        // Create a flash overlay
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.left = '0';
        flash.style.top = '0';
        flash.style.right = '0';
        flash.style.bottom = '0';
        flash.style.backgroundColor = 'rgba(255, 215, 0, 0.5)';
        flash.style.borderRadius = '50%';
        flash.style.zIndex = '50';
        flash.style.pointerEvents = 'none';
        
        cookie.appendChild(flash);
        
        // Create text effect
        const critText = document.createElement('div');
        critText.style.position = 'absolute';
        critText.style.left = '50%';
        critText.style.top = '50%';
        critText.style.transform = 'translate(-50%, -50%)';
        critText.style.fontWeight = 'bold';
        critText.style.fontSize = '24px';
        critText.style.color = '#FF0000';
        critText.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.7)';
        critText.style.zIndex = '100';
        critText.style.pointerEvents = 'none';
        critText.textContent = 'CRITICAL!';
        
        cookie.appendChild(critText);
        
        // Animate flash
        const startTime = Date.now();
        const animateFlash = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 500;
            
            if (progress < 1) {
                flash.style.opacity = 1 - progress;
                critText.style.transform = `translate(-50%, ${-progress * 30 - 50}%) scale(${1 + progress})`;
                critText.style.opacity = 1 - progress;
                
                requestAnimationFrame(animateFlash);
            } else {
                cookie.removeChild(flash);
                cookie.removeChild(critText);
            }
        };
        
        requestAnimationFrame(animateFlash);
        
        // Also create particles for extra effect
        this.createParticles(event, true);
    }
    
    // Create sparkle effect around the cursor
    createSparkle(event, isCritical) {
        const cookie = event.currentTarget;
        const rect = cookie.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const sparkleCount = isCritical ? 12 : 8;
        const radius = isCritical ? 30 : 20;
        
        for (let i = 0; i < sparkleCount; i++) {
            const angle = (i / sparkleCount) * Math.PI * 2;
            const sparkle = document.createElement('div');
            
            sparkle.style.position = 'absolute';
            sparkle.style.width = '4px';
            sparkle.style.height = '4px';
            sparkle.style.backgroundColor = isCritical ? '#FFD700' : '#FFFFFF';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            
            // Position sparkle in a circle around click point
            const sparkleX = x + Math.cos(angle) * radius;
            const sparkleY = y + Math.sin(angle) * radius;
            
            sparkle.style.left = sparkleX + 'px';
            sparkle.style.top = sparkleY + 'px';
            
            cookie.appendChild(sparkle);
            
            // Animate sparkle
            const startTime = Date.now();
            const lifetime = 1000;
            const animateSparkle = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / lifetime;
                
                if (progress < 1) {
                    const scale = 1 - progress;
                    const distance = radius + (progress * 20);
                    const currentX = x + Math.cos(angle) * distance;
                    const currentY = y + Math.sin(angle) * distance;
                    
                    sparkle.style.left = currentX + 'px';
                    sparkle.style.top = currentY + 'px';
                    sparkle.style.transform = `scale(${1 + progress})`;
                    sparkle.style.opacity = 1 - progress;
                    
                    requestAnimationFrame(animateSparkle);
                } else {
                    cookie.removeChild(sparkle);
                }
            };
            
            requestAnimationFrame(animateSparkle);
        }
    }
}

// Initialize on DOM ready and expose globally
document.addEventListener('DOMContentLoaded', () => {
    // Create singleton instance
    window.clickEffects = new ClickEffects();
});

// Update the critical hit detection in the existing click handler
// This will need to be patched into the shop.js file or wherever click handling occurs
document.addEventListener('DOMContentLoaded', function() {
    // Try to patch the critical detection function
    const originalAddPoints = window.PointsManager?.addPoints;
    
    if (originalAddPoints && typeof originalAddPoints === 'function') {
        window.PointsManager.addPoints = function(amount, sync = true) {
            // Check for critical before calling original function
            const criticalChance = parseFloat(localStorage.getItem('petCriticalChance')) || 0;
            
            if (criticalChance > 0 && Math.random() < criticalChance) {
                // Set a flag that a critical hit has occurred
                localStorage.setItem('criticalHit', 'true');
                
                // Track critical clicks for achievement
                const criticalClicks = parseInt(localStorage.getItem('criticalClicks') || '0') + 1;
                localStorage.setItem('criticalClicks', criticalClicks);
                
                // Apply critical multiplier (usually 3x)
                const critMultiplier = parseFloat(localStorage.getItem('petCritMultiplier')) || 3;
                amount *= critMultiplier;
            }
            
            // Call original function with potentially modified amount
            return originalAddPoints.call(this, amount, sync);
        };
    }
});
