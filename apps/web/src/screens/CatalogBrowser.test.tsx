// Catálogo com busca e filtros (T043, RF-NAV-02, padrão §9.8 e §9.10).
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { withIntl } from "@/components/language-test-utils";
import type { CatalogEntry } from "@/games/catalog";
import { CatalogBrowser } from "./CatalogBrowser";
import { GameList, useGameCards } from "./GameList";

function Browser({ entries }: { entries: readonly CatalogEntry[] }) {
  const cards = useGameCards(entries);
  return <CatalogBrowser entries={entries} cards={cards} empty={<GameList entries={[]} />} />;
}

const entries: CatalogEntry[] = [
  {
    id: "word-search",
    category: "words",
    name: "Caça-palavras",
    description: "Ache as palavras",
    href: "/x/",
  },
  { id: "sudoku", category: "numbers", name: "Sudoku", description: "Números", href: "/y/" },
  { id: "checkers", category: "board", name: "Damas", description: "Tabuleiro", href: null },
];

const visibleNames = () =>
  screen.queryAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);

describe("CatalogBrowser", () => {
  it("mostra a lista inteira de início (também sem JavaScript, no HTML gerado)", () => {
    render(withIntl("pt", <Browser entries={entries} />));
    expect(visibleNames()).toEqual(["Caça-palavras", "Sudoku", "Damas"]);
  });

  it("tem um campo de busca com rótulo visível", () => {
    render(withIntl("pt", <Browser entries={entries} />));
    expect(screen.getByRole("searchbox", { name: "Buscar jogos" })).toBeInTheDocument();
  });

  it("filtra ao digitar, sem diferenciar acentos", async () => {
    render(withIntl("pt", <Browser entries={entries} />));
    await userEvent.type(screen.getByRole("searchbox", { name: "Buscar jogos" }), "caca");
    expect(visibleNames()).toEqual(["Caça-palavras"]);
  });

  it("mostra só as categorias que existem, num grupo de chips com aria-pressed", async () => {
    render(withIntl("pt", <Browser entries={entries} />));
    const group = screen.getByRole("group", { name: "Categorias" });
    const chips = within(group).getAllByRole("button");
    expect(chips.map((chip) => chip.textContent)).toEqual([
      "Todas",
      "Palavras",
      "Tabuleiro",
      "Números",
    ]);
    expect(within(group).getByRole("button", { name: "Todas" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await userEvent.click(within(group).getByRole("button", { name: "Tabuleiro" }));
    expect(within(group).getByRole("button", { name: "Tabuleiro" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(group).getByRole("button", { name: "Todas" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(visibleNames()).toEqual(["Damas"]);
  });

  it("anuncia quantos jogos aparecem", async () => {
    render(withIntl("pt", <Browser entries={entries} />));
    await userEvent.type(screen.getByRole("searchbox", { name: "Buscar jogos" }), "sudoku");
    expect(screen.getByRole("status")).toHaveTextContent("1 jogo");
  });

  it("sem resultado mostra o estado vazio e Limpar volta tudo", async () => {
    render(withIntl("pt", <Browser entries={entries} />));
    const search = screen.getByRole("searchbox", { name: "Buscar jogos" });
    await userEvent.type(search, "xadrez");
    expect(screen.getByText("Nenhum jogo encontrado.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Limpar busca e filtros" }));
    expect(search).toHaveValue("");
    expect(visibleNames()).toEqual(["Caça-palavras", "Sudoku", "Damas"]);
  });

  it("sem jogos, não mostra busca nem filtros", () => {
    render(withIntl("es", <Browser entries={[]} />));
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.getByText("Todavía no hay juegos aquí.")).toBeInTheDocument();
  });
});
