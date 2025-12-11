import { Context } from "hono";
import { booksService } from "./books.service";
import { uploadToCloudinary } from "../../utils/cloudinary";
export const createBook = async (c: Context) => {
  try {
    const user = c.get("jwtPayload");
    const body = await c.req.parseBody();
    const title = body['title'] as string;
    const description = body['description'] as string;
    const priceStr = body['price'] as string;
    const categoryId = body['categoryId'] as string;
    const authorId = body['authorId'] as string;
    const coverFile = body['thumbnail'] as File | undefined; 
    if(!title || !priceStr || !categoryId || !authorId) {
        throw new Error("Missing required fields");
    }
    let coverImageUrl = null;
    if (coverFile && coverFile instanceof File) {
       coverImageUrl = await uploadToCloudinary(coverFile, 'book-shop/books');
    }
    const newBook = await booksService.createBook(user.id, {
      title,
      description,
      price: Number(priceStr), 
      categoryId,
      authorId,
      thumbnail: coverImageUrl || undefined, 
    });
    return c.json({ success: true, data: newBook }, 201);
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
