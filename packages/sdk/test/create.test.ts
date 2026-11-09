// Implementações provisórias (anúncios, favoritos, eventos) e montagem do SDK (T009).
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAds } from "../src/ads";
import { createPortalSdk, type CreatePortalSdkOptions } from "../src/create";
import { createEvents } from "../src/events";
import { createFavorites } from "../src/favorites";
import { createMemoryBackend } from "../src/storage/backend";
import { SDK_VERSION } from "../src/types";

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("anúncios provisórios", () => {
  it("commercialBreak e rewardedBreak resolvem sem mostrar nada e com recompensa", async () => {
    const ads = createAds();
    await expect(ads.commercialBreak()).resolves.toEqual({ shown: false, rewarded: true });
    await expect(ads.rewardedBreak()).resolves.toEqual({ shown: false, rewarded: true });
  });
});

describe("favoritos provisórios", () => {
  it("ligam e desligam em memória", async () => {
    const favorites = createFavorites();
    const ref = { kind: "game", gameId: "example" } as const;

    expect(await favorites.isFavorite(ref)).toBe(false);
    expect(await favorites.toggle(ref)).toBe(true);
    expect(await favorites.isFavorite(ref)).toBe(true);
    expect(await favorites.toggle(ref)).toBe(false);
    expect(await favorites.isFavorite(ref)).toBe(false);
  });

  it("distinguem jogo, tema e nível", async () => {
    const favorites = createFavorites();
    await favorites.toggle({ kind: "theme", gameId: "example", id: "animals" });

    expect(await favorites.isFavorite({ kind: "theme", gameId: "example", id: "animals" })).toBe(
      true,
    );
    expect(await favorites.isFavorite({ kind: "level", gameId: "example", id: "animals" })).toBe(
      false,
    );
    expect(await favorites.isFavorite({ kind: "game", gameId: "example" })).toBe(false);
  });
});

describe("eventos provisórios", () => {
  it("track escreve no console só em desenvolvimento", () => {
    const log = vi.fn();
    createEvents({ gameId: "example", dev: true, log }).track("game_start", { level: 1 });
    expect(log).toHaveBeenCalledWith("[zuploop/event]", "game_start", {
      gameId: "example",
      level: 1,
    });

    const prodLog = vi.fn();
    createEvents({ gameId: "example", dev: false, log: prodLog }).track("game_start");
    expect(prodLog).not.toHaveBeenCalled();
  });

  it("usa o console quando não recebe outra saída", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    createEvents({ gameId: "example", dev: true }).track("game_end");
    expect(info).toHaveBeenCalled();
  });
});

function sdkOptions(overrides: Partial<CreatePortalSdkOptions> = {}): CreatePortalSdkOptions {
  return {
    game: { id: "example", saveVersion: 1 },
    locale: "es",
    messages: { play: "Jugar" },
    fallbackMessages: { play: "Play", hint: "Hint" },
    dev: false,
    target: new EventTarget(),
    ...overrides,
  };
}

