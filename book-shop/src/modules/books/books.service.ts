import { db } from "../../config/db";
import { BookTable } from "../../db/schema";
import { CreateBookInput } from "../../types/tupes";
import { eq, and, ilike, asc, desc, sql } from "drizzle-orm";

export const booksService = {
  createBook: async (userId: string, data: CreateBookInput) => {
    const [newBook] = await db.insert(BookTable).values({
      ...data,
      userId, 
    }).returning();
    return newBook;
  },
  getMyBooks: async (userId: string, query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit; 
    const search = query.search;
    const sort = query.sort === "desc" ? desc(BookTable.title) : asc(BookTable.title);

    const whereConditions = [eq(BookTable.userId, userId)]; 

    if (search) {
      whereConditions.push(ilike(BookTable.title, `%${search}%`));
    }
    const books = await db.query.BookTable.findMany({
      where: and(...whereConditions),
      limit: limit,
      offset: offset,
      orderBy: [sort],
      with: {
        category: true,
      }
    });



    return books;
  }
}