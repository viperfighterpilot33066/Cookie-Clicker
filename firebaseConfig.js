// Firebase configuration using non-modular (v8) Firebase SDK
const firebaseConfig = {
    apiKey: "AIzaSyD1vSGtQ5IO1pEgn2BOf1kQFks22NZ-Vzs",
    authDomain: "leaderboard-10f42.firebaseapp.com",
    databaseURL: "https://leaderboard-10f42-default-rtdb.firebaseio.com",
    projectId: "leaderboard-10f42",
    storageBucket: "leaderboard-10f42.firebasestorage.app",
    messagingSenderId: "1097500483722",
    appId: "1:1097500483722:web:f901c50a5ea065ee9f8d73",
    measurementId: "G-T2MMSV42YY"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
window.database = database;
