// Busca e filtro do catálogo (T043, RF-NAV-02).
import { describe, expect, it } from "vitest";
import type { CatalogEntry } from "./catalog";
import { filterEntries } from "./filter";

const entries: CatalogEntry[] = [
  {
    id: "word-search",
    category: "words",
    name: "Caça-palavras",
    description: "Ache as palavras",
    href: "/a/",
  },
  {
    id: "sudoku",
    category: "numbers",
    name: "Sudoku",
    description: "Números de 1 a 9",
    href: "/b/",
  },
  {
    id: "checkers",
    category: "board",
    name: "Damas",
    description: "Tabuleiro clássico",
    href: null,
  },
];

const ids = (list: CatalogEntry[]) => list.map((entry) => entry.id);

describe("filterEntries", () => {
  it("sem busca nem categoria devolve tudo", () => {
    expect(ids(filterEntries(entries, { query: "", category: null }))).toEqual([
      "word-search",
      "sudoku",
      "checkers",
    ]);
  });

  it("busca no nome e na descrição, sem diferenciar maiúsculas e acentos", () => {
    expect(ids(filterEntries(entries, { query: "CACA", category: null }))).toEqual(["word-search"]);
    expect(ids(filterEntries(entries, { query: "numeros", category: null }))).toEqual(["sudoku"]);
    expect(ids(filterEntries(entries, { query: "  tabuleiro ", category: null }))).toEqual([
      "checkers",
    ]);
  });

  it("filtra por categoria", () => {
    expect(ids(filterEntries(entries, { query: "", category: "board" }))).toEqual(["checkers"]);
  });

  it("combina busca e categoria", () => {
    expect(ids(filterEntries(entries, { query: "sudoku", category: "words" }))).toEqual([]);
  });
});
