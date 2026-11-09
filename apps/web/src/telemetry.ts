// Registro de erros do portal (provisório). Em desenvolvimento, vai para o console; em produção,
// nada é enviado até a 005 (analytics) e a decisão Q-04 (GlitchTip ou Sentry). Nunca dados pessoais.
import type { DiagnosticProps, PortalErrorCode } from "@zuploop/sdk";

export type HostErrorCode = PortalErrorCode | "game_crashed";

export const isDev = process.env.NODE_ENV !== "production";

export function reportError(code: HostErrorCode, props?: DiagnosticProps): void {
  if (isDev) console.warn("[zuploop/error]", code, props ?? {});
}
