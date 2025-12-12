interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  total_copies: number;
  available_copies: number;
  description: string;
  color: string;
  videoUrl: string;
  cover: string;
  summary: string;
  createdAt: Date | null;
}
// src/features/auth/types.ts
export type AuthView = "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD" | "OTP" | "RESET_PASSWORD";
interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}
export interface Book {
  id: string
  title: string
  price: number
  thumbnail: string
  author: string
  category: string
  description: string
  createdAt?: Date
  updatedAt?: Date
}

export interface User {
  id: string
  email: string
  name: string
  role?: "admin" | "user"
  createdAt?: Date
}

export interface CreateBookDto {
  title: string
  price: number
  thumbnail: string
  author: string
  category: string
  description: string
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

export interface BooksQueryParams {
  page?: number
  limit?: number
  search?: string
  sort?: "title" | "author" | "price" | "createdAt"
  order?: "asc" | "desc"
}

export interface BooksResponse {
  books: Book[]
  total: number
  page: number
  limit: number
  totalPages: number
}

