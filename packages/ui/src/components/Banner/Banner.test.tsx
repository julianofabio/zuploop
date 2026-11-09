import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button";
import { Banner } from "./Banner";

describe("Banner", () => {
  it("é uma região com nome, mensagem e ações", () => {
    render(
      <Banner
        label="Sugestão de idioma"
        actions={
          <>
            <Button variant="ghost" size="sm">
              Ver em português
            </Button>
            <Button variant="ghost" size="sm">
              Continue in English
            </Button>
          </>
        }
      >
        Ver em português?
      </Banner>,
    );
    const region = screen.getByRole("region", { name: "Sugestão de idioma" });
    expect(region).toHaveTextContent("Ver em português?");
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("fecha pelo botão de ícone quando há onClose", async () => {
    const onClose = vi.fn();
    render(
      <Banner label="Aviso" onClose={onClose} closeLabel="Fechar aviso">
        Mensagem
      </Banner>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Fechar aviso" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sem onClose não mostra botão de fechar", () => {
    render(<Banner label="Aviso">Mensagem</Banner>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("aceita o idioma do conteúdo (faixa em outro idioma)", () => {
    render(
      <Banner label="Language" lang="pt">
        Ver em português?
      </Banner>,
    );
    expect(screen.getByRole("region")).toHaveAttribute("lang", "pt");
  });
});
