// Metadados e hreflang no HTML gerado (T028, RNF-03, FDD 001 §9).
import { describe, expect, it } from "vitest";
import { readOut } from "./out";

const SITE = "https://zuploop.com";

function head(html: string) {
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  const alternates = Object.fromEntries(
    [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => [
      m[1],
      m[2],
    ]),
  );
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
  return { canonical, alternates, title, description };
}

const pages = [
  {
    file: "pt/index.html",
    canonical: `${SITE}/pt/`,
    alternates: { pt: "/pt/", es: "/es/", en: "/en/" },
  },
  {
    file: "es/juegos/index.html",
    canonical: `${SITE}/es/juegos/`,
    alternates: { pt: "/pt/jogos/", es: "/es/juegos/", en: "/en/games/" },
  },
  {
    file: "en/games/example/index.html",
    canonical: `${SITE}/en/games/example/`,
    alternates: { pt: "/pt/jogos/exemplo/", es: "/es/juegos/ejemplo/", en: "/en/games/example/" },
  },
];

describe.each(pages)("$file", ({ file, canonical, alternates }) => {
  const meta = head(readOut(file));

  it("tem canonical absoluto", () => {
    expect(meta.canonical).toBe(canonical);
  });

  it("tem hreflang pt, es, en e x-default apontando para /", () => {
    expect(meta.alternates).toEqual({
      pt: `${SITE}${alternates.pt}`,
      es: `${SITE}${alternates.es}`,
      en: `${SITE}${alternates.en}`,
      "x-default": `${SITE}/`,
    });
  });

  it("tem título e descrição", () => {
    expect(meta.title?.length).toBeGreaterThan(0);
    expect(meta.description?.length).toBeGreaterThan(20);
  });
});

describe("títulos e descrições", () => {
  it("são únicos entre as páginas de um idioma", () => {
    const files = [
      "pt/index.html",
      "pt/jogos/index.html",
      "pt/ajustes/index.html",
      "pt/jogos/exemplo/index.html",
    ];
    const titles = files.map((f) => head(readOut(f)).title);
    const descriptions = files.map((f) => head(readOut(f)).description);
    expect(new Set(titles).size).toBe(files.length);
    expect(new Set(descriptions).size).toBe(files.length);
  });

  it("a página do jogo usa o nome e a descrição do jogo no idioma", () => {
    const meta = head(readOut("pt/jogos/exemplo/index.html"));
    expect(meta.title).toContain("Jogo de exemplo");
    expect(meta.description).toBe(
      "Um jogo de referência para testar o salvamento e o SDK do portal.",
    );
  });

  it("a 404 do idioma não é indexada", () => {
    expect(readOut("pt/404/index.html")).toMatch(/<meta name="robots" content="noindex/);
  });
});
