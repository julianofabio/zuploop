// Página de jogo gerada (T026, RF-NAV-03, RF-AJ-03, RNF-01).
import { describe, expect, it } from "vitest";
import { chunksContaining, readOut } from "./out";

describe("página do jogo de exemplo", () => {
  const pt = readOut("pt/jogos/exemplo/index.html");

  it("existe nos três idiomas com os slugs do manifesto", () => {
    expect(() => readOut("es/juegos/ejemplo/index.html")).not.toThrow();
    expect(() => readOut("en/games/example/index.html")).not.toThrow();
  });

  it("tem título, descrição e Como jogar em texto, no idioma da página", () => {
    expect(pt).toMatch(/<h1[^>]*>Jogo de exemplo<\/h1>/);
    expect(pt).toContain("Um jogo de referência para testar o salvamento");
    expect(pt).toMatch(/<h2[^>]*>Como jogar<\/h2>/);
    expect(pt).toContain("Cada jogada soma 1 ou 2 pontos.");
    expect(pt).toContain("Feche a página no meio da partida");
    expect(readOut("es/juegos/ejemplo/index.html")).toMatch(/<h2[^>]*>Cómo jugar<\/h2>/);
  });

  it('tem o botão "Jogar"', () => {
    expect(pt).toMatch(/<button[^>]*>[\s\S]*?Jogar[\s\S]*?<\/button>/);
  });

  it("não carrega nenhum script do jogo antes de tocar em Jogar", () => {
    const gameChunks = chunksContaining("example-moves");
    expect(gameChunks.length).toBeGreaterThan(0);
    for (const chunk of gameChunks) {
      expect(pt, chunk).not.toContain(chunk);
    }
  });
});
