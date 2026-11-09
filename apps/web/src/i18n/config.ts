// Idiomas do site (RF-I18N-01). O inglês é a referência e a reserva (RF-I18N-05).
import type { Locale } from "@zuploop/sdk";

export type { Locale };

export const locales = ["pt", "es", "en"] as const satisfies readonly Locale[];

export const defaultLocale: Locale = "en";

/** Chave do localStorage com a escolha de idioma da pessoa (FDD 001 F1 e F2). */
export const LOCALE_STORAGE_KEY = "zuploop.locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
