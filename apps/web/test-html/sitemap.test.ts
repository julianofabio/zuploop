// Mapas do site e robots.txt (T029, RNF-03).
import { describe, expect, it } from "vitest";
import { readOut } from "./out";

const SITE = "https://zuploop.com";

const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

describe("mapas do site", () => {
  it("sitemap.xml é um índice com um mapa por idioma", () => {
    const index = readOut("sitemap.xml");
    expect(index).toContain("<sitemapindex");
    expect(locs(index)).toEqual([
      `${SITE}/sitemap-pt.xml`,
      `${SITE}/sitemap-es.xml`,
      `${SITE}/sitemap-en.xml`,
    ]);
  });

  it("cada mapa lista todas as páginas públicas do idioma", () => {
    expect(locs(readOut("sitemap-pt.xml"))).toEqual([
      `${SITE}/pt/`,
      `${SITE}/pt/jogos/`,
      `${SITE}/pt/ajustes/`,
    ]);
    expect(locs(readOut("sitemap-es.xml"))).toEqual([
      `${SITE}/es/`,
      `${SITE}/es/juegos/`,
      `${SITE}/es/ajustes/`,
    ]);
    expect(locs(readOut("sitemap-en.xml"))).toEqual([
      `${SITE}/en/`,
      `${SITE}/en/games/`,
      `${SITE}/en/settings/`,
    ]);
  });

  it("não lista jogos ocultos nem a página 404, mesmo no build que mostra ocultos", () => {
    for (const locale of ["pt", "es", "en"]) {
      const xml = readOut(`sitemap-${locale}.xml`);
      expect(xml).not.toMatch(/exemplo|ejemplo|example/);
      expect(xml).not.toContain("/404/");
    }
  });

  it("cada URL traz as versões nos outros idiomas e o x-default", () => {
    const xml = readOut("sitemap-es.xml");
    const games = /<url><loc>https:\/\/zuploop\.com\/es\/juegos\/<\/loc>([\s\S]*?)<\/url>/.exec(
      xml,
    );
    expect(games?.[1]).toContain(`hreflang="pt" href="${SITE}/pt/jogos/"`);
    expect(games?.[1]).toContain(`hreflang="en" href="${SITE}/en/games/"`);
    expect(games?.[1]).toContain(`hreflang="x-default" href="${SITE}/"`);
  });
});

describe("robots.txt", () => {
  it("permite tudo e aponta para o índice dos mapas", () => {
    const robots = readOut("robots.txt");
    expect(robots).toMatch(/User-agent: \*/);
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });
});
