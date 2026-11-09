// Carrega a tela do jogo num chunk separado (navegador).
import type { GameManifest } from "@zuploop/sdk";

export const loadGame: GameManifest["load"] = () => import("./Game");
