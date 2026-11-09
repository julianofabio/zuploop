"use client";
// Catálogo com busca e filtros por categoria (T043, RF-NAV-02, padrão §9.8 e §9.10).
// O HTML gerado já traz a lista inteira; sem JavaScript, ela continua lá.
import type { GameCategory } from "@zuploop/sdk";
import { Button, Chip, TextField } from "@zuploop/ui";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import type { CatalogEntry } from "@/games/catalog";
import { categoriesIn, filterEntries } from "@/games/filter";
import styles from "./CatalogBrowser.module.css";
import { GameGrid } from "./GameGrid";

export interface CatalogBrowserProps {
  entries: readonly CatalogEntry[];
  /** Cards já renderizados no servidor, por id do jogo (o código do card fica fora do navegador). */
  cards: Record<string, ReactNode>;
  /** O que mostrar quando não há jogo nenhum. */
  empty: ReactNode;
}

export function CatalogBrowser({ entries, cards, empty }: CatalogBrowserProps) {
  const t = useTranslations("catalog");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GameCategory | null>(null);

  if (entries.length === 0) return empty;

  const categories = categoriesIn(entries);
  const visible = filterEntries(entries, { query, category });

  function clear() {
    setQuery("");
    setCategory(null);
  }

  return (
    <div className={styles.browser}>
      <div className={styles.controls} role="search">
        <TextField
          className={styles.search}
          label={t("searchLabel")}
          type="search"
          autoComplete="off"
          value={query}
          onChange={setQuery}
        />
        {categories.length > 1 ? (
          <div className={styles.chips} role="group" aria-label={t("filterLabel")}>
            <Chip selected={category === null} onClick={() => setCategory(null)}>
              {t("allCategories")}
            </Chip>
            {categories.map((value) => (
              <Chip key={value} selected={category === value} onClick={() => setCategory(value)}>
                {t(`categories.${value}`)}
              </Chip>
            ))}
          </div>
        ) : null}
      </div>
      <p className="visually-hidden" role="status">
        {t("results", { count: visible.length })}
      </p>
      {visible.length > 0 ? (
        <GameGrid items={visible.map((entry) => ({ id: entry.id, card: cards[entry.id] }))} />
      ) : (
        <div className={styles.empty}>
          <p>{t("noResults")}</p>
          <Button variant="secondary" size="md" onClick={clear}>
            {t("clear")}
          </Button>
        </div>
      )}
    </div>
  );
}
