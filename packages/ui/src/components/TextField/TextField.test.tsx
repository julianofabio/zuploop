import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("tem rótulo visível ligado ao campo", () => {
    render(<TextField label="Buscar jogos" value="" onChange={() => undefined} />);
    expect(screen.getByLabelText("Buscar jogos")).toBeInTheDocument();
    expect(screen.getByText("Buscar jogos")).toBeVisible();
  });

  it("liga a ajuda ao campo por aria-describedby", () => {
    render(
      <TextField
        label="Nome"
        hint="Como você quer ser chamado."
        value=""
        onChange={() => undefined}
      />,
    );
    expect(screen.getByLabelText("Nome")).toHaveAccessibleDescription(
      "Como você quer ser chamado.",
    );
  });

  it("erro marca aria-invalid e descreve o problema", () => {
    render(
      <TextField
        label="E-mail"
        error="Digite um e-mail válido."
        value="x"
        onChange={() => undefined}
      />,
    );
    const input = screen.getByLabelText("E-mail");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/Digite um e-mail válido\./);
  });

  it("repassa o texto digitado", async () => {
    const onChange = vi.fn();
    render(<TextField label="Buscar" type="search" value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Buscar" }), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });
});
