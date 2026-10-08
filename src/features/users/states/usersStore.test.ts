import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUsersStore } from "./usersStore";
import { userApi } from "../api/userApi";

describe("usersStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it("initializes with initial state", () => {
    const store = useUsersStore();
    expect(store.currentUser).toBeNull();
    expect(store.users).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  describe("fetchProfile", () => {
    it("successfully fetches profile", async () => {
      const store = useUsersStore();
      const mockUser = { id: "1", name: "Alice", email: "alice@delcom.org" };
      vi.spyOn(userApi, "getProfile").mockResolvedValue({ success: true, data: mockUser });

      const res = await store.fetchProfile();
      expect(res).toEqual(mockUser);
      expect(store.currentUser).toEqual(mockUser);
      expect(store.isLoading).toBe(false);
    });

    it("handles error during fetchProfile with explicit message", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "getProfile").mockRejectedValue(new Error("Unauthorized"));

      await expect(store.fetchProfile()).rejects.toThrow("Unauthorized");
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe("Unauthorized");
    });

    it("handles error during fetchProfile with fallback message", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "getProfile").mockRejectedValue({});

      await expect(store.fetchProfile()).rejects.toEqual({});
      expect(store.error).toBe("Gagal memuat profil pengguna");
    });
  });

  describe("fetchUsers", () => {
    it("successfully fetches all users", async () => {
      const store = useUsersStore();
      const mockUsers = [{ id: "1", name: "Alice", email: "alice@delcom.org" }];
      vi.spyOn(userApi, "getAllUsers").mockResolvedValue({ success: true, data: mockUsers });

      const res = await store.fetchUsers();
      expect(res).toEqual(mockUsers);
      expect(store.users).toEqual(mockUsers);
      expect(store.isLoading).toBe(false);
    });

    it("handles error during fetchUsers with explicit message", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "getAllUsers").mockRejectedValue(new Error("Network Error"));

      await expect(store.fetchUsers()).rejects.toThrow("Network Error");
      expect(store.error).toBe("Network Error");
    });

    it("handles error during fetchUsers with fallback message", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "getAllUsers").mockRejectedValue({});

      await expect(store.fetchUsers()).rejects.toEqual({});
      expect(store.error).toBe("Gagal memuat daftar pengguna");
    });
  });

  describe("updateProfile", () => {
    it("updates current profile name successfully", async () => {
      const store = useUsersStore();
      store.currentUser = { id: "1", name: "Old Name", email: "alice@delcom.org" };
      vi.spyOn(userApi, "updateProfile").mockResolvedValue({
        success: true,
        message: "Updated",
        data: { id: "1", name: "New Name", email: "alice@delcom.org" }
      });

      const res = await store.updateProfile({ name: "New Name" });
      expect(res.success).toBe(true);
      expect(store.currentUser?.name).toBe("New Name");
      expect(store.isLoading).toBe(false);
    });

    it("updates profile when currentUser is null", async () => {
      const store = useUsersStore();
      store.currentUser = null;
      vi.spyOn(userApi, "updateProfile").mockResolvedValue({
        success: true,
        message: "Updated",
        data: { id: "1", name: "New Name", email: "alice@delcom.org" }
      });

      const res = await store.updateProfile({ name: "New Name" });
      expect(res.success).toBe(true);
      expect(store.currentUser).toBeNull();
    });

    it("handles updateProfile error with fallback message", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "updateProfile").mockRejectedValue({});

      await expect(store.updateProfile({ name: "New" })).rejects.toEqual({});
      expect(store.error).toBe("Gagal memperbarui profil");
    });

    it("handles updateProfile error with explicit message", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "updateProfile").mockRejectedValue(new Error("Update failed"));

      await expect(store.updateProfile({ name: "New" })).rejects.toThrow("Update failed");
      expect(store.error).toBe("Update failed");
    });
  });

  describe("changePassword", () => {
    it("successfully changes password", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "changePassword").mockResolvedValue({
        success: true,
        message: "Password updated"
      });

      const res = await store.changePassword({ old_password: "old", password: "new" });
      expect(res.success).toBe(true);
    });

    it("handles changePassword error with fallback", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "changePassword").mockRejectedValue({});

      await expect(
        store.changePassword({ old_password: "old", password: "new" })
      ).rejects.toEqual({});
      expect(store.error).toBe("Gagal mengubah kata sandi");
    });

    it("handles changePassword error with explicit message", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "changePassword").mockRejectedValue(new Error("Wrong old password"));

      await expect(
        store.changePassword({ old_password: "old", password: "new" })
      ).rejects.toThrow("Wrong old password");
      expect(store.error).toBe("Wrong old password");
    });
  });

  describe("uploadAvatar", () => {
    it("successfully uploads avatar and updates currentUser.photo", async () => {
      const store = useUsersStore();
      store.currentUser = { id: "1", name: "Alice", email: "alice@delcom.org", photo: null };
      vi.spyOn(userApi, "uploadAvatar").mockResolvedValue({
        success: true,
        message: "Uploaded",
        data: { photo: "https://photos/avatar.jpg" }
      });

      const file = new File(["dummy"], "avatar.jpg", { type: "image/jpeg" });
      const res = await store.uploadAvatar(file);

      expect(res.data.photo).toBe("https://photos/avatar.jpg");
      expect(store.currentUser?.photo).toBe("https://photos/avatar.jpg");
    });

    it("handles upload avatar when currentUser is null", async () => {
      const store = useUsersStore();
      store.currentUser = null;
      vi.spyOn(userApi, "uploadAvatar").mockResolvedValue({
        success: true,
        message: "Uploaded",
        data: { photo: "https://photos/avatar.jpg" }
      });

      const file = new File(["dummy"], "avatar.jpg", { type: "image/jpeg" });
      await store.uploadAvatar(file);
      expect(store.currentUser).toBeNull();
    });

    it("handles uploadAvatar error with fallback", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "uploadAvatar").mockRejectedValue({});

      const file = new File(["dummy"], "avatar.jpg", { type: "image/jpeg" });
      await expect(store.uploadAvatar(file)).rejects.toEqual({});
      expect(store.error).toBe("Gagal mengunggah foto profil");
    });

    it("handles uploadAvatar error with explicit message", async () => {
      const store = useUsersStore();
      vi.spyOn(userApi, "uploadAvatar").mockRejectedValue(new Error("File too large"));

      const file = new File(["dummy"], "avatar.jpg", { type: "image/jpeg" });
      await expect(store.uploadAvatar(file)).rejects.toThrow("File too large");
      expect(store.error).toBe("File too large");
    });
  });
});

