import { createRouter, createWebHistory, type Router } from "vue-router";
import { routes } from "./routes";
import { getAccessToken } from "./helpers/apiHelper";

export function createAppRouter(): Router {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach((to, from, next) => {
    const token = getAccessToken();
    const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth);
    const requiresGuest = to.matched.some((record) => record.meta?.requiresGuest);

    if (requiresAuth && !token) {
      next({ path: "/login" });
    } else if (requiresGuest && token) {
      next({ path: "/" });
    } else {
      next();
    }
  });

  return router;
}

export const router = createAppRouter();