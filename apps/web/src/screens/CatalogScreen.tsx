// Catálogo de jogos (RF-NAV-02, padrão §7.1), com busca e filtros por categoria (T043).
import { getLocale, getTranslations } from "next-intl/server";
import { loadCatalogEntries } from "@/games/catalog";
import { isLocale } from "@/i18n/config";
import styles from "./CatalogScreen.module.css";
import { CatalogBrowser } from "./CatalogBrowser";
import { GameList, useGameCards } from "./GameList";

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
      <CatalogCards entries={entries} />
    </div>
  );
}

function CatalogCards({ entries }: { entries: Awaited<ReturnType<typeof loadCatalogEntries>> }) {
  const cards = useGameCards(entries);
  return <CatalogBrowser entries={entries} cards={cards} empty={<GameList entries={[]} />} />;
}
