// Visibilidade dos jogos (T023, FDD 001 §6.1).
import { describe, expect, it } from "vitest";
import { catalogGames, routableGames, showHiddenGames } from "./registry";
import { availableGame, comingSoonGame, hiddenGame, testGames } from "./test-manifests";

describe("registro de jogos", () => {
  it("o catálogo lista available e coming_soon e esconde hidden por padrão", () => {
    expect(catalogGames(testGames, false)).toEqual([availableGame, comingSoonGame]);
  });

  it("com a variável ligada, o catálogo mostra os ocultos", () => {
    expect(catalogGames(testGames, true)).toEqual(testGames);
  });

  it("só jogos available (e ocultos, com a variável) têm página própria", () => {
    expect(routableGames(testGames, false)).toEqual([availableGame]);
    expect(routableGames(testGames, true)).toEqual([availableGame, hiddenGame]);
  });

  it("ZUPLOOP_SHOW_HIDDEN_GAMES só liga com o valor true", () => {
    expect(showHiddenGames("true")).toBe(true);
    expect(showHiddenGames("1")).toBe(false);
    expect(showHiddenGames(undefined)).toBe(false);
  });
});
