import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { createBook, getAllBooks, getMyBooks  } from "./books.controller";
import { createBookSchema, queryBookSchema } from "./books.schema";

const booksRouter = new Hono();
booksRouter.use("/*", jwt({ secret: process.env.JWT_SECRET! }));
booksRouter.post(
  "/create",
  zValidator("json", createBookSchema),
  createBook
);
booksRouter.get(
  "/all",
  zValidator("query", queryBookSchema), 
  getAllBooks
);
booksRouter.get(
  "/my-books",
  zValidator("query", queryBookSchema), 
  getMyBooks
);
export default booksRouter;