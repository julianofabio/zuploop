// Metadados de cada página (RNF-03, FDD 001 §8.1): título e descrição únicos, canonical e
// hreflang pt, es, en e x-default (que aponta para a raiz "/"), a partir do registro de rotas.
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { routes, type PageRef } from "@/routes";

export interface PageTexts {
  title: string;
  description: string;
  /** Página que não deve ir para o Google (404). */
  noindex?: boolean;
}

export function pageMetadata(locale: Locale, page: PageRef, texts: PageTexts): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: texts.title,
    description: texts.description,
    alternates: {
      canonical: routes.getPath(locale, page),
      languages: { ...routes.getAlternates(page), "x-default": "/" },
    },
    openGraph: {
      title: texts.title,
      description: texts.description,
      url: routes.getPath(locale, page),
      siteName: "ZupLoop",
      locale,
      type: "website",
    },
    ...(texts.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** "Jogos · ZupLoop". */
export function withSiteName(title: string, siteName: string): string {
  return `${title} · ${siteName}`;
}
