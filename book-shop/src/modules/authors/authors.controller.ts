import { Context } from "hono";
import { db } from "../../config/db";
import { AuthorTable } from "../../db/schema";
import { uploadToCloudinary } from "../../utils/cloudinary";

export const createAuthor = async (c: Context) => {
  try {
    const body = await c.req.parseBody();
    const name = body["name"] as string;
    const bio = (body["bio"] as string) || undefined;
    const imageFile = body["image"] as File | undefined;
    let imageUrl = null;
    if (imageFile && imageFile instanceof File) {
      imageUrl = await uploadToCloudinary(imageFile, "book-shop/authors");
    }
    if (!name || name.length < 2) {
      throw new Error("Name is required and must be 2+ chars");
    }
    const [author] = await db
      .insert(AuthorTable)
      .values({
        name,
        bio,
        image: imageUrl,
      })
      .returning();
    return c.json({ success: true, data: author });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};
