import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { categoriesService } from "./category.service";
import { categorySchema } from "./category.schema";

const categoriesRouter = new Hono();
categoriesRouter.get("/", async (c) => {
  const result = await categoriesService.getAll();
  return c.json({ success: true, data: result });
});
categoriesRouter.use("/*", jwt({ secret: process.env.JWT_SECRET! }));
categoriesRouter.post(
  "/",
  zValidator("json", categorySchema),
  async (c) => {
    const body = await c.req.json();
    const result = await categoriesService.create(body);
    return c.json({ success: true, data: result }, 201);
  }
);
categoriesRouter.put(
  "/:id",
  zValidator("json", categorySchema),
  async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const result = await categoriesService.update(id, body);
    return c.json({ success: true, data: result });
  }
);
categoriesRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await categoriesService.delete(id);
  return c.json({ success: true, message: "Deleted" });
});
export default categoriesRouter;