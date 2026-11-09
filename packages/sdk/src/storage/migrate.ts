// Decide o que fazer com um envelope lido do armazenamento (RF-SDK-03, FDD 001 F5).
// Save antigo é migrado; save que não migra ou de versão mais nova é descartado, nunca quebra o jogo.
import { isEnvelope } from "./envelope";

export type DiscardReason = "invalid" | "newer" | "no_migration" | "migration_failed";

export type EnvelopeResolution =
  | { kind: "current"; data: unknown }
  | { kind: "migrated"; data: unknown }
  | { kind: "discarded"; reason: DiscardReason };

export function resolveEnvelope(
  stored: unknown,
  saveVersion: number,
  migrateSave?: (fromVersion: number, data: unknown) => unknown,
): EnvelopeResolution {
  if (!isEnvelope(stored)) return { kind: "discarded", reason: "invalid" };
  if (stored.v === saveVersion) return { kind: "current", data: stored.data };
  // Save gravado por uma versão mais nova do jogo: não há como voltar no tempo.
  if (stored.v > saveVersion) return { kind: "discarded", reason: "newer" };
  if (!migrateSave) return { kind: "discarded", reason: "no_migration" };

  try {
    const migrated = migrateSave(stored.v, stored.data);
    // `undefined` não é serializável: trata como migração que não deu certo.
    if (migrated === undefined) return { kind: "discarded", reason: "migration_failed" };
    return { kind: "migrated", data: migrated };
  } catch {
    return { kind: "discarded", reason: "migration_failed" };
  }
}
