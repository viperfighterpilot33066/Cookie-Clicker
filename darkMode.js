// Global dark mode handler to ensure consistency across all pages

// This function initializes dark mode based on localStorage
function initDarkMode() {
    // Apply dark mode setting from localStorage immediately on page load
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    applyTheme(isDarkMode);
    
    // Handle any dark mode toggles in the document
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkMode;
        
        darkModeToggle.addEventListener('change', () => {
            const enabled = darkModeToggle.checked;
            localStorage.setItem('darkMode', enabled);
            applyTheme(enabled);
            
            // Broadcast a custom event so other components can react to theme change
            document.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { darkMode: enabled } 
            }));
        });
    }
}

// Apply the theme to both html and body elements to ensure it works across all pages
function applyTheme(isDark) {
    // Set data attribute on document element for CSS selectors
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', isDark);
    
    // Apply specific styles for better dark mode coverage
    if (isDark) {
        // Darker background and lighter text for better contrast
        document.body.style.backgroundColor = '#121212';
        document.body.style.color = '#f0f0f0';
        
        // Apply dark styles to common UI elements
        applyDarkStylesToElements();
    } else {
        // Reset inline styles when switching to light mode
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        
        // Remove dark styles from elements
        removeInlineDarkStyles();
    }
}

// Apply dark styles to common UI elements
function applyDarkStylesToElements() {
    // Apply to cards, containers, and other common elements
    const elementsToStyle = document.querySelectorAll('.shop-item, .inventory-item, .power-up-card, .achievement, #leaderboardDisplay, .modal-content, .status-bar');
    
    elementsToStyle.forEach(element => {
        // Skip elements that should maintain their own styling
        if (element.classList.contains('dark-mode-exempt')) return;
        
        element.style.backgroundColor = '#1e1e1e';
        element.style.color = '#e0e0e0';
        element.style.borderColor = '#333';
    });
    
    // Style inputs and buttons
    const inputsAndButtons = document.querySelectorAll('input, button:not(.dark-mode-exempt)');
    inputsAndButtons.forEach(element => {
        element.style.backgroundColor = '#2d2d2d';
        element.style.color = '#e0e0e0';
        element.style.borderColor = '#444';
    });
    
    // Improve visibility of specific elements
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
        heading.style.color = '#f0f0f0';
    });
    
    // Style paragraphs and spans for better contrast
    const textElements = document.querySelectorAll('p, span:not(.dark-mode-exempt)');
    textElements.forEach(element => {
        if (!element.closest('.dark-mode-exempt')) {
            element.style.color = '#cccccc';
        }
    });
    
    // Ensure cookie and other game elements are visible
    const gameElements = document.querySelectorAll('#cookie, #autoClicker, #CurserUpgrade');
    gameElements.forEach(element => {
        element.style.backgroundColor = '#2d2d2d';
        element.style.borderColor = '#444';
    });
}

// Remove inline dark styles
function removeInlineDarkStyles() {
    const styledElements = document.querySelectorAll('.shop-item, .inventory-item, .power-up-card, .achievement, #leaderboardDisplay, .modal-content, .status-bar, input, button, h1, h2, h3, p, span, #cookie, #autoClicker, #CurserUpgrade');
    
    styledElements.forEach(element => {
        // Skip elements that should maintain their own styling
        if (element.classList.contains('dark-mode-exempt')) return;
        
        element.style.backgroundColor = '';
        element.style.color = '';
        element.style.borderColor = '';
    });
}

// Listen for storage changes from other tabs/windows
window.addEventListener('storage', (event) => {
    if (event.key === 'darkMode') {
        applyTheme(event.newValue === 'true');
        
        // Update toggle if it exists
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = event.newValue === 'true';
        }
    }
});

// Apply theme immediately before DOM content loads to prevent flash
(function() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.write('<style>body { background-color: #121212 !important; color: #f5f5f5 !important; } html { background-color: #121212 !important; }</style>');
    }
})();

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initDarkMode);

// Observe DOM changes and apply dark mode to dynamically added elements
const observer = new MutationObserver((mutations) => {
    if (localStorage.getItem('darkMode') === 'true') {
        applyDarkStylesToElements();
    }
});

// Start observing DOM changes once the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { 
        childList: true,
        subtree: true
    });
});

// Export for use in other scripts
window.darkMode = {
    toggle: function() {
        const current = localStorage.getItem('darkMode') === 'true';
        localStorage.setItem('darkMode', !current);
        applyTheme(!current);
        return !current;
    },
    enable: function() {
        localStorage.setItem('darkMode', true);
        applyTheme(true);
    },
    disable: function() {
        localStorage.setItem('darkMode', false);
        applyTheme(false);
    },
    isEnabled: function() {
        return localStorage.getItem('darkMode') === 'true';
    }
};
