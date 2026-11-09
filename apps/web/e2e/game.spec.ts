// Jogo de exemplo e salvamento (FDD 001 §11: "Jogo de exemplo e salvamento"; F4 e F5).
// Precisa do build com jogos ocultos: `pnpm --filter @zuploop/web build:hidden`.
import { expect, test, type Page } from "@playwright/test";

const GAME_PAGE = "/pt/jogos/exemplo/";

test.use({ locale: "pt-BR" });

async function openGame(page: Page) {
  await page.getByRole("button", { name: "Jogar" }).click();
  const dialog = page.getByRole("dialog", { name: "Jogo de exemplo" });
  await expect(dialog).toBeVisible();
  return dialog;
}

test("continuar de onde parei", async ({ context }) => {
  const first = await context.newPage();
  await first.goto(GAME_PAGE);
  const dialog = await openGame(first);
  const addOne = dialog.getByRole("button", { name: "Somar 1 ponto" });
  for (let i = 0; i < 3; i += 1) await addOne.click();
  await expect(dialog.getByTestId("example-moves")).toContainText("3 de 10 jogadas");
  // Espera o intervalo entre gravações (300 ms) antes de fechar a aba.
  await first.waitForTimeout(500);
  await first.close();

  const second = await context.newPage();
  await second.goto(GAME_PAGE);
  const reopened = await openGame(second);
  await expect(reopened.getByTestId("example-moves")).toContainText("3 de 10 jogadas");
});

test("save de versão mais nova é descartado", async ({ page }) => {
  await page.goto(GAME_PAGE);
  // Grava um save de uma versão do jogo que ainda não existe (v 99).
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("zuploop");
        request.onupgradeneeded = () => request.result.createObjectStore("saves");
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const tx = request.result.transaction("saves", "readwrite");
          tx.objectStore("saves").put(
            {
              v: 99,
              sdk: 1,
              gameId: "example",
              slot: "main",
              updatedAt: new Date().toISOString(),
              data: { moves: 7, score: 9 },
            },
            "example:main",
          );
          tx.oncomplete = () => {
            request.result.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
      }),
  );

  const dialog = await openGame(page);
  await expect(page.getByText("Não foi possível recuperar sua partida anterior.")).toBeVisible();
  await expect(dialog.getByTestId("example-moves")).toContainText("0 de 10 jogadas");
});

test("jogo só carrega ao tocar em Jogar, e abre em tela cheia", async ({ page }) => {
  const gameScripts: string[] = [];
  page.on("response", async (response) => {
    if (!response.url().endsWith(".js")) return;
    const body = await response.text().catch(() => "");
    if (body.includes("example-moves")) gameScripts.push(response.url());
  });

  await page.goto(GAME_PAGE);
  await page.waitForLoadState("networkidle");
  expect(gameScripts).toEqual([]);

  const dialog = await openGame(page);
  await expect.poll(() => gameScripts.length).toBeGreaterThan(0);

  const viewport = page.viewportSize();
  const box = await dialog.boundingBox();
  expect(box?.width).toBe(viewport?.width);
  expect(box?.height).toBe(viewport?.height);
});

test("Voltar e o voltar do navegador fecham o jogo sem mudar o endereço", async ({ page }) => {
  await page.goto(GAME_PAGE);
  const dialog = await openGame(page);
  await expect(page).toHaveURL(new RegExp(`${GAME_PAGE}$`));

  await dialog.getByRole("button", { name: "Voltar" }).first().click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Jogar" })).toBeFocused();

  await openGame(page);
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`${GAME_PAGE}$`));
});
