// Ponto de entrada público do SDK do portal.
export * from "./types";
export { createPortalSdk, type CreatePortalSdkOptions, type PortalSdkHandle } from "./create";
export type { PortalErrorCode, ErrorReporter, DiagnosticProps } from "./diagnostics";