describe("createPortalSdk", () => {
  it("monta o contrato completo", async () => {
    const sdk = await createPortalSdk(sdkOptions());

    expect(sdk.version).toBe(SDK_VERSION);
    expect(sdk.gameId).toBe("example");
    expect(sdk.getLocale()).toBe("es");
    expect(sdk.i18n.t("play")).toBe("Jugar");
    expect(sdk.i18n.t("hint")).toBe("Hint");
    expect(sdk.storage.persistent).toBe(true);
    await expect(sdk.ads.commercialBreak()).resolves.toEqual({ shown: false, rewarded: true });
    expect(await sdk.favorites.toggle({ kind: "game", gameId: "example" })).toBe(true);
    expect(() => sdk.events.track("game_start")).not.toThrow();
  });

  it("nenhuma função rejeita", async () => {
    const backend = createMemoryBackend();
    vi.spyOn(backend, "get").mockRejectedValue(new Error("boom"));
    vi.spyOn(backend, "set").mockRejectedValue(new Error("boom"));
    vi.spyOn(backend, "del").mockRejectedValue(new Error("boom"));
    const sdk = await createPortalSdk(sdkOptions({ backend, onError: vi.fn() }));

    await expect(sdk.storage.load()).resolves.toBeNull();
    await expect(sdk.storage.save("main", { a: 1 })).resolves.toBeUndefined();
    await expect(sdk.storage.clear()).resolves.toBeUndefined();
    await expect(sdk.ads.rewardedBreak()).resolves.toBeDefined();
    await expect(sdk.favorites.isFavorite({ kind: "game", gameId: "x" })).resolves.toBe(false);
    await expect(sdk.dispose()).resolves.toBeUndefined();
  });

  it("faz flush em pagehide", async () => {
    vi.useFakeTimers();
    const target = new EventTarget();
    const backend = createMemoryBackend();
    const set = vi.spyOn(backend, "set");
    const sdk = await createPortalSdk(sdkOptions({ target, backend }));

    await sdk.storage.save("main", { moves: 1 });
    await sdk.storage.save("main", { moves: 2 });
    expect(set).toHaveBeenCalledTimes(1);

    target.dispatchEvent(new Event("pagehide"));
    await vi.waitFor(() => expect(set).toHaveBeenCalledTimes(2));
    expect(set.mock.lastCall?.[1]).toMatchObject({ data: { moves: 2 } });
    vi.useRealTimers();
  });

  it("faz flush quando a aba fica oculta", async () => {
    vi.useFakeTimers();
    const target = new EventTarget();
    const backend = createMemoryBackend();
    const set = vi.spyOn(backend, "set");
    let state: DocumentVisibilityState = "visible";
    const sdk = await createPortalSdk(
      sdkOptions({ target, backend, visibilityState: () => state }),
    );

    await sdk.storage.save("main", { moves: 1 });
    await sdk.storage.save("main", { moves: 2 });

    target.dispatchEvent(new Event("visibilitychange"));
    expect(set).toHaveBeenCalledTimes(1);

    state = "hidden";
    target.dispatchEvent(new Event("visibilitychange"));
    await vi.waitFor(() => expect(set).toHaveBeenCalledTimes(2));
    vi.useRealTimers();
  });

  it("dispose grava o pendente e para de ouvir a página", async () => {
    vi.useFakeTimers();
    const target = new EventTarget();
    const backend = createMemoryBackend();
    const set = vi.spyOn(backend, "set");
    const sdk = await createPortalSdk(sdkOptions({ target, backend }));

    await sdk.storage.save("main", { moves: 1 });
    await sdk.storage.save("main", { moves: 2 });
    await sdk.dispose();
    expect(set).toHaveBeenCalledTimes(2);

    await sdk.storage.save("main", { moves: 3 });
    target.dispatchEvent(new Event("pagehide"));
    await Promise.resolve();
    expect(set).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("descarte de save vira evento save_discarded", async () => {
    const backend = createMemoryBackend();
    await backend.set("example:main", {
      v: 9,
      sdk: 1,
      gameId: "example",
      slot: "main",
      updatedAt: "2026-11-08T12:00:00.000Z",
      data: {},
    });
    const log = vi.fn();
    const sdk = await createPortalSdk(sdkOptions({ backend, dev: true, log }));

    expect(await sdk.storage.load()).toBeNull();
    expect(log).toHaveBeenCalledWith(
      "[zuploop/event]",
      "save_discarded",
      expect.objectContaining({ reason: "newer" }),
    );
  });

  it("avisa sobre erros no console em desenvolvimento", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubGlobal("indexedDB", undefined);
    const sdk = await createPortalSdk(sdkOptions({ dev: true }));

    expect(sdk.storage.persistent).toBe(false);
    expect(warn).toHaveBeenCalledWith("[zuploop/error]", "storage_unavailable", expect.any(Object));
  });

  it("usa a janela global quando não recebe outro alvo", async () => {
    const target = new EventTarget();
    vi.stubGlobal("window", target);
    const sdk = await createPortalSdk(sdkOptions({ target: undefined }));
    await expect(sdk.dispose()).resolves.toBeUndefined();
  });
});
