// LocalizedLink (T018, ADR-0013): links internos sempre pelo registro de rotas.
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { LocalizedLink } from "./LocalizedLink";

function withLocale(locale: "pt" | "es" | "en", children: ReactNode) {
  return (
    <NextIntlClientProvider locale={locale} messages={{}}>
      {children}
    </NextIntlClientProvider>
  );
}

describe("LocalizedLink", () => {
  it('page="catalog" gera /es/juegos/ em espanhol', () => {
    render(withLocale("es", <LocalizedLink page="catalog">Juegos</LocalizedLink>));
    expect(screen.getByRole("link", { name: "Juegos" })).toHaveAttribute("href", "/es/juegos/");
  });

  it("usa o idioma da página por padrão", () => {
    render(withLocale("pt", <LocalizedLink page="settings">Ajustes</LocalizedLink>));
    expect(screen.getByRole("link")).toHaveAttribute("href", "/pt/ajustes/");
  });

  it("aceita outro idioma (seletor de idioma) e marca hreflang e lang", () => {
    render(
      withLocale(
        "pt",
        <LocalizedLink page="catalog" locale="en">
          English
        </LocalizedLink>,
      ),
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/en/games/");
    expect(link).toHaveAttribute("hreflang", "en");
  });

  it("estiliza como Link de @zuploop/ui, com variante", () => {
    render(
      withLocale(
        "en",
        <LocalizedLink page="home" variant="menu">
          Home
        </LocalizedLink>,
      ),
    );
    expect(screen.getByRole("link")).toHaveAttribute("data-variant", "menu");
    expect(screen.getByRole("link")).toHaveAttribute("href", "/en/");
  });

  it("variante plain não aplica estilo de link (cards, logotipo)", () => {
    render(
      withLocale(
        "en",
        <LocalizedLink page="home" variant="plain">
          Home
        </LocalizedLink>,
      ),
    );
    expect(screen.getByRole("link")).not.toHaveAttribute("data-variant");
  });
});
