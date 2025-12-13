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
export const forgetPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().length(6),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Form input schema (accepts strings from form inputs)
export const addBookFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  coverImage: z.string().optional(),
  publicationYear: z.string().optional(),
  authorId: z.string().uuid("Please select an author"),
  categoryId: z.string().uuid("Please select a category"),
});

// Transformed schema for API (with proper types)
export const addBookSchema = addBookFormSchema.transform((data) => {
  const price = parseFloat(data.price);
  if (isNaN(price) || price <= 0) {
    throw new Error("Price must be a valid number greater than 0");
  }

  let publicationYear: number | undefined = undefined;
  if (data.publicationYear && data.publicationYear !== "") {
    const year = parseInt(data.publicationYear);
    if (!isNaN(year)) {
      if (year < 1000 || year > new Date().getFullYear()) {
        throw new Error(`Publication year must be between 1000 and ${new Date().getFullYear()}`);
      }
      publicationYear = year;
    }
  }

  let coverImage: string | undefined = undefined;
  if (data.coverImage && data.coverImage !== "") {
    try {
      new URL(data.coverImage);
      coverImage = data.coverImage;
    } catch {
      throw new Error("Invalid URL");
    }
  }

  return {
    title: data.title,
    description: data.description,
    price,
    coverImage,
    publicationYear,
    authorId: data.authorId,
    categoryId: data.categoryId,
  };
});

export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type AddBookFormInput = z.infer<typeof addBookFormSchema>;
export type AddBookInput = z.infer<typeof addBookSchema>;