import { Context } from "hono";
import { booksService } from "./books.service";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { CreateBookInput } from "./books.schema";
export const createBook = async (c: Context) => {
  try {
    const user = c.get("user");
    const body = await c.req.parseBody();

    let thumbnailUrl: string | undefined = undefined;
    const imageFile = body["thumbnail"];

    if (imageFile && imageFile instanceof File) {
       thumbnailUrl = await uploadToCloudinary(imageFile, "books-covers");
    }

    const bookData: CreateBookInput = {
      title: body["title"] as string,
      description: body["description"] as string,
      price: String(body["price"]), 
      categoryId: body["categoryId"] as string,
      authorId: body["authorId"] as string,
      publicationYear: body["publicationYear"] ? Number(body["publicationYear"]) : undefined,
      thumbnail: thumbnailUrl, 
    };

    const newBook = await booksService.createBook(user.id, bookData);

    return c.json({ success: true, data: newBook }, 201);
  } catch (error: any) {
    console.error("Create Book Error:", error);
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
export const getBookById = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const book = await booksService.getBookById(id);
    if (!book) {
      return c.json({ success: false, message: "Book not found" }, 404);
    }
    return c.json({ success: true, data: book }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};
