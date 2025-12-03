import { Router } from "express";
import users from "./users";
import series from "./series";
import collections from "./collections";
import likes from "./likes";
import comments from "./comments";

const r: Router = Router();

r.use("/users", users);
r.use("/series", series);
r.use("/collections", collections);
r.use("/likes", likes);
r.use("/comments", comments);

export default r;
