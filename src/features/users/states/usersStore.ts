import { defineStore } from "pinia";
import { ref } from "vue";
import {
  userApi,
  type User,
  type UpdateProfilePayload,
  type ChangePasswordPayload
} from "../api/userApi";

export const useUsersStore = defineStore("users", () => {
  const currentUser = ref<User | null>(null);
  const users = ref<User[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchProfile = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await userApi.getProfile();
      currentUser.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat profil pengguna";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUsers = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await userApi.getAllUsers();
      users.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat daftar pengguna";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await userApi.updateProfile(payload);
      if (currentUser.value) {
        currentUser.value.name = response.data.name;
      }
      return response;
    } catch (err: any) {
      error.value = err.message || "Gagal memperbarui profil";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const changePassword = async (payload: ChangePasswordPayload) => {
    isLoading.value = true;
    error.value = null;
    try {
      return await userApi.changePassword(payload);
    } catch (err: any) {
      error.value = err.message || "Gagal mengubah kata sandi";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const uploadAvatar = async (file: File) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await userApi.uploadAvatar(file);
      if (currentUser.value && response.data?.photo) {
        currentUser.value.photo = response.data.photo;
      }
      return response;
    } catch (err: any) {
      error.value = err.message || "Gagal mengunggah foto profil";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    currentUser,
    users,
    isLoading,
    error,
    fetchProfile,
    fetchUsers,
    updateProfile,
    changePassword,
    uploadAvatar
  };
});

