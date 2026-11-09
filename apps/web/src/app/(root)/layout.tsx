// Layout raiz da página "/" (escolha de idioma). As páginas por idioma têm o próprio
// layout raiz em [locale] (FDD 001 §8.1).
import "@zuploop/ui/tokens.css";
import "@zuploop/ui/base.css";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { defaultLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { fontVariables } from "../fonts";

export default function RootLayout({ children }: { children: ReactNode }) {
  setRequestLocale(defaultLocale);
  return (
    <html lang={defaultLocale} className={fontVariables}>
      <head>
        {/* Decide o idioma antes da pintura e redireciona (FDD 001 F1). Precisa ser síncrono. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/lang.js" />
      </head>
      <body>
        <NextIntlClientProvider locale={defaultLocale} messages={getMessages(defaultLocale)}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
