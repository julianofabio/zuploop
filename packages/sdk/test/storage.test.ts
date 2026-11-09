// Salvamento com envelope, IndexedDB e reserva em memória (T006, FDD 001 §6.3 e §7).
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_SAVE_BYTES, type SaveEnvelope } from "../src/storage/envelope";
import { createMemoryBackend, type StorageBackend } from "../src/storage/backend";
import { createStorage, type StorageOptions } from "../src/storage/index";

const FIXED_NOW = new Date("2026-11-08T12:00:00.000Z");

function baseOptions(overrides: Partial<StorageOptions> = {}): StorageOptions {
  return {
    gameId: "example",
    saveVersion: 1,
    onError: vi.fn(),
    track: vi.fn(),
    now: () => FIXED_NOW,
    ...overrides,
  };
}

/** Backend em memória que registra as chamadas, para inspecionar as gravações. */
function spyBackend(): StorageBackend & { set: ReturnType<typeof vi.fn> } {
  const inner = createMemoryBackend();
  return {
    persistent: true,
    get: vi.fn((key: string) => inner.get(key)),
    set: vi.fn((key: string, value: unknown) => inner.set(key, value)),
    del: vi.fn((key: string) => inner.del(key)),
  };
}

beforeEach(() => {
  // Banco novo a cada teste, para um não enxergar os saves do outro.
  globalThis.indexedDB = new IDBFactory();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("storage com IndexedDB", () => {
  it("grava e lê no slot main", async () => {
    const storage = await createStorage(baseOptions());
    expect(storage.persistent).toBe(true);

    await storage.save("main", { moves: 3 });
    await storage.flush();

    // Uma instância nova lê do IndexedDB, não da memória.
    const reopened = await createStorage(baseOptions());
    expect(await reopened.load()).toEqual({ moves: 3 });
  });

  it("grava e lê em slot nomeado, separado do main", async () => {
    const storage = await createStorage(baseOptions());
    await storage.save("main", { a: 1 });
    await storage.save("level-2", { b: 2 });
    await storage.flush();

    const reopened = await createStorage(baseOptions());
    expect(await reopened.load("main")).toEqual({ a: 1 });
    expect(await reopened.load("level-2")).toEqual({ b: 2 });
  });

  it("guarda o envelope com versão, jogo, slot e data", async () => {
    const backend = spyBackend();
    const storage = await createStorage(baseOptions({ backend, saveVersion: 2 }));
    await storage.save("main", { moves: 1 });
    await storage.flush();

    const envelope: SaveEnvelope = {
      v: 2,
      sdk: 1,
      gameId: "example",
      slot: "main",
      updatedAt: "2026-11-08T12:00:00.000Z",
      data: { moves: 1 },
    };
    expect(backend.set).toHaveBeenLastCalledWith("example:main", envelope);
  });

  it("devolve null quando não há save", async () => {
    const storage = await createStorage(baseOptions());
    expect(await storage.load()).toBeNull();
  });

  it("clear apaga o save", async () => {
    const storage = await createStorage(baseOptions());
    await storage.save("main", { moves: 3 });
    await storage.flush();
    await storage.clear();

    expect(await storage.load()).toBeNull();
    const reopened = await createStorage(baseOptions());
    expect(await reopened.load()).toBeNull();
  });
});

describe("espera entre gravações", () => {
  it("grava no máximo uma vez a cada 300 ms por slot", async () => {
    vi.useFakeTimers();
    const backend = spyBackend();
    const storage = await createStorage(baseOptions({ backend }));

    await storage.save("main", { moves: 1 });
    await storage.save("main", { moves: 2 });
    await storage.save("main", { moves: 3 });
    expect(backend.set).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(299);
    expect(backend.set).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    expect(backend.set).toHaveBeenCalledTimes(2);
    expect(backend.set.mock.lastCall?.[1]).toMatchObject({ data: { moves: 3 } });
  });

  it("slots diferentes não esperam um pelo outro", async () => {
    vi.useFakeTimers();
    const backend = spyBackend();
    const storage = await createStorage(baseOptions({ backend }));

    await storage.save("main", { a: 1 });
    await storage.save("other", { b: 1 });
    expect(backend.set).toHaveBeenCalledTimes(2);
  });

  it("flush grava o pendente na hora", async () => {
    vi.useFakeTimers();
    const backend = spyBackend();
    const storage = await createStorage(baseOptions({ backend }));

    await storage.save("main", { moves: 1 });
    await storage.save("main", { moves: 2 });
    await storage.flush();

    expect(backend.set).toHaveBeenCalledTimes(2);
    expect(backend.set.mock.lastCall?.[1]).toMatchObject({ data: { moves: 2 } });

    // Depois do flush, o temporizador não grava de novo.
    await vi.advanceTimersByTimeAsync(1000);
    expect(backend.set).toHaveBeenCalledTimes(2);
  });

  it("load devolve o estado mais novo mesmo antes de gravar no disco", async () => {
    vi.useFakeTimers();
    const storage = await createStorage(baseOptions({ backend: spyBackend() }));
    await storage.save("main", { moves: 1 });
    await storage.save("main", { moves: 2 });
    expect(await storage.load()).toEqual({ moves: 2 });
  });
});

describe("limites e falhas", () => {
  it("recusa save acima de 256 KB sem lançar erro e registra save_too_large", async () => {
    const backend = spyBackend();
    const onError = vi.fn();
    const storage = await createStorage(baseOptions({ backend, onError }));

    await storage.save("main", { small: true });
    await storage.flush();
    const big = { text: "x".repeat(MAX_SAVE_BYTES + 1) };

    await expect(storage.save("main", big)).resolves.toBeUndefined();
    await storage.flush();

    expect(onError).toHaveBeenCalledWith(
      "save_too_large",
      expect.objectContaining({ slot: "main" }),
    );
    expect(backend.set).toHaveBeenCalledTimes(1);
    // O save anterior continua valendo.
    expect(await storage.load()).toEqual({ small: true });
  });

  it("sem IndexedDB, usa memória e persistent vira false", async () => {
    vi.stubGlobal("indexedDB", undefined);
    const storage = await createStorage(baseOptions());

    expect(storage.persistent).toBe(false);
    await storage.save("main", { moves: 5 });
    await storage.flush();
    expect(await storage.load()).toEqual({ moves: 5 });
  });

  it("IndexedDB que falha ao abrir cai para a memória", async () => {
    const broken = {
      open: () => {
        throw new DOMException("blocked", "SecurityError");
      },
    };
    vi.stubGlobal("indexedDB", broken);
    const onError = vi.fn();
    const storage = await createStorage(baseOptions({ onError }));

    expect(storage.persistent).toBe(false);
    expect(onError).toHaveBeenCalledWith("storage_unavailable", expect.any(Object));
  });

  it("QuotaExceededError não lança, registra storage_quota e mantém o save em memória", async () => {
    const backend = spyBackend();
    backend.set.mockRejectedValue(new DOMException("full", "QuotaExceededError"));
    const onError = vi.fn();
    const storage = await createStorage(baseOptions({ backend, onError }));

    await expect(storage.save("main", { moves: 9 })).resolves.toBeUndefined();
    await expect(storage.flush()).resolves.toBeUndefined();

    expect(onError).toHaveBeenCalledWith(
      "storage_quota",
      expect.objectContaining({ slot: "main" }),
    );
    expect(await storage.load()).toEqual({ moves: 9 });
  });

  it("falha de leitura não lança e devolve null", async () => {
    const backend = spyBackend();
    vi.mocked(backend.get).mockRejectedValue(new Error("read failed"));
    const onError = vi.fn();
    const storage = await createStorage(baseOptions({ backend, onError }));

    await expect(storage.load()).resolves.toBeNull();
    expect(onError).toHaveBeenCalledWith("storage_error", expect.any(Object));
  });

  it("falha ao apagar não lança", async () => {
    const backend = spyBackend();
    vi.mocked(backend.del).mockRejectedValue(new Error("delete failed"));
    const onError = vi.fn();
    const storage = await createStorage(baseOptions({ backend, onError }));

    await expect(storage.clear("main")).resolves.toBeUndefined();
    expect(onError).toHaveBeenCalledWith("storage_error", expect.any(Object));
  });
});
