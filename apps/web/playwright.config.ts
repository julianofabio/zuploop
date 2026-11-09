// Testes de ponta a ponta contra o build estático (FDD 001 §10, ADR-0012).
// Chromium, WebKit (o público usa muito iPhone) e Firefox, em celular (390 × 844) e computador
// (1280 × 800); a largura de 360 px é conferida em layout.spec.ts (T045).
// Antes: `pnpm --filter @zuploop/web build:hidden` (os cenários usam o jogo de exemplo).
import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

const mobile = { viewport: { width: 390, height: 844 }, isMobile: false, hasTouch: true };
const desktop = { viewport: { width: 1280, height: 800 } };

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium-mobile", use: { ...devices["Desktop Chrome"], ...mobile } },
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], ...desktop } },
    { name: "webkit-mobile", use: { ...devices["Desktop Safari"], ...mobile } },
    { name: "webkit-desktop", use: { ...devices["Desktop Safari"], ...desktop } },
    { name: "firefox-mobile", use: { ...devices["Desktop Firefox"], ...mobile } },
    { name: "firefox-desktop", use: { ...devices["Desktop Firefox"], ...desktop } },
  ],
  webServer: {
    command: `node scripts/serve-out.mjs ${PORT}`,
    url: `http://localhost:${PORT}/en/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
