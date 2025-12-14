import { describe, it, expect, vi, beforeEach } from "vitest";
import { sign } from "hono/jwt";

vi.mock("./authors.controller", () => ({
  getAuyhors: vi.fn((c) => c.json({ authors: [] }, 200)),
  createAuthor: vi.fn((c) => c.json({ success: true }, 201)),
}));

import { createAuthor } from "./authors.controller";

describe("Authors Router", () => {
  const TEST_SECRET = "test-secret";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules(); 
    process.env.JWT_SECRET = TEST_SECRET; 
  });

  it("should return 201 if valid JWT is provided", async () => {
    const { authorsRouter } = await import("./authors.routes");

    const payload = { sub: "user-123", role: "admin" };
    const token = await sign(payload, TEST_SECRET);

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

  it("should return 401 if no token provided", async () => {
     const { authorsRouter } = await import("./authors.routes");
     const res = await authorsRouter.request("/", { method: "POST" });
     expect(res.status).toBe(401);
  });
});