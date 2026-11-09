// Testes que leem o HTML gerado em out/ (rodar depois de `pnpm build:hidden`).
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test-html/**/*.test.ts"],
  },
});
