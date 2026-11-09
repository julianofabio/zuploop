// Layout raiz das páginas por idioma (FDD 001 §8.1): <html lang> certo e mensagens do idioma.
import "@zuploop/ui/tokens.css";
import "@zuploop/ui/base.css";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isLocale, locales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { fontVariables } from "../fonts";

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

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <NextIntlClientProvider locale={locale} messages={getMessages(locale)}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
