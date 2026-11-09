// Preparação dos testes do site: matchers do jest-dom e limpeza entre testes.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
