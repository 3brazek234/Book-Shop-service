import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { booksService } from './books.service'; // Adjust path as needed
import { db } from '../../config/db'; // Adjust path as needed
import { BookTable } from '../../db/schema'; // Adjust path as needed

// 1. Mock the DB module
vi.mock('../../config/db', () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
    query: {
      BookTable: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
  },
}));

describe('Books Service', () => {
  // Clear mocks after each test to ensure clean state
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createBook', () => {
    it('should insert a new book and return it', async () => {
      const mockUserId = 'user-123';
      const mockInput = {
        title: 'Test Book',
        description: 'Test Desc',
        price: "100",
        categoryId: 'cat-1',
        authorId: 'auth-1',
        thumbnail: 'image.jpg',
      };

      const mockReturnedBook = { id: 'book-1', ...mockInput, price: '100' };

      // Mocking the chain: insert -> values -> returning
      const returningMock = vi.fn().mockResolvedValue([mockReturnedBook]);
      const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
      vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as any);

      const result = await booksService.createBook(mockUserId, mockInput);

      // Assertions
      expect(db.insert).toHaveBeenCalledWith(BookTable);
      expect(valuesMock).toHaveBeenCalledWith({
        title: mockInput.title,
        description: mockInput.description,
        price: '100', // Converted to string in service
        categoryId: mockInput.categoryId,
        authorId: mockInput.authorId,
        userId: mockUserId,
        coverImage: mockInput.thumbnail,
      });
      expect(result).toEqual(mockReturnedBook);
    });
  });

  describe('getAllBooks', () => {
    it('should return paginated and formatted books with default query params', async () => {
      const mockBooks = [
        {
          id: '1',
          title: 'Book 1',
          tags: [{ tag: { id: 't1', name: 'Fiction' } }], // Nested structure
        },
      ];
      
      vi.mocked(db.query.BookTable.findMany).mockResolvedValue(mockBooks as any);

      const whereMock = vi.fn().mockResolvedValue([{ count: 1 }]);
      const fromMock = vi.fn().mockReturnValue({ where: whereMock });
      vi.mocked(db.select).mockReturnValue({ from: fromMock } as any);

      const query = {}; // Empty query
      const result = await booksService.getAllBooks(query);

      // Check formatting (tags should be flattened)
      expect(result.formattedBook[0].tags).toEqual([{ id: 't1', name: 'Fiction' }]);
      
      // Check pagination calculation
      expect(result.pagination).toEqual({
        total: 1,
        totalPages: 1,
        page: 1,
        limit: 10,
      });

      // Verify DB calls defaults
      expect(db.query.BookTable.findMany).toHaveBeenCalledWith(expect.objectContaining({
        limit: 10,
        offset: 0,
      }));
    });

    it('should handle search queries', async () => {
        // Setup minimal mocks to avoid crashes
        vi.mocked(db.query.BookTable.findMany).mockResolvedValue([]);
        const whereMock = vi.fn().mockResolvedValue([{ count: 0 }]);
        const fromMock = vi.fn().mockReturnValue({ where: whereMock });
        vi.mocked(db.select).mockReturnValue({ from: fromMock } as any);

        const query = { search: 'Harry Potter' };
        await booksService.getAllBooks(query);
        expect(db.query.BookTable.findMany).toHaveBeenCalled();
        expect(whereMock).toHaveBeenCalled();
    });
  });

  describe('getMyBooks', () => {
    it('should return books for a specific user', async () => {
      const mockUserId = 'user-123';
      const mockBooks = [{ id: '1', title: 'My Book' }];
      
      vi.mocked(db.query.BookTable.findMany).mockResolvedValue(mockBooks as any);

      const result = await booksService.getMyBooks(mockUserId, { page: 1, limit: 3 });

      expect(result).toEqual(mockBooks);
      expect(db.query.BookTable.findMany).toHaveBeenCalledWith(expect.objectContaining({
        limit: 3,
        with: { category: true },
     
      }));
    });
  });

  describe('getBookById', () => {
    it('should return a single book with relations', async () => {
      const mockBook = { 
        id: '1', 
        title: 'Detailed Book',
        author: { name: 'John' } 
      };

      vi.mocked(db.query.BookTable.findFirst).mockResolvedValue(mockBook as any);

      const result = await booksService.getBookById('1');

      expect(result).toEqual(mockBook);
      expect(db.query.BookTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        with: expect.objectContaining({
            author: expect.any(Object),
            category: expect.any(Object),
            user: expect.any(Object),
            tags: expect.any(Object)
        })
      }));
    });

    it('should return undefined if book not found', async () => {
        vi.mocked(db.query.BookTable.findFirst).mockResolvedValue(undefined);
        const result = await booksService.getBookById('999');
        expect(result).toBeUndefined();
    });
  });
});