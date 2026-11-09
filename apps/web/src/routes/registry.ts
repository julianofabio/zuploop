// Registro de rotas (FDD 001 §6.4, ADR-0013): cada página sabe o caminho em cada idioma.
// Alimenta as páginas geradas, o seletor de idioma, a faixa de sugestão, o hreflang e o mapa do site.
import type { GameManifest } from "@zuploop/sdk";
import { locales, type Locale } from "../i18n/config";

export type StaticPageId = "home" | "catalog" | "settings" | "not-found";
export type PageId = StaticPageId | "game";

export type PageRef = { id: StaticPageId } | { id: "game"; gameId: string };

export interface RouteDef {
  id: StaticPageId;
  /** Segmentos depois do idioma; `[]` é o início do idioma. */
  slugs: Record<Locale, string[]>;
}

export type GameRouteInfo = Pick<GameManifest, "id" | "slugs">;

export const staticRoutes: readonly RouteDef[] = [
  { id: "home", slugs: { pt: [], es: [], en: [] } },
  { id: "catalog", slugs: { pt: ["jogos"], es: ["juegos"], en: ["games"] } },
  { id: "settings", slugs: { pt: ["ajustes"], es: ["ajustes"], en: ["settings"] } },
  { id: "not-found", slugs: { pt: ["404"], es: ["404"], en: ["404"] } },
];

const SLUG_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function catalogSlugs(): Record<Locale, string[]> {
  const catalog = staticRoutes.find((route) => route.id === "catalog");
  if (!catalog) throw new Error("Route registry needs a catalog page.");
  return catalog.slugs;
}

function toPath(locale: Locale, segments: readonly string[]): string {
  return `/${[locale, ...segments].join("/")}/`;
}

/** Confere ids, formato e unicidade dos slugs. Lança erro com o que está errado. */
function validate(games: readonly GameRouteInfo[]): void {
  const ids = new Set<string>();
  for (const game of games) {
    if (ids.has(game.id)) throw new Error(`Duplicate game id "${game.id}".`);
    ids.add(game.id);
  }
  for (const locale of locales) {
    const seen = new Map<string, string>();
    for (const game of games) {
      const slug = game.slugs[locale];
      if (!SLUG_FORMAT.test(slug)) {
        throw new Error(`Invalid slug "${slug}" for game "${game.id}" (${locale}).`);
      }
      const owner = seen.get(slug);
      if (owner) {
        throw new Error(`Slug "${slug}" (${locale}) is used by "${owner}" and "${game.id}".`);
      }
      seen.set(slug, game.id);
    }
  }
}

export interface RouteRegistry {
  getPath(locale: Locale, page: PageRef): string;
  getAlternates(page: PageRef): Record<Locale, string>;
  /** Todas as páginas, na ordem: fixas e depois os jogos. */
  listPages(): PageRef[];
  /** Segmentos depois do idioma, como `[...slug]` recebe. */
  getSegments(locale: Locale, page: PageRef): string[];
  resolve(locale: Locale, segments: readonly string[]): PageRef | null;
}

export function createRouteRegistry(games: readonly GameRouteInfo[]): RouteRegistry {
  validate(games);
  const gamesById = new Map(games.map((game) => [game.id, game]));

  function getSegments(locale: Locale, page: PageRef): string[] {
    if (page.id === "game") {
      const game = gamesById.get(page.gameId);
      if (!game) throw new Error(`Unknown game "${page.gameId}".`);
      return [...catalogSlugs()[locale], game.slugs[locale]];
    }
    const route = staticRoutes.find((r) => r.id === page.id);
    if (!route) throw new Error(`Unknown page "${page.id}".`);
    return route.slugs[locale];
  }

  const registry: RouteRegistry = {
    getSegments,
    getPath: (locale, page) => toPath(locale, getSegments(locale, page)),
    getAlternates: (page) =>
      Object.fromEntries(
        locales.map((locale) => [locale, registry.getPath(locale, page)]),
      ) as Record<Locale, string>,
    listPages: () => [
      ...staticRoutes.map((route): PageRef => ({ id: route.id })),
      ...games.map((game): PageRef => ({ id: "game", gameId: game.id })),
    ],
    resolve(locale, segments) {
      const key = segments.join("/");
      return (
        registry.listPages().find((page) => getSegments(locale, page).join("/") === key) ?? null
      );
    },
  };
  return registry;
}
