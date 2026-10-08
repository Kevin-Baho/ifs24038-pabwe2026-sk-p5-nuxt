import { describe, it, expect, vi, beforeEach } from "vitest";
import { authApi } from "./authApi";
import * as apiHelper from "../../../helpers/apiHelper";

describe("authApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should post credentials to /auth/login with requiresAuth false", async () => {
    const mockResponse = {
      success: true,
      message: "Login successful",
      data: { token: "token-123" }
    };
    const fetchApiSpy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue(mockResponse);

    const payload = { email: "user@delcom.org", password: "password123" };
    const result = await authApi.login(payload);

    expect(fetchApiSpy).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      requiresAuth: false
    });
    expect(result).toEqual(mockResponse);
  });

  it("should post payload to /auth/register with requiresAuth false", async () => {
    const mockResponse = {
      success: true,
      message: "Register successful",
      data: { token: "token-456" }
    };
    const fetchApiSpy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue(mockResponse);

    const payload = {
      name: "John Doe",
      email: "john@delcom.org",
      password: "password123"
    };
    const result = await authApi.register(payload);

    expect(fetchApiSpy).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      requiresAuth: false
    });
    expect(result).toEqual(mockResponse);
  });
});

