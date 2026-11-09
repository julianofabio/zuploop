// Erros de infraestrutura que o portal registra. Nunca chegam ao jogo como exceção (ADR-0014).

export type PortalErrorCode =
  "save_too_large" | "storage_quota" | "storage_unavailable" | "storage_error" | "game_load_failed";

export type DiagnosticProps = Record<string, string | number | boolean>;

export type ErrorReporter = (code: PortalErrorCode, props?: DiagnosticProps) => void;

/** Texto curto de um erro qualquer, para log; nunca inclui dados do jogador. */
export function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

export function isQuotaError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}
