import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["test/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup.ts"],
    // O build define isto a partir de trailingSlash: true; o next/link lê em tempo de execução.
    env: { __NEXT_TRAILING_SLASH: "true" },
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
