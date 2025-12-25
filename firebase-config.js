// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);