import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRouter } from "./modules/auth/auth.routes";
import booksRouter from "./modules/books/books.routes";
import { authorsRouter } from "./modules/authors/authors.routes";
import categoriesRouter from "./modules/category/category.routes";
import { cors } from "hono/cors";
import { userRouter } from "./modules/user/user.routes";
import tagsRouter from "./modules/tags/tags.routes";
const app = new Hono();
app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.get("/", (c) => c.text("Hello Book Shop! 📚"));
app.route("/auth", authRouter);
app.route("/user", userRouter);
app.route("/category", categoriesRouter);
app.route("/books", booksRouter);
app.route("/authors", authorsRouter);
app.route("/tags", tagsRouter);
const startServer = async () => {
  try {
    const port = 3001;
    console.log(`🚀 Server is running on port ${port}`);

    serve({
      fetch: app.fetch,
      port,
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
