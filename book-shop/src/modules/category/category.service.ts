import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { CategoryTable } from "../../db/schema";
import { CategoryInput } from "./category.schema";

export const categoriesService = {
  getAll: async () => {
    return await db.select().from(CategoryTable);
  },

  create: async (data: CategoryInput) => {
    const [newCategory] = await db
      .insert(CategoryTable)
      .values(data)
      .returning();
    return newCategory;
  },

  update: async (id: string, data: CategoryInput) => {
    const [updatedCategory] = await db
      .update(CategoryTable)
      .set(data)
      .where(eq(CategoryTable.id, id))
      .returning();
    return updatedCategory;
  },

  delete: async (id: string) => {
    await db.delete(CategoryTable).where(eq(CategoryTable.id, id));
    return { message: "Category deleted successfully" };
  },
};