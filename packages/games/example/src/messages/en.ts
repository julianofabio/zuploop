// Textos do jogo de exemplo em inglês, a referência (RF-I18N-05).
import type { GameMessages } from "@zuploop/sdk";

const messages: GameMessages = {
  name: "Example game",
  description: "A reference game to test saving and the portal SDK.",
  howToPlay: {
    rules: [
      "Each move adds 1 or 2 points.",
      "The game ends after 10 moves.",
      "Your game is saved after every move.",
    ],
    controls: [
      "Tap “Add 1 point” or “Add 2 points” to make a move.",
      "Use the keyboard: Tab to choose, Enter to play.",
    ],
    tip: "Close the page in the middle of a game and come back: it continues where you stopped.",
  },
  ui: {
    title: "Example game",
    moves: "{count} of {max} moves",
    score: "{score} points",
    addOne: "Add 1 point",
    addTwo: "Add 2 points",
    finished: "Game over. You scored {score} points.",
    restart: "Play again",
    invalid: "That move is not allowed.",
  },
};

export default messages;
