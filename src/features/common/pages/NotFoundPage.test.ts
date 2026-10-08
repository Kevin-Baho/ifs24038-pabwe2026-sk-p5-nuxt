import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import NotFoundPage from "./NotFoundPage.vue";

describe("NotFoundPage.vue", () => {
  it("renders 404 text and link to home", () => {
    const wrapper = mount(NotFoundPage, {
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>"
          }
        }
      }
    });

    expect(wrapper.text()).toContain("404");
    expect(wrapper.text()).toContain("Halaman Tidak Ditemukan");
    expect(wrapper.find("[data-testid='back-home-button']").exists()).toBe(true);
  });
});

