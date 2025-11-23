import { Router, Request, Response } from "express";
import { SERIES } from "../data/series";
import { COLLECTIBLES } from "../data/collectibles";

const r: Router = Router();

r.get("/", (_req: Request, res: Response) => res.json(SERIES));

r.get("/:id/collectibles", (req: Request, res: Response) => {
    const items = COLLECTIBLES.filter(c => c.seriesId === req.params.id);
    if (!items.length) {
        return res.status(404).json({ error: { code: "NOT_FOUND", message: "Series not found" } });
    }
    res.json(items);
});

export default r;
