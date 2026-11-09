// Onde os saves ficam guardados. A camada de cima não sabe se é IndexedDB ou memória.

export interface StorageBackend {
  /** `true` quando os dados sobrevivem a fechar a aba. */
  readonly persistent: boolean;
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
}

/** Reserva para quando o IndexedDB não existe ou está bloqueado. Some ao fechar a aba. */
export function createMemoryBackend(): StorageBackend {
  const data = new Map<string, unknown>();
  return {
    persistent: false,
    get: async (key) => data.get(key),
    set: async (key, value) => {
      data.set(key, value);
    },
    del: async (key) => {
      data.delete(key);
    },
  };
}
