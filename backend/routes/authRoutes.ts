import { Router, Request, Response } from "express";
import {
    AuthSignupRequest,
    AuthLoginRequest,
    GoogleAuthRequest,
    AuthResponse,
    User
} from "@full-stack/types";

const router: Router = Router();

/**
 * POST /auth/signup
 * Register a new user with email and password
 */
router.post("/signup", async (req: Request, res: Response) => {
    try {
        const { email, password, displayName } = req.body;

        // This is what we did for MS2: Implement user registration logic
        const mockUser: User = {
            id: "user-001",
            email,
            displayName,
            createdAt: new Date().toISOString()
        };

        const mockResponse: AuthResponse = {
            user: mockUser,
            token: "mock-jwt-token"
        };

        res.status(201).json(mockResponse);
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Failed to create account" });
    }
});

/**
 * POST /auth/login
 * Login with email and password
 */
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // This is what we did for MS2: Implement login logic
        const mockUser: User = {
            id: "user-001",
            email,
            displayName: "Mock User",
            createdAt: new Date().toISOString()
        };

        const mockResponse: AuthResponse = {
            user: mockUser,
            token: "mock-jwt-token"
        };

        res.json(mockResponse);
    } catch (error) {
        console.error("Login error:", error);
        res.status(401).json({ error: "Invalid credentials" });
    }
});

/**
 * POST /auth/google
 * Login or signup with Google OAuth
 */
router.post("/google", async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        // This is what we did for MS2: Implement Google OAuth logic
        const mockUser: User = {
            id: "user-google-001",
            email: "user@gmail.com",
            displayName: "Google User",
            profilePicUrl: "https://placeholder-url.com/profile.jpg",
            createdAt: new Date().toISOString()
        };

        const mockResponse: AuthResponse = {
            user: mockUser,
            token: "mock-jwt-token"
        };

        res.json(mockResponse);
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(401).json({ error: "Google authentication failed" });
    }
});

/**
 * GET /auth/me
 * Get current authenticated user
 */
router.get("/me", async (req: Request, res: Response) => {
    try {
        // This is what we did for MS2: Implement get current user logic
        const mockUser: User = {
            id: "user-001",
            email: "user@example.com",
            displayName: "Current User",
            createdAt: new Date().toISOString()
        };

        res.json(mockUser);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(401).json({ error: "Unauthorized" });
    }
});

export default router;
