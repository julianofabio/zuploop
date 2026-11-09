// Layout na menor largura de celular comum (360 px, Android de entrada): nada estoura a tela
// (padrão §6, RNF-02 reflow). Só confere rolagem horizontal; o comportamento fica nos outros testes.
import { expect, test, type Page } from "@playwright/test";

const NARROW = { width: 360, height: 740 };

const pages = [
  { name: "início", path: "/pt/" },
  { name: "catálogo", path: "/es/juegos/" },
  { name: "jogo", path: "/en/games/example/" },
  { name: "ajustes", path: "/pt/ajustes/" },
  { name: "página não encontrada", path: "/pt/nao-existe/" },
];

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

test.use({ viewport: NARROW });

for (const { name, path } of pages) {
  test(`${name} não rola na horizontal a 360 px`, async ({ page }) => {
    await page.goto(path);
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
}

test("o jogo aberto não rola na horizontal a 360 px", async ({ page }) => {
  await page.goto("/pt/jogos/exemplo/");
  await page.getByRole("button", { name: "Jogar" }).click();
  await expect(page.getByTestId("example-moves")).toBeVisible();
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
});
