// Textos del juego de ejemplo en español.
import type { GameMessages } from "@zuploop/sdk";

const messages: GameMessages = {
  name: "Juego de ejemplo",
  description: "Un juego de referencia para probar el guardado y el SDK del portal.",
  howToPlay: {
    rules: [
      "Cada jugada suma 1 o 2 puntos.",
      "El juego termina después de 10 jugadas.",
      "Tu partida se guarda en cada jugada.",
    ],
    controls: [
      "Toca «Sumar 1 punto» o «Sumar 2 puntos» para jugar.",
      "Con el teclado: Tab para elegir, Enter para jugar.",
    ],
    tip: "Cierra la página a mitad de la partida y vuelve: sigue donde la dejaste.",
  },
  ui: {
    title: "Juego de ejemplo",
    moves: "{count} de {max} jugadas",
    score: "{score} puntos",
    addOne: "Sumar 1 punto",
    addTwo: "Sumar 2 puntos",
    finished: "Fin del juego. Hiciste {score} puntos.",
    restart: "Jugar de nuevo",
    invalid: "Esa jugada no vale.",
  },
};

export default messages;
