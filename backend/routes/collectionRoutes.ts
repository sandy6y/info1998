import { Router, Request, Response } from "express";
import {
    UserCollection,
    CollectionBySeries,
    AddFigureRequest,
    ReorderCollectionRequest,
    CollectedFigure
} from "@full-stack/types";
import { figures, figureLibrary, getFiguresBySeries } from "../figureData";
import {
    getUserCollection,
    getUserCollectionBySeries,
    addFigureToCollection,
    removeFigureFromCollection,
    reorderCollection
} from "../services/collectionService";

const router: Router = Router();

/**
 * GET /collections/:userId
 * Get user's complete collection
 */
router.get("/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const collection = await getUserCollection(userId);
        res.json(collection);
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

        const collectionBySeries = await getUserCollectionBySeries(userId);
        res.json(collectionBySeries);
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
        const { figureId, userImageUrl, isRevealed } = req.body;

        const newFigure = await addFigureToCollection(userId, {
            figureId,
            userImageUrl,
            isRevealed: isRevealed || false
        });

        res.status(201).json({
            message: "Figure added to collection",
            figure: newFigure
        });
    } catch (error: any) {
        console.error("Add figure error:", error);
        if (error.message === "Figure already in collection") {
            return res.status(400).json({ error: error.message });
        }
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

        await removeFigureFromCollection(userId, figureId);

        res.json({
            message: "Figure removed from collection",
            figureId
        });
    } catch (error: any) {
        console.error("Delete figure error:", error);
        if (error.message === "Collection not found" || error.message === "Figure not found in collection") {
            return res.status(404).json({ error: error.message });
        }
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

        const reorderedFigures = await reorderCollection(userId, figureOrders);

        res.json({
            message: "Collection reordered successfully",
            figures: reorderedFigures
        });
    } catch (error: any) {
        console.error("Reorder collection error:", error);
        if (error.message === "Collection not found" || error.message?.includes("not found in collection")) {
            return res.status(404).json({ error: error.message });
        }
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
