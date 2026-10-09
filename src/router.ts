import { createRouter, createWebHistory, type RouterHistory } from "vue-router";
import { routes } from "./routes";

/**
 * Membuat instance router. Dipakai oleh mode Vite murni (main.ts) dan pengujian.
 * Pada Nuxt, rute disuplai lewat src/router.options.ts.
 */
export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    history: history ?? createWebHistory(),
    routes,
  });
}
