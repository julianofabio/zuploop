// Faixa "Ver em português?" (T020, FDD 001 F3, RF-I18N-04).
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageSuggestion } from "./LanguageSuggestion";
import { texts, withIntl } from "./language-test-utils";

const pathname = vi.hoisted(() => ({ current: "/en/games/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

function setBrowserLanguages(languages: string[]) {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(languages);
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-lang-suggest");
  pathname.current = "/en/games/";
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("LanguageSuggestion", () => {
  it("aparece quando o idioma do navegador difere da página, no idioma sugerido", async () => {
    setBrowserLanguages(["pt-BR"]);
    render(withIntl("en", <LanguageSuggestion texts={texts} />));

    const banner = await screen.findByRole("region", { name: "Sugestão de idioma" });
    expect(banner).toHaveAttribute("lang", "pt");
    expect(banner).toHaveTextContent("Ver em português?");
    expect(screen.getByRole("link", { name: "Ver em português" })).toHaveAttribute(
      "href",
      "/pt/jogos/",
    );
    expect(screen.getByRole("button", { name: "Continue in English" })).toBeInTheDocument();
  });

  it("não redireciona sozinha", async () => {
    setBrowserLanguages(["pt-BR"]);
    const replace = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      replace,
      assign: replace,
    });
    render(withIntl("en", <LanguageSuggestion texts={texts} />));
    await screen.findByRole("region");
    expect(replace).not.toHaveBeenCalled();
  });

  it("não aparece quando o navegador está no idioma da página", () => {
    setBrowserLanguages(["en-US"]);
    render(withIntl("en", <LanguageSuggestion texts={texts} />));
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("Continuar salva o idioma atual e esconde a faixa", async () => {
    setBrowserLanguages(["pt-BR"]);
    document.documentElement.setAttribute("data-lang-suggest", "pt");
    render(withIntl("en", <LanguageSuggestion texts={texts} />));

    await userEvent.click(await screen.findByRole("button", { name: "Continue in English" }));
    expect(window.localStorage.getItem("zuploop.locale")).toBe("en");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveAttribute("data-lang-suggest");
  });

  it("Ver em português salva a escolha", async () => {
    setBrowserLanguages(["pt-BR"]);
    render(withIntl("en", <LanguageSuggestion texts={texts} />));
    await userEvent.click(await screen.findByRole("link", { name: "Ver em português" }));
    expect(window.localStorage.getItem("zuploop.locale")).toBe("pt");
  });

  it("não aparece nas próximas visitas depois de Continuar", async () => {
    setBrowserLanguages(["pt-BR"]);
    window.localStorage.setItem("zuploop.locale", "en");
    render(withIntl("en", <LanguageSuggestion texts={texts} />));
    await act(async () => undefined);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("reserva o espaço num contêiner de altura fixa (sem deslocar a página)", () => {
    setBrowserLanguages(["pt-BR"]);
    const { container } = render(withIntl("en", <LanguageSuggestion texts={texts} />));
    expect(container.querySelector("[data-banner-slot]")).toBeInTheDocument();
  });

  it("não sugere página que não existe no outro idioma", async () => {
    setBrowserLanguages(["pt-BR"]);
    pathname.current = "/en/does-not-exist/";
    render(withIntl("en", <LanguageSuggestion texts={texts} />));
    await act(async () => undefined);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
