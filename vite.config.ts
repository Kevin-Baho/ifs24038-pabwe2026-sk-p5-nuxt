import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "#imports": fileURLToPath(new URL("./src/test-utils.ts", import.meta.url)),
      "#app": fileURLToPath(new URL("./src/test-utils.ts", import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      },
      exclude: [
        "node_modules/**",
        ".nuxt/**",
        "dist/**",
        "coverage/**",
        "**/*.d.ts",
        "start.mjs",
        "nuxt.config.ts",
        "vite.config.ts",
        "src/test-utils.ts",
        "src/setupTests.ts",
        "src/main.ts",
        "**/*.test.ts"
      ]
    }
  }
});

