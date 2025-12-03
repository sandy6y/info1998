import { Figure, FigureLibrary } from "@full-stack/types";
import { COLLECTIBLES } from "./data/collectibles";

export const figures: Figure[] = [
    // ===== Skull Panda - The Paradox (13 figures) as of 12/02 =====
    ...Array.from({ length: 13 }, (_, i) => {
        const paradox = COLLECTIBLES.find(
        (col) =>
            col.characterName === "Skullpanda" &&
            col.serieName === "The Paradox" &&
            col.serieNbr === i + 1
        );
        if (!paradox) throw new Error(`Figure not found for The Paradox #${i + 1}`);

        return {
        id: `sp-${String(i + 27).padStart(3, "0")}`,
        name: paradox.name,
        series: "Skull Panda" as const,
        imageUrl: `/images/Skullpanda/The Paradox/${i + 1}.jpg`,
        description: `The Paradox series #${i + 1}`,
        };
    }),

    // ===== Skull Panda - The Sound (13 figures) as of 11/12 =====
    ...Array.from({ length: 13 }, (_, i) => {
        const c = COLLECTIBLES.find(
        (col) =>
            col.characterName === "Skullpanda" &&
            col.serieName === "The Sound" &&
            col.serieNbr === i + 1
        );
        if (!c) throw new Error(`Figure not found: Skullpanda - The Sound #${i + 1}`);
        return {
        id: `sp-${String(i + 14).padStart(3, "0")}`,
        name: c.name,
        series: "Skull Panda" as const,
        imageUrl: `/images/Skullpanda/The Sound/${i + 1}.jpg`,
        description: `The Sound series #${i + 1}`,
        };
    }),

    // ===== Skull Panda - Warmth (13 figures) as of 11/12 =====
    ...Array.from({ length: 13 }, (_, i) => {
        const c = COLLECTIBLES.find(
        (col) =>
            col.characterName === "Skullpanda" &&
            col.serieName === "Warmth" &&
            col.serieNbr === i + 1
        );
        if (!c) throw new Error(`Figure not found: Skullpanda - Warmth #${i + 1}`);
        return {
        id: `sp-${String(i + 1).padStart(3, "0")}`,
        name: c.name,
        series: "Skull Panda" as const,
        imageUrl: `/images/Skullpanda/Warmth/${i + 1}.jpg`,
        description: `Warmth series #${i + 1}`,
        };
    }),

    // ===== Hirono - Reshape (10 figures) as of 11/12=====
    ...Array.from({ length: 10 }, (_, i) => {
        const c = COLLECTIBLES.find(
        (col) =>
            col.characterName === "Hirono" &&
            col.serieName === "Reshape" &&
            col.serieNbr === i + 1
        );
        if (!c) throw new Error(`Figure not found: Hirono - Reshape #${i + 1}`);
        return {
        id: `hr-${String(i + 1).padStart(3, "0")}`,
        name: c.name,
        series: "Hirono" as const,
        imageUrl: `/images/Hirono/Reshape/${i + 1}.jpg`,
        description: `Reshape series #${i + 1}`,
        };
    }),

    // ===== Hirono - Echo (13 figures) as of 11/12 =====
    ...Array.from({ length: 13 }, (_, i) => {
        const c = COLLECTIBLES.find(
        (col) =>
            col.characterName === "Hirono" &&
            col.serieName === "Echo" &&
            col.serieNbr === i + 1
        );
        if (!c) throw new Error(`Figure not found: Hirono - Echo #${i + 1}`);
        return {
        id: `hr-${String(i + 24).padStart(3, "0")}`,
        name: c.name,
        series: "Hirono" as const,
        imageUrl: `/images/Hirono/Echo/${i + 1}.jpg`,
        description: `Echo series #${i + 1}`,
        };
    }),

    // ===== Hirono - Shelter (13 figures) as of 11/12=====
    ...Array.from({ length: 13 }, (_, i) => {
        const c = COLLECTIBLES.find(
        (col) =>
            col.characterName === "Hirono" &&
            col.serieName === "Shelter" &&
            col.serieNbr === i + 1
        );
        if (!c) throw new Error(`Figure not found: Hirono - Shelter #${i + 1}`);
        return {
        id: `hr-${String(i + 11).padStart(3, "0")}`,
        name: c.name,
        series: "Hirono" as const,
        imageUrl: `/images/Hirono/Shelter/${i + 1}.jpg`,
        description: `Shelter series #${i + 1}`,
        };
    }),

    // ===== Labubu - Exciting Macaron (7 figures) as of 11/12 =====
    ...Array.from({ length: 7 }, (_, i) => {
        const c = COLLECTIBLES.find(
        (col) =>
            col.characterName === "Labubu" &&
            col.serieName === "Exciting Macaron" &&
            col.serieNbr === i + 1
        );
        if (!c) throw new Error(`Figure not found: Labubu - Exciting Macaron #${i + 1}`);
        return {
        id: `lb-${String(i + 1).padStart(3, "0")}`,
        name: c.name,
        series: "Labubu" as const,
        imageUrl: `/images/Labubu/Exciting Macaron/${i + 1}.jpg`,
        description: `Exciting Macaron series #${i + 1}`,
        };
    }),
];

// Convert array to library object for easy lookup
export const figureLibrary: FigureLibrary = figures.reduce((acc, figure) => {
    acc[figure.id] = figure;
    return acc;
}, {} as FigureLibrary);

// Helper function to get figures by series
export function getFiguresBySeries(series: string): Figure[] {
    return figures.filter(f => f.series === series);
}
