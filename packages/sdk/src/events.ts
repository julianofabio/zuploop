// Eventos provisórios (FDD 001 §6.2): em desenvolvimento vão para o console; em produção, nada.
// O envio ao analytics chega na 005.
import type { PortalSdk } from "./types";

export type EventLog = (prefix: string, name: string, props: Record<string, unknown>) => void;

export interface EventsOptions {
  gameId: string;
  dev: boolean;
  log?: EventLog;
}

export function createEvents(options: EventsOptions): PortalSdk["events"] {
  const log: EventLog = options.log ?? ((...args) => console.info(...args));
  return {
    track(name, props) {
      if (!options.dev) return;
      log("[zuploop/event]", name, { gameId: options.gameId, ...props });
    },
  };
}
