import { db } from "../firebaseConfig";

const collectionsCollection = db.collection("collections");

/**
 * Get user's collection
 */
export async function getUserCollection(userId: string) {
    const doc = await collectionsCollection.doc(userId).get();
    if (!doc.exists) {
        // Return empty collection if doesn't exist
        return {
            userId,
            figures: [],
            updatedAt: new Date().toISOString()
        };
    }
    return doc.data();
}

/**
 * Get user's collection organized by series
 */
export async function getUserCollectionBySeries(userId: string) {
    const collection = await getUserCollection(userId);
    // Group figures by series (series is part of figureId, e.g., "sp-001" -> "sp")
    const bySeries: Record<string, any[]> = {};

    if (collection.figures) {
        for (const figure of collection.figures) {
            const series = figure.figureId.split('-')[0];
            if (!bySeries[series]) {
                bySeries[series] = [];
            }
            bySeries[series].push(figure);
        }
    }

    return bySeries;
}

/**
 * Add a figure to user's collection
 */
export async function addFigureToCollection(
    userId: string,
    figureData: {
        figureId: string;
        userImageUrl?: string;
        isRevealed: boolean;
    }
) {
    const collectionRef = collectionsCollection.doc(userId);
    const doc = await collectionRef.get();

    const now = new Date().toISOString();
    const newFigure = {
        ...figureData,
        collectedAt: now,
        order: 0 // Will be set properly when get existing figures
    };

    if (!doc.exists) {
        // Create new collection
        await collectionRef.set({
            userId,
            figures: [newFigure],
            updatedAt: now
        });
    } else {
        // Add to existing collection
        const data = doc.data();
        const figures = data?.figures || [];

        // Check if figure already exists
        if (figures.some((f: any) => f.figureId === figureData.figureId)) {
            throw new Error("Figure already in collection");
        }

        newFigure.order = figures.length;
        figures.push(newFigure);

        await collectionRef.update({
            figures,
            updatedAt: now
        });
    }

    return newFigure;
}

/**
 * Remove a figure from user's collection
 */
export async function removeFigureFromCollection(userId: string, figureId: string) {
    const collectionRef = collectionsCollection.doc(userId);
    const doc = await collectionRef.get();

    if (!doc.exists) {
        throw new Error("Collection not found");
    }

    const data = doc.data();
    const figures = data?.figures || [];
    const filteredFigures = figures.filter((f: any) => f.figureId !== figureId);

    if (filteredFigures.length === figures.length) {
        throw new Error("Figure not found in collection");
    }

    // Reorder remaining figures
    filteredFigures.forEach((f: any, index: number) => {
        f.order = index;
    });

    await collectionRef.update({
        figures: filteredFigures,
        updatedAt: new Date().toISOString()
    });

    return { success: true };
}

/**
 * Reorder figures in collection
 */
export async function reorderCollection(userId: string, figureIds: string[]) {
    const collectionRef = collectionsCollection.doc(userId);
    const doc = await collectionRef.get();

    if (!doc.exists) {
        throw new Error("Collection not found");
    }

    const data = doc.data();
    const figures = data?.figures || [];

    // Create a map of figureId to figure data
    const figureMap = new Map();
    figures.forEach((f: any) => figureMap.set(f.figureId, f));

    // Reorder based on provided figureIds array
    const reorderedFigures = figureIds.map((id, index) => {
        const figure = figureMap.get(id);
        if (!figure) {
            throw new Error(`Figure ${id} not found in collection`);
        }
        return { ...figure, order: index };
    });

    await collectionRef.update({
        figures: reorderedFigures,
        updatedAt: new Date().toISOString()
    });

    return reorderedFigures;
}
