import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("é um botão de alternar com aria-pressed", () => {
    const { rerender } = render(<Chip selected={false}>Palavras</Chip>);
    expect(screen.getByRole("button", { name: "Palavras" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    rerender(<Chip selected>Palavras</Chip>);
    expect(screen.getByRole("button", { name: "Palavras" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("selecionado mostra o ícone de confirmação (não só cor)", () => {
    const { container, rerender } = render(<Chip selected={false}>Palavras</Chip>);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
    rerender(<Chip selected>Palavras</Chip>);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("chama onClick", async () => {
    const onClick = vi.fn();
    render(
      <Chip selected={false} onClick={onClick}>
        Números
      </Chip>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
