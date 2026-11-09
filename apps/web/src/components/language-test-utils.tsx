// Apoio aos testes dos componentes de idioma: mensagens reais e textos por idioma.
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { languageTexts } from "@/i18n/language-texts";
import { getMessages } from "@/i18n/messages";

export const texts = languageTexts();

export function withIntl(locale: Locale, children: ReactNode) {
  return (
    <NextIntlClientProvider locale={locale} messages={getMessages(locale)}>
      {children}
    </NextIntlClientProvider>
  );
}
