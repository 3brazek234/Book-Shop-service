import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3001",
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        // Get token from cookies (client-side)
        if (typeof window !== "undefined") {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;