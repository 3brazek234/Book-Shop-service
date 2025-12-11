import { Context } from "hono";
import { db } from "../../config/db";
import { AuthorTable } from "../../db/schema";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { eq } from "drizzle-orm";

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
    const checkIsFound = await db
      .select()
      .from(AuthorTable)
      .where(eq(AuthorTable.name, name));
    if (checkIsFound.length > 0) {
      return c.json({ success: false, message: "Author already exists" }, 400);
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
export const getAuyhors = async (c: Context) => {
  try {
    const authors = await db.select().from(AuthorTable);
    return c.json({ success: true, data: authors });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};
