import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    threads: false,
    setupFiles: ["__tests__/setup.ts"],
  },
});
