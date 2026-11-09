// No servidor (React Server Components) o jogo nunca é renderizado: só o GameHost, no navegador,
// chama `load()`. Este módulo existe para o servidor não importar a tela do jogo.
import type { GameManifest } from "@zuploop/sdk";

export const loadGame: GameManifest["load"] = () =>
  Promise.reject(new Error("Games are loaded only in the browser."));
