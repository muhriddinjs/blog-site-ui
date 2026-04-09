import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://api.muhriddinjs.uz/api/v1";

// Backendning asosiy manzili (rasmlar uchun)
// https://api.muhriddinjs.uz/api/v1 -> https://api.muhriddinjs.uz
export const API_BASE_URL = API_URL.replace("/api/v1", "");

/**
 * Rasmlar manzillarini to'g'rilash:
 * /uploads/abc.jpg -> https://api.muhriddinjs.uz/uploads/abc.jpg
 */
export const resolveImageUrl = (path?: string | null): string => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  // Agarda path slash bilan boshlanmasa va relative bo'lsa
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
