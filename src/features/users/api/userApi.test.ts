import { describe, it, expect, vi, beforeEach } from "vitest";
import { userApi } from "./userApi";
import * as apiHelper from "../../../helpers/apiHelper";

describe("userApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches profile from /users/me", async () => {
    const mockUser = { id: "1", name: "Alice", email: "alice@delcom.org" };
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, data: mockUser });

    const result = await userApi.getProfile();
    expect(fetchApiSpy).toHaveBeenCalledWith("/users/me");
    expect(result.data).toEqual(mockUser);
  });

  it("fetches all users from /users", async () => {
    const mockUsers = [{ id: "1", name: "Alice", email: "alice@delcom.org" }];
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, data: mockUsers });

    const result = await userApi.getAllUsers();
    expect(fetchApiSpy).toHaveBeenCalledWith("/users");
    expect(result.data).toEqual(mockUsers);
  });

  it("updates user profile at /users/me", async () => {
    const mockResponse = {
      success: true,
      message: "Updated",
      data: { id: "1", name: "Updated Name", email: "alice@delcom.org" }
    };
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue(mockResponse);

    const payload = { name: "Updated Name" };
    const result = await userApi.updateProfile(payload);

    expect(fetchApiSpy).toHaveBeenCalledWith("/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    expect(result).toEqual(mockResponse);
  });

  it("changes password at /users/me/password", async () => {
    const mockResponse = { success: true, message: "Password updated" };
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue(mockResponse);

    const payload = {
      old_password: "old",
      password: "new",
      password_confirmation: "new"
    };
    const result = await userApi.changePassword(payload);

    expect(fetchApiSpy).toHaveBeenCalledWith("/users/me/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    expect(result).toEqual(mockResponse);
  });

  it("uploads avatar to /users/me/photo with FormData", async () => {
    const mockResponse = {
      success: true,
      message: "Photo uploaded",
      data: { photo: "https://photos/avatar.png" }
    };
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue(mockResponse);

    const file = new File(["dummy"], "avatar.png", { type: "image/png" });
    const result = await userApi.uploadAvatar(file);

    expect(fetchApiSpy).toHaveBeenCalledWith(
      "/users/me/photo",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData)
      })
    );
    expect(result).toEqual(mockResponse);
  });
});

