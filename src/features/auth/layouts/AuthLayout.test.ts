import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AuthLayout from "./AuthLayout.vue";

describe("AuthLayout.vue", () => {
  it("renders correctly with default slot content", () => {
    const wrapper = mount(AuthLayout, {
      slots: {
        default: '<div data-testid="auth-content">Login Form</div>'
      }
    });

    expect(wrapper.text()).toContain("Delcom Cash Flow");
    expect(wrapper.text()).toContain("Manajemen catatan keuangan pribadi & tim secara praktis");
    expect(wrapper.find('[data-testid="auth-content"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Login Form");
  });
});

