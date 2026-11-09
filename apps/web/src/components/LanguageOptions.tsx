"use client";
// Lista de idiomas, cada um escrito nele mesmo (padrão §7.2 e §9.11). Usada no seletor do
// cabeçalho e em Ajustes, com o mesmo efeito: leva à mesma página no idioma e salva a escolha.
import { CheckIcon } from "@zuploop/ui";
import { useLocale } from "next-intl";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n/config";
import { saveLocale } from "@/i18n/detect";
import type { LanguageTexts } from "@/i18n/language-texts";
import { alternatesForPathname } from "@/routes/current";
import styles from "./LanguageOptions.module.css";

export function LanguageOptions({ texts }: { texts: LanguageTexts }) {
  const current = useLocale();
  const alternates = alternatesForPathname(usePathname());

  return (
    <ul className={styles.list}>
      {locales.map((locale) => (
        <li key={locale}>
          <NextLink
            href={alternates[locale]}
            lang={locale}
            hrefLang={locale}
            aria-current={locale === current ? "true" : undefined}
            className={styles.option}
            onClick={() => saveLocale(locale)}
          >
            <span>{texts[locale].selfName}</span>
            {locale === current ? <CheckIcon /> : null}
          </NextLink>
        </li>
      ))}
    </ul>
  );
}
