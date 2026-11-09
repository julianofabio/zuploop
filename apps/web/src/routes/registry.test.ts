// Registro de rotas (T017, FDD 001 §6.4, ADR-0013).
import { describe, expect, it } from "vitest";
import { createRouteRegistry, type GameRouteInfo } from "./registry";

const wordSearch: GameRouteInfo = {
  id: "word-search",
  slugs: { pt: "caca-palavras", es: "sopa-de-letras", en: "word-search" },
};
const sudoku: GameRouteInfo = {
  id: "sudoku",
  slugs: { pt: "sudoku", es: "sudoku", en: "sudoku" },
};

describe("registro de rotas", () => {
  const routes = createRouteRegistry([wordSearch, sudoku]);

  it("monta os caminhos fixos em cada idioma", () => {
    expect(routes.getPath("pt", { id: "home" })).toBe("/pt/");
    expect(routes.getPath("es", { id: "catalog" })).toBe("/es/juegos/");
    expect(routes.getPath("en", { id: "catalog" })).toBe("/en/games/");
    expect(routes.getPath("pt", { id: "settings" })).toBe("/pt/ajustes/");
    expect(routes.getPath("en", { id: "settings" })).toBe("/en/settings/");
    expect(routes.getPath("es", { id: "not-found" })).toBe("/es/404/");
  });

  it("página de jogo usa os slugs do manifesto, dentro do catálogo do idioma", () => {
    const page = { id: "game", gameId: "word-search" } as const;
    expect(routes.getPath("pt", page)).toBe("/pt/jogos/caca-palavras/");
    expect(routes.getPath("es", page)).toBe("/es/juegos/sopa-de-letras/");
    expect(routes.getPath("en", page)).toBe("/en/games/word-search/");
  });

  it("getAlternates devolve a mesma página nos três idiomas", () => {
    expect(routes.getAlternates({ id: "catalog" })).toEqual({
      pt: "/pt/jogos/",
      es: "/es/juegos/",
      en: "/en/games/",
    });
    expect(routes.getAlternates({ id: "game", gameId: "word-search" })).toEqual({
      pt: "/pt/jogos/caca-palavras/",
      es: "/es/juegos/sopa-de-letras/",
      en: "/en/games/word-search/",
    });
  });

  it("caminhos são únicos em cada idioma", () => {
    for (const locale of ["pt", "es", "en"] as const) {
      const paths = routes.listPages().map((page) => routes.getPath(locale, page));
      expect(new Set(paths).size, locale).toBe(paths.length);
    }
  });

  it("lista todas as páginas, inclusive as de jogo", () => {
    expect(routes.listPages()).toEqual([
      { id: "home" },
      { id: "catalog" },
      { id: "settings" },
      { id: "not-found" },
      { id: "game", gameId: "word-search" },
      { id: "game", gameId: "sudoku" },
    ]);
  });

  it("resolve um caminho de volta para a página", () => {
    expect(routes.resolve("pt", [])).toEqual({ id: "home" });
    expect(routes.resolve("es", ["juegos"])).toEqual({ id: "catalog" });
    expect(routes.resolve("en", ["games", "word-search"])).toEqual({
      id: "game",
      gameId: "word-search",
    });
    expect(routes.resolve("pt", ["juegos"])).toBeNull();
    expect(routes.resolve("pt", ["jogos", "nao-existe"])).toBeNull();
  });

  it("jogo desconhecido não tem caminho", () => {
    expect(() => routes.getPath("pt", { id: "game", gameId: "missing" })).toThrow(/missing/);
  });

  it("conflito de slug entre jogos falha", () => {
    const clash: GameRouteInfo = {
      id: "word-hunt",
      slugs: { pt: "caca-palavras", es: "caza", en: "hunt" },
    };
    expect(() => createRouteRegistry([wordSearch, clash])).toThrow(/caca-palavras/);
  });

  it("id de jogo repetido falha", () => {
    expect(() => createRouteRegistry([wordSearch, { ...sudoku, id: "word-search" }])).toThrow(
      /word-search/,
    );
  });

  it("slug fora do formato (minúsculas, números e hífen) falha", () => {
    const bad: GameRouteInfo = { id: "bad", slugs: { pt: "x", es: "y", en: "z/w" } };
    expect(() => createRouteRegistry([bad])).toThrow(/z\/w/);
  });
});
