// Seletor de idioma (T020, FDD 001 F2, RF-I18N-03).
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { texts, withIntl } from "./language-test-utils";

const pathname = vi.hoisted(() => ({ current: "/pt/jogos/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

beforeEach(() => {
  window.localStorage.clear();
  pathname.current = "/pt/jogos/";
});

describe("LanguageSwitcher", () => {
  it("mostra a sigla do idioma atual e um nome acessível que a contém", () => {
    render(withIntl("pt", <LanguageSwitcher texts={texts} />));
    const button = screen.getByRole("button", { name: /Idioma.*PT/ });
    expect(button).toHaveTextContent("PT");
  });

  it("abre a lista com cada idioma escrito nele mesmo", async () => {
    render(withIntl("pt", <LanguageSwitcher texts={texts} />));
    await userEvent.click(screen.getByRole("button", { name: /Idioma/ }));

    expect(screen.getByRole("dialog", { name: "Escolha o idioma" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute("lang", "es");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("lang", "en");
    expect(screen.getByRole("link", { name: "Português" })).toHaveAttribute("aria-current", "true");
  });

  it("trocar para espanhol em /pt/jogos/ leva a /es/juegos/ e salva es", async () => {
    render(withIntl("pt", <LanguageSwitcher texts={texts} />));
    await userEvent.click(screen.getByRole("button", { name: /Idioma/ }));
    const spanish = screen.getByRole("link", { name: "Español" });

    expect(spanish).toHaveAttribute("href", "/es/juegos/");
    await userEvent.click(spanish);
    expect(window.localStorage.getItem("zuploop.locale")).toBe("es");
  });

  it("página sem equivalente leva ao catálogo do idioma", async () => {
    pathname.current = "/pt/nao-existe/";
    render(withIntl("pt", <LanguageSwitcher texts={texts} />));
    await userEvent.click(screen.getByRole("button", { name: /Idioma/ }));
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en/games/");
  });

  it("localStorage bloqueado não quebra a troca", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    render(withIntl("pt", <LanguageSwitcher texts={texts} />));
    await userEvent.click(screen.getByRole("button", { name: /Idioma/ }));
    await expect(
      userEvent.click(screen.getByRole("link", { name: "English" })),
    ).resolves.not.toThrow();
    setItem.mockRestore();
  });
});
