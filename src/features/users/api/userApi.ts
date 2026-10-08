import { fetchApi } from "../../../helpers/apiHelper";

export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfilePayload {
  name: string;
}

export interface ChangePasswordPayload {
  current_password?: string;
  old_password?: string;
  password?: string;
  new_password?: string;
  password_confirmation?: string;
}

export const userApi = {
  getProfile: async (): Promise<{ success: boolean; data: User }> => {
    return await fetchApi<{ success: boolean; data: User }>("/users/me");
  },

  getAllUsers: async (): Promise<{ success: boolean; data: User[] }> => {
    return await fetchApi<{ success: boolean; data: User[] }>("/users");
  },

  updateProfile: async (
    payload: UpdateProfilePayload
  ): Promise<{ success: boolean; message: string; data: User }> => {
    return await fetchApi<{ success: boolean; message: string; data: User }>("/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },

  changePassword: async (
    payload: ChangePasswordPayload
  ): Promise<{ success: boolean; message: string }> => {
    return await fetchApi<{ success: boolean; message: string }>("/users/me/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },

  uploadAvatar: async (
    file: File
  ): Promise<{ success: boolean; message: string; data: { photo: string } }> => {
    const formData = new FormData();
    formData.append("photo", file);

    return await fetchApi<{ success: boolean; message: string; data: { photo: string } }>(
      "/users/me/photo",
      {
        method: "POST",
        body: formData
      }
    );
  }
};

