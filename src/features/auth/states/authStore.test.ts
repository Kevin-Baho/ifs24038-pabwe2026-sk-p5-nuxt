import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "./authStore";
import { authApi } from "../api/authApi";
import * as apiHelper from "../../../helpers/apiHelper";

describe("authStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("should initialize with default states and computed values", () => {
    const authStore = useAuthStore();
    expect(authStore.token).toBeNull();
    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });

  it("should handle login successfully", async () => {
    const authStore = useAuthStore();
    const mockResponse = {
      success: true,
      message: "Success",
      data: { token: "new-token-123" }
    };
    vi.spyOn(authApi, "login").mockResolvedValue(mockResponse);
    const putTokenSpy = vi.spyOn(apiHelper, "putAccessToken");

    const result = await authStore.login({
      email: "test@example.com",
      password: "password"
    });

    expect(result).toEqual(mockResponse);
    expect(authStore.token).toBe("new-token-123");
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBeNull();
    expect(putTokenSpy).toHaveBeenCalledWith("new-token-123");
  });

  it("should handle login failure and set error", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authApi, "login").mockRejectedValue(new Error("Invalid credentials"));

    await expect(
      authStore.login({ email: "wrong@example.com", password: "wrong" })
    ).rejects.toThrow("Invalid credentials");

    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBe("Invalid credentials");
    expect(authStore.token).toBeNull();
  });

  it("should handle login failure with fallback error message", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authApi, "login").mockRejectedValue({});

    await expect(
      authStore.login({ email: "wrong@example.com", password: "wrong" })
    ).rejects.toEqual({});

    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBe("Gagal masuk ke sistem");
  });

  it("should handle register successfully", async () => {
    const authStore = useAuthStore();
    const mockResponse = {
      success: true,
      message: "Registered",
      data: { token: "token-registered" }
    };
    vi.spyOn(authApi, "register").mockResolvedValue(mockResponse);

    const result = await authStore.register({
      name: "User",
      email: "user@example.com",
      password: "password"
    });

    expect(result).toEqual(mockResponse);
    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBeNull();
  });

  it("should handle register failure and set error", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authApi, "register").mockRejectedValue(new Error("Email already used"));

    await expect(
      authStore.register({
        name: "User",
        email: "existing@example.com",
        password: "password"
      })
    ).rejects.toThrow("Email already used");

    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBe("Email already used");
  });

  it("should handle register failure with fallback error message", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authApi, "register").mockRejectedValue({});

    await expect(
      authStore.register({
        name: "User",
        email: "existing@example.com",
        password: "password"
      })
    ).rejects.toEqual({});

    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBe("Gagal mendaftar akun");
  });

  it("should logout and remove token", () => {
    const authStore = useAuthStore();
    authStore.token = "active-token";
    const removeTokenSpy = vi.spyOn(apiHelper, "removeAccessToken");

    authStore.logout();

    expect(authStore.token).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
    expect(removeTokenSpy).toHaveBeenCalled();
  });
});

