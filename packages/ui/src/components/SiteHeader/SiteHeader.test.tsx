import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { navItems } from "../nav-test-items";
import { SiteHeader } from "./SiteHeader";

const css = readFileSync(path.resolve(import.meta.dirname, "SiteHeader.module.css"), "utf8");

describe("SiteHeader", () => {
  it("mostra o logotipo, a navegação e as ações", () => {
    render(
      <SiteHeader
        logo={<a href="/x/">ZupLoop</a>}
        navLabel="Principal"
        items={navItems}
        actions={<button type="button">PT</button>}
      />,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ZupLoop" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Principal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "PT" })).toBeInTheDocument();
  });

  it('marca o item ativo com aria-current="page"', () => {
    render(<SiteHeader logo="ZupLoop" navLabel="Principal" items={navItems} />);
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Ajustes" })).not.toHaveAttribute("aria-current");
  });

  it("a navegação do cabeçalho só aparece a partir de 1024 px", () => {
    expect(css).toMatch(/\.nav\s*\{[^}]*display: none;/);
    expect(css).toMatch(/@media \(min-width: 64rem\)\s*\{[\s\S]*\.nav\s*\{\s*display: flex;/);
  });
});
