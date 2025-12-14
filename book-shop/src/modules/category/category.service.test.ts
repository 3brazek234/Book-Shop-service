import { describe, it, expect, vi, beforeEach } from "vitest";
import { CategoryInput } from "./category.schema";

// 1. Mock the DB module
vi.mock("../../config/db", () => {
  return {
    db: {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
});

// Import the mocked db to assert against it
import { db } from "../../config/db";
import { categoriesService } from "./category.service";

describe("CategoriesService", () => {
  // Clear mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all categories", async () => {
      // Arrange
      const mockCategories = [
        { id: "1", name: "Fiction" },
        { id: "2", name: "Non-Fiction" },
      ];
      
      // Mock chain: db.select().from()
      const mockFrom = vi.fn().mockResolvedValue(mockCategories);
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
      
      (db.select as any).mockImplementation(mockSelect);

      // Act
      const result = await categoriesService.getAll();

      // Assert
      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });
  });

  describe("create", () => {
    it("should create a category and return it", async () => {
      // Arrange
      const inputData: CategoryInput = { name: "Sci-Fi" };
      const createdCategory = { id: "1", name: "Sci-Fi" };

      // Mock chain: db.insert().values().returning()
      const mockReturning = vi.fn().mockResolvedValue([createdCategory]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockInsert = vi.fn().mockReturnValue({ values: mockValues });

      (db.insert as any).mockImplementation(mockInsert);

      // Act
      const result = await categoriesService.create(inputData);

      // Assert
      expect(db.insert).toHaveBeenCalled();
      expect(mockValues).toHaveBeenCalledWith(inputData);
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toEqual(createdCategory);
    });
  });

  describe("update", () => {
    it("should update a category and return the updated record", async () => {
      // Arrange
      const id = "1";
      const inputData: CategoryInput = { name: "Updated Name" };
      const updatedCategory = { id: "1", name: "Updated Name" };

      // Mock chain: db.update().set().where().returning()
      const mockReturning = vi.fn().mockResolvedValue([updatedCategory]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });

      (db.update as any).mockImplementation(mockUpdate);

      // Act
      const result = await categoriesService.update(id, inputData);

      // Assert
      expect(db.update).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith(inputData);
      // We check that 'where' was called. 
      // Checking the specific argument of `eq` in a unit test is often overkill 
      // or requires mocking `drizzle-orm` exports directly.
      expect(mockWhere).toHaveBeenCalled(); 
      expect(result).toEqual(updatedCategory);
    });
  });

  describe("delete", () => {
    it("should delete a category and return success message", async () => {
      // Arrange
      const id = "1";

      // Mock chain: db.delete().where()
      const mockWhere = vi.fn().mockResolvedValue(undefined);
      const mockDelete = vi.fn().mockReturnValue({ where: mockWhere });

      (db.delete as any).mockImplementation(mockDelete);

      // Act
      const result = await categoriesService.delete(id);

      // Assert
      expect(db.delete).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalled();
      expect(result).toEqual({ message: "Category deleted successfully" });
    });
  });
});