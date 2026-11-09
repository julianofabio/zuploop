"use client";
// Seletor de idioma do cabeçalho (padrão §7.2, FDD 001 F2): botão com a sigla que abre a lista
// com cada idioma escrito nele mesmo. Leva à mesma página no outro idioma e salva a escolha.
import { Button, CheckIcon, LanguageIcon, Sheet } from "@zuploop/ui";
import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { locales } from "@/i18n/config";
import { saveLocale } from "@/i18n/detect";
import type { LanguageTexts } from "@/i18n/language-texts";
import { alternatesForPathname } from "@/routes/current";
import styles from "./LanguageSwitcher.module.css";

export function LanguageSwitcher({ texts }: { texts: LanguageTexts }) {
  const t = useTranslations("lang");
  const current = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const alternates = alternatesForPathname(pathname);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        icon={<LanguageIcon />}
        aria-label={`${t("label")} (${t("short")})`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {t("short")}
      </Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={t("chooseTitle")}
        closeLabel={t("close")}
      >
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
      </Sheet>
    </>
  );
}
