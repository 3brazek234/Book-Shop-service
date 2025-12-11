export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};
export type LoginInput = {
  email: string;
  password: string;
};
export type User = {
  name: string;
  email: string;
  password: string;
  otp: string;
  otpExpiry: Date;
};
export type VerifyOtpInput = {
  email: string;
  otp: string;
};
export type ForgetPasswordInput = {
  email: string;
};
export type ResetPasswordInput = {
  email: string;
  otp: string;
  password: string;
};
export type CreateBookInput = {
  userId: string;
  body: Book;
};
export type Book = {
  id: string;
  title: string;
  userId: string;
  description: string;
  price: number;
  coverImage: string;
  publicationYear: Date;
  authorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};
