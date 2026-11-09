// Textos do jogo de exemplo em português.
import type { GameMessages } from "@zuploop/sdk";

const messages: GameMessages = {
  name: "Jogo de exemplo",
  description: "Um jogo de referência para testar o salvamento e o SDK do portal.",
  howToPlay: {
    rules: [
      "Cada jogada soma 1 ou 2 pontos.",
      "O jogo termina depois de 10 jogadas.",
      "Sua partida é salva a cada jogada.",
    ],
    controls: [
      "Toque em “Somar 1 ponto” ou “Somar 2 pontos” para jogar.",
      "Pelo teclado: Tab para escolher, Enter para jogar.",
    ],
    tip: "Feche a página no meio da partida e volte: ela continua de onde parou.",
  },
  ui: {
    title: "Jogo de exemplo",
    moves: "{count} de {max} jogadas",
    score: "{score} pontos",
    addOne: "Somar 1 ponto",
    addTwo: "Somar 2 pontos",
    finished: "Fim de jogo. Você fez {score} pontos.",
    restart: "Jogar de novo",
    invalid: "Essa jogada não vale.",
  },
};

export default messages;
