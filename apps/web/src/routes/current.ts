// A página atual a partir do endereço, para o seletor de idioma e a faixa de sugestão.
import { isLocale, locales, type Locale } from "../i18n/config";
import { routes } from "./index";
import type { PageRef } from "./registry";

export function pageFromPathname(pathname: string): { locale: Locale; page: PageRef } | null {
  const [first, ...segments] = pathname.split("/").filter(Boolean);
  if (!isLocale(first)) return null;
  const page = routes.resolve(first, segments);
  return page ? { locale: first, page } : null;
}

/** Mesma página em cada idioma; sem equivalente, o catálogo do idioma (FDD 001 F2). */
export function alternatesForPathname(pathname: string): Record<Locale, string> {
  const current = pageFromPathname(pathname);
  if (current) return routes.getAlternates(current.page);
  return Object.fromEntries(
    locales.map((locale) => [locale, routes.getPath(locale, { id: "catalog" })]),
  ) as Record<Locale, string>;
}
