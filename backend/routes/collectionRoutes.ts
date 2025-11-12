import { Router, Request, Response } from "express";
import {
    UserCollection,
    CollectionBySeries,
    AddFigureRequest,
    ReorderCollectionRequest,
    CollectedFigure
} from "@full-stack/types";
import { figures, figureLibrary, getFiguresBySeries } from "../figureData";

const router: Router = Router();

/**
 * GET /collections/:userId
 * Get user's complete collection
 */
router.get("/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // This is what we did for MS2: Implement get collection logic
        const mockCollection: UserCollection = {
            userId,
            figures: [
                {
                    figureId: "sp-001",
                    collectedAt: "2024-03-01T00:00:00Z",
                    order: 0,
                    userImageUrl: "https://placeholder-url.com/my-figure.jpg",
                    isRevealed: true
                },
                {
                    figureId: "hr-002",
                    collectedAt: "2024-03-10T00:00:00Z",
                    order: 1,
                    isRevealed: false
                }
            ],
            updatedAt: new Date().toISOString()
        };

        res.json(mockCollection);
    } catch (error) {
        console.error("Get collection error:", error);
        res.status(500).json({ error: "Failed to fetch collection" });
    }
});

/**
 * GET /collections/:userId/by-series
 * Get user's collection organized by series
 * Shows count per series for the UI
 */
router.get("/:userId/by-series", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // This is what we did for MS2: Implement get collection by series logic

        const mockCollectionBySeries: CollectionBySeries[] = [
            {
                series: "Skull Panda",
                count: 3,
                figures: [
                    {
                        figureId: "sp-001",
                        collectedAt: "2024-03-01T00:00:00Z",
                        order: 0,
                        isRevealed: true
                    }
                ]
            },
            {
                series: "Hirono",
                count: 2,
                figures: [
                    {
                        figureId: "hr-002",
                        collectedAt: "2024-03-10T00:00:00Z",
                        order: 0,
                        isRevealed: false
                    }
                ]
            }
        ];

        res.json(mockCollectionBySeries);
    } catch (error) {
        console.error("Get collection by series error:", error);
        res.status(500).json({ error: "Failed to fetch collection by series" });
    }
});

/**
 * POST /collections/:userId/figures
 * Add a figure to user's collection
 */
router.post("/:userId/figures", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { figureId, userImageUrl } = req.body;

        // This is what we did for MS2: Implement add figure logic

        const newCollectedFigure: CollectedFigure = {
            figureId,
            collectedAt: new Date().toISOString(),
            order: 0, // Will be calculated based on existing figures
            userImageUrl,
            isRevealed: false
        };

        res.status(201).json({
            message: "Figure added to collection",
            figure: newCollectedFigure
        });
    } catch (error) {
        console.error("Add figure error:", error);
        res.status(500).json({ error: "Failed to add figure to collection" });
    }
});

/**
 * DELETE /collections/:userId/figures/:figureId
 * Remove a figure from user's collection
 */
router.delete("/:userId/figures/:figureId", async (req: Request, res: Response) => {
    try {
        const { userId, figureId } = req.params;

        // This is what we did for MS2: Implement delete figure logic

        res.json({
            message: "Figure removed from collection",
            figureId
        });
    } catch (error) {
        console.error("Delete figure error:", error);
        res.status(500).json({ error: "Failed to remove figure from collection" });
    }
});

/**
 * PUT /collections/:userId/reorder
 * Reorder figures in user's collection
 */
router.put("/:userId/reorder", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { figureOrders } = req.body;

        // This is what we did for MS2: Implement reorder collection logic
        res.json({
            message: "Collection reordered successfully",
            figureOrders
        });
    } catch (error) {
        console.error("Reorder collection error:", error);
        res.status(500).json({ error: "Failed to reorder collection" });
    }
});

/**
 * GET /figures
 * Get all available figures in the library
 * Returns the complete figure library for browsing
 */
router.get("/figures/all", async (req: Request, res: Response) => {
    try {
        // Return all figures from the figure library
        res.json(figures);
    } catch (error) {
        console.error("Get all figures error:", error);
        res.status(500).json({ error: "Failed to fetch figures" });
    }
});

/**
 * GET /figures/series/:seriesName
 * Get all figures from a specific series
 */
router.get("/figures/series/:seriesName", async (req: Request, res: Response) => {
    try {
        const { seriesName } = req.params;

        const seriesFigures = getFiguresBySeries(seriesName);

        res.json(seriesFigures);
    } catch (error) {
        console.error("Get figures by series error:", error);
        res.status(500).json({ error: "Failed to fetch figures by series" });
    }
});

export default router;
