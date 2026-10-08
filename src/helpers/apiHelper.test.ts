import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  getBaseUrl,
  fetchApi
} from "./apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Token Management", () => {
    it("should get null when no token is set", () => {
      expect(getAccessToken()).toBeNull();
    });

    it("should put and get access token correctly", () => {
      putAccessToken("test-token-123");
      expect(getAccessToken()).toBe("test-token-123");
    });

    it("should remove access token correctly", () => {
      putAccessToken("test-token-123");
      removeAccessToken();
      expect(getAccessToken()).toBeNull();
    });

    it("should handle SSR / undefined window gracefully in token methods", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(getAccessToken()).toBeNull();
      expect(() => putAccessToken("test")).not.toThrow();
      expect(() => removeAccessToken()).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe("getBaseUrl", () => {
    it("should return correct Delcom base URL", () => {
      expect(getBaseUrl()).toBe("https://open-api.delcom.org/api/v1");
    });
  });

  describe("fetchApi", () => {
    it("should make fetch call with base URL when relative path provided", async () => {
      const mockResponse = { success: true, data: { id: 1 } };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => mockResponse
      });

      const result = await fetchApi("/users");
      expect(global.fetch).toHaveBeenCalledWith(
        "https://open-api.delcom.org/api/v1/users",
        expect.objectContaining({
          headers: {}
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should attach Authorization header when token exists and requiresAuth is true", async () => {
      putAccessToken("my-secret-token");
      const mockResponse = { success: true };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => mockResponse
      });

      await fetchApi("/users/me", { requiresAuth: true });
      expect(global.fetch).toHaveBeenCalledWith(
        "https://open-api.delcom.org/api/v1/users/me",
        expect.objectContaining({
          headers: {
            Authorization: "Bearer my-secret-token"
          }
        })
      );
    });

    it("should not attach Authorization header if requiresAuth is false", async () => {
      putAccessToken("my-secret-token");
      const mockResponse = { success: true };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => mockResponse
      });

      await fetchApi("/auth/login", { requiresAuth: false });
      expect(global.fetch).toHaveBeenCalledWith(
        "https://open-api.delcom.org/api/v1/auth/login",
        expect.objectContaining({
          headers: {}
        })
      );
    });

    it("should handle full URL if endpoint starts with http", async () => {
      const mockResponse = { success: true };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => mockResponse
      });

      await fetchApi("https://custom-api.com/status", { requiresAuth: false });
      expect(global.fetch).toHaveBeenCalledWith(
        "https://custom-api.com/status",
        expect.objectContaining({
          headers: {}
        })
      );
    });

    it("should parse text response when content-type is not JSON", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => "text/plain" },
        text: async () => "Plain text response"
      });

      const result = await fetchApi("/status", { requiresAuth: false });
      expect(result).toBe("Plain text response");
    });

    it("should throw error with API message when response is not ok and JSON message provided", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: { get: () => "application/json" },
        json: async () => ({ message: "Email already taken" })
      });

      await expect(fetchApi("/auth/register")).rejects.toThrow("Email already taken");
    });

    it("should throw fallback error when response is not ok and no message provided", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        headers: { get: () => "text/plain" },
        text: async () => "Internal error"
      });

      await expect(fetchApi("/server-error")).rejects.toThrow(
        "Request failed with status 500"
      );
    });
  });
});

