import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { createAuthor, getAuyhors } from "./authors.controller";
import { authCookieBridge } from "../../middlewares/authMiddleware";

export const authorsRouter = new Hono();

authorsRouter.get("/", getAuyhors);
authorsRouter.post("/", authCookieBridge ,jwt({ secret: process.env.JWT_SECRET! }), createAuthor);
