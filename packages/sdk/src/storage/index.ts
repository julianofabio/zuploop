// Salvamento do jogo (RF-SDK-02, ADR-0014): IndexedDB, reserva em memória e gravações espaçadas.
import { describeError, isQuotaError, type ErrorReporter } from "../diagnostics";
import type { GameEventName, PortalSdk } from "../types";
import { createMemoryBackend, type StorageBackend } from "./backend";
import {
  MAX_SAVE_BYTES,
  createEnvelope,
  serializedSize,
  storageKey,
  type SaveEnvelope,
} from "./envelope";
import { openIdbBackend } from "./idb";
import { resolveEnvelope } from "./migrate";

/** Intervalo mínimo entre duas gravações do mesmo slot. */
export const SAVE_INTERVAL_MS = 300;

export const DEFAULT_SLOT = "main";

export interface StorageOptions {
  gameId: string;
  saveVersion: number;
  migrateSave?: (fromVersion: number, data: unknown) => unknown;
  onError: ErrorReporter;
  track: (name: GameEventName, props?: Record<string, string | number | boolean>) => void;
  /** Só para testes: troca o IndexedDB por outro backend. */
  backend?: StorageBackend;
  now?: () => Date;
}

export type GameStorage = PortalSdk["storage"] & {
  /** Grava na hora tudo o que estiver esperando (usado em `pagehide`). */
  flush(): Promise<void>;
};

interface SlotState {
  lastWriteAt: number;
  timer: ReturnType<typeof setTimeout> | undefined;
  pending: SaveEnvelope | undefined;
}

async function selectBackend(onError: ErrorReporter): Promise<StorageBackend> {
  try {
    return await openIdbBackend();
  } catch (error) {
    onError("storage_unavailable", { reason: describeError(error) });
    return createMemoryBackend();
  }
}

export async function createStorage(options: StorageOptions): Promise<GameStorage> {
  const { gameId, saveVersion, onError } = options;
  const now = options.now ?? (() => new Date());
  const backend = options.backend ?? (await selectBackend(onError));

  // Último envelope conhecido de cada slot. É a reserva quando a gravação no disco falha.
  const memory = new Map<string, SaveEnvelope>();
  const slots = new Map<string, SlotState>();
  const inFlight = new Set<Promise<void>>();

  function slotState(key: string): SlotState {
    let state = slots.get(key);
    if (!state) {
      state = { lastWriteAt: Number.NEGATIVE_INFINITY, timer: undefined, pending: undefined };
      slots.set(key, state);
    }
    return state;
  }

  function write(key: string, envelope: SaveEnvelope): Promise<void> {
    slotState(key).lastWriteAt = Date.now();
    const promise = backend.set(key, envelope).then(
      () => undefined,
      (error: unknown) => {
        onError(isQuotaError(error) ? "storage_quota" : "storage_error", {
          slot: envelope.slot,
          reason: describeError(error),
        });
      },
    );
    inFlight.add(promise);
    void promise.finally(() => inFlight.delete(promise));
    return promise;
  }

  function writePending(key: string): Promise<void> {
    const state = slotState(key);
    clearTimeout(state.timer);
    state.timer = undefined;
    const envelope = state.pending;
    state.pending = undefined;
    return envelope ? write(key, envelope) : Promise.resolve();
  }

  async function readStored(key: string): Promise<unknown> {
    const cached = memory.get(key);
    if (cached) return cached;
    try {
      return await backend.get(key);
    } catch (error) {
      onError("storage_error", { reason: describeError(error) });
      return undefined;
    }
  }

  const storage: GameStorage = {
    persistent: backend.persistent,

    async load<T>(slot: string = DEFAULT_SLOT): Promise<T | null> {
      const key = storageKey(gameId, slot);
      const stored = await readStored(key);
      if (stored === undefined || stored === null) return null;

      const result = resolveEnvelope(stored, saveVersion, options.migrateSave);
      if (result.kind === "discarded") {
        memory.delete(key);
        options.track("save_discarded", { slot, reason: result.reason });
        return null;
      }
      if (result.kind === "migrated") {
        const envelope = createEnvelope(gameId, slot, saveVersion, result.data, now());
        memory.set(key, envelope);
        await write(key, envelope);
      }
      return result.data as T;
    },

    async save<T>(slot: string, data: T): Promise<void> {
      const bytes = serializedSize(data);
      if (bytes === null || bytes > MAX_SAVE_BYTES) {
        onError("save_too_large", { slot, bytes: bytes ?? -1 });
        return;
      }

      const key = storageKey(gameId, slot);
      const envelope = createEnvelope(gameId, slot, saveVersion, data, now());
      memory.set(key, envelope);

      const state = slotState(key);
      const elapsed = Date.now() - state.lastWriteAt;
      if (!state.timer && elapsed >= SAVE_INTERVAL_MS) {
        await write(key, envelope);
        return;
      }
      // Dentro do intervalo: guarda só o mais novo e grava quando o intervalo acabar.
      state.pending = envelope;
      state.timer ??= setTimeout(() => void writePending(key), SAVE_INTERVAL_MS - elapsed);
    },

    async clear(slot: string = DEFAULT_SLOT): Promise<void> {
      const key = storageKey(gameId, slot);
      const state = slotState(key);
      clearTimeout(state.timer);
      state.timer = undefined;
      state.pending = undefined;
      memory.delete(key);
      try {
        await backend.del(key);
      } catch (error) {
        onError("storage_error", { slot, reason: describeError(error) });
      }
    },

    async flush(): Promise<void> {
      const writes = [...slots.keys()].map((key) => writePending(key));
      await Promise.all([...writes, ...inFlight]);
    },
  };

  return storage;
}
