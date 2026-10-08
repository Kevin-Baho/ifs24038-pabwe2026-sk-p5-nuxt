import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import NavbarComponent from "./NavbarComponent.vue";
import { useUsersStore } from "../../users/states/usersStore";
import { useAuthStore } from "../../auth/states/authStore";
import * as toolsHelper from "../../../helpers/toolsHelper";

import { ref } from "vue";

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe("NavbarComponent.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("renders navbar and emits toggleSidebar on button click", async () => {
    const wrapper = mount(NavbarComponent, {
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>"
          }
        }
      }
    });

    await wrapper.find("[data-testid='toggle-sidebar-button']").trigger("click");
    expect(wrapper.emitted("toggleSidebar")).toBeTruthy();
    expect(wrapper.emitted("toggleSidebar")?.length).toBe(1);
  });

  it("renders user photo when available", () => {
    const usersStore = useUsersStore();
    usersStore.currentUser = {
      id: "1",
      name: "Budi",
      email: "budi@delcom.org",
      photo: "https://avatar.png"
    };

    const wrapper = mount(NavbarComponent, {
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>"
          }
        }
      }
    });

    expect(wrapper.find("[data-testid='navbar-avatar-image']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Budi");
  });

  it("renders default initial when user has no photo and no name", () => {
    const usersStore = useUsersStore();
    usersStore.currentUser = null;

    const wrapper = mount(NavbarComponent, {
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>"
          }
        }
      }
    });

    expect(wrapper.text()).toContain("U");
    expect(wrapper.text()).toContain("Pengguna");
  });

  it("handles logout confirmation and navigates to /login", async () => {
    const authStore = useAuthStore();
    const logoutSpy = vi.spyOn(authStore, "logout");
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);

    const wrapper = mount(NavbarComponent, {
      global: {
        stubs: { RouterLink: true }
      }
    });

    await wrapper.find("[data-testid='logout-button']").trigger("click");
    expect(logoutSpy).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("does not logout when dialog is cancelled", async () => {
    const authStore = useAuthStore();
    const logoutSpy = vi.spyOn(authStore, "logout");
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(false);

    const wrapper = mount(NavbarComponent, {
      global: {
        stubs: { RouterLink: true }
      }
    });

    await wrapper.find("[data-testid='logout-button']").trigger("click");
    expect(logoutSpy).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});

