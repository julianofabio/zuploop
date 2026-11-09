// Páginas de um segmento por idioma: catálogo, ajustes e 404 (FDD 001 §6.4).
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { languageTexts } from "@/i18n/language-texts";
import { metadataFor, resolvePage, segmentsWithLength } from "@/routes/pages";
import { CatalogScreen } from "@/screens/CatalogScreen";
import { NotFoundScreen } from "@/screens/NotFoundScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";

export const dynamicParams = false;

interface Params {
  locale: string;
  section: string;
}

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return segmentsWithLength(params.locale, 1).map(([section]) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, section } = await params;
  const resolved = resolvePage(locale, [section]);
  return metadataFor(resolved.locale, resolved.page);
}

export default async function SectionPage({ params }: { params: Promise<Params> }) {
  const { locale, section } = await params;
  const { locale: pageLocale, page } = resolvePage(locale, [section]);
  setRequestLocale(pageLocale);

  switch (page.id) {
    case "catalog":
      return <CatalogScreen />;
    case "settings":
      return <SettingsScreen languageTexts={languageTexts()} />;
    case "not-found":
      return <NotFoundScreen />;
    default:
      notFound();
  }
}
