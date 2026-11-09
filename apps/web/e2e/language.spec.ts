// Idiomas (FDD 001 §11: "Escolha de idioma pela raiz" e "Troca de idioma"; RF-I18N-02 a 04).
import { expect, test } from "@playwright/test";

test.describe("Escolha de idioma pela raiz", () => {
  test.describe("navegador em espanhol, primeira visita", () => {
    test.use({ locale: "es-MX" });

    test("vai para /es/ com lang es", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/es\/$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "es");
    });
  });

  test.describe("escolha salva vence o navegador", () => {
    test.use({ locale: "pt-BR" });

    test("vai para /en/", async ({ page, context }) => {
      await context.addInitScript(() => window.localStorage.setItem("zuploop.locale", "en"));
      await page.goto("/");
      await expect(page).toHaveURL(/\/en\/$/);
    });
  });

  test.describe("idioma sem suporte", () => {
    test.use({ locale: "fr-FR" });

    test("vai para /en/", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/en\/$/);
    });
  });

  test.describe("sem JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("mostra os três idiomas", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("link", { name: "Português" })).toHaveAttribute("href", "/pt/");
      await expect(page.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/es/");
      await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en/");
    });
  });
});

test.describe("Troca de idioma", () => {
  test.use({ locale: "pt-BR" });

  test("mesma página em outro idioma, e a escolha fica salva", async ({ page }) => {
    await page.goto("/pt/jogos/");
    await page.getByRole("button", { name: /Idioma/ }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Español" }).click();

    await expect(page).toHaveURL(/\/es\/juegos\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    expect(await page.evaluate(() => window.localStorage.getItem("zuploop.locale"))).toBe("es");
  });

  test("faixa de sugestão sem redirecionar", async ({ page }) => {
    await page.goto("/en/games/");
    const banner = page.getByRole("region", { name: "Sugestão de idioma" });
    await expect(banner).toBeVisible();
    await expect(banner).toContainText("Ver em português?");
    await expect(page).toHaveURL(/\/en\/games\/$/);
  });

  test('"Continuar" esconde a faixa e ela não volta', async ({ page }) => {
    await page.goto("/en/games/");
    await page.getByRole("button", { name: "Continue in English" }).click();
    await expect(page.getByRole("region", { name: "Sugestão de idioma" })).toBeHidden();
    await page.reload();
    await expect(page.locator("html")).not.toHaveAttribute("data-lang-suggest", /.*/);
    await expect(page.getByRole("region", { name: "Sugestão de idioma" })).toBeHidden();
  });
});

test.describe("Página não encontrada", () => {
  test("endereço inexistente mostra a 404 do idioma", async ({ page }) => {
    const response = await page.goto("/pt/nao-existe/");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Página não encontrada");
    await expect(page.getByRole("link", { name: "Ver os jogos" })).toHaveAttribute(
      "href",
      "/pt/jogos/",
    );
  });
});
