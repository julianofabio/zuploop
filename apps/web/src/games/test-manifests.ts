// Manifestos falsos para testes do registro e do catálogo.
import type { GameManifest, GameMessages } from "@zuploop/sdk";

function messages(name: string): Record<"pt" | "es" | "en", () => Promise<GameMessages>> {
  const value: GameMessages = {
    name,
    description: `${name} description`,
    howToPlay: { rules: ["r"], controls: ["c"], tip: "t" },
    ui: {},
  };
  return { pt: async () => value, es: async () => value, en: async () => value };
}

function manifest(
  id: string,
  status: GameManifest["status"],
  category: GameManifest["category"] = "words",
): GameManifest {
  return {
    id,
    category,
    phase: 1,
    status,
    slugs: { pt: id, es: id, en: id },
    saveVersion: 1,
    messages: messages(id),
    load: async () => ({ default: () => null }),
  };
}

export const availableGame = manifest("word-search", "available", "words");
export const comingSoonGame = manifest("checkers", "coming_soon", "board");
export const hiddenGame = manifest("example", "hidden", "logic");
export const testGames = [availableGame, comingSoonGame, hiddenGame];
