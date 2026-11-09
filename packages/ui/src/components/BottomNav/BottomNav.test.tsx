import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { navItems } from "../nav-test-items";
import { BottomNav } from "./BottomNav";

const css = readFileSync(path.resolve(import.meta.dirname, "BottomNav.module.css"), "utf8");

describe("BottomNav", () => {
  it("é uma navegação com nome e um link por item, com ícone e rótulo", () => {
    render(<BottomNav label="Principal" items={navItems} />);
    const nav = screen.getByRole("navigation", { name: "Principal" });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[1]).toHaveAccessibleName("Jogos");
    expect(links[1]).toHaveAttribute("href", "/games/");
    expect(links[1]?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it('marca o item ativo com aria-current="page" e ícone preenchido', () => {
    render(<BottomNav label="Principal" items={navItems} />);
    const active = screen.getByRole("link", { name: "Início" });
    expect(active).toHaveAttribute("aria-current", "page");
    expect(active.querySelector("svg")).toHaveAttribute("data-filled", "true");
    expect(screen.getByRole("link", { name: "Jogos" })).not.toHaveAttribute("aria-current");
  });

  it("só aparece abaixo de 1024 px", () => {
    expect(css).toMatch(/@media \(min-width: 64rem\)\s*\{\s*\.bottomNav\s*\{\s*display: none;/);
  });

  it("respeita a área segura do iPhone", () => {
    expect(css).toContain("max(var(--space-3), env(safe-area-inset-bottom))");
  });

  it("aceita outro componente de link", () => {
    function RouterLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
      const { children, ...rest } = props;
      return (
        <a data-router="" {...rest}>
          {children}
        </a>
      );
    }
    render(<BottomNav label="Principal" items={navItems} linkComponent={RouterLink} />);
    expect(screen.getByRole("link", { name: "Jogos" })).toHaveAttribute("data-router");
  });
});
