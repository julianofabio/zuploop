// Acessibilidade e idioma das páginas (RNF-02, FDD 001 §9): axe sem falhas A e AA,
// lang certo, "Pular para o conteúdo" como primeiro item do teclado.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const pages = [
  { name: "início", path: "/pt/", lang: "pt" },
  { name: "catálogo", path: "/es/juegos/", lang: "es" },
  { name: "jogo", path: "/en/games/example/", lang: "en" },
  { name: "ajustes", path: "/pt/ajustes/", lang: "pt" },
];

for (const { name, path, lang } of pages) {
  test.describe(name, () => {
    test("passa no axe sem falhas A ou AA", async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });

    test(`tem lang="${lang}"`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
    });
  });
}

test("o jogo aberto passa no axe", async ({ page, browserName }) => {
  await page.goto("/pt/jogos/exemplo/");
  await page.getByRole("button", { name: "Jogar" }).click();
  await expect(page.getByTestId("example-moves")).toBeVisible();
  let axe = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  // No Firefox, o axe derruba o processo da página ao percorrer o fundo com o jogo aberto
  // (defeito do navegador, notas N-95). Lá a análise fica no diálogo do jogo; o fundo já é
  // analisado com o jogo fechado no teste "jogo" acima.
  if (browserName === "firefox") axe = axe.include('[role="dialog"]');
  const results = await axe.analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});

test('"Pular para o conteúdo" é o primeiro item do teclado e leva ao conteúdo', async ({
  page,
  browserName,
}) => {
  await page.goto("/pt/");
  const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
  if (browserName === "webkit") {
    // O WebKit só leva o Tab a links quando a pessoa liga isso nos ajustes do Safari. Aqui se
    // confere a mesma coisa pela ordem do documento: o link é o primeiro item focável.
    const first = await page.evaluate(() => {
      const focusable = document.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      return focusable?.textContent;
    });
    expect(first).toBe("Pular para o conteúdo");
    await skip.focus();
  } else {
    await page.keyboard.press("Tab");
  }
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});
