import api from "../api/api";

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_admin: boolean;
}

export const authService = {
  login: async (formData: FormData) => {
    const { data } = await api.post<LoginResponse>("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }
    return data;
  },

  getMe: async () => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const { data } = await api.post("/auth/change-password", null, {
      params: { old_password: oldPassword, new_password: newPassword }
    });
    return data;
  },
};
