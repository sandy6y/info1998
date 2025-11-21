import admin from "firebase-admin";

// Initialize Firebase Admin SDK using environment variables
let firebaseApp: admin.app.App;

try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error("Missing required Firebase environment variables. Please check your .env file.");
    }

    firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });

    console.log("Firebase Admin initialized successfully");
} catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    console.warn("Firebase authentication will not work until properly configured");
    throw error;
}

export const auth = admin.auth();
export const db = admin.firestore();
export default firebaseApp;
