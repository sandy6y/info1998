import { Router, Request, Response } from "express";
const r = Router();

r.post("/", (_req: Request, res: Response) => res.status(201).json({ ok: true }));
r.delete("/", (_req: Request, res: Response) => res.status(204).end());

export default r;
