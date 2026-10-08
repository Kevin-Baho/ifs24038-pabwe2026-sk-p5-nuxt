import { describe, it, expect, beforeEach, vi } from "vitest";
import { createAppRouter } from "./router";
import * as apiHelper from "./helpers/apiHelper";

describe("router.ts", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("navigates to protected route when authenticated", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    const router = createAppRouter();

    await router.push("/");
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("redirects to /login when navigating to protected route without token", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);
    const router = createAppRouter();

    await router.push("/profile");
    expect(router.currentRoute.value.path).toBe("/login");
  });

  it("redirects to / when navigating to guest route with token", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    const router = createAppRouter();

    await router.push("/login");
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("allows navigating to guest route without token", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);
    const router = createAppRouter();

    await router.push("/register");
    expect(router.currentRoute.value.path).toBe("/register");
  });

  it("allows navigating to non-restricted route like 404", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);
    const router = createAppRouter();

    await router.push("/random-unknown-page");
    expect(router.currentRoute.value.name).toBe("not-found");
  });
});

