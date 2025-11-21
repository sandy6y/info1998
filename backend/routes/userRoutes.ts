import { Router, Request, Response } from "express";
import { User, UserProfile, UserRanking } from "@full-stack/types";
import { getUserRankings, getUserProfile, updateUserProfile } from "../services/userService";

const router: Router = Router();

/**
 * GET /users/rankings
 * Get all users ranked by collection size
 * Used for Page 2: Rankings page
 */
router.get("/rankings", async (req: Request, res: Response) => {
    try {
        const rankings = await getUserRankings();
        res.json(rankings);
    } catch (error) {
        console.error("Get rankings error:", error);
        res.status(500).json({ error: "Failed to fetch rankings" });
    }
});

/**
 * GET /users/:userId
 * Get user profile with their collection
 * Used for Page 3: User profile page
 */
router.get("/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const profile = await getUserProfile(userId);

        if (!profile) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error("Get user profile error:", error);
        res.status(404).json({ error: "User not found" });
    }
});

/**
 * PUT /users/:userId
 * Update user profile (name, profile picture)
 */
router.put("/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { displayName, profilePicUrl } = req.body;

        const updatedUser = await updateUserProfile(userId, {
            displayName,
            profilePicUrl
        });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("Update user profile error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

export default router;
