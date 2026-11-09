import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it } from "vitest";
import { GamesIcon, HeartIcon } from "../../icons";
import { IconButton } from "../IconButton/IconButton";
import { GameCard } from "./GameCard";

function FakeRouterLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-router="true" {...props}>
      {children}
    </a>
  );
}

describe("GameCard", () => {
  it("o card inteiro é um link com o nome do jogo", () => {
    render(
      <GameCard
        name="Caça-palavras"
        description="Ache as palavras escondidas na grade"
        icon={<GamesIcon />}
        category="words"
        href="/pt/jogos/caca-palavras/"
      />,
    );
    const link = screen.getByRole("link", { name: /Caça-palavras/ });
    expect(link).toHaveAttribute("href", "/pt/jogos/caca-palavras/");
    expect(screen.getByText("Ache as palavras escondidas na grade")).toBeInTheDocument();
  });

  it("o nome é um título, no nível pedido", () => {
    render(
      <GameCard
        name="Sudoku"
        description="Números"
        icon={<GamesIcon />}
        category="numbers"
        href="/x/"
        headingLevel={3}
      />,
    );
    expect(screen.getByRole("heading", { name: "Sudoku", level: 3 })).toBeInTheDocument();
  });

  it("jogo em breve não tem link e mostra o selo", () => {
    render(
      <GameCard
        name="Damas"
        description="Tabuleiro"
        icon={<GamesIcon />}
        category="board"
        badge="Em breve"
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Em breve")).toHaveAttribute("data-variant", "neutral");
  });

  it("a ação (favorito) fica fora do link", () => {
    render(
      <GameCard
        name="Sudoku"
        description="Números"
        icon={<GamesIcon />}
        category="numbers"
        href="/pt/jogos/sudoku/"
        action={<IconButton label="Favoritar: Sudoku" icon={<HeartIcon />} variant="subtle" />}
      />,
    );
    const link = screen.getByRole("link");
    const button = screen.getByRole("button", { name: "Favoritar: Sudoku" });
    expect(link).not.toContainElement(button);
  });

  it("marca a categoria para o fundo do ícone", () => {
    const { container } = render(
      <GameCard name="X" description="Y" icon={<GamesIcon />} category="logic" />,
    );
    expect(container.querySelector("[data-category]")).toHaveAttribute("data-category", "logic");
  });

  it("aceita outro componente de link", () => {
    render(
      <GameCard
        name="X"
        description="Y"
        icon={<GamesIcon />}
        category="words"
        href="/x/"
        linkComponent={FakeRouterLink}
      />,
    );
    expect(screen.getByRole("link")).toHaveAttribute("data-router", "true");
  });
});
