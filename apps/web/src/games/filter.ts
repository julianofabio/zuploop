// Busca e filtro do catálogo, no navegador (T043, RF-NAV-02): sem diferenciar maiúsculas e acentos.
import type { GameCategory } from "@zuploop/sdk";
import type { CatalogEntry } from "./catalog";

/** Ordem fixa dos filtros de categoria. */
export const CATEGORY_ORDER: readonly GameCategory[] = ["words", "board", "numbers", "logic"];

export interface CatalogFilter {
  query: string;
  category: GameCategory | null;
}

/** "Caça" → "caca": minúsculas e sem acentos. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function filterEntries(
  entries: readonly CatalogEntry[],
  { query, category }: CatalogFilter,
): CatalogEntry[] {
  const needle = normalize(query);
  return entries.filter(
    (entry) =>
      (category === null || entry.category === category) &&
      (needle === "" || normalize(`${entry.name} ${entry.description}`).includes(needle)),
  );
}

export function categoriesIn(entries: readonly CatalogEntry[]): GameCategory[] {
  const present = new Set(entries.map((entry) => entry.category));
  return CATEGORY_ORDER.filter((category) => present.has(category));
}
