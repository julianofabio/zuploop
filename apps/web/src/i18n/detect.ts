// Que idioma sugerir para a pessoa (FDD 001 F3, RF-I18N-04). A mesma regra do public/lang.js,
// que marca o <html> antes da pintura para a faixa não deslocar a página.
import { isLocale, LOCALE_STORAGE_KEY, type Locale } from "./config";

/** Primeiro idioma do navegador que o site tem, pelo começo da etiqueta ("es-MX" → "es"). */
export function browserLocale(languages: readonly string[]): Locale | null {
  for (const tag of languages) {
    const base = tag.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}

/** Idioma a sugerir, ou null. Ordem: escolha salva > navegador. */
export function suggestedLocale(
  pageLocale: Locale,
  saved: string | null,
  languages: readonly string[],
): Locale | null {
  const preferred = isLocale(saved) ? saved : browserLocale(languages);
  return preferred && preferred !== pageLocale ? preferred : null;
}

/** Escolha salva, ou null se não houver ou se o localStorage estiver bloqueado. */
export function readSavedLocale(): string | null {
  try {
    return window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Salva a escolha; com o localStorage bloqueado, segue sem salvar (FDD 001 §7). */
export function saveLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Nada a fazer: a escolha vale só nesta visita.
  }
}

export function navigatorLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}
