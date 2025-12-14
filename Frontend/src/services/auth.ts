import api from "@/lib/api";
import type { User } from "@/types";

export const getMe = async (): Promise<User> => {
    const response = await api.get("/user");
    return response.data;
};


export const verifyOtp = async (data: { email: string; otp: string }) => {
    const response = await api.post("/auth/verify", data);
    return response.data;
};

export const resendOtp = async (data: { email: string }) => {
    const response = await api.post("/auth/resend-otp", data);
    return response.data;
};
