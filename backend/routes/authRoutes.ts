import { Router, Request, Response } from "express";
import {
    AuthSignupRequest,
    AuthLoginRequest,
    GoogleAuthRequest,
    AuthResponse,
    User
} from "@full-stack/types";
import { auth } from "../firebaseConfig";
import { createOrUpdateUser, getUserById } from "../services/userService";

const router: Router = Router();

/**
 * POST /auth/signup
 * This app uses Google OAuth only - signup happens through /auth/google
 */
router.post("/signup", async (req: Request, res: Response) => {
    res.status(400).json({
        error: "Email/password signup not supported. Please use Google OAuth via /auth/google"
    });
});

/**
 * POST /auth/login
 * This app uses Google OAuth only - login happens through /auth/google
 */
router.post("/login", async (req: Request, res: Response) => {
    res.status(400).json({
        error: "Email/password login not supported. Please use Google OAuth via /auth/google"
    });
});

/**
 * POST /auth/google
 * Login or signup with Google OAuth
 */
router.post("/google", async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: "ID token is required" });
        }

        // Verify the ID token with Firebase Admin SDK
        const decodedToken = await auth.verifyIdToken(idToken);

        // Extract user information from the decoded token
        const { uid, email, name, picture } = decodedToken;

        // Check if user exists in Firestore
        let user = await getUserById(uid);

        if (!user) {
            // Create new user in Firestore
            user = {
                id: uid,
                email: email || "",
                displayName: name || email?.split("@")[0] || "User",
                photoURL: picture,
                createdAt: new Date().toISOString()
            };
            await createOrUpdateUser(user);
        } else {
            // Update existing user's photo URL if it changed
            if (picture && user.photoURL !== picture) {
                user.photoURL = picture;
                await createOrUpdateUser(user);
            }
        }

        // Return user data
        res.json({ user });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(401).json({ error: "Google authentication failed" });
    }
});

/**
 * GET /auth/me
 * Get current authenticated user by ID
 * Usage: GET /auth/me?userId=xxx
 * Or send Authorization header with Firebase ID token
 */
router.get("/me", async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authorization token required"});
        }

        const idToken = authHeader.substring(7);
        const decodedToken = await auth.verifyIdToken(idToken);
        const userId = decodedToken.uid; 

        const user = await getUserById(userId)
        if (!user) {
            return res.status(400).json({
                error: "User ID required. Provide userId query param or Authorization header"
            });

        }
        
        res.json(user);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ error: "Failed to get user" });
    }
});

export default router;
