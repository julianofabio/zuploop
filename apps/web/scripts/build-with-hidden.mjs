// Build com os jogos ocultos visíveis (jogo de exemplo), usado nos testes do HTML e no e2e.
// Funciona igual no Windows e no Linux, sem depender de cross-env.
import { execSync } from "node:child_process";

execSync("next build", {
  stdio: "inherit",
  env: { ...process.env, ZUPLOOP_SHOW_HIDDEN_GAMES: "true" },
});
