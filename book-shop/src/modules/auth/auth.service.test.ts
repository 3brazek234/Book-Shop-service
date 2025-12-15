import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { authService } from "./auth.service"; // Adjust path
import { RegisterInput, VerifyOtpInput, LoginInput } from "../../types/tupes";

vi.mock("../../config/db", () => {
  return {
    db: {
      query: {
        UserTable: {
          findFirst: vi.fn(),
        },
      },
      insert: vi.fn(),
      update: vi.fn(),
    },
  };
});

// 2. Mock Utils & Config
vi.mock("../../utils/email", () => ({ sendEmail: vi.fn() }));
vi.mock("../../utils/generateOtp", () => ({ generateOtp: vi.fn(() => "123456") }));
vi.mock("../../utils/generateToken", () => ({ generateToken: vi.fn(() => "mock-jwt-token") }));
vi.mock("../../config/redis", () => ({
  redisClient: {
    set: vi.fn(),
    del: vi.fn(),
  },
}));

// 3. Mock Bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password_mock"),
    compare: vi.fn(),
  },
}));

// --- IMPORTS AFTER MOCKS ---
import { db } from "../../config/db";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../utils/email";
import { redisClient } from "../../config/redis";

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- REGISTER TESTS ---
  describe("register", () => {
    const input: RegisterInput = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };

    it("should register a new user successfully", async () => {
      // Arrange
      (db.query.UserTable.findFirst as any).mockResolvedValue(null); // User doesn't exist

      const mockNewUser = {
        id: "user-1",
        ...input,
        password: "hashed_password_mock",
        otp: "123456",
      };

      // Mock Insert Chain: .insert().values().returning()
      const mockReturning = vi.fn().mockResolvedValue([mockNewUser]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
      (db.insert as any).mockImplementation(mockInsert);

      // Act
      const result = await authService.register(input);

      // Assert
      expect(db.query.UserTable.findFirst).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
      expect(mockInsert).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
      // Expect result to exclude password and otp
      expect(result).not.toHaveProperty("password");
      expect(result).not.toHaveProperty("otp");
      expect(result.email).toBe(input.email);
    });

    it("should throw error if email already exists", async () => {
      // Arrange
      (db.query.UserTable.findFirst as any).mockResolvedValue({ id: "1" });

      // Act & Assert
      await expect(authService.register(input)).rejects.toThrow("Email already exists");
    });
  });

  // --- VERIFY OTP TESTS ---
  describe("verifyOtp", () => {
    const input: VerifyOtpInput = { email: "test@example.com", otp: "123456" };

    it("should verify user successfully", async () => {
      // Arrange
      const mockUser = {
        id: "user-1",
        email: input.email,
        otp: "123456",
        isActivated: false,
        otpExpiry: new Date(Date.now() + 10000), // Future date
      };
      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);

      // Mock Update Chain
      const mockWhere = vi.fn().mockResolvedValue(undefined);
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
      (db.update as any).mockImplementation(mockUpdate);

      // Act
      const result = await authService.verifyOtp(input);

      // Assert
      expect(mockSet).toHaveBeenCalledWith({
        isActivated: true,
        otp: null,
        otpExpiry: null,
      });
      expect(result.message).toBe("Account verified successfully");
    });

    it("should throw error if OTP is invalid", async () => {
      const mockUser = {
        id: "user-1",
        otp: "999999", // Different OTP
        isActivated: false,
      };
      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);

      await expect(authService.verifyOtp(input)).rejects.toThrow("Invalid OTP");
    });

    it("should throw error if OTP is expired", async () => {
      const mockUser = {
        id: "user-1",
        otp: "123456",
        isActivated: false,
        otpExpiry: new Date(Date.now() - 10000), // Past date
      };
      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);

      await expect(authService.verifyOtp(input)).rejects.toThrow("OTP has expired");
    });
  });

  // --- LOGIN TESTS ---
  describe("login", () => {
    const input: LoginInput = { email: "test@example.com", password: "password123" };

    it("should return token and user data on successful login", async () => {
      // Arrange
      const mockUser = {
        id: "user-1",
        email: input.email,
        password: "hashed_password",
        isActivated: true,
        name: "Test",
        image: "img.jpg",
      };
      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true); // Password matches

      // Act
      const result = await authService.login(input);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(input.password, mockUser.password);
      expect(redisClient.set).toHaveBeenCalledWith(
        `user:${mockUser.id}:token`,
        "mock-jwt-token",
        expect.any(Object)
      );
      expect(result).toHaveProperty("token", "mock-jwt-token");
    });

    it("should throw error if user is not verified", async () => {
      const mockUser = { isActivated: false };
      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);

      await expect(authService.login(input)).rejects.toThrow("User is not verified");
    });

    it("should throw error if password is incorrect", async () => {
      const mockUser = { isActivated: true, password: "hashed" };
      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(false); // Wrong password

      await expect(authService.login(input)).rejects.toThrow("Invalid credentials");
    });
  });

  // --- LOGOUT TESTS ---
  describe("logout", () => {
    it("should delete token from redis", async () => {
      const userId = "user-1";
      await authService.logout(userId);
      expect(redisClient.del).toHaveBeenCalledWith(`user:${userId}:token`);
    });
  });

  // --- FORGET PASSWORD TESTS ---
  describe("forgetPassword", () => {
    it("should set static OTP and send email", async () => {
      const input = { email: "test@example.com" };
      const mockUser = { id: "user-1", email: input.email };
      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);

      // Mock update chain
      const mockWhere = vi.fn().mockResolvedValue(undefined);
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
      (db.update as any).mockImplementation(mockUpdate);

      await authService.forgetPassword(input);

      expect(mockSet).toHaveBeenCalledWith({
        otp: "123456",
        otpExpiry: expect.any(Date),
      });
      expect(sendEmail).toHaveBeenCalled();
    });
  });


  describe("resetPassword", () => {
    const input = { email: "test@example.com", otp: "123456", password: "newpassword" };

    it("should reset password successfully", async () => {
      const mockUser = {
        id: "user-1",
        otp: "123456",
        otpExpiry: new Date(Date.now() + 10000),
      };
      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);
      
      // Mock update chain
      const mockWhere = vi.fn().mockResolvedValue(undefined);
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
      (db.update as any).mockImplementation(mockUpdate);

      await authService.resetPassword(input);

      expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
      expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
          password: "hashed_password_mock",
          otp: null
      }));
    });
  });
});