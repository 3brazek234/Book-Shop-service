import { describe, it, expect, vi, afterEach } from 'vitest';
import { booksService } from './books.service';
import { db } from '../../config/db'; 
import { BookTable } from '../../db/schema'; 
vi.mock('../../config/db', () => ({
  db: {
    insert: vi.fn(),
    query: {
      BookTable: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    select: vi.fn(),
  },
}));

describe('BooksService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createBook', () => {
    it('should insert a new book and return it', async () => {
      const userId = 'user-123';
      const inputData = {
        title: 'New Book',
        description: 'Desc',
        price: "100",
        categoryId: 'cat-1',
        authorId: 'auth-1',
        thumbnail: 'image.jpg',
      };

      const mockReturnedBook = { id: 'book-1', ...inputData, userId };

      // Chainable Mocking for Drizzle insert
      // db.insert().values().returning()
      const returningMock = vi.fn().mockResolvedValue([mockReturnedBook]);
      const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
      const insertMock = vi.fn().mockReturnValue({ values: valuesMock });
      
      (db.insert as any).mockImplementation(insertMock);

      const result = await booksService.createBook(userId, inputData);

      expect(insertMock).toHaveBeenCalledWith(BookTable);
      expect(valuesMock).toHaveBeenCalledWith(expect.objectContaining({
        title: inputData.title,
        userId: userId,
        price: "100" 
      }));
      expect(result).toEqual(mockReturnedBook);
    });
  });

  describe('getAllBooks', () => {
    it('should return paginated books and pagination info', async () => {
      // Arrange
      const query = { page: 1, limit: 10, search: 'Test' };
      const mockBooks = [{ id: '1', title: 'Test Book' }];
      const mockCount = [{ count: 50 }]; // فرضنا ان فيه 50 كتاب

      // Mock findMany
      (db.query.BookTable.findMany as any).mockResolvedValue(mockBooks);

      // Mock select count query
      // db.select().from().where()
      const whereMock = vi.fn().mockResolvedValue(mockCount);
      const fromMock = vi.fn().mockReturnValue({ where: whereMock });
      (db.select as any).mockReturnValue({ from: fromMock });

      // Act
      const result = await booksService.getAllBooks(query);

      // Assert
      expect(db.query.BookTable.findMany).toHaveBeenCalled();
      expect(result.books).toEqual(mockBooks);
      expect(result.pagination).toEqual({
        total: 50,
        totalPages: 5, // 50 / 10 = 5
        page: 1,
        limit: 10
      });
    });

    it('should use default values for pagination if not provided', async () => {
        // Arrange
        const query = {}; // No params
        const mockBooks : any = [];
        const mockCount = [{ count: 0 }];
  
        (db.query.BookTable.findMany as any).mockResolvedValue(mockBooks);
        
        // Mocking the chain for count
        const whereMock = vi.fn().mockResolvedValue(mockCount);
        const fromMock = vi.fn().mockReturnValue({ where: whereMock });
        (db.select as any).mockReturnValue({ from: fromMock });
  
        // Act
        const result = await booksService.getAllBooks(query);
  
        // Assert
        expect(result.pagination.page).toBe(1);
        expect(result.pagination.limit).toBe(10);
      });
  });

  describe('getMyBooks', () => {
    it('should return user specific books', async () => {
      // Arrange
      const userId = 'user-123';
      const query = { page: 1 };
      const mockBooks = [{ id: '1', title: 'My Book', userId }];

      (db.query.BookTable.findMany as any).mockResolvedValue(mockBooks);

      // Act
      const result = await booksService.getMyBooks(userId, query);

      // Assert
      expect(db.query.BookTable.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
            limit: 3, 
            with: { category: true }
        })
      );
      expect(result).toEqual(mockBooks);
    });
  });

  describe('getBookById', () => {
    it('should return a book with relations if found', async () => {
      // Arrange
      const bookId = 'book-1';
      const mockBook = { 
        id: bookId, 
        title: 'Details',
        category: { id: 1, name: 'Tech' } 
      };

      (db.query.BookTable.findFirst as any).mockResolvedValue(mockBook);

      // Act
      const result = await booksService.getBookById(bookId);

      // Assert
      expect(db.query.BookTable.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
            with: expect.objectContaining({
                author: expect.any(Object),
                tags: expect.any(Object)
            })
        })
      );
      expect(result).toEqual(mockBook);
    });

    it('should return undefined if book not found', async () => {
        // Arrange
        (db.query.BookTable.findFirst as any).mockResolvedValue(undefined);
  
        // Act
        const result = await booksService.getBookById('non-existent');
  
        // Assert
        expect(result).toBeUndefined();
      });
  });
});