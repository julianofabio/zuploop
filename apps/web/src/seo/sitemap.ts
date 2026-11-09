// Mapas do site (RNF-03, FDD 001 §8.1): um índice e um mapa por idioma, com os alternates de
// cada página. Ficam de fora a 404 e os jogos que não são públicos (hidden).
import { SITE_URL } from "@/config/site";
import { findGame } from "@/games/registry";
import { locales, type Locale } from "@/i18n/config";
import { routes, type PageRef } from "@/routes";

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';

function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Páginas que vão para o Google. */
export function publicPages(): PageRef[] {
  return routes.listPages().filter((page) => {
    if (page.id === "not-found") return false;
    if (page.id === "game") return findGame(page.gameId)?.status === "available";
    return true;
  });
}

export function sitemapIndexXml(): string {
  const entries = locales
    .map(
      (locale) => `<sitemap><loc>${escapeXml(absolute(`/sitemap-${locale}.xml`))}</loc></sitemap>`,
    )
    .join("");
  return `${XML_HEADER}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`;
}

export function sitemapXml(locale: Locale): string {
  const urls = publicPages()
    .map((page) => {
      const alternates = Object.entries(routes.getAlternates(page))
        .map(
          ([lang, path]) =>
            `<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(absolute(path))}"/>`,
        )
        .join("");
      const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absolute("/"))}"/>`;
      return `<url><loc>${escapeXml(absolute(routes.getPath(locale, page)))}</loc>${alternates}${xDefault}</url>`;
    })
    .join("");
  return `${XML_HEADER}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
}

export function xmlResponse(body: string): Response {
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
