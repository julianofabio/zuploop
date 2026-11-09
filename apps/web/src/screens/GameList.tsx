// Grade de cards de jogo (padrão §6.4 e §9.5): 1 coluna no celular, 2 no tablet, 3 no computador.
// Renderizada no servidor: o código do card não vai para o navegador.
import { GameCard, GamesIcon } from "@zuploop/ui";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import type { ReactNode } from "react";
import type { CatalogEntry } from "@/games/catalog";
import { GameGrid } from "./GameGrid";
import styles from "./GameList.module.css";

type HeadingLevel = 2 | 3;

/** Um card por jogo, já no idioma, prontos para a grade (ou para o CatalogBrowser filtrar). */
export function useGameCards(
  entries: readonly CatalogEntry[],
  headingLevel: HeadingLevel = 2,
): Record<string, ReactNode> {
  const t = useTranslations("catalog");
  return Object.fromEntries(
    entries.map((entry) => [
      entry.id,
      <GameCard
        key={entry.id}
        name={entry.name}
        description={entry.description}
        icon={<GamesIcon size="lg" />}
        category={entry.category}
        headingLevel={headingLevel}
        linkComponent={NextLink}
        {...(entry.href ? { href: entry.href } : { badge: t("comingSoon") })}
      />,
    ]),
  );
}

export function GameList({
  entries,
  headingLevel = 2,
}: {
  entries: readonly CatalogEntry[];
  headingLevel?: HeadingLevel;
}) {
  const t = useTranslations("catalog");
  const cards = useGameCards(entries, headingLevel);
  if (entries.length === 0) {
    return <p className={styles.empty}>{t("empty")}</p>;
  }
  return <GameGrid items={entries.map((entry) => ({ id: entry.id, card: cards[entry.id] }))} />;
}
