// Páginas de dois segmentos por idioma: a página de cada jogo (FDD 001 §6.4).
// Rota separada de [section] para cada página levar só o JS das próprias telas (RNF-01).
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { routes } from "@/routes";
import { metadataFor, resolvePage, segmentsWithLength } from "@/routes/pages";
import { GameScreen } from "@/screens/GameScreen";
import { NotFoundScreen } from "@/screens/NotFoundScreen";

export const dynamicParams = false;

/** Item usado só quando não há jogo público: a exportação estática exige ao menos uma página. */
const PLACEHOLDER_ITEM = "404";

interface Params {
  locale: string;
  section: string;
  item: string;
}

function isPlaceholder({ locale, section, item }: Params): boolean {
  return (
    isLocale(locale) &&
    item === PLACEHOLDER_ITEM &&
    section === routes.getSegments(locale, { id: "catalog" })[0]
  );
}

// O Next chama esta função só com o idioma: ela devolve seção e item juntos.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const games = segmentsWithLength(params.locale, 2).map(([section, item]) => ({ section, item }));
  if (games.length > 0 || !isLocale(params.locale)) return games;
  // Sem jogo público (antes da 002): só a 404 do catálogo, com noindex e fora do mapa do site.
  const [catalog] = routes.getSegments(params.locale, { id: "catalog" });
  return [{ section: catalog, item: PLACEHOLDER_ITEM }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale, section, item } = resolvedParams;
  if (isPlaceholder(resolvedParams) && isLocale(locale)) {
    return metadataFor(locale, { id: "not-found" });
  }
  const resolved = resolvePage(locale, [section, item]);
  return metadataFor(resolved.locale, resolved.page);
}

export default async function ItemPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const { locale, section, item } = resolvedParams;
  if (isPlaceholder(resolvedParams) && isLocale(locale)) {
    setRequestLocale(locale);
    return <NotFoundScreen />;
  }
  const { locale: pageLocale, page } = resolvePage(locale, [section, item]);
  if (page.id !== "game") notFound();
  setRequestLocale(pageLocale);
  return <GameScreen gameId={page.gameId} />;
}
