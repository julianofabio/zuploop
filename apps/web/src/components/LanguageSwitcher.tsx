"use client";
// Seletor de idioma do cabeçalho (padrão §7.2, FDD 001 F2): botão com a sigla que abre a lista
// com cada idioma escrito nele mesmo. Leva à mesma página no outro idioma e salva a escolha.
import { Button, LanguageIcon, Sheet } from "@zuploop/ui";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { LanguageTexts } from "@/i18n/language-texts";
import { LanguageOptions } from "./LanguageOptions";

export function LanguageSwitcher({ texts }: { texts: LanguageTexts }) {
  const t = useTranslations("lang");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        icon={<LanguageIcon />}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {/* O nome acessível vem do conteúdo ("Idioma PT") e contém o texto visível (WCAG 2.5.3). */}
        <span className="visually-hidden">{t("label")} </span>
        {t("short")}
      </Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={t("chooseTitle")}
        closeLabel={t("close")}
      >
        <LanguageOptions texts={texts} />
      </Sheet>
    </>
  );
}
