import { describe, it, expect, vi, beforeEach } from "vitest";
import { authorsRouter } from "./authors.routes";
import { sign } from "hono/jwt";

// 1. Mock the controller to avoid DB calls
vi.mock("./authors.controller", () => ({
  // We mock the implementation to return a simple Hono JSON response
  getAuyhors: vi.fn((c) => c.json({ authors: [] }, 200)),
  createAuthor: vi.fn((c) => c.json({ success: true }, 201)),
}));

// Import the mocked functions to verify they are called
import { getAuyhors, createAuthor } from "./authors.controller";

describe("Authors Router", () => {
  // Set the secret for testing purposes
  const TEST_SECRET = "test-secret";
  process.env.JWT_SECRET = TEST_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /", () => {
    it("should be public and return 200", async () => {
      // Act: Simulate a request to the router
      const res = await authorsRouter.request("/", {
        method: "GET",
      });

      // Assert
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ authors: [] });
      expect(getAuyhors).toHaveBeenCalled();
    });
  });

  describe("POST /", () => {
    it("should return 401 Unauthorized if no token provided", async () => {
      // Act
      const res = await authorsRouter.request("/", {
        method: "POST",
      });

      // Assert
      expect(res.status).toBe(401);
      // Controller should NOT be called
      expect(createAuthor).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", async () => {
      // Act
      const res = await authorsRouter.request("/", {
        method: "POST",
        headers: {
            Authorization: "Bearer invalid_token_string"
        }
      });

      // Assert
      expect(res.status).toBe(401);
      expect(createAuthor).not.toHaveBeenCalled();
    });

    it("should return 201 if valid JWT is provided", async () => {
      // Arrange: Generate a real valid token using the same secret
      const payload = { sub: "user-123", role: "admin" };
      const token = await sign(payload, TEST_SECRET);

      // Act
      const res = await authorsRouter.request("/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ success: true });
      expect(createAuthor).toHaveBeenCalled();
    });
  });
});