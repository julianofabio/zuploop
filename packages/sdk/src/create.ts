// Monta o SDK de um jogo aberto (ADR-0014). Um SDK por jogo; descartado ao fechar.
import { createAds } from "./ads";
import type { DiagnosticProps, ErrorReporter } from "./diagnostics";
import { createEvents, type EventLog } from "./events";
import { createFavorites } from "./favorites";
import { createI18n } from "./i18n";
import type { StorageBackend } from "./storage/backend";
import { createStorage } from "./storage/index";
import { SDK_VERSION, type GameManifest, type Locale, type PortalSdk } from "./types";

export interface CreatePortalSdkOptions {
  game: Pick<GameManifest, "id" | "saveVersion" | "migrateSave">;
  locale: Locale;
  /** `GameMessages.ui` no idioma da página. */
  messages: Record<string, string>;
  /** `GameMessages.ui` em inglês, a referência. */
  fallbackMessages: Record<string, string>;
  /** Em desenvolvimento, eventos e erros aparecem no console. */
  dev: boolean;
  /** Recebe os erros de infraestrutura (o portal decide como mostrar ou registrar). */
  onError?: ErrorReporter;
  /** Recebe cada evento do jogo e do SDK (por exemplo, `save_discarded`, para avisar a pessoa). */
  onEvent?: PortalSdk["events"]["track"];
  /** Onde ouvir `pagehide` e `visibilitychange`; por padrão, a janela. */
  target?: EventTarget | undefined;
  visibilityState?: () => DocumentVisibilityState;
  /** Só para testes. */
  backend?: StorageBackend;
  log?: EventLog;
}

export type PortalSdkHandle = PortalSdk & {
  /** Grava o que estiver pendente e para de ouvir a página. Chamado ao fechar o jogo. */
  dispose(): Promise<void>;
};

function defaultTarget(): EventTarget | undefined {
  return typeof window === "undefined" ? undefined : window;
}

function defaultVisibility(): DocumentVisibilityState {
  return typeof document === "undefined" ? "visible" : document.visibilityState;
}

export async function createPortalSdk(options: CreatePortalSdkOptions): Promise<PortalSdkHandle> {
  const { game, dev } = options;
  const devEvents = createEvents({
    gameId: game.id,
    dev,
    ...(options.log ? { log: options.log } : {}),
  });
  const events: PortalSdk["events"] = {
    track(name, props) {
      devEvents.track(name, props);
      options.onEvent?.(name, props);
    },
  };
  const onError: ErrorReporter = (code, props?: DiagnosticProps) => {
    if (dev) console.warn("[zuploop/error]", code, { gameId: game.id, ...props });
    options.onError?.(code, props);
  };

  const storage = await createStorage({
    gameId: game.id,
    saveVersion: game.saveVersion,
    ...(game.migrateSave ? { migrateSave: game.migrateSave } : {}),
    ...(options.backend ? { backend: options.backend } : {}),
    onError,
    track: events.track,
  });
  const i18n = createI18n({
    locale: options.locale,
    messages: options.messages,
    fallback: options.fallbackMessages,
    dev,
  });

  // Grava na hora quando a pessoa sai da página ou troca de aba (FDD 001 F4).
  const target = options.target ?? defaultTarget();
  const visibility = options.visibilityState ?? defaultVisibility;
  const onPageHide = () => void storage.flush();
  const onVisibilityChange = () => {
    if (visibility() === "hidden") void storage.flush();
  };
  target?.addEventListener("pagehide", onPageHide);
  target?.addEventListener("visibilitychange", onVisibilityChange);

  return {
    version: SDK_VERSION,
    gameId: game.id,
    getLocale: i18n.getLocale,
    i18n: { t: i18n.t },
    storage: {
      persistent: storage.persistent,
      load: storage.load,
      save: storage.save,
      clear: storage.clear,
    },
    ads: createAds(),
    favorites: createFavorites(),
    events,
    async dispose() {
      target?.removeEventListener("pagehide", onPageHide);
      target?.removeEventListener("visibilitychange", onVisibilityChange);
      await storage.flush();
    },
  };
}
