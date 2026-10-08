import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import RegisterPage from "./RegisterPage.vue";
import { useAuthStore } from "../states/authStore";
import * as toolsHelper from "../../../helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe("RegisterPage.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("renders register form fields correctly", () => {
    const wrapper = mount(RegisterPage, {
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>"
          }
        }
      }
    });

    expect(wrapper.find("input[id='name']").exists()).toBe(true);
    expect(wrapper.find("input[id='email']").exists()).toBe(true);
    expect(wrapper.find("input[id='password']").exists()).toBe(true);
    expect(wrapper.find("button[type='submit']").text()).toBe("Daftar Sekarang");
  });

  it("submits register form successfully and navigates to '/login'", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, "register").mockResolvedValue({
      success: true,
      message: "Success",
      data: { token: "" }
    });
    const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

    const wrapper = mount(RegisterPage, {
      global: {
        stubs: { RouterLink: true }
      }
    });

    await wrapper.find("input[id='name']").setValue("John Doe");
    await wrapper.find("input[id='email']").setValue("john@delcom.org");
    await wrapper.find("input[id='password']").setValue("secret123");
    await wrapper.find("form").trigger("submit.prevent");

    expect(authStore.register).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@delcom.org",
      password: "secret123"
    });
    expect(showSuccessSpy).toHaveBeenCalledWith(
      "Pendaftaran berhasil! Silakan masuk ke akun Anda."
    );
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("handles register failure and shows error dialog", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, "register").mockRejectedValue(new Error("Email sudah digunakan"));
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(RegisterPage, {
      global: {
        stubs: { RouterLink: true }
      }
    });

    await wrapper.find("input[id='name']").setValue("John Doe");
    await wrapper.find("input[id='email']").setValue("existing@delcom.org");
    await wrapper.find("input[id='password']").setValue("secret123");
    await wrapper.find("form").trigger("submit.prevent");

    expect(showErrorSpy).toHaveBeenCalledWith("Email sudah digunakan");
  });

  it("shows fallback error dialog when error has no message", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, "register").mockRejectedValue({});
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(RegisterPage, {
      global: {
        stubs: { RouterLink: true }
      }
    });

    await wrapper.find("form").trigger("submit.prevent");
    expect(showErrorSpy).toHaveBeenCalledWith("Gagal mendaftar");
  });

  it("shows loading state when isLoading is true", () => {
    const authStore = useAuthStore();
    authStore.isLoading = true;
    const wrapper = mount(RegisterPage, {
      global: {
        stubs: { RouterLink: true }
      }
    });

    expect(wrapper.find("button[type='submit']").text()).toBe("Mendaftarkan...");
  });
});

