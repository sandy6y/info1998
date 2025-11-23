import { Router, Request, Response } from "express";

type Comment = {
    id: string;
    userId: string;
    collectibleId: string;
    text: string;
    createdAt: string;
};

const COMMENTS: Comment[] = [];

const r: Router = Router();

// GET /comments?collectibleId=xxx
r.get("/", (req: Request, res: Response) => {
    const collectibleId = req.query.collectibleId as string;
    if (!collectibleId) {
        return res.status(400).json({ error: { code: "BAD_REQUEST", message: "collectibleId required" } });
    }
    const comments = COMMENTS.filter(c => c.collectibleId === collectibleId);
    res.json(comments);
});

// POST /comments
r.post("/", (req: Request, res: Response) => {
    const { userId, collectibleId, text } = req.body || {};
    if (!userId || !collectibleId || !text) {
        return res.status(400).json({ error: { code: "BAD_REQUEST", message: "userId, collectibleId and text required" } });
    }
    const comment: Comment = {
        id: `c_${Date.now()}`,
        userId,
        collectibleId,
        text,
        createdAt: new Date().toISOString()
    };
    COMMENTS.push(comment);
    res.status(201).json(comment);
});

// DELETE /comments/:id
r.delete("/:id", (req: Request, res: Response) => {
    const ix = COMMENTS.findIndex(c => c.id === req.params.id);
    if (ix === -1) {
        return res.status(404).json({ error: { code: "NOT_FOUND", message: "Comment not found" } });
    }
    COMMENTS.splice(ix, 1);
    res.status(204).end();
});

export default r;
