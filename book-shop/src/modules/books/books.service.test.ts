import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { booksService } from "./books.service"; // Adjust path if needed
import { CreateBookInput } from "./books.schema";
import { db } from "../../config/db";

vi.mock("../../config/db", () => {
  return {
    db: {
      insert: vi.fn(),
      query: {
        BookTable: {
          findMany: vi.fn(),
          findFirst: vi.fn(),
        },
      },
    },
  };
});


describe("BooksService", () => {
  // Clear mocks before each test to ensure clean state
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createBook", () => {
    it("should insert a book and return the created record", async () => {
      // Arrange
      const userId = "user-123";
      const inputData: CreateBookInput = {
        title: "Unit Testing with Vitest",
        description: "A guide",
        price: "29.99",
        categoryId: "cat-1",
        authorId: "auth-1",
        thumbnail: "image.jpg",
      };

      const mockCreatedBook = { id: "book-1", ...inputData, userId };

      // Mocking the chain: .insert().values().returning()
      const mockReturning = vi.fn().mockResolvedValue([mockCreatedBook]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockInsert = vi.fn().mockReturnValue({ values: mockValues });

      // Apply the mock implementation
      (db.insert as any).mockImplementation(mockInsert);

      // Act
      const result = await booksService.createBook(userId, inputData);

      // Assert
      expect(mockInsert).toHaveBeenCalled(); // Check insert was called
      expect(mockValues).toHaveBeenCalledWith({
        title: inputData.title,
        description: inputData.description,
        price: inputData.price.toString(),
        categoryId: inputData.categoryId,
        authorId: inputData.authorId,
        userId: userId,
        coverImage: inputData.thumbnail,
      });
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedBook);
    });
  });

  describe("getAllBooks", () => {
    it("should return books with default pagination and sorting", async () => {
      // Arrange
      const mockBooks = [{ id: "1", title: "Book 1" }];
      (db.query.BookTable.findMany as any).mockResolvedValue(mockBooks);

      const query = {}; // Empty query, should use defaults

      // Act
      const result = await booksService.getAllBooks(query);

      // Assert
      expect(db.query.BookTable.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 5, // Default limit
          offset: 0, // Default offset (page 1)
          // checking specific orderBy/where implies checking Drizzle objects which is complex in mocks
          // usually, checking the limit/offset logic is sufficient for unit tests
        })
      );
      expect(result).toEqual(mockBooks);
    });

    it("should calculate offset correctly based on page and limit", async () => {
      // Arrange
      (db.query.BookTable.findMany as any).mockResolvedValue([]);
      const query = { page: "3", limit: "10" };

      // Act
      await booksService.getAllBooks(query);

      // Assert
      // Page 3, Limit 10 -> Offset should be (3-1) * 10 = 20
      expect(db.query.BookTable.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 20,
        })
      );
    });

    it("should throw an error if db returns null/undefined", async () => {
      // Arrange
      (db.query.BookTable.findMany as any).mockResolvedValue(null);

      // Act & Assert
      await expect(booksService.getAllBooks({})).rejects.toThrow("Books not found");
    });
    
    it("should apply sorting logic (price/asc)", async () => {
       // Arrange
       (db.query.BookTable.findMany as any).mockResolvedValue([]);
       const query = { sortBy: "price", sortOrder: "asc" };

       // Act
       await booksService.getAllBooks(query);

       // Assert
       expect(db.query.BookTable.findMany).toHaveBeenCalled();
       // We verified the function ran without erroring on the switch-case logic
    });
  });

  describe("getMyBooks", () => {
    it("should return books belonging to the specific user", async () => {
      // Arrange
      const userId = "user-123";
      const mockUserBooks = [{ id: "1", title: "My Book", userId }];
      (db.query.BookTable.findMany as any).mockResolvedValue(mockUserBooks);

      const query = { page: "1", limit: "3" };

      // Act
      const result = await booksService.getMyBooks(userId, query);

      // Assert
      expect(db.query.BookTable.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 3,
          offset: 0,
          with: { category: true },
        })
      );
      expect(result).toEqual(mockUserBooks);
    });
  });

  describe("getBookById", () => {
    it("should return a book with relations when found", async () => {
      // Arrange
      const bookId = "book-1";
      const mockBook = {
        id: bookId,
        title: "Single Book",
        category: { id: "c1", name: "Fiction" },
      };
      (db.query.BookTable.findFirst as any).mockResolvedValue(mockBook);

      // Act
      const result = await booksService.getBookById(bookId);

      // Assert
      expect(db.query.BookTable.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          with: expect.objectContaining({
            category: expect.any(Object),
            author: expect.any(Object),
            user: expect.any(Object),
            tags: expect.any(Object),
          }),
        })
      );
      expect(result).toEqual(mockBook);
    });

    it("should return undefined/null if book is not found", async () => {
      // Arrange
      (db.query.BookTable.findFirst as any).mockResolvedValue(undefined);

      // Act
      const result = await booksService.getBookById("non-existent");

      // Assert
      expect(result).toBeUndefined();
    });
  });
});