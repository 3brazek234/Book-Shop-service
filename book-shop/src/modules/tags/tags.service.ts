import { db } from "../../config/db";
import { TagTable, BookTagsTable } from "../../db/schema";

export const tagsService = {
  createTag: async (name: string) => {
    const [newTag] = await db.insert(TagTable).values({ name }).returning();
    return newTag;
  },

  getAllTags: async () => {
    return await db.select().from(TagTable);
  },

  assignTagToBook: async (bookId: string, tagId: string) => {
    await db
      .insert(BookTagsTable)
      .values({ bookId, tagId })
      .onConflictDoNothing();

    return { message: "Tag assigned successfully" };
  },
};
