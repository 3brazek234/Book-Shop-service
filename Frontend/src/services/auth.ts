import api from "@/lib/api";
import type { User } from "@/types";

export const getMe = async (): Promise<User> => {
    const response = await api.get("/user");
    return response.data;
};
