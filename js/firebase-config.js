// Firebase configuration
// Replace these values with your actual Firebase project credentials
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAg1Q0_6AvggOiuyvaSHpZ_gYN_VL6msv0",
    authDomain: "social-truth-31e90.firebaseapp.com",
    projectId: "social-truth-31e90",
    storageBucket: "social-truth-31e90.firebasestorage.app",
    messagingSenderId: "953301894494",
    appId: "1:953301894494:web:c90bb17babe141c061bbcf",
    measurementId: "G-LFNHVM60EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, db, auth, analytics };
