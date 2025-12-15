import { db } from "../../config/db";
import { BookTable } from "../../db/schema";
import { eq, and, ilike, asc, desc, sql, count } from "drizzle-orm";
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
        coverImage: data.thumbnail as string | undefined,
      })
      .returning();
    return newBook;
  },
  getAllBooks: async (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = query.search;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    const whereConditions = [];
    if (search) {
      whereConditions.push(ilike(BookTable.title, `%${search}%`));
    }

    const orderByCondition =
      sortBy === "price"
        ? sortOrder === "asc"
          ? asc(BookTable.price)
          : desc(BookTable.price)
        : sortBy === "title"
        ? sortOrder === "asc"
          ? asc(BookTable.title)
          : desc(BookTable.title)
        : sortOrder === "asc"
        ? asc(BookTable.id)
        : desc(BookTable.id);
    const books = await db.query.BookTable.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      limit: limit,
      offset: offset,
      orderBy: orderByCondition,
      with: {
        category: { columns: { id: true, name: true } },
        user: { columns: { id: true, name: true, email: true } },
        tags: {
          with: {
            tag: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    const [totalResult] = await db
      .select({ count: count() })
      .from(BookTable)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalBooks = totalResult.count;
    const totalPages = Math.ceil(totalBooks / limit);
    const formattedBook = books.map((book) => ({
      ...book,
      tags: book.tags.map((t) => t.tag),
    }));
    return {
      formattedBook,
      pagination: {
        total: totalBooks,
        totalPages,
        page,
        limit,
      },
    };
  },
  getMyBooks: async (userId: string, query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 3;
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
  getBookById: async (id: string) => {
    const book = await db.query.BookTable.findFirst({
      where: eq(BookTable.id, id),
      with: {
        category: {
          columns: { id: true, name: true },
        },
        author: {
          columns: { id: true, name: true, image: true, bio: true },
        },
        user: {
          columns: { id: true, name: true },
        },
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    return book;
  },
};
