// Parâmetros e metadados das páginas por idioma, comuns às rotas [section] (catálogo, ajustes,
// 404) e [section]/[item] (jogos). Não importa telas: cada rota leva só o JS das próprias telas.
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { findGame } from "@/games/registry";
import { isLocale, type Locale } from "@/i18n/config";
import { pageMetadata, withSiteName } from "@/seo/metadata";
import { routes, type PageRef } from "./index";

/** Segmentos (depois do idioma) de todas as páginas com esse número de segmentos. */
export function segmentsWithLength(locale: string, length: number): string[][] {
  if (!isLocale(locale)) return [];
  return routes
    .listPages()
    .map((page) => routes.getSegments(locale, page))
    .filter((segments) => segments.length === length);
}

export function resolvePage(locale: string, segments: string[]): { locale: Locale; page: PageRef } {
  if (!isLocale(locale)) notFound();
  const page = routes.resolve(locale, segments);
  if (!page || page.id === "home") notFound();
  return { locale, page };
}

export async function metadataFor(locale: Locale, page: PageRef): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const site = t("siteName");
  switch (page.id) {
    case "catalog":
      return pageMetadata(locale, page, {
        title: withSiteName(t("catalogTitle"), site),
        description: t("catalogDescription"),
      });
    case "settings":
      return pageMetadata(locale, page, {
        title: withSiteName(t("settingsTitle"), site),
        description: t("settingsDescription"),
      });
    case "not-found":
      return pageMetadata(locale, page, {
        title: withSiteName(t("notFoundTitle"), site),
        description: t("notFoundDescription"),
        noindex: true,
      });
    case "game": {
      const game = findGame(page.gameId);
      if (!game) notFound();
      const messages = await game.messages[locale]();
      return pageMetadata(locale, page, {
        title: withSiteName(messages.name, site),
        description: messages.description,
      });
    }
    default:
      notFound();
  }
}
