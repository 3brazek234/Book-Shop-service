import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import {
  createBook,
  getAllBooks,
  getBookById,
  getMyBooks,
} from "./books.controller";
import { createBookSchema, queryBookSchema } from "./books.schema";
import { authCookieBridge } from "../../middlewares/authMiddleware";
import { bodyLimit } from "hono/body-limit";

const booksRouter = new Hono();
booksRouter.get("/all", zValidator("query", queryBookSchema), getAllBooks);
booksRouter.get(
  "/my-books",
  authCookieBridge,
  jwt({ secret: process.env.JWT_SECRET! }),
  zValidator("query", queryBookSchema),
  getMyBooks
);
booksRouter.get("/:id", getBookById);
booksRouter.use("/*", authCookieBridge);

booksRouter.post(
  "/create",
  authCookieBridge,

  jwt({ secret: process.env.JWT_SECRET! }),

  async (c, next) => {
    const payload = c.get("jwtPayload");
    if (payload) c.set("user", payload);
    await next();
  },

  bodyLimit({
    maxSize: 10 * 1024 * 1024,
    onError: (c) => c.text("File overflow", 413),
  }),

  zValidator("form", createBookSchema),
  createBook
);

export default booksRouter;
