import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HintIcon } from "../../icons";
import { Button } from "./Button";

describe("Button", () => {
  it("usa primary e lg por padrão, refletidos em data-*", () => {
    render(<Button>Jogar</Button>);
    const button = screen.getByRole("button", { name: "Jogar" });
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "lg");
    expect(button).toHaveAttribute("type", "button");
  });

  it.each(["primary", "secondary", "ghost", "danger"] as const)(
    "aceita a variante %s",
    (variant) => {
      render(<Button variant={variant}>Ação</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", variant);
    },
  );

  it.each(["lg", "md", "sm"] as const)("aceita o tamanho %s", (size) => {
    render(<Button size={size}>Ação</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-size", size);
  });

  it("chama onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Jogar</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("desabilitado usa aria-disabled, continua focável e não dispara clique", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Jogar
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    button.focus();
    expect(button).toHaveFocus();
  });

  it("carregando mostra indicador no lugar do ícone, aria-busy e não dispara clique", async () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button loading icon={<HintIcon />} onClick={onClick}>
        Dica
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Dica" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector("[data-spinner]")).toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("mostra o ícone à esquerda, decorativo", () => {
    const { container } = render(<Button icon={<HintIcon />}>Dica</Button>);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("pode ocupar a largura total", () => {
    render(<Button fullWidth>Continuar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-full-width", "true");
  });

  it("repassa a ref para o botão", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Jogar</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
