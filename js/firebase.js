// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmyuq-wzyFGwcVT4GYJ6-stsSVavrkcNI",
  authDomain: "hidden-cafe-a4a9d.firebaseapp.com",
  projectId: "hidden-cafe-a4a9d",
  storageBucket: "hidden-cafe-a4a9d.appspot.com",
  messagingSenderId: "588696930442",
  appId: "1:588696930442:web:a3071cd30d355b377b0573",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const authService = getAuth(app);
export const dbService = getFirestore(app);
export const storageService = getStorage(app);
