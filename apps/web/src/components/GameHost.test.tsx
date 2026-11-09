// GameHost (T027, FDD 001 F4 e §7): abre o jogo só ao tocar em "Jogar", em tela cheia,
// fecha pelo Voltar e pelo voltar do navegador, e trata falhas sem quebrar a página.
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { GameManifest, GameMessages, GameProps } from "@zuploop/sdk";
import { IDBFactory } from "fake-indexeddb";
import { createStore, set } from "idb-keyval";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withIntl } from "./language-test-utils";
import { GameHost } from "./GameHost";

const mocks = vi.hoisted(() => ({
  load: vi.fn(),
  reportError: vi.fn(),
}));

vi.mock("@/telemetry", () => ({ reportError: mocks.reportError, isDev: false }));

vi.mock("@/games/registry", () => {
  const messages: GameMessages = {
    name: "Jogo falso",
    description: "d",
    howToPlay: { rules: [], controls: [], tip: "" },
    ui: { hello: "Olá do jogo" },
  };
  const manifest: GameManifest = {
    id: "fake",
    category: "logic",
    phase: 1,
    status: "available",
    slugs: { pt: "falso", es: "falso", en: "fake" },
    saveVersion: 1,
    messages: { pt: async () => messages, es: async () => messages, en: async () => messages },
    load: mocks.load,
  };
  return { findGame: (id: string) => (id === "fake" ? manifest : undefined) };
});

function FakeGame({ sdk }: GameProps) {
  useEffect(() => {
    void sdk.storage.load();
  }, [sdk]);
  return <p>{sdk.i18n.t("hello")}</p>;
}

function renderHost() {
  return render(withIntl("pt", <GameHost gameId="fake" name="Jogo falso" />));
}

async function openGame() {
  await userEvent.click(screen.getByRole("button", { name: "Jogar" }));
  return screen.findByRole("dialog", { name: "Jogo falso" });
}

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  window.sessionStorage.clear();
  mocks.load.mockReset();
  mocks.load.mockResolvedValue({ default: FakeGame });
  mocks.reportError.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("GameHost", () => {
  it('o import() do jogo só acontece ao tocar em "Jogar"', async () => {
    renderHost();
    expect(mocks.load).not.toHaveBeenCalled();
    await openGame();
    expect(mocks.load).toHaveBeenCalledTimes(1);
  });

  it("abre em tela cheia, sem a barra inferior, com foco no jogo", async () => {
    renderHost();
    const dialog = await openGame();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(document.documentElement).toHaveAttribute("data-game-open");
    expect(await screen.findByText("Olá do jogo")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("game-area")).toHaveFocus());
  });

  it('"Voltar" fecha e devolve o foco ao "Jogar"', async () => {
    renderHost();
    await openGame();
    await screen.findByText("Olá do jogo");
    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Jogar" })).toHaveFocus();
    expect(document.documentElement).not.toHaveAttribute("data-game-open");
  });

  it("o botão voltar do navegador fecha o jogo e o endereço não muda", async () => {
    renderHost();
    const before = window.location.href;
    await openGame();
    expect(window.location.href).toBe(before);

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Jogar" })).toHaveFocus();
  });

  it('falha ao baixar mostra erro com "Tentar de novo" e registra game_load_failed', async () => {
    mocks.load.mockRejectedValueOnce(new Error("network"));
    renderHost();
    await openGame();

    expect(
      await screen.findByText(
        "Não foi possível abrir o jogo. Verifique a conexão e tente de novo.",
      ),
    ).toBeInTheDocument();
    expect(mocks.reportError).toHaveBeenCalledWith(
      "game_load_failed",
      expect.objectContaining({ gameId: "fake" }),
    );

    await userEvent.click(screen.getByRole("button", { name: "Tentar de novo" }));
    expect(await screen.findByText("Olá do jogo")).toBeInTheDocument();
    expect(mocks.load).toHaveBeenCalledTimes(2);
  });

  it('exceção dentro do jogo cai no error boundary com "Voltar" e "Tentar de novo"', async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    let crash = true;
    function CrashingGame(props: GameProps) {
      if (crash) throw new Error("boom");
      return <FakeGame {...props} />;
    }
    mocks.load.mockResolvedValue({ default: CrashingGame });
    renderHost();
    await openGame();

    expect(await screen.findByText("Algo deu errado neste jogo.")).toBeInTheDocument();
    expect(mocks.reportError).toHaveBeenCalledWith(
      "game_crashed",
      expect.objectContaining({ gameId: "fake" }),
    );
    expect(screen.getAllByRole("button", { name: "Voltar" }).length).toBeGreaterThanOrEqual(1);

    crash = false;
    await userEvent.click(screen.getByRole("button", { name: "Tentar de novo" }));
    expect(await screen.findByText("Olá do jogo")).toBeInTheDocument();
  });

  it('avisa "Não foi possível recuperar sua partida anterior." quando o save é descartado', async () => {
    // Save gravado por uma versão mais nova do jogo: o SDK descarta (F5).
    await set(
      "fake:main",
      {
        v: 9,
        sdk: 1,
        gameId: "fake",
        slot: "main",
        updatedAt: "2026-11-08T12:00:00.000Z",
        data: {},
      },
      createStore("zuploop", "saves"),
    );
    renderHost();
    await openGame();
    expect(
      await screen.findByText("Não foi possível recuperar sua partida anterior."),
    ).toBeInTheDocument();
  });

  it("avisa uma vez só quando o progresso não pode ser salvo (storage.persistent false)", async () => {
    vi.stubGlobal("indexedDB", undefined);
    renderHost();
    await openGame();
    const notice = "Seu progresso não será salvo neste modo do navegador.";
    expect(await screen.findByText(notice)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await openGame();
    await screen.findByText("Olá do jogo");
    expect(screen.queryByText(notice)).not.toBeInTheDocument();
  });
});
