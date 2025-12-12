import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { updatePasswordSchema, updateUserSchema } from "./user.schema";
import { getProfile, updatePassword, updateProfile } from "./user.controller";
import { jwt } from "hono/jwt";

export const userRouter = new Hono();
userRouter.use("/*", jwt({ secret: process.env.JWT_SECRET! }));
userRouter.post("/", updateProfile);
userRouter.get("/", getProfile);
userRouter.put(
  "/password",
  zValidator("json", updatePasswordSchema),
  updatePassword
);
