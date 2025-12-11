import { Context } from "hono";
import { booksService } from "./books.service";

export const createBook = async (c: Context) => {
  try {
    const user = c.get("jwtPayload");
    const body = await c.req.json();

    const book = await booksService.createBook(user.id, body);
    return c.json({ success: true, data: book }, 201);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};
export const getAllBooks = async (c: Context) => {
  try {
    const query = c.req.query();
    const books = await booksService.getAllBooks(query);
    return c.json({ success: true, data: books }, 200);
  } catch (error: any) {
    console.log(error);
    return c.json({ success: false, message: error.message }, 500);
  }
};
export const getMyBooks = async (c: Context) => {
  try {
    const user = c.get("jwtPayload");
    const query = c.req.query();

    const books = await booksService.getMyBooks(user.id, query);
    return c.json({ success: true, data: books }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};
