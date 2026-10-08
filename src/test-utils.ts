import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory, type Router } from "vue-router";
import { routes } from "./routes";
import type { Component } from "vue";

export function createTestRouter(initialPath: string = "/") {
  const router = createRouter({
    history: createWebHistory(),
    routes
  });
  router.push(initialPath);
  return router;
}

export function renderWithProviders(
  component: Component,
  options: {
    props?: Record<string, any>;
    slots?: Record<string, any>;
    router?: Router;
    initialPath?: string;
    pinia?: ReturnType<typeof createPinia>;
    global?: Record<string, any>;
  } = {}
) {
  const pinia = options.pinia || createPinia();
  setActivePinia(pinia);

  const router = options.router || createTestRouter(options.initialPath || "/");

  const globalOptions = {
    plugins: [pinia, router],
    stubs: {
      NuxtLink: {
        template: '<a :href="to"><slot /></a>',
        props: ["to"]
      },
      NuxtPage: {
        template: '<div data-testid="nuxt-page"><slot /></div>'
      },
      RouterLink: {
        template: '<a :href="to"><slot /></a>',
        props: ["to"]
      },
      RouterView: {
        template: '<div data-testid="router-view"><slot /></div>'
      },
      ...(options.global?.stubs || {})
    },
    mocks: {
      ...(options.global?.mocks || {})
    },
    ...options.global
  };

  return mount(component, {
    props: options.props,
    slots: options.slots,
    global: globalOptions
  });
}

// Nuxt mock helpers for test environment
export const useRuntimeConfig = () => ({
  public: {
    delcomBaseUrl: process.env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
  }
});

export const navigateTo = async (path: string) => {
  return path;
};

