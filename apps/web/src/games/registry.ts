// A única lista de jogos do site (FDD 001 §8.2). Um jogo novo entra com uma linha em `allGames`.
// Visibilidade (FDD 001 §6.1): `hidden` só com ZUPLOOP_SHOW_HIDDEN_GAMES=true no build;
// `coming_soon` aparece no catálogo com o selo "Em breve", sem página própria.
import exampleGame from "@zuploop/game-example";
import type { GameManifest } from "@zuploop/sdk";

export const allGames: readonly GameManifest[] = [exampleGame];

export function showHiddenGames(value = process.env.ZUPLOOP_SHOW_HIDDEN_GAMES): boolean {
  return value === "true";
}

/** Jogos que aparecem no catálogo e no início. */
export function catalogGames(
  games: readonly GameManifest[] = allGames,
  showHidden = showHiddenGames(),
): GameManifest[] {
  return games.filter((game) => game.status !== "hidden" || showHidden);
}

/** Jogos com página própria (e, portanto, no registro de rotas e no mapa do site). */
export function routableGames(
  games: readonly GameManifest[] = allGames,
  showHidden = showHiddenGames(),
): GameManifest[] {
  return games.filter(
    (game) => game.status === "available" || (game.status === "hidden" && showHidden),
  );
}

export function findGame(gameId: string): GameManifest | undefined {
  return allGames.find((game) => game.id === gameId);
}
