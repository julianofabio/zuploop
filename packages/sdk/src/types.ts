// Contrato entre o portal e os jogos (FDD 001 §6.1 e §6.2, ADR-0014).
// Mudança que quebre jogos exige SDK_VERSION novo e um ADR.
import type { ComponentType } from "react";

export const SDK_VERSION = 1 as const;

export type Locale = "pt" | "es" | "en";

// Valores em inglês por serem identificadores; o rótulo exibido vem dos arquivos de idioma.
export type GameCategory = "words" | "board" | "numbers" | "logic";

export type GameStatus = "available" | "coming_soon" | "hidden";

export interface GameManifest {
  /** Identificador estável, em inglês; nunca muda (vai nas chaves de save e nos eventos). */
  id: string;
  category: GameCategory;
  /** Fase do PRD em que o jogo é lançado. */
  phase: 1 | 2 | 3 | 4 | 5;
  /** `hidden` só aparece em desenvolvimento e testes (ZUPLOOP_SHOW_HIDDEN_GAMES). */
  status: GameStatus;
  /** Slug público por idioma, traduzido (ADR-0013). */
  slugs: Record<Locale, string>;
  /** Versão do formato do save; começa em 1. */
  saveVersion: number;
  /** Converte um save antigo para `saveVersion`; se lançar erro, o save é descartado. */
  migrateSave?: (fromVersion: number, data: unknown) => unknown;
  messages: Record<Locale, () => Promise<GameMessages>>;
  load: () => Promise<{ default: ComponentType<GameProps> }>;
}

export interface GameMessages {
  /** Nome exibido do jogo. */
  name: string;
  /** Usado na meta description e no card. */
  description: string;
  howToPlay: { rules: string[]; controls: string[]; tip: string };
  /** Textos internos do jogo, lidos por `sdk.i18n.t`. */
  ui: Record<string, string>;
}

export interface GameProps {
  sdk: PortalSdk;
  onExit: () => void;
}

export interface PortalSdk {
  readonly version: typeof SDK_VERSION;
  readonly gameId: string;

  getLocale(): Locale;

  i18n: {
    t(key: string, params?: Record<string, string | number>): string;
  };

  storage: {
    /** Slot padrão: "main". */
    load<T>(slot?: string): Promise<T | null>;
    save<T>(slot: string, data: T): Promise<void>;
    clear(slot?: string): Promise<void>;
    /** `false` quando os saves ficam só em memória (algumas navegações privadas). */
    readonly persistent: boolean;
  };

  ads: {
    /** Intervalo no fim da partida. */
    commercialBreak(): Promise<AdResult>;
    /** Dica com recompensa. */
    rewardedBreak(): Promise<AdResult>;
  };

  favorites: {
    isFavorite(ref: FavoriteRef): Promise<boolean>;
    /** Devolve o novo estado. */
    toggle(ref: FavoriteRef): Promise<boolean>;
  };

  events: {
    track(name: GameEventName, props?: Record<string, string | number | boolean>): void;
  };
}

export type AdResult = { shown: boolean; rewarded: boolean };

export interface FavoriteRef {
  kind: "game" | "theme" | "level";
  gameId: string;
  id?: string;
}

export type GameEventName =
  | "game_start"
  | "game_end"
  | "game_abandon"
  | "hint_used"
  | "tutorial_skip"
  | "tutorial_done"
  | "result_shared"
  | "favorite_set"
  | "save_discarded";
