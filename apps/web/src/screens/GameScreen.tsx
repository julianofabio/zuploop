// Página de um jogo (RF-NAV-03, RF-AJ-03): título, descrição e "Como jogar" em HTML, no idioma
// da página, e o botão "Jogar". O jogo só é baixado ao tocar em "Jogar" (RNF-01).
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { findGame } from "@/games/registry";
import { isLocale } from "@/i18n/config";
import styles from "./GameScreen.module.css";
import { PlayArea } from "./PlayArea";

export async function GameScreen({ gameId }: { gameId: string }) {
  const game = findGame(gameId);
  if (!game) notFound();
  const current = await getLocale();
  const locale = isLocale(current) ? current : "en";
  const [messages, t] = await Promise.all([game.messages[locale](), getTranslations("game")]);

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{messages.name}</h1>
        <p className={styles.description}>{messages.description}</p>
        <PlayArea gameId={game.id} />
      </header>
      <section className={styles.howTo} aria-labelledby="how-to-play">
        <h2 id="how-to-play" className={styles.sectionTitle}>
          {t("howToPlay")}
        </h2>
        <h3 className={styles.subTitle}>{t("rules")}</h3>
        <ul className={styles.list}>
          {messages.howToPlay.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <h3 className={styles.subTitle}>{t("controls")}</h3>
        <ul className={styles.list}>
          {messages.howToPlay.controls.map((control) => (
            <li key={control}>{control}</li>
          ))}
        </ul>
        <h3 className={styles.subTitle}>{t("tip")}</h3>
        <p>{messages.howToPlay.tip}</p>
      </section>
    </article>
  );
}
