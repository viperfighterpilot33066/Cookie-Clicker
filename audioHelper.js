/**
 * Audio Helper Utility
 * Provides graceful fallbacks for audio playback
 */

const AudioHelper = {
    // Sound cache for better performance
    audioCache: {},
    
    // Cache status tracking
    loadedSounds: {},
    
    // Flag to track if audio is available
    audioAvailable: true,
    
    /**
     * Play a sound with error handling and fallbacks
     * @param {string} src - The source URL for the audio file
     * @param {number} volume - Volume from 0 to 1 (default: 0.5)
     * @returns {Promise} - Promise that resolves when audio plays or fails gracefully
     */
    playSound: function(src, volume = 0.5) {
        // Skip if we've detected audio isn't available
        if (!this.audioAvailable) {
            return Promise.resolve(false);
        }
        
        return new Promise((resolve) => {
            try {
                // Check if Web Audio API is supported
                if (!window.AudioContext && !window.webkitAudioContext) {
                    console.log('Web Audio API not supported in this browser');
                    this.audioAvailable = false;
                    resolve(false);
                    return;
                }
                
                // Create audio element
                let audio;
                
                // Try alternate file paths if specific files are known to be troublesome
                if (src === 'sounds/goldencookie.mp3') {
                    const alternates = [
                        'audio/goldencookie.mp3',
                        'audio/click.mp3', // Fallback to click sound
                        'audio/bubblePop.mp3' // Another fallback
                    ];
                    
                    // Try each alternate path
                    for (const altSrc of alternates) {
                        if (this.loadedSounds[altSrc] === true) {
                            src = altSrc;
                            break;
                        }
                    }
                }
                
                // Use cached audio if available
                if (this.audioCache[src]) {
                    audio = this.audioCache[src];
                    audio.currentTime = 0; // Reset to start
                } else {
                    // Check if we've previously tried to load this sound and failed
                    if (this.loadedSounds[src] === false) {
                        resolve(false);
                        return;
                    }
                    
                    audio = new Audio(src);
                    
                    // Handle loading error once to avoid repeated attempts
                    audio.addEventListener('error', (e) => {
                        console.log(`Audio error: Unable to load ${src}`);
                        this.loadedSounds[src] = false;
                        
                        // Try a fallback sound if this is a golden cookie
                        if (src.includes('goldencookie')) {
                            this.playSound('audio/click.mp3', volume).then(resolve);
                        } else {
                            resolve(false);
                        }
                    }, { once: true });
                    
                    this.audioCache[src] = audio; // Cache for future use
                }
                
                audio.volume = volume;
                
                // Set up event handlers
                audio.onended = () => resolve(true);
                audio.onerror = (e) => {
                    console.log(`Audio error: ${e.message || 'Unknown error'}`);
                    resolve(false);
                };
                
                // Attempt to play
                const playPromise = audio.play();
                
                // Handle autoplay restrictions
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.log(`Audio playback failed: ${e.message}`);
                        resolve(false);
                    });
                }
            } catch (error) {
                console.log('Audio playback error:', error);
                resolve(false);
            }
        });
    },
    
    /**
     * Play cookie click sound
     * @param {number} volume - Volume from 0 to 1 (default: 0.3)
     */
    playClickSound: function(volume = 0.3) {
        return this.playSound('audio/click.mp3', volume);
    },
    
    /**
     * Play notification sound
     * @param {number} volume - Volume from 0 to 1 (default: 0.4)
     */
    playNotificationSound: function(volume = 0.4) {
        return this.playSound('audio/RewardSound.wav', volume);
    },
    
    /**
     * Play golden cookie pop sound
     * @param {number} volume - Volume from 0 to 1 (default: 0.5)
     */
    playPopSound: function(volume = 0.5) {
        return this.playSound('audio/bubblePop.mp3', volume);
    },
    
    /**
     * Preload common sounds for better performance
     */
    preloadCommonSounds: function() {
        const commonSounds = [
            'audio/click.mp3',
            'audio/bubblePop.mp3',
            'audio/RewardSound.wav'
        ];
        
        commonSounds.forEach(soundPath => {
            if (!this.loadedSounds[soundPath]) {
                const audio = new Audio(soundPath);
                audio.preload = 'auto';
                this.audioCache[soundPath] = audio;
                this.loadedSounds[soundPath] = true;
                
                // Add error handler
                audio.addEventListener('error', (e) => {
                    console.log(`Error preloading sound ${soundPath}: ${e.message || 'Unknown error'}`);
                    this.loadedSounds[soundPath] = false;
                });
            }
        });
    },
    
    /**
     * Check if audio is supported in this browser
     * @returns {boolean} - Whether audio is supported
     */
    isSupported: function() {
        return !!(window.AudioContext || window.webkitAudioContext) && 
               typeof Audio !== 'undefined';
    }
};

// Log audio support status and preload sounds
document.addEventListener('DOMContentLoaded', () => {
    if (!AudioHelper.isSupported()) {
        console.log('Audio not supported in this browser');
    } else {
        console.log('Audio support detected');
        // Preload common sounds
        AudioHelper.preloadCommonSounds();
    }
});

window.AudioHelper = {
    playNotificationSound(volume = 1.0) {
        try {
            const audio = new Audio('audio/RewardSound.wav');
            audio.volume = volume;
            audio.play().catch(err => console.log('Unable to play audio:', err));
        } catch {
            console.log('Audio not supported');
        }
    }
};
