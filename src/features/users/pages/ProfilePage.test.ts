import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ProfilePage from "./ProfilePage.vue";
import * as toolsHelper from "../../../helpers/toolsHelper";

import { reactive } from "vue";

// --- Module-level mock so every call to useUsersStore() returns our mock object ---
const mockStore = reactive({
  currentUser: null as any,
  isLoading: false,
  error: null as any,
  fetchProfile: vi.fn().mockResolvedValue(null),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
  uploadAvatar: vi.fn()
});

vi.mock("../states/usersStore", () => ({
  useUsersStore: () => mockStore
}));

describe("ProfilePage.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.currentUser = null;
    mockStore.isLoading = false;
    mockStore.error = null;
    mockStore.fetchProfile.mockResolvedValue(null);
    mockStore.updateProfile.mockResolvedValue({ success: true, message: "ok", data: {} });
    mockStore.changePassword.mockResolvedValue({ success: true, message: "ok" });
    mockStore.uploadAvatar.mockResolvedValue({ success: true, message: "ok", data: { photo: "new.jpg" } });
  });

  it("fetches profile on mount and sets initial name", async () => {
    const mockUser = {
      id: "1",
      name: "Budi Santoso",
      email: "budi@example.com",
      photo: "https://example.com/photo.jpg"
    };
    mockStore.fetchProfile.mockImplementation(async () => {
      mockStore.currentUser = mockUser;
      return mockUser;
    });

    const wrapper = mount(ProfilePage);
    await flushPromises();

    expect(mockStore.fetchProfile).toHaveBeenCalled();
    const nameInput = wrapper.find("[data-testid='name-input']");
    expect((nameInput.element as HTMLInputElement).value).toBe("Budi Santoso");
    expect(wrapper.find("[data-testid='avatar-image']").exists()).toBe(true);
  });

  it("handles profile fetch failure on mount gracefully", async () => {
    mockStore.fetchProfile.mockRejectedValue(new Error("Network Error"));

    const wrapper = mount(ProfilePage);
    await flushPromises();

    expect(mockStore.fetchProfile).toHaveBeenCalled();
    expect(wrapper.text()).toContain("Profil Pengguna");
  });

  it("handles file change and validation (> 2MB rejects)", async () => {
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(ProfilePage);

    const largeFile = new File(["dummy"], "large.png", { type: "image/png" });
    Object.defineProperty(largeFile, "size", { value: 3 * 1024 * 1024 });

    const input = wrapper.find("[data-testid='avatar-input']");
    Object.defineProperty(input.element, "files", {
      value: [largeFile],
      configurable: true
    });
    await input.trigger("change");

    expect(showErrorSpy).toHaveBeenCalledWith("Ukuran file maksimal adalah 2MB");
    expect(wrapper.find("[data-testid='upload-button']").exists()).toBe(false);
  });

  it("handles file change within limit, shows preview, and cancels file", async () => {
    const wrapper = mount(ProfilePage);
    const validFile = new File(["dummy"], "small.png", { type: "image/png" });
    Object.defineProperty(validFile, "size", { value: 500 * 1024 });

    const input = wrapper.find("[data-testid='avatar-input']");
    Object.defineProperty(input.element, "files", {
      value: [validFile],
      configurable: true
    });
    await input.trigger("change");

    expect(wrapper.find("[data-testid='upload-button']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='cancel-photo-button']").exists()).toBe(true);

    // Cancel selection
    await wrapper.find("[data-testid='cancel-photo-button']").trigger("click");
    expect(wrapper.find("[data-testid='upload-button']").exists()).toBe(false);
  });

  it("uploads avatar successfully", async () => {
    mockStore.uploadAvatar.mockResolvedValue({ success: true, message: "Uploaded", data: { photo: "new.jpg" } });
    const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

    const wrapper = mount(ProfilePage);
    const validFile = new File(["dummy"], "small.png", { type: "image/png" });
    Object.defineProperty(validFile, "size", { value: 100 * 1024 });

    const input = wrapper.find("[data-testid='avatar-input']");
    Object.defineProperty(input.element, "files", {
      value: [validFile],
      configurable: true
    });
    await input.trigger("change");

    const uploadBtn = wrapper.find("[data-testid='upload-button']");
    expect(uploadBtn.exists()).toBe(true);
    await uploadBtn.trigger("click");
    await flushPromises();

    expect(mockStore.uploadAvatar).toHaveBeenCalledWith(validFile);
    expect(showSuccessSpy).toHaveBeenCalledWith("Foto profil berhasil diperbarui!");
  });

  it("handles upload avatar error", async () => {
    mockStore.uploadAvatar.mockRejectedValue(new Error("Upload gagal"));
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(ProfilePage);
    const validFile = new File(["dummy"], "small.png", { type: "image/png" });
    Object.defineProperty(validFile, "size", { value: 100 * 1024 });

    const input = wrapper.find("[data-testid='avatar-input']");
    Object.defineProperty(input.element, "files", {
      value: [validFile],
      configurable: true
    });
    await input.trigger("change");

    const uploadBtn = wrapper.find("[data-testid='upload-button']");
    expect(uploadBtn.exists()).toBe(true);
    await uploadBtn.trigger("click");
    await flushPromises();

    expect(mockStore.uploadAvatar).toHaveBeenCalledWith(validFile);
    expect(showErrorSpy).toHaveBeenCalledWith("Upload gagal");
  });

  it("updates user name successfully", async () => {
    mockStore.updateProfile.mockResolvedValue({
      success: true,
      message: "Updated",
      data: { id: "1", name: "New Name", email: "budi@delcom.org" }
    });
    const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

    const wrapper = mount(ProfilePage);
    await wrapper.find("[data-testid='name-input']").setValue("New Name");
    await wrapper.findAll("form")[0].trigger("submit.prevent");
    await flushPromises();

    expect(mockStore.updateProfile).toHaveBeenCalledWith({ name: "New Name" });
    expect(showSuccessSpy).toHaveBeenCalledWith("Nama profil berhasil diperbarui!");
  });

  it("handles update name error with fallback", async () => {
    mockStore.updateProfile.mockRejectedValue({});
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(ProfilePage);
    await wrapper.find("[data-testid='name-input']").setValue("New Name");
    await wrapper.findAll("form")[0].trigger("submit.prevent");
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Gagal memperbarui profil");
  });

  it("changes password successfully", async () => {
    mockStore.changePassword.mockResolvedValue({ success: true, message: "Updated" });
    const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

    const wrapper = mount(ProfilePage);
    await wrapper.find("[data-testid='current-password-input']").setValue("oldPass123");
    await wrapper.find("[data-testid='new-password-input']").setValue("newPass123");
    await wrapper.findAll("form")[1].trigger("submit.prevent");
    await flushPromises();

    expect(mockStore.changePassword).toHaveBeenCalledWith({
      old_password: "oldPass123",
      current_password: "oldPass123",
      password: "newPass123",
      new_password: "newPass123",
      password_confirmation: "newPass123"
    });
    expect(showSuccessSpy).toHaveBeenCalledWith("Kata sandi berhasil diubah!");
  });

  it("handles change password error", async () => {
    mockStore.changePassword.mockRejectedValue(new Error("Password salah"));
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(ProfilePage);
    await wrapper.findAll("form")[1].trigger("submit.prevent");
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Password salah");
  });
});
