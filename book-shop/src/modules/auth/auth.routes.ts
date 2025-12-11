import { Hono } from "hono";
import { login, register, resendOtp, verifyEmail } from "./auth.controller";
import { loginSchema, registerSchema, resendOtpSchema, verifyOtpSchema } from "./auth.schema";
import { zValidator } from "@hono/zod-validator";

export const authRouter = new Hono();
authRouter.post("/register", zValidator("json", registerSchema), register);
authRouter.post("/verify", zValidator("json", verifyOtpSchema), verifyEmail);
authRouter.post("/resend-otp", zValidator("json", resendOtpSchema), resendOtp)
authRouter.post("/login", zValidator("json", loginSchema), login)