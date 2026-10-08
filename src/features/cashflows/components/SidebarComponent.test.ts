import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SidebarComponent from "./SidebarComponent.vue";

import { vi } from "vitest";

const mockRoute = { path: "/" };
vi.mock("vue-router", () => ({
  useRoute: () => mockRoute
}));

describe("SidebarComponent.vue", () => {
  it("renders sidebar with navigation items and emits closeSidebar", async () => {
    mockRoute.path = "/";
    const wrapper = mount(SidebarComponent, {
      props: {
        isOpen: true
      },
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>"
          }
        }
      }
    });

    expect(wrapper.find("[data-testid='nav-link-dashboard']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='nav-link-users']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='nav-link-profile']").exists()).toBe(true);

    await wrapper.find("[data-testid='close-sidebar-button']").trigger("click");
    expect(wrapper.emitted("closeSidebar")).toBeTruthy();
    expect(wrapper.emitted("closeSidebar")?.length).toBe(1);
  });

  it("applies hidden styles when isOpen is false", () => {
    mockRoute.path = "/users";
    const wrapper = mount(SidebarComponent, {
      props: {
        isOpen: false
      },
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>"
          }
        }
      }
    });

    const aside = wrapper.find("[data-testid='sidebar-aside']");
    expect(aside.classes()).toContain("max-lg:-translate-x-full");
  });

  it("highlights profile link when on /profile route", () => {
    mockRoute.path = "/profile";
    const wrapper = mount(SidebarComponent, {
      props: {
        isOpen: true
      },
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>"
          }
        }
      }
    });

    expect(wrapper.find("[data-testid='nav-link-profile']").classes()).toContain("bg-indigo-50");
  });
});

