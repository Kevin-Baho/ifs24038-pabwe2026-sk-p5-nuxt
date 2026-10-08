import { fetchApi } from "../../../helpers/apiHelper";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user?: {
      id: string;
      name: string;
      email: string;
      photo?: string;
    };
  };
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return await fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      requiresAuth: false
    });
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    return await fetchApi<AuthResponse>("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      requiresAuth: false
    });
  }
};

