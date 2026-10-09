import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import App from "./App.vue";

describe("App.vue", () => {
  it("renders app container and router-view correctly", () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          NuxtPage: {
            template: '<div data-testid="router-view-content">Page Content</div>'
          }
        }
      }
    });

    expect(wrapper.find("#app").exists()).toBe(true);
    expect(wrapper.find("[data-testid='router-view-content']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Page Content");
  });
});

