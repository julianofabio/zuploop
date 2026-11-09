// Migração e descarte de saves de outras versões (T007, FDD 001 F5, RF-SDK-03).
import { describe, expect, it, vi } from "vitest";
import { createMemoryBackend, type StorageBackend } from "../src/storage/backend";
import { createEnvelope } from "../src/storage/envelope";
import { createStorage, type StorageOptions } from "../src/storage/index";
import { resolveEnvelope } from "../src/storage/migrate";

const NOW = new Date("2026-11-08T12:00:00.000Z");

async function backendWith(v: number, data: unknown): Promise<StorageBackend> {
  const backend = createMemoryBackend();
  await backend.set("example:main", createEnvelope("example", "main", v, data, NOW));
  return backend;
}

function options(overrides: Partial<StorageOptions>): StorageOptions {
  return {
    gameId: "example",
    saveVersion: 2,
    onError: vi.fn(),
    track: vi.fn(),
    now: () => NOW,
    ...overrides,
  };
}

describe("migração de saves", () => {
  it("save com v menor chama migrateSave e regrava com a versão nova", async () => {
    const backend = await backendWith(1, { count: 3 });
    const migrateSave = vi.fn((_from: number, data: unknown) => ({
      moves: (data as { count: number }).count,
    }));
    const storage = await createStorage(options({ backend, migrateSave }));

    expect(await storage.load()).toEqual({ moves: 3 });
    expect(migrateSave).toHaveBeenCalledWith(1, { count: 3 });

    await storage.flush();
    expect(await backend.get("example:main")).toMatchObject({ v: 2, data: { moves: 3 } });
  });

  it("migrateSave que lança descarta, registra save_discarded e devolve null", async () => {
    const backend = await backendWith(1, { count: 3 });
    const track = vi.fn();
    const migrateSave = vi.fn(() => {
      throw new Error("cannot migrate");
    });
    const storage = await createStorage(options({ backend, migrateSave, track }));

    expect(await storage.load()).toBeNull();
    expect(track).toHaveBeenCalledWith(
      "save_discarded",
      expect.objectContaining({ reason: "migration_failed" }),
    );
  });

  it("save com v maior é descartado e devolve null", async () => {
    const backend = await backendWith(3, { moves: 1 });
    const track = vi.fn();
    const migrateSave = vi.fn();
    const storage = await createStorage(options({ backend, migrateSave, track }));

    expect(await storage.load()).toBeNull();
    expect(migrateSave).not.toHaveBeenCalled();
    expect(track).toHaveBeenCalledWith(
      "save_discarded",
      expect.objectContaining({ reason: "newer" }),
    );
  });

  it("jogo sem migrateSave e save antigo: descarta", async () => {
    const backend = await backendWith(1, { count: 3 });
    const track = vi.fn();
    const storage = await createStorage(options({ backend, track }));

    expect(await storage.load()).toBeNull();
    expect(track).toHaveBeenCalledWith(
      "save_discarded",
      expect.objectContaining({ reason: "no_migration" }),
    );
  });

  it("save descartado começa do zero na próxima gravação", async () => {
    const backend = await backendWith(3, { moves: 1 });
    const storage = await createStorage(options({ backend }));

    expect(await storage.load()).toBeNull();
    await storage.save("main", { moves: 0 });
    await storage.flush();
    expect(await storage.load()).toEqual({ moves: 0 });
  });
});

describe("resolveEnvelope", () => {
  it("aceita a versão atual sem migrar", () => {
    const migrateSave = vi.fn();
    const envelope = createEnvelope("example", "main", 2, { a: 1 }, NOW);
    expect(resolveEnvelope(envelope, 2, migrateSave)).toEqual({ kind: "current", data: { a: 1 } });
    expect(migrateSave).not.toHaveBeenCalled();
  });

  it("descarta o que não é envelope", () => {
    expect(resolveEnvelope({ moves: 1 }, 2)).toEqual({ kind: "discarded", reason: "invalid" });
    expect(resolveEnvelope("texto", 2)).toEqual({ kind: "discarded", reason: "invalid" });
  });

  it("descarta migração que devolve undefined", () => {
    const envelope = createEnvelope("example", "main", 1, { a: 1 }, NOW);
    expect(resolveEnvelope(envelope, 2, () => undefined)).toEqual({
      kind: "discarded",
      reason: "migration_failed",
    });
  });
});
