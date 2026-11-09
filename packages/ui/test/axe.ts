// Roda o axe num trecho renderizado. Contraste e "region" ficam para o axe no navegador (T030):
// o jsdom não calcula cores, e "region" é regra de página inteira.
import axe from "axe-core";
import { expect } from "vitest";

export async function expectNoAxeViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  const summary = results.violations.map((v) => `${v.id}: ${v.help}`);
  expect(summary).toEqual([]);
}
