import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { createAuthor, getAuyhors } from "./authors.controller";

export const authorsRouter = new Hono();

authorsRouter.get("/", getAuyhors);
authorsRouter.post("/", jwt({ secret: process.env.JWT_SECRET! }), createAuthor);
