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

const booksRouter = new Hono();
booksRouter.post(
  "/create",
  jwt({ secret: process.env.JWT_SECRET! }),
  zValidator("json", createBookSchema),
  createBook
);
booksRouter.get("/all", zValidator("query", queryBookSchema), getAllBooks);
booksRouter.get(
  "/my-books",
  jwt({ secret: process.env.JWT_SECRET! }),
  zValidator("query", queryBookSchema),
  getMyBooks
);
booksRouter.get("/:id", getBookById);

export default booksRouter;
