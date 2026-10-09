import type { RouterConfig } from "@nuxt/schema";
import { createAppRouter } from "./router";

export default <RouterConfig>{
  createRouter: () => {
    return createAppRouter();
  },
};