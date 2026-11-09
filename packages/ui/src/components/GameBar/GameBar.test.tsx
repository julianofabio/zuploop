import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameBar } from "./GameBar";

describe("GameBar", () => {
  it("mostra Voltar e o título do jogo", () => {
    render(<GameBar title="Jogo de exemplo" backLabel="Voltar" onBack={() => undefined} />);
    expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Jogo de exemplo" })).toBeInTheDocument();
  });

  it("chama onBack ao tocar em Voltar", async () => {
    const onBack = vi.fn();
    render(<GameBar title="X" backLabel="Voltar" onBack={onBack} />);
    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("aceita ações à direita (ajuda, favorito)", () => {
    render(
      <GameBar
        title="X"
        backLabel="Voltar"
        onBack={() => undefined}
        actions={<button type="button">Ajuda</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Ajuda" })).toBeInTheDocument();
  });
});
