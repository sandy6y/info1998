import { Router, Request, Response } from "express";

type UserCollectible = {
    id: string;
    userId: string;
    collectibleId: string;
    revealPicUrl?: string;
    sortIndex: number;
};

const USER_ITEMS: UserCollectible[] = [];

const r: Router = Router();

// GET /collections { userId }
r.get("/:userId", (req: Request, res: Response) => {
    const { userId } = req.params;
    const userItems = USER_ITEMS.filter(x => x.userId === userId);
    res.json({ userId, figures: userItems }); 
});

// POST /collections  { userId, collectibleId, revealPicUrl? }
r.post("/", (req: Request, res: Response) => {
    const { userId, collectibleId, revealPicUrl } = req.body || {};
    if (!userId || !collectibleId) {
        return res.status(400).json({ error: { code: "BAD_REQUEST", message: "userId and collectibleId required" } });
    }
    const sortIndex = USER_ITEMS.filter(x => x.userId === userId).length + 1;
    const row = { id: `uc_${Date.now()}`, userId, collectibleId, revealPicUrl, sortIndex };
    USER_ITEMS.push(row);

    const userItems = USER_ITEMS.filter(x => x.userId === userId);
    res.status(201).json(row);
});

// PUT /collections/reorder  { userId, order: [userCollectibleId...] }
r.put("/reorder", (req: Request, res: Response) => {
    const { userId, order } = req.body || {};
    if (!userId || !Array.isArray(order)) {
        return res.status(400).json({ error: { code: "BAD_REQUEST", message: "userId and order required" } });
    }
    let i = 1;
    for (const id of order) {
        const it = USER_ITEMS.find(x => x.id === id && x.userId === userId);
        if (it) it.sortIndex = i++;
    }
    res.json({ ok: true });
});

// DELETE /collections/:id
r.delete("/:id", (req: Request, res: Response) => {
    const ix = USER_ITEMS.findIndex(x => x.id === req.params.id);
    if (ix === -1) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Item not found" } });
    USER_ITEMS.splice(ix, 1);
    res.status(204).end();
});

export default r;
