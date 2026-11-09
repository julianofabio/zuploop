import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it } from "vitest";
import { Link } from "./Link";

function FakeRouterLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-router="true" {...props}>
      {children}
    </a>
  );
}

describe("Link", () => {
  it("renderiza um link com a variante inline por padrão", () => {
    render(<Link href="/pt/jogos/">Jogos</Link>);
    const link = screen.getByRole("link", { name: "Jogos" });
    expect(link).toHaveAttribute("href", "/pt/jogos/");
    expect(link).toHaveAttribute("data-variant", "inline");
  });

  it("aceita a variante menu", () => {
    render(
      <Link href="/pt/" variant="menu">
        Início
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("data-variant", "menu");
  });

  it("aceita outro componente de link (por exemplo, o do Next.js)", () => {
    render(
      <Link component={FakeRouterLink} href="/es/juegos/">
        Juegos
      </Link>,
    );
    const link = screen.getByRole("link", { name: "Juegos" });
    expect(link).toHaveAttribute("data-router", "true");
    expect(link).toHaveAttribute("data-variant", "inline");
  });

  it("repassa aria-current e className", () => {
    render(
      <Link href="/pt/" aria-current="page" className="extra">
        Início
      </Link>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link.className).toContain("extra");
  });
});
