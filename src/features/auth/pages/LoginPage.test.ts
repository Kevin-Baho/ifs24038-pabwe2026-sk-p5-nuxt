import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import LoginPage from "./LoginPage.vue";
import { useAuthStore } from "../states/authStore";
import * as toolsHelper from "../../../helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe("LoginPage.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("renders login form fields correctly", () => {
    const wrapper = mount(LoginPage, {
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>"
          }
        }
      }
    });

    expect(wrapper.find("input[type='email']").exists()).toBe(true);
    expect(wrapper.find("input[type='password']").exists()).toBe(true);
    expect(wrapper.find("button[type='submit']").text()).toBe("Masuk");
  });

  it("submits form successfully and navigates to '/'", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, "login").mockResolvedValue({
      success: true,
      message: "Success",
      data: { token: "token" }
    });

    const wrapper = mount(LoginPage, {
      global: {
        stubs: { RouterLink: true }
      }
    });

    const emailInput = wrapper.find("input[type='email']");
    const passwordInput = wrapper.find("input[type='password']");

    await emailInput.setValue("user@delcom.org");
    await passwordInput.setValue("password123");
    await wrapper.find("form").trigger("submit.prevent");

    expect(authStore.login).toHaveBeenCalledWith({
      email: "user@delcom.org",
      password: "password123"
    });
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("handles login failure and shows error dialog", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, "login").mockRejectedValue(new Error("Kredensial salah"));
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(LoginPage, {
      global: {
        stubs: { RouterLink: true }
      }
    });

    await wrapper.find("input[type='email']").setValue("user@delcom.org");
    await wrapper.find("input[type='password']").setValue("wrongpassword");
    await wrapper.find("form").trigger("submit.prevent");

    expect(showErrorSpy).toHaveBeenCalledWith("Kredensial salah");
  });

  it("shows fallback error message when error object has no message", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, "login").mockRejectedValue({});
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(LoginPage, {
      global: {
        stubs: { RouterLink: true }
      }
    });

    await wrapper.find("form").trigger("submit.prevent");
    expect(showErrorSpy).toHaveBeenCalledWith("Gagal masuk");
  });

  it("shows loading state when isLoading is true", () => {
    const authStore = useAuthStore();
    authStore.isLoading = true;
    const wrapper = mount(LoginPage, {
      global: {
        stubs: { RouterLink: true }
      }
    });

    expect(wrapper.find("button[type='submit']").text()).toBe("Memproses...");
  });
});

