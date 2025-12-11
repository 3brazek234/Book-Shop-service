import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "name must be at least 3 characters"),
  email: z.string().email("invalid email"),
  password: z.string().min(6, "password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("invalid email"),
  password: z.string().min(6, "password must be at least 6 characters long"),
});
export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});
export const resendOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;