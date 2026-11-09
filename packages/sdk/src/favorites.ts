// Favoritos provisórios em memória (FDD 001 §6.2). Somem ao fechar o jogo; a 008 os guarda no aparelho.
import type { FavoriteRef, PortalSdk } from "./types";

function favoriteKey(ref: FavoriteRef): string {
  return [ref.kind, ref.gameId, ref.id ?? ""].join(":");
}

export function createFavorites(): PortalSdk["favorites"] {
  const favorites = new Set<string>();
  return {
    isFavorite: async (ref) => favorites.has(favoriteKey(ref)),
    toggle: async (ref) => {
      const key = favoriteKey(ref);
      if (favorites.delete(key)) return false;
      favorites.add(key);
      return true;
    },
  };
}
