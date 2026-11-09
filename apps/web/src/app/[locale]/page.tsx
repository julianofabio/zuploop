// Página inicial de cada idioma (RF-NAV-01, parcial): título, jogos e "Ver todos os jogos".
// Desafio do dia, favoritos e "Continue jogando" entram na 007, 008 e 013.
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LocalizedLink } from "@/components/LocalizedLink";
import { loadCatalogEntries } from "@/games/catalog";
import { isLocale } from "@/i18n/config";
import { GameList } from "@/screens/GameList";
import styles from "./page.module.css";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const entries = await loadCatalogEntries(locale);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.intro}>{t("intro")}</p>
      </header>
      <section className={styles.section} aria-labelledby="home-games">
        <div className={styles.sectionHeader}>
          <h2 id="home-games" className={styles.sectionTitle}>
            {t("gamesTitle")}
          </h2>
          <LocalizedLink page="catalog" variant="menu" className={styles.seeAll}>
            {t("seeAllGames")}
          </LocalizedLink>
        </div>
        <GameList entries={entries} headingLevel={3} />
      </section>
    </div>
  );
}
