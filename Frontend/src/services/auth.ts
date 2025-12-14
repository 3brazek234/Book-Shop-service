import api from "@/lib/api";
import type { User } from "@/types";

export const getMe = async (): Promise<User> => {
    const response = await api.get("/user");
    return response.data;
};

export const updateProfile = async (data: { name: string; email: string; image?: File }): Promise<User> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    if (data.image) {
        formData.append('image', data.image);
    }
    const response = await api.put("/user", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
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
