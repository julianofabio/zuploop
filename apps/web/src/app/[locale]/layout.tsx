// Layout raiz das páginas por idioma (FDD 001 §8.1): <html lang> certo, mensagens do idioma,
// cabeçalho, barra inferior no celular e rodapé (padrão §6.2 e §6.3).
import "@zuploop/ui/tokens.css";
import "@zuploop/ui/base.css";
import "@/styles/app.css";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSuggestion } from "@/components/LanguageSuggestion";
import { isLocale, locales } from "@/i18n/config";
import { languageTexts } from "@/i18n/language-texts";
import { getMessages } from "@/i18n/messages";
import { fontVariables } from "../fonts";
import styles from "./layout.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const texts = languageTexts();

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        {/* Marca o idioma a sugerir antes da pintura, para a faixa não deslocar a página (T020). */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/lang.js" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={getMessages(locale)}>
          <a className="skip-link" href="#main">
            {t("skipToContent")}
          </a>
          <LanguageSuggestion texts={texts} />
          <AppHeader languageTexts={texts} />
          <main id="main" className={styles.main} tabIndex={-1}>
            {children}
          </main>
          <AppFooter />
          <AppBottomNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
