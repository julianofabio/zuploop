// Catálogo com busca (T043, RF-NAV-02). Precisa do build com o jogo de exemplo.
import { expect, test } from "@playwright/test";

test.use({ locale: "pt-BR" });

test("busca filtra os jogos e Limpar volta a lista", async ({ page }) => {
  await page.goto("/pt/jogos/");
  const search = page.getByRole("searchbox", { name: "Buscar jogos" });
  const game = page.getByRole("link", { name: /Jogo de exemplo/ });
  await expect(game).toBeVisible();

  await search.fill("EXEMPLO");
  await expect(game).toBeVisible();
  // Contagem com plural compilado no build (pegaria um erro de formatação das mensagens).
  await expect(page.locator("main").getByRole("status")).toHaveText("1 jogo");

  await search.fill("xadrez");
  await expect(game).toBeHidden();
  await expect(page.getByText("Nenhum jogo encontrado.")).toBeVisible();
  await expect(page.locator("main").getByRole("status")).toHaveText("Nenhum jogo");

  await page.getByRole("button", { name: "Limpar busca e filtros" }).click();
  await expect(search).toHaveValue("");
  await expect(game).toBeVisible();
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("a lista inteira aparece", async ({ page }) => {
    await page.goto("/pt/jogos/");
    await expect(page.getByRole("link", { name: /Jogo de exemplo/ })).toBeVisible();
  });
});
