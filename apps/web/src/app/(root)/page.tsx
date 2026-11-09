// Página "/": logotipo e os três idiomas (FDD 001 F1). O lang.js redireciona antes da pintura;
// sem JavaScript, a pessoa (e os robôs de busca) veem os links.
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LocalizedLink } from "@/components/LocalizedLink";
import { SITE_URL } from "@/config/site";
import { defaultLocale, locales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { routes } from "@/routes";
import styles from "./page.module.css";

const brand = getMessages(defaultLocale).meta;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: brand.homeTitle,
  description: brand.homeDescription,
  alternates: {
    canonical: "/",
    languages: { "x-default": "/", ...routes.getAlternates({ id: "home" }) },
  },
};

export default function RootPage() {
  setRequestLocale(defaultLocale);
  return (
    <main className={styles.page}>
      <h1 className={styles.logo}>
        <span className={styles.mark} aria-hidden="true" />
        {brand.siteName}
      </h1>
      <div className={styles.prompts}>
        {locales.map((locale) => (
          <p key={locale} lang={locale}>
            {getMessages(locale).lang.chooseTitle}
          </p>
        ))}
      </div>
      <ul className={styles.list}>
        {locales.map((locale) => (
          <li key={locale}>
            <LocalizedLink
              page="home"
              locale={locale}
              lang={locale}
              variant="plain"
              className={styles.choice}
            >
              {getMessages(locale).lang.selfName}
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </main>
  );
}
