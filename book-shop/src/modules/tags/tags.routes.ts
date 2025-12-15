import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { tagsService } from "./tags.service";
import { createTagSchema, assignTagSchema } from "./tags.schema";
import { authCookieBridge } from "../../middlewares/authMiddleware";

const tagsRouter = new Hono();

tagsRouter.get("/", async (c) => {
  const tags = await tagsService.getAllTags();
  return c.json({ success: true, data: tags });
});

tagsRouter.post(
  "/",
  authCookieBridge,
  async (c) => {
    try {
      const body = await c.req.json();
      return c.json({ received: body });
    } catch (e) {
      return c.json({ error: "Failed to parse JSON" });
    }
  }
);

tagsRouter.post(
  "/assign",
  authCookieBridge,
  zValidator("json", assignTagSchema),
  async (c) => {
    const { bookId, tagId } = c.req.valid("json");
    await tagsService.assignTagToBook(bookId, tagId);
    return c.json({ success: true, message: "Tag assigned to book" });
  }
);

export default tagsRouter;
