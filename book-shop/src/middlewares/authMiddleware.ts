import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export const authCookieBridge = createMiddleware(async (c, next) => {
  const token = getCookie(c, "token");
  if (token) {
    c.req.raw.headers.set("Authorization", `Bearer ${token}`);
  }

  await next();
});
