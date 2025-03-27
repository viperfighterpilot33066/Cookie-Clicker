/**
 * Changelog System
 * Shows updates to users who haven't seen them yet
 */

class ChangelogSystem {
    constructor() {
        // Check changelog.txt modification time rather than using a fixed version
        this.forceRefresh = true; // Always check for changes
        this.changelogLastShown = localStorage.getItem('changelogLastShown') || '0';
        
        // Only check if we need to show the changelog once per session
        const sessionKey = 'changelogCheckedThisSession';
        if (sessionStorage.getItem(sessionKey) && !this.forceRefresh) {
            return; // Already checked this session
        }
        sessionStorage.setItem(sessionKey, 'true');
        
        // Load and check changelog immediately
        this.init();
    }
    
    init() {
        // Wait for DOM to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.fetchChangelogWithTimestamp());
        } else {
            this.fetchChangelogWithTimestamp();
        }
    }
    
    fetchChangelogWithTimestamp() {
        // Add cache-busting parameter to force reload of the changelog file
        const cacheBuster = `?_=${Date.now()}`;
        
        // First, get the file timestamp using HEAD request
        fetch(`changelog.txt${cacheBuster}`, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load changelog');
                }
                
                // Get last modified date from header or current time if not available
                const lastModified = response.headers.get('Last-Modified') || new Date().toUTCString();
                const fileTimestamp = new Date(lastModified).getTime();
                
                console.log(`Changelog file timestamp: ${fileTimestamp}`);
                console.log(`Last shown timestamp: ${this.changelogLastShown}`);
                
                // Compare to last shown timestamp
                if (fileTimestamp > parseInt(this.changelogLastShown)) {
                    // Changelog has been modified, load content
                    this.loadChangelogContent(cacheBuster, fileTimestamp);
                } else {
                    console.log("Changelog hasn't been updated since last shown");
                }
                
                return fileTimestamp;
            })
            .catch(error => {
                console.error('Error checking changelog timestamp:', error);
                // Try loading content directly as fallback
                this.loadChangelogContent(cacheBuster);
            });
    }
    
    loadChangelogContent(cacheBuster, fileTimestamp) {
        fetch(`changelog.txt${cacheBuster}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load changelog content');
                }
                return response.text();
            })
            .then(data => {
                const changelogData = this.parseChangelog(data);
                if (changelogData && changelogData.length > 0) {
                    this.showChangelogPopup(fileTimestamp || Date.now());
                }
            })
            .catch(error => {
                console.error('Error loading changelog content:', error);
            });
    }
    
    parseChangelog(changelogText) {
        // Simple parser for the format Version X.X.X - Date \n - Change \n - Change
        const versions = [];
        let currentVersion = null;
        
        const lines = changelogText.split('\n');
        
        for (const line of lines) {
            // Skip empty lines
            if (!line.trim()) continue;
            
            // Check if this is a version line
            if (line.trim().startsWith('Version')) {
                // Extract version number and date
                const match = line.match(/Version\s+(\d+\.\d+\.\d+)\s+-\s+(.*)/);
                if (match) {
                    currentVersion = {
                        version: match[1],
                        date: match[2],
                        changes: []
                    };
                    versions.push(currentVersion);
                }
            } else if (currentVersion && line.trim().startsWith('-')) {
                // This is a change item
                currentVersion.changes.push(line.trim().substring(1).trim());
            }
        }
        
        // Save the parsed changelog data for rendering
        this.changelogData = versions;
        return versions;
    }
    
    showChangelogPopup(timestamp) {
        if (!this.changelogData || this.changelogData.length === 0) return;
        
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'changelog-modal';
        modal.innerHTML = `
            <div class="changelog-container">
                <h2>What's New</h2>
                <div class="changelog-content">
                    ${this.renderChangelog()}
                </div>
                <button id="changelogDismiss">Nice!</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .changelog-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease-out;
            }
            
            .changelog-container {
                background-color: #fff;
                border-radius: 10px;
                padding: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            }
            
            [data-theme="dark"] .changelog-container {
                background-color: #333;
                color: #f0f0f0;
            }
            
            .changelog-container h2 {
                margin-top: 0;
                color: #4CAF50;
                text-align: center;
                border-bottom: 2px solid #4CAF50;
                padding-bottom: 10px;
            }
            
            .changelog-content {
                max-height: 60vh;
                overflow-y: auto;
                margin-bottom: 20px;
                padding-right: 10px;
            }
            
            .changelog-version {
                margin-top: 20px;
                margin-bottom: 10px;
            }
            
            .changelog-version:first-child {
                margin-top: 0;
            }
            
            .changelog-version h3 {
                margin-bottom: 5px;
                color: #2196F3;
            }
            
            [data-theme="dark"] .changelog-version h3 {
                color: #64B5F6;
            }
            
            .changelog-changes {
                margin-left: 20px;
                padding-left: 0;
            }
            
            .changelog-change {
                margin-bottom: 5px;
                position: relative;
                padding-left: 20px;
                list-style-type: none;
            }
            
            .changelog-change::before {
                content: "•";
                position: absolute;
                left: 0;
                color: #4CAF50;
            }
            
            #changelogDismiss {
                display: block;
                width: 100%;
                padding: 12px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s;
            }
            
            #changelogDismiss:hover {
                background-color: #3e8e41;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            /* Scrollbar styling */
            .changelog-content::-webkit-scrollbar {
                width: 8px;
            }
            
            .changelog-content::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }
            
            .changelog-content::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }
            
            .changelog-content::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
            
            [data-theme="dark"] .changelog-content::-webkit-scrollbar-track {
                background: #444;
            }
            
            [data-theme="dark"] .changelog-content::-webkit-scrollbar-thumb {
                background: #666;
            }
            
            [data-theme="dark"] .changelog-content::-webkit-scrollbar-thumb:hover {
                background: #888;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Add dismiss handler
        document.getElementById('changelogDismiss').addEventListener('click', () => {
            modal.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(modal);
                // Save the timestamp to localStorage
                localStorage.setItem('changelogLastShown', timestamp || Date.now());
            }, 300);
        });
    }
    
    renderChangelog() {
        let html = '';
        
        // Only show the last 3 versions
        const versionsToShow = this.changelogData.slice(0, 3);
        
        for (const versionInfo of versionsToShow) {
            html += `
                <div class="changelog-version">
                    <h3>Version ${versionInfo.version} - ${versionInfo.date}</h3>
                    <ul class="changelog-changes">
                        ${versionInfo.changes.map(change => `
                            <li class="changelog-change">${change}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        return html;
    }
    
    // Force show the changelog (for testing)
    static forceShow() {
        // Clear stored changelog version to force it to show
        localStorage.removeItem('changelogLastShown');
        sessionStorage.removeItem('changelogCheckedThisSession');
        
        // Create new instance to load and show the changelog
        new ChangelogSystem();
    }
}

// Initialize changelog system
const changelogSystem = new ChangelogSystem();

// Add a global function for testing
window.forceShowChangelog = ChangelogSystem.forceShow;
