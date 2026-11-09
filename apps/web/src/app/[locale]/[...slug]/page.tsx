// Todas as páginas por idioma, menos o início, geradas a partir do registro de rotas (FDD 001 §6.4).
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { languageTexts } from "@/i18n/language-texts";
import { routes, type PageRef } from "@/routes";
import { CatalogScreen } from "@/screens/CatalogScreen";
import { GameScreen } from "@/screens/GameScreen";
import { NotFoundScreen } from "@/screens/NotFoundScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { findGame } from "@/games/registry";
import { pageMetadata, withSiteName } from "@/seo/metadata";

export const dynamicParams = false;

interface SlugParams {
  locale: string;
  slug: string[];
}

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const targets: Locale[] = isLocale(params.locale) ? [params.locale] : [...locales];
  return targets.flatMap((locale) =>
    routes
      .listPages()
      .filter((page) => page.id !== "home")
      .map((page) => ({ slug: routes.getSegments(locale, page) })),
  );
}

function resolvePage(params: SlugParams): { locale: Locale; page: PageRef } {
  if (!isLocale(params.locale)) notFound();
  const page = routes.resolve(params.locale, params.slug);
  if (!page || page.id === "home") notFound();
  return { locale: params.locale, page };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<SlugParams>;
}): Promise<Metadata> {
  const { locale, page } = resolvePage(await params);
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

export default async function SlugPage({ params }: { params: Promise<SlugParams> }) {
  const { locale, page } = resolvePage(await params);
  setRequestLocale(locale);

  switch (page.id) {
    case "catalog":
      return <CatalogScreen />;
    case "settings":
      return <SettingsScreen languageTexts={languageTexts()} />;
    case "not-found":
      return <NotFoundScreen />;
    case "game":
      return <GameScreen gameId={page.gameId} />;
    default:
      notFound();
  }
}
