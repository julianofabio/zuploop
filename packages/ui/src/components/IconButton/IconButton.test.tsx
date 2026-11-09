import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BackIcon, HeartIcon } from "../../icons";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("tem nome acessível pelo rótulo e ícone decorativo", () => {
    const { container } = render(<IconButton label="Voltar" icon={<BackIcon />} />);
    expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("usa a variante padrão ou subtle", () => {
    const { rerender } = render(<IconButton label="Ajuda" icon={<BackIcon />} />);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "default");
    rerender(<IconButton label="Ajuda" icon={<BackIcon />} variant="subtle" />);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "subtle");
  });

  it("aceita aria-pressed para alternar", () => {
    render(<IconButton label="Favoritar" icon={<HeartIcon />} pressed />);
    expect(screen.getByRole("button", { name: "Favoritar" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("chama onClick e respeita disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <IconButton label="Fechar" icon={<BackIcon />} onClick={onClick} />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<IconButton label="Fechar" icon={<BackIcon />} onClick={onClick} disabled />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("repassa a ref para o botão", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<IconButton ref={ref} label="Voltar" icon={<BackIcon />} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
