// Dados dos cards de jogo, já no idioma: nome e descrição vêm das mensagens do próprio jogo.
import type { GameCategory } from "@zuploop/sdk";
import type { Locale } from "@/i18n/config";
import { routes } from "@/routes";
import { catalogGames, routableGames } from "./registry";

export interface CatalogEntry {
  id: string;
  category: GameCategory;
  name: string;
  description: string;
  /** null para jogo "Em breve", que não tem página. */
  href: string | null;
}

export async function loadCatalogEntries(locale: Locale): Promise<CatalogEntry[]> {
  const withPage = new Set(routableGames().map((game) => game.id));
  return Promise.all(
    catalogGames().map(async (game) => {
      const messages = await game.messages[locale]();
      return {
        id: game.id,
        category: game.category,
        name: messages.name,
        description: messages.description,
        href: withPage.has(game.id)
          ? routes.getPath(locale, { id: "game", gameId: game.id })
          : null,
      };
    }),
  );
}
