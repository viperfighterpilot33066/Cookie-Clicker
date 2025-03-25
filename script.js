document.addEventListener("DOMContentLoaded", function () {
    // Add class to prevent transitions on load
    document.body.classList.add('no-transition');
    
    // Remove the class after a small delay
    setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 100);

    // Initialize dark mode
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    const pointsValue = document.getElementById("pointsValue");
    if (!pointsValue) {
        console.warn("Points value element not found.");
        return;
    }
    
    let autoClickerPurchased = JSON.parse(localStorage.getItem("autoClickerPurchased")) || false;
    let autoClickerPointsPerSecond = parseInt(localStorage.getItem("autoClickerPointsPerSecond")) || 1;
    let curserUpgradeActive = parseInt(localStorage.getItem("curserUpgradeActive")) || 0;
    let pointsPerClick = 1 + curserUpgradeActive;
    let points = parseInt(localStorage.getItem("points")) || 0;

    function updatePointsDisplay() {
        pointsValue.innerText = points;
        // Sync with Firebase if user is logged in
        const userId = localStorage.getItem("userId");
        if (userId) {
            saveUserProgress();
        }
    }

    // Add throttled save function
    let saveTimeout;
    function saveUserProgress() {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            const userRef = ref(database, `users/${userId}`);
            const updates = {
                points: points,
                autoClickerPurchased,
                autoClickerPointsPerSecond,
                curserUpgradeActive
            };

            update(userRef, updates).catch(console.error);
        }, 1000);
    }

    updatePointsDisplay();

    setInterval(function () {
        if (autoClickerPurchased) {
            points += autoClickerPointsPerSecond;
            localStorage.setItem("points", points);
            updatePointsDisplay();
        }
    }, 1000);

    const cookie = document.getElementById("cookie");
    if (cookie) {
        cookie.addEventListener("click", function () {
            pointsPerClick = 1 + curserUpgradeActive;
            points += pointsPerClick;
            localStorage.setItem("points", points);
            updatePointsDisplay();
        });
    }

    // Find this line around line 43:
    // ref.on('value', (snapshot) => {
    // And replace it with:
    database.ref('leaderboard').on('value', (snapshot) => {
        // ...existing code...
    });
});
