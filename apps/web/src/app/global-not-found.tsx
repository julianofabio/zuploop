// Página não encontrada fora dos idiomas (/404.html), para endereços como /qualquer-coisa.
// Com dois layouts raiz, o Next.js pede esta página completa, com <html> próprio (FDD 001 §8.5).
import "@zuploop/ui/tokens.css";
import "@zuploop/ui/base.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LocalizedLink } from "@/components/LocalizedLink";
import { defaultLocale, locales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { fontVariables } from "./fonts";
import styles from "./global-not-found.module.css";

const messages = getMessages(defaultLocale);

export const metadata: Metadata = {
  title: messages.meta.notFoundTitle,
  description: messages.meta.notFoundDescription,
  robots: { index: false },
};

export default function GlobalNotFound() {
  setRequestLocale(defaultLocale);
  return (
    <html lang={defaultLocale} className={fontVariables}>
      <body>
        <NextIntlClientProvider locale={defaultLocale} messages={messages}>
          <main className={styles.page}>
            <h1 className={styles.title}>{messages.errors.notFoundTitle}</h1>
            <p>{messages.errors.notFoundText}</p>
            <ul className={styles.links}>
              {locales.map((locale) => (
                <li key={locale}>
                  <LocalizedLink page="home" locale={locale} lang={locale}>
                    {getMessages(locale).lang.selfName}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
