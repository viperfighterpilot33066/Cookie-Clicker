/**
 * Event Cleanup
 * Prevents duplicate event handlers and click issues
 */
(function() {
    // Track if we've cleaned up handlers already
    let hasCleanedHandlers = false;

    // Run when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initial cleanup after short delay
        setTimeout(cleanupEventHandlers, 500);
        
        // Listen for authentication events
        listenForAuthEvents();
        
        // Set up a MutationObserver to detect DOM changes
        setupMutationObserver();
        
        // As a fallback, periodically check for duplicates
        setInterval(checkForDuplicateHandlers, 3000);
    });
    
    // Listen for custom auth events and storage changes
    function listenForAuthEvents() {
        // Listen for authentication state changes in localStorage
        window.addEventListener('storage', function(e) {
            if (e.key === 'userName' || e.key === 'userId') {
                console.log('Auth state changed, cleaning up handlers');
                setTimeout(cleanupEventHandlers, 200);
            }
        });
        
        // Listen for custom auth events that might be dispatched
        document.addEventListener('userAuthenticated', function() {
            console.log('User authenticated event detected, cleaning up handlers');
            setTimeout(cleanupEventHandlers, 200);
        });
    }
    
    // Setup MutationObserver to detect when the cookie element might be replaced
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // If anything was added to the body, check if we need to clean up
                    setTimeout(checkForDuplicateHandlers, 100);
                }
            }
        });
        
        // Start observing the body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    function checkForDuplicateHandlers() {
        const cookie = document.getElementById('cookie');
        if (!cookie) return;
        
        // Use a click test element to detect multiple handlers
        try {
            // Flag to track if we've already run cleanup recently
            if (hasCleanedHandlers) {
                if (Date.now() - window._lastCleanupTime < 5000) return;
            }
            
            // Check if we need to clean up
            cleanupEventHandlers();
        } catch (e) {
            console.error('Error checking for duplicate handlers:', e);
        }
    }
    
    function cleanupEventHandlers() {
        // Get cookie element
        const cookie = document.getElementById('cookie');
        if (!cookie) return;
        
        console.log('Cleaning up duplicate click handlers...');
        
        // Clone the cookie to remove all event listeners
        const oldCookie = cookie;
        const newCookie = oldCookie.cloneNode(true);
        
        // Add a single unified click handler
        newCookie.addEventListener('click', handleUnifiedCookieClick);
        
        // Replace the old cookie with the new one
        if (oldCookie.parentNode) {
            oldCookie.parentNode.replaceChild(newCookie, oldCookie);
            console.log('Replaced cookie element to clean up event handlers');
            
            // Track when we last cleaned up
            window._lastCleanupTime = Date.now();
            hasCleanedHandlers = true;
        }
        
        // Store a reference to the cookie element globally
        window._cookieElement = newCookie;
    }
    
    function handleUnifiedCookieClick(e) {
        // Calculate points
        const cursorUpgradeActive = parseInt(localStorage.getItem('cursorUpgradeActive')) || 0;
        const clickMultiplier = parseFloat(localStorage.getItem('clickMultiplier')) || 1;
        let pointsToAdd = (1 + cursorUpgradeActive) * clickMultiplier;
        
        // Apply permanent bonus
        const permanentBonus = parseFloat(localStorage.getItem('permanentPointsBonus')) || 0;
        if (permanentBonus > 0) {
            pointsToAdd *= (1 + permanentBonus);
        }
        
        // Add points using PointsManager if available
        if (window.PointsManager && typeof window.PointsManager.addPoints === 'function') {
            window.PointsManager.addPoints(Math.floor(pointsToAdd));
        } else {
            // Fallback to direct localStorage method
            const currentPoints = parseInt(localStorage.getItem('points')) || 0;
            localStorage.setItem('points', currentPoints + Math.floor(pointsToAdd));
            
            // Update UI - IMPORTANT: Only update the points display, not points per click
            // const pointsValue = document.getElementById('pointsValue');
            // if (pointsValue) {
            //     pointsValue.textContent = currentPoints + Math.floor(pointsToAdd);
            // }
        }
        
        // Track total clicks
        const totalClicks = parseInt(localStorage.getItem('totalClicks') || '0') + 1;
        localStorage.setItem('totalClicks', totalClicks);
        
        // Forward event to click effects if available
        if (window.clickEffects && typeof window.clickEffects.createClickEffect === 'function') {
            window.clickEffects.createClickEffect(e.pageX, e.pageY);
        }
        
        // Play click sound
        if (window.AudioHelper && typeof window.AudioHelper.playClickSound === 'function') {
            window.AudioHelper.playClickSound(0.3);
        }
        
        // Create visual feedback for the click
        createClickVisualFeedback(e);
    }
    
    // Simple visual feedback for clicks
    function createClickVisualFeedback(e) {
        const cookie = e.currentTarget;
        
        // Create a ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255,255,255,0.4)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.left = (e.offsetX - 10) + 'px';
        ripple.style.top = (e.offsetY - 10) + 'px';
        ripple.style.pointerEvents = 'none';
        
        cookie.appendChild(ripple);
        
        // Animate and remove
        const anim = ripple.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(3)', opacity: 0 }
        ], { duration: 600 });
        
        anim.onfinish = () => ripple.remove();
    }
})();
