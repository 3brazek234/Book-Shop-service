import { Hono } from "hono";
import {
  forgetPassword,
  login,
  logout,
  register,
  resendOtp,
  resetPassword,
  verifyEmail,
} from "./auth.controller";
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "./auth.schema";
import { zValidator } from "@hono/zod-validator";
import { jwt } from "hono/jwt";
import "dotenv/config";
import { deleteCookie } from "hono/cookie";
export const authRouter = new Hono();
authRouter.post("/register", zValidator("json", registerSchema), register);
authRouter.post("/verify", zValidator("json", verifyOtpSchema), verifyEmail);
authRouter.post("/resend-otp", zValidator("json", resendOtpSchema), resendOtp);
authRouter.post("/login", zValidator("json", loginSchema), login);
authRouter.post(
  "/forget-password",
  zValidator("json", forgetPasswordSchema),
  forgetPassword
);
authRouter.post(
  "/reset-password",
  zValidator("json", resetPasswordSchema),
  resetPassword
);
authRouter.post(
  "/logout",
  (c) => {
    deleteCookie(c, "token");
  },
  logout
);
