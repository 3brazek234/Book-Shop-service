import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdatePasswordInput, UpdateUserInput } from "./user.schema";

// 1. Mock External Dependencies
// Mock the Database
vi.mock("../../config/db", () => {
  return {
    db: {
      query: {
        UserTable: {
          findFirst: vi.fn(),
        },
      },
      update: vi.fn(),
    },
  };
});

// Mock Bcrypt
vi.mock("bcryptjs", () => {
  return {
    default: {
      compare: vi.fn(),
      hash: vi.fn(),
    },
  };
});

// Import mocked modules to assert against them
import { db } from "../../config/db";
import bcrypt from "bcryptjs";
import { profileService } from "./user.service";

describe("ProfileService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return the user profile", async () => {
      // Arrange
      const userId = "user-1";
      const mockUser = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        createdAt: new Date(),
        image: "img.jpg",
      };

      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);

      // Act
      const result = await profileService.getProfile(userId);

      // Assert
      expect(db.query.UserTable.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything(), // eq(UserTable.id, userId)
          columns: expect.objectContaining({
            id: true,
            email: true,
          }),
        })
      );
      expect(result).toEqual(mockUser);
    });

    it("should return undefined if user not found", async () => {
      // Arrange
      (db.query.UserTable.findFirst as any).mockResolvedValue(undefined);

      // Act
      const result = await profileService.getProfile("non-existent");

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe("updateProfile", () => {
    it("should update user data and return the updated record", async () => {
      // Arrange
      const userId = "user-1";
      const updateData: UpdateUserInput = { name: "Jane Doe" };
      const updatedUser = {
        id: "user-1",
        name: "Jane Doe",
        email: "john@example.com",
      };

      // Mock Drizzle Chain: .update().set().where().returning()
      const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });

      (db.update as any).mockImplementation(mockUpdate);

      // Act
      const result = await profileService.updateProfile(userId, updateData);

      // Assert
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith(updateData);
      expect(mockWhere).toHaveBeenCalled();
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });
  });

  describe("updatePassword", () => {
    const userId = "user-1";
    const body: UpdatePasswordInput = {
      oldPassword: "oldPass123",
      newPassword: "newPass456",
    };

    it("should throw error if user does not exist", async () => {
      // Arrange
      (db.query.UserTable.findFirst as any).mockResolvedValue(null);

      // Act & Assert
      await expect(profileService.updatePassword(userId, body))
        .rejects.toThrow("Invaild Credintials"); // Note: Matching your specific typo in error message
    });

    it("should throw error if old password is incorrect", async () => {
      // Arrange
      const mockUser = { id: userId, password: "hashedOldPassword" };
      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare to return FALSE
      (bcrypt.compare as any).mockResolvedValue(false);

      // Act & Assert
      await expect(profileService.updatePassword(userId, body))
        .rejects.toThrow("Incorrect old password");
    });

    it("should update password successfully if credentials are valid", async () => {
      // Arrange
      const mockUser = { id: userId, password: "hashedOldPassword" };
      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare to return TRUE
      (bcrypt.compare as any).mockResolvedValue(true);
      
      // Mock bcrypt.hash
      const newHashedPassword = "hashedNewPassword";
      (bcrypt.hash as any).mockResolvedValue(newHashedPassword);

      // Mock DB Update Chain
      // .update().set().where() (no returning in your service code for this function)
      const mockWhere = vi.fn().mockResolvedValue(undefined);
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
      (db.update as any).mockImplementation(mockUpdate);

      // Act
      const result = await profileService.updatePassword(userId, body);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(body.oldPassword, mockUser.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(body.newPassword, 10);
      expect(mockSet).toHaveBeenCalledWith({ password: newHashedPassword });
      expect(result).toEqual({ message: "Password updated successfully" });
    });
  });
});