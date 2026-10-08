import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import CashFlowLayout from "./CashFlowLayout.vue";

describe("CashFlowLayout.vue", () => {
  it("toggles sidebar on navbar emit and closes on backdrop click", async () => {
    setActivePinia(createPinia());
    const wrapper = mount(CashFlowLayout, {
      slots: {
        default: '<div data-testid="page-content">Dashboard Content</div>'
      },
      global: {
        stubs: {
          RouterLink: true,
          NavbarComponent: {
            template:
              '<div><button data-testid="nav-toggle" @click="$emit(\'toggle-sidebar\')">Toggle</button></div>'
          },
          SidebarComponent: {
            props: ["isOpen"],
            template: '<div data-testid="sidebar-stub" :data-open="isOpen"></div>'
          }
        }
      }
    });

    expect(wrapper.find("[data-testid='page-content']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='sidebar-backdrop']").exists()).toBe(false);

    // Click toggle to open sidebar
    await wrapper.find("[data-testid='nav-toggle']").trigger("click");
    expect(wrapper.find("[data-testid='sidebar-backdrop']").exists()).toBe(true);

    // Click backdrop to close sidebar
    await wrapper.find("[data-testid='sidebar-backdrop']").trigger("click");
    expect(wrapper.find("[data-testid='sidebar-backdrop']").exists()).toBe(false);
  });
});

