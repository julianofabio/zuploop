// Envelope do save (FDD 001 §6.3): todo save guarda a versão do jogo e a data.

/** Tamanho máximo de `data` serializado em JSON. */
export const MAX_SAVE_BYTES = 256 * 1024;

/** Versão do formato do envelope (não confundir com a `saveVersion` do jogo). */
export const ENVELOPE_FORMAT = 1 as const;

export interface SaveEnvelope<T = unknown> {
  /** `saveVersion` do jogo quando foi gravado. */
  v: number;
  sdk: typeof ENVELOPE_FORMAT;
  gameId: string;
  slot: string;
  /** ISO 8601 em UTC; na 013 decide o conflito "o mais recente vence". */
  updatedAt: string;
  data: T;
}

export function storageKey(gameId: string, slot: string): string {
  return `${gameId}:${slot}`;
}

export function createEnvelope<T>(
  gameId: string,
  slot: string,
  saveVersion: number,
  data: T,
  now: Date,
): SaveEnvelope<T> {
  return {
    v: saveVersion,
    sdk: ENVELOPE_FORMAT,
    gameId,
    slot,
    updatedAt: now.toISOString(),
    data,
  };
}

/** Confere a forma do envelope lido do armazenamento, que pode estar corrompido. */
export function isEnvelope(value: unknown): value is SaveEnvelope {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.v === "number" &&
    Number.isInteger(record.v) &&
    record.sdk === ENVELOPE_FORMAT &&
    typeof record.gameId === "string" &&
    typeof record.slot === "string" &&
    typeof record.updatedAt === "string" &&
    "data" in record
  );
}

/**
 * Tamanho em bytes de `data` serializado. Devolve `null` se não for serializável
 * (referência circular, BigInt), o que também impede a gravação.
 */
export function serializedSize(data: unknown): number | null {
  try {
    const json = JSON.stringify(data);
    if (json === undefined) return null;
    return new TextEncoder().encode(json).byteLength;
  } catch {
    return null;
  }
}
