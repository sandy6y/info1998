import { Figure, FigureLibrary } from "@full-stack/types";

// Figure library with ALL Popmart blind box figures from your collection!

export const figures: Figure[] = [
    // ===== Skull Panda - The Paradox (13 figures) as of 11/12 =====
    ...Array.from({ length: 13 }, (_, i) => ({
        id: `sp-${String(i + 1).padStart(3, '0')}`,
        name: `Skull Panda - The Paradox #${i + 1}`,
        series: "Skull Panda" as const,
        imageUrl: `/images/Skullpanda/The Paradox/${i + 1}.jpg`,
        description: `The Paradox series #${i + 1}`
    })),

    // ===== Skull Panda - Warmth (13 figures) as of 11/12 =====
    ...Array.from({ length: 13 }, (_, i) => ({
        id: `sp-${String(i + 14).padStart(3, '0')}`,
        name: `Skull Panda - Warmth #${i + 1}`,
        series: "Skull Panda" as const,
        imageUrl: `/images/Skullpanda/Warmth/${i + 1}.jpg`,
        description: `Warmth series #${i + 1}`
    })),

    // ===== Skull Panda - The Sound (13 figures) as of 11/12 =====
    ...Array.from({ length: 13 }, (_, i) => ({
        id: `sp-${String(i + 27).padStart(3, '0')}`,
        name: `Skull Panda - The Sound #${i + 1}${i + 1 === 13 ? ' (Secret)' : ''}`,
        series: "Skull Panda" as const,
        imageUrl: `/images/Skullpanda/The Sound/${i + 1}.jpg`,
        description: `The Sound series #${i + 1}${i + 1 === 13 ? ' - Rare secret variant!' : ''}`
    })),

    // ===== Hirono - Reshape (10 figures) as of 11/12=====
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `hr-${String(i + 1).padStart(3, '0')}`,
        name: `Hirono - Reshape #${i + 1}`,
        series: "Hirono" as const,
        imageUrl: `/images/Hirono/Reshape/${i + 1}.jpg`,
        description: `Reshape series #${i + 1}`
    })),

    // ===== Hirono - Echo (13 figures) as of 11/12 =====
    ...Array.from({ length: 13 }, (_, i) => ({
        id: `hr-${String(i + 11).padStart(3, '0')}`,
        name: `Hirono - Echo #${i + 1}${i + 1 === 13 ? ' (Secret)' : ''}`,
        series: "Hirono" as const,
        imageUrl: `/images/Hirono/Echo/${i + 1}.jpg`,
        description: `Echo series #${i + 1}${i + 1 === 13 ? ' - Rare secret variant!' : ''}`
    })),

    // ===== Hirono - Shelter (13 figures) as of 11/12=====
    ...Array.from({ length: 13 }, (_, i) => ({
        id: `hr-${String(i + 24).padStart(3, '0')}`,
        name: `Hirono - Shelter #${i + 1}${i + 1 === 13 ? ' (Secret)' : ''}`,
        series: "Hirono" as const,
        imageUrl: `/images/Hirono/Shelter/${i + 1}.jpg`,
        description: `Shelter series #${i + 1}${i + 1 === 13 ? ' - Rare secret variant!' : ''}`
    })),

    // ===== Labubu - Exciting Macaron (7 figures) as of 11/12 =====
    ...Array.from({ length: 7 }, (_, i) => ({
        id: `lb-${String(i + 1).padStart(3, '0')}`,
        name: `Labubu - Exciting Macaron #${i + 1}${i + 1 === 7 ? ' (Secret)' : ''}`,
        series: "Labubu" as const,
        imageUrl: `/images/Labubu/Exciting Macaron/${i + 1}.jpg`,
        description: `Exciting Macaron series #${i + 1}${i + 1 === 7 ? ' - Rare secret variant!' : ''}`
    }))
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
