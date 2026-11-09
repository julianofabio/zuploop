// Manifesto do jogo de exemplo (FDD 001 §6.1). Oculto em produção: aparece só com
// ZUPLOOP_SHOW_HIDDEN_GAMES=true, para testar o caminho inteiro (abrir, salvar, voltar, continuar).
import type { GameManifest } from "@zuploop/sdk";
import type { ExampleState } from "./rules";

/** Save da versão 1, antes de haver pontos: só a contagem de jogadas. */
function isVersionOne(data: unknown): data is { count: number } {
  return (
    typeof data === "object" &&
    data !== null &&
    Number.isInteger((data as Record<string, unknown>).count)
  );
}

export const manifest: GameManifest = {
  id: "example",
  category: "logic",
  phase: 1,
  status: "hidden",
  slugs: { pt: "exemplo", es: "ejemplo", en: "example" },
  saveVersion: 2,
  migrateSave(fromVersion, data): ExampleState {
    if (fromVersion === 1 && isVersionOne(data)) {
      return { moves: data.count, score: data.count };
    }
    throw new Error(`Cannot migrate example save from version ${fromVersion}.`);
  },
  messages: {
    pt: () => import("./messages/pt").then((m) => m.default),
    es: () => import("./messages/es").then((m) => m.default),
    en: () => import("./messages/en").then((m) => m.default),
  },
  // Chunk separado: o jogo só é baixado ao tocar em "Jogar" (RNF-01).
  load: () => import("./Game"),
};

export default manifest;
