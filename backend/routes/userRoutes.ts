import { Router, Request, Response } from "express";
import { User, UserProfile, UserRanking } from "@full-stack/types";

const router: Router = Router();

/**
 * GET /users/rankings
 * Get all users ranked by collection size
 * Used for Page 2: Rankings page
 */
router.get("/rankings", async (req: Request, res: Response) => {
    try {
        // This is what we did for MS2: Implement rankings logic
        const mockRankings: UserRanking[] = [
            {
                rank: 1,
                user: {
                    id: "user-001",
                    email: "collector1@example.com",
                    displayName: "Super Collector",
                    profilePicUrl: "https://placeholder-url.com/user1.jpg",
                    createdAt: "2024-01-01T00:00:00Z"
                },
                collectionCount: 15
            },
            {
                rank: 2,
                user: {
                    id: "user-002",
                    email: "collector2@example.com",
                    displayName: "Pop Master",
                    profilePicUrl: "https://placeholder-url.com/user2.jpg",
                    createdAt: "2024-01-15T00:00:00Z"
                },
                collectionCount: 12
            },
            {
                rank: 3,
                user: {
                    id: "user-003",
                    email: "collector3@example.com",
                    displayName: "Figure Fan",
                    createdAt: "2024-02-01T00:00:00Z"
                },
                collectionCount: 8
            }
        ];

        res.json(mockRankings);
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

        // This is what we did for MS2: Implement get user profile logic
        const mockProfile: UserProfile = {
            id: userId,
            email: "user@example.com",
            displayName: "User Profile",
            profilePicUrl: "https://placeholder-url.com/profile.jpg",
            createdAt: "2024-01-01T00:00:00Z",
            collectionCount: 5,
            collections: [
                {
                    userId,
                    figures: [
                        {
                            figureId: "sp-001",
                            collectedAt: "2024-03-01T00:00:00Z",
                            order: 0,
                            userImageUrl: "https://placeholder-url.com/my-figure-1.jpg",
                            isRevealed: true
                        },
                        {
                            figureId: "hr-002",
                            collectedAt: "2024-03-15T00:00:00Z",
                            order: 1,
                            userImageUrl: "https://placeholder-url.com/my-figure-2.jpg",
                            isRevealed: false
                        }
                    ],
                    updatedAt: "2024-03-15T00:00:00Z"
                }
            ]
        };

        res.json(mockProfile);
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

        // This is what we did for MS2: Implement update user profile logic

        const updatedUser: User = {
            id: userId,
            email: "user@example.com",
            displayName: displayName || "Updated User",
            profilePicUrl: profilePicUrl,
            createdAt: "2024-01-01T00:00:00Z"
        };

        res.json(updatedUser);
    } catch (error) {
        console.error("Update user profile error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

export default router;
