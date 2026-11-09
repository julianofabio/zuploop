// Site e jogos funcionam com a API fora do ar (T044, RNF-06): todo pedido à API é bloqueado,
// e nenhum deveria acontecer na 001.
import { expect, test } from "@playwright/test";

test.use({ locale: "pt-BR" });

test("páginas e jogo funcionam sem a API, e nada é pedido a ela", async ({ page, context }) => {
  const apiRequests: string[] = [];
  // A API local do compose e qualquer endereço de API em produção.
  await context.route(
    /^https?:\/\/(localhost|127\.0\.0\.1):8000\/|\/\/api\.zuploop\.com\//,
    (route) => {
      apiRequests.push(route.request().url());
      return route.abort("connectionrefused");
    },
  );

  for (const path of ["/pt/", "/pt/jogos/", "/pt/ajustes/"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }

  await page.goto("/pt/jogos/exemplo/");
  await page.getByRole("button", { name: "Jogar" }).click();
  const dialog = page.getByRole("dialog", { name: "Jogo de exemplo" });
  await dialog.getByRole("button", { name: "Somar 2 pontos" }).click();
  await expect(dialog.getByTestId("example-moves")).toContainText("1 de 10 jogadas");
  await page.waitForTimeout(500);

  await page.reload();
  await page.getByRole("button", { name: "Jogar" }).click();
  await expect(page.getByTestId("example-moves")).toContainText("1 de 10 jogadas");

  expect(apiRequests).toEqual([]);
});
