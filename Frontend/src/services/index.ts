// services.ts
import { LoginInput, RegisterInput } from "@/lib/validation";
import api from "@/lib/api";

export const login = async (data: LoginInput) => {
    const response = await api.post("/auth/login", data);
    return response;
};
export const signup = async (data: RegisterInput) => {
    const response = await api.post("/auth/signup", data);
    return response;
};