import { Router, Request, Response } from "express";

const r = Router();

// POST /auth/login
r.post("/login", (req: Request, res: Response) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ error: { code: "BAD_REQUEST", message: "Email and password required" } });
    }
    // Mock authentication
    res.json({ token: "mock-jwt-token", userId: "u1", email });
});

// POST /auth/register
r.post("/register", (req: Request, res: Response) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
        return res.status(400).json({ error: { code: "BAD_REQUEST", message: "Name, email and password required" } });
    }
    // Mock registration
    res.status(201).json({ userId: `u_${Date.now()}`, name, email });
});

export default r;
