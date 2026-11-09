// Textos do jogo no idioma da página (RF-I18N-06). O inglês é a referência (RF-I18N-05).
import type { Locale } from "./types";

export interface I18nOptions {
  locale: Locale;
  /** Textos do jogo no idioma da página. */
  messages: Record<string, string>;
  /** Textos em inglês, usados quando falta a chave no idioma da página. */
  fallback: Record<string, string>;
  /** Em desenvolvimento, avisa no console sobre chaves que não existem. */
  dev: boolean;
  warn?: (message: string) => void;
}

export interface GameI18n {
  getLocale(): Locale;
  t(key: string, params?: Record<string, string | number>): string;
}

function lookup(table: Record<string, string>, key: string): string | undefined {
  return Object.hasOwn(table, key) ? table[key] : undefined;
}

/** Troca `{nome}` pelo parâmetro; marcadores sem valor ficam como estão. */
function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (marker, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : marker,
  );
}

export function createI18n(options: I18nOptions): GameI18n {
  const warn = options.warn ?? ((message: string) => console.warn(message));
  return {
    getLocale: () => options.locale,
    t(key, params) {
      const text = lookup(options.messages, key) ?? lookup(options.fallback, key);
      if (text === undefined) {
        if (options.dev)
          warn(`[zuploop/sdk] Missing translation key "${key}" (${options.locale}).`);
        return key;
      }
      return interpolate(text, params);
    },
  };
}
