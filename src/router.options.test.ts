import { describe, it, expect } from "vitest";
import routerOptions from "./router.options";
import { routes } from "./routes";

describe("router.options.ts", () => {
  it("returns predefined routes function", () => {
    expect(typeof routerOptions.routes).toBe("function");
    if (typeof routerOptions.routes === "function") {
      const returnedRoutes = routerOptions.routes([]);
      expect(returnedRoutes).toEqual(routes);
    }
  });
});

