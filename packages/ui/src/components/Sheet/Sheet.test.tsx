import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button";
import { Sheet } from "./Sheet";

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Como jogar</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Regras" closeLabel="Fechar">
        <p>Regras do jogo.</p>
        <Button variant="secondary">Entendi</Button>
      </Sheet>
    </>
  );
}

describe("Sheet", () => {
  it("fechada não renderiza nada", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("abre como diálogo modal com título, e o foco vai para o título", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Como jogar" }));

    const dialog = screen.getByRole("dialog", { name: "Regras" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("heading", { name: "Regras" })).toHaveFocus();
  });

  it("prende o foco dentro e volta ao botão que abriu ao fechar", async () => {
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Como jogar" });
    await userEvent.click(opener);

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Fechar" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Entendi" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Fechar" })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Entendi" })).toHaveFocus();

    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("fecha com Esc", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Como jogar" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("fecha com toque fora, exceto quando não é dispensável", async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Sheet open onClose={onClose} title="T" closeLabel="Fechar">
        x
      </Sheet>,
    );
    await userEvent.click(screen.getByTestId("sheet-scrim"));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <Sheet open onClose={onClose} title="T" closeLabel="Fechar" dismissible={false}>
        x
      </Sheet>,
    );
    await userEvent.click(screen.getByTestId("sheet-scrim"));
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
    // O botão Fechar continua funcionando.
    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("clique dentro da folha não fecha", async () => {
    const onClose = vi.fn();
    render(
      <Sheet open onClose={onClose} title="T" closeLabel="Fechar">
        <p>conteúdo</p>
      </Sheet>,
    );
    await userEvent.click(screen.getByText("conteúdo"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
