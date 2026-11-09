// Catálogo e lista de jogos (T023, RF-NAV-02).
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { withIntl } from "@/components/language-test-utils";
import type { CatalogEntry } from "@/games/catalog";
import { GameList } from "./GameList";

const entries: CatalogEntry[] = [
  {
    id: "word-search",
    category: "words",
    name: "Caça-palavras",
    description: "Ache as palavras",
    href: "/pt/jogos/caca-palavras/",
  },
  {
    id: "checkers",
    category: "board",
    name: "Damas",
    description: "Contra o computador",
    href: null,
  },
];

describe("GameList", () => {
  it("jogo disponível é um card com link para a página do jogo", () => {
    render(withIntl("pt", <GameList entries={entries} />));
    expect(screen.getByRole("link", { name: /Caça-palavras/ })).toHaveAttribute(
      "href",
      "/pt/jogos/caca-palavras/",
    );
  });

  it('jogo em breve aparece com o selo "Em breve" e sem link', () => {
    render(withIntl("pt", <GameList entries={entries} />));
    const card = screen.getByRole("heading", { name: "Damas" }).closest("article");
    if (!card) throw new Error("card");
    expect(within(card).getByText("Em breve")).toBeInTheDocument();
    expect(within(card).queryByRole("link")).not.toBeInTheDocument();
  });

  it("lista vazia mostra o estado vazio", () => {
    render(withIntl("es", <GameList entries={[]} />));
    expect(screen.getByText("Todavía no hay juegos aquí.")).toBeInTheDocument();
  });
});
