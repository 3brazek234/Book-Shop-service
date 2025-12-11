import { db } from "../../config/db";
import { BookTable } from "../../db/schema";
import { eq, and, ilike, asc, desc } from "drizzle-orm";
import { CreateBookInput } from "./books.schema";

export const booksService = {
  createBook: async (userId: string, data: CreateBookInput) => {
    const [newBook] = await db
      .insert(BookTable)
      .values({
        title: data.title,
        description: data.description,
        price: data.price.toString(),
        categoryId: data.categoryId,
        authorId: data.authorId,
        userId: userId,
        coverImage: data.thumbnail,
      })
      .returning();
    return newBook;
  },
  getAllBooks: async (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = query.search;
    const whereConditions = [];
    if (search) {
      whereConditions.push(ilike(BookTable.title, `%${search}%`));
    }
    const books = await db.query.BookTable.findMany({
      where: and(...whereConditions),
      limit: limit,
      offset: offset,
      with: {
        category: {
          columns: {
            id: true,
            name: true, // هات اسم القسم بس
          },
        },
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!books) {
      throw new Error("Books not found");
    }

    return books;
  },
  getMyBooks: async (userId: string, query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = query.search;
    const sort =
      query.sort === "desc" ? desc(BookTable.title) : asc(BookTable.title);

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
      },
    });

    return books;
  },
};
