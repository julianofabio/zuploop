// Página 404 por idioma (T021, FDD 001 §7).
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { withIntl } from "@/components/language-test-utils";
import { NotFoundScreen } from "./NotFoundScreen";

describe("NotFoundScreen", () => {
  it("diz que a página não foi encontrada, no idioma", () => {
    render(withIntl("pt", <NotFoundScreen />));
    expect(screen.getByRole("heading", { level: 1, name: "Página não encontrada" })).toBeVisible();
  });

  it("tem links para o início e para os jogos do idioma", () => {
    render(withIntl("es", <NotFoundScreen />));
    expect(screen.getByRole("link", { name: "Ir al inicio" })).toHaveAttribute("href", "/es/");
    expect(screen.getByRole("link", { name: "Ver los juegos" })).toHaveAttribute(
      "href",
      "/es/juegos/",
    );
  });
});
