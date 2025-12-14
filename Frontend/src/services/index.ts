// services.ts
import { LoginInput, RegisterInput, AddBookInput } from "@/lib/validation";
import api from "@/lib/api";
import type { User, BooksResponse, BooksQueryParams } from "@/types";
type loginResponse = {
  success: boolean;
  token: string;
  user: User;
};
export const login = async (data: LoginInput): Promise<loginResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
export const signup = async (data: RegisterInput) => {
  const response = await api.post("/auth/register", data);
  return response;
};
export const createBook = async (data: AddBookInput & { userId: string }) => {
  const response = await api.post("/books/create", data);
  return response.data;
};
export const forgetPassword = async (email: string) => {
  const response = await api.post("/auth/forget-password", { email });
  return response.data;
}
export const getBooks = async (
  params?: BooksQueryParams
): Promise<BooksResponse> => {
  const response = await api.get("/books/all", { params });
  console.log("res",response);
  return response.data;
};
export const getAuthors = async () => {
  const response = await api.get("/authors");
  return response.data;
};
export const getCategories = async () => {
  const response = await api.get("/category");
  return response.data;
};
export const getBookById = async (id: string) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
}

