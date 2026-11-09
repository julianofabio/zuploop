// Ajustes, só com o idioma (T024, RF-I18N-03).
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { texts, withIntl } from "@/components/language-test-utils";
import { SettingsScreen } from "./SettingsScreen";

vi.mock("next/navigation", () => ({ usePathname: () => "/pt/ajustes/" }));

beforeEach(() => {
  window.localStorage.clear();
});

describe("SettingsScreen", () => {
  it("mostra o título e a seção de idioma", () => {
    render(withIntl("pt", <SettingsScreen languageTexts={texts} />));
    expect(screen.getByRole("heading", { level: 1, name: "Ajustes" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Idioma" })).toBeInTheDocument();
  });

  it("lista os idiomas como opções, com o atual marcado", () => {
    render(withIntl("pt", <SettingsScreen languageTexts={texts} />));
    expect(screen.getByRole("link", { name: "Português" })).toHaveAttribute("aria-current", "true");
  });

  it("trocar o idioma tem o mesmo efeito do seletor: mesma página e escolha salva", async () => {
    render(withIntl("pt", <SettingsScreen languageTexts={texts} />));
    const spanish = screen.getByRole("link", { name: "Español" });
    expect(spanish).toHaveAttribute("href", "/es/ajustes/");
    await userEvent.click(spanish);
    expect(window.localStorage.getItem("zuploop.locale")).toBe("es");
  });
});
