// Ajustes (RF-NAV-06, parcial): na 001, só o idioma. O resto chega na 009.
import { useTranslations } from "next-intl";
import { LanguageOptions } from "@/components/LanguageOptions";
import type { LanguageTexts } from "@/i18n/language-texts";
import styles from "./SettingsScreen.module.css";

export function SettingsScreen({ languageTexts }: { languageTexts: LanguageTexts }) {
  const t = useTranslations("settings");
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t("title")}</h1>
      <section className={styles.section} aria-labelledby="settings-language">
        <h2 id="settings-language" className={styles.sectionTitle}>
          {t("languageTitle")}
        </h2>
        <p className={styles.hint}>{t("languageHint")}</p>
        <LanguageOptions texts={languageTexts} />
      </section>
    </div>
  );
}
