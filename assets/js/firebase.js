// ============================================
// FIREBASE CONFIGURATION
// ============================================

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCDZpCizgObTQEBbPX60v6DIPPOLczjum8",
    authDomain: "pension-sunset.firebaseapp.com",
    projectId: "pension-sunset",
    storageBucket: "pension-sunset.firebasestorage.app",
    messagingSenderId: "842117416822",
    appId: "1:842117416822:web:f4738a095706f8ffde1c57",
    measurementId: "G-0DGR16TLFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only if available)
let analytics = null;
if (typeof window !== 'undefined') {
    try {
        analytics = getAnalytics(app);
    } catch (error) {
        console.log('Analytics not available:', error);
    }
}

export { analytics };

// Export app instance
export default app;

