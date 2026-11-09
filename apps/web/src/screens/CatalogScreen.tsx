// Catálogo de jogos (RF-NAV-02, padrão §7.1). Busca e filtros ficam para depois (notas, L-03).
import { getLocale, getTranslations } from "next-intl/server";
import { loadCatalogEntries } from "@/games/catalog";
import { isLocale } from "@/i18n/config";
import styles from "./CatalogScreen.module.css";
import { GameList } from "./GameList";

export async function CatalogScreen() {
  const t = await getTranslations("catalog");
  const current = await getLocale();
  const entries = await loadCatalogEntries(isLocale(current) ? current : "en");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.intro}>{t("intro")}</p>
      </header>
      <GameList entries={entries} />
    </div>
  );
}
