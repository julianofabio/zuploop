import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { navItems } from "../nav-test-items";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("mostra marca, frase e links do site numa navegação com nome", () => {
    render(
      <SiteFooter
        brand="ZupLoop"
        tagline="Passatempos clássicos para adultos."
        linksLabel="Links do site"
        links={navItems}
      />,
    );
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Passatempos clássicos");
    expect(screen.getByRole("navigation", { name: "Links do site" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ajustes" })).toHaveAttribute("href", "/settings/");
  });
});
