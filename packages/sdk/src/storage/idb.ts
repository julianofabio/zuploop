// Saves em IndexedDB pelo idb-keyval (ADR-0014): banco "zuploop", store "saves".
import { createStore, del, get, set } from "idb-keyval";
import type { StorageBackend } from "./backend";

export const DB_NAME = "zuploop";
export const STORE_NAME = "saves";

/** Chave de teste: uma leitura dela confirma que o banco abre de verdade. */
const PROBE_KEY = "__probe__";

/**
 * Abre o IndexedDB e confirma que ele responde. Lança erro se não houver IndexedDB
 * ou se o navegador bloquear o acesso (algumas navegações privadas).
 */
export async function openIdbBackend(): Promise<StorageBackend> {
  if (typeof indexedDB === "undefined" || indexedDB === null) {
    throw new Error("IndexedDB is not available");
  }
  const store = createStore(DB_NAME, STORE_NAME);
  await get(PROBE_KEY, store);
  return {
    persistent: true,
    get: (key) => get(key, store),
    set: (key, value) => set(key, value, store),
    del: (key) => del(key, store),
  };
}
