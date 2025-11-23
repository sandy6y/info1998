import { Router, Request, Response } from "express";

const USERS: Array<{ id: string; name: string; email: string; profilePic: string; owned: string[] }> = [
    { id: "u1", name: "Sandy", email: "sandy@cornell.edu", profilePic: "", owned: ["echo-1", "hirono-reshape-1", "skullpanda-the-paradox-1"] },
    { id: "u2", name: "Ye", email: "ye@example.com", profilePic: "", owned: ["labubu-exciting-macaron-3", "skullpanda-warmth-2", "skullpanda-the-sound-5"] },
    { id: "u3", name: "Kat", email: "kat@example.com", profilePic: "", owned: [] }
];

const r: Router = Router();

r.get("/leaderboard", (req: Request, res: Response) => {
    const limit = Number(req.query.limit ?? 50);
    const ranked = USERS
        .map(u => ({ id: u.id, name: u.name, profilePic: u.profilePic, ownedCount: u.owned.length }))
        .sort((a, b) => b.ownedCount - a.ownedCount)
        .slice(0, limit);
    res.json(ranked);
});

r.get("/:id", (req: Request, res: Response) => {
    const user = USERS.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    res.json(user);
});

export default r;
