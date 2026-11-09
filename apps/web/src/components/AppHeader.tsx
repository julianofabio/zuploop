"use client";
// Cabeçalho do site: logotipo, navegação (a partir de 1024 px) e seletor de idioma.
import { Logo, SiteHeader } from "@zuploop/ui";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import type { LanguageTexts } from "@/i18n/language-texts";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocalizedLink } from "./LocalizedLink";
import styles from "./AppHeader.module.css";
import { useNavItems } from "./nav-items";

export function AppHeader({ languageTexts }: { languageTexts: LanguageTexts }) {
  const t = useTranslations();
  return (
    <SiteHeader
      logo={
        <LocalizedLink
          page="home"
          variant="plain"
          className={styles.logoLink}
          aria-label={t("common.logoLabel")}
        >
          <Logo name={t("meta.siteName")} />
        </LocalizedLink>
      }
      navLabel={t("nav.mainLabel")}
      items={useNavItems()}
      linkComponent={NextLink}
      actions={<LanguageSwitcher texts={languageTexts} />}
    />
  );
}
