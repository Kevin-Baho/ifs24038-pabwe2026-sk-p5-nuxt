import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApi, type LoginPayload, type RegisterPayload } from "../api/authApi";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken
} from "../../../helpers/apiHelper";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(getAccessToken());
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const login = async (payload: LoginPayload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authApi.login(payload);
      if (response && response.data && response.data.token) {
        token.value = response.data.token;
        putAccessToken(response.data.token);
      }
      return response;
    } catch (err: any) {
      error.value = err.message || "Gagal masuk ke sistem";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (payload: RegisterPayload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authApi.register(payload);
      return response;
    } catch (err: any) {
      error.value = err.message || "Gagal mendaftar akun";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    removeAccessToken();
  };

  return {
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout
  };
});

