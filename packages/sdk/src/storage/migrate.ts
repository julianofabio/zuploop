// Decide o que fazer com um envelope lido do armazenamento (RF-SDK-03).
import { isEnvelope } from "./envelope";

export type EnvelopeResolution =
  | { kind: "current"; data: unknown }
  | { kind: "migrated"; data: unknown }
  | { kind: "discarded"; reason: "invalid" | "newer" | "no_migration" | "migration_failed" };

export function resolveEnvelope(
  stored: unknown,
  saveVersion: number,
  _migrateSave?: (fromVersion: number, data: unknown) => unknown,
): EnvelopeResolution {
  if (!isEnvelope(stored)) return { kind: "discarded", reason: "invalid" };
  if (stored.v === saveVersion) return { kind: "current", data: stored.data };
  return { kind: "discarded", reason: stored.v > saveVersion ? "newer" : "no_migration" };
}
