// Grade de cards de jogo (padrão §6.4 e §9.5): 1 coluna no celular, 2 no tablet, 3 no computador.
import { GameCard, GamesIcon } from "@zuploop/ui";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import type { CatalogEntry } from "@/games/catalog";
import styles from "./GameList.module.css";

export function GameList({
  entries,
  headingLevel = 2,
}: {
  entries: readonly CatalogEntry[];
  headingLevel?: 2 | 3;
}) {
  const t = useTranslations("catalog");
  if (entries.length === 0) {
    return <p className={styles.empty}>{t("empty")}</p>;
  }
  return (
    <ul className={styles.grid}>
      {entries.map((entry) => (
        <li key={entry.id}>
          <GameCard
            name={entry.name}
            description={entry.description}
            icon={<GamesIcon size="lg" />}
            category={entry.category}
            headingLevel={headingLevel}
            linkComponent={NextLink}
            {...(entry.href ? { href: entry.href } : { badge: t("comingSoon") })}
          />
        </li>
      ))}
    </ul>
  );
}
