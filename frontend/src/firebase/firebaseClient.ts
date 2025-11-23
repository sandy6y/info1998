// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCUWHA65_JKdoPm7r46eoNiwhvVV0a8lSg",
    authDomain: "popmart-collection.firebaseapp.com",
    projectId: "popmart-collection",
    storageBucket: "popmart-collection.firebasestorage.app",
    messagingSenderId: "726862330600",
    appId: "1:726862330600:web:1592d64bda132838b5275d",
    measurementId: "G-CK3FKJ8DG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics only in browser 
let analytics: any = null;
if (typeof window !== "undefined") {
  const { getAnalytics } = await import("firebase/analytics");
  analytics = getAnalytics(app);
}


export default app; 