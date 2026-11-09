// Fontes do padrão de interface (§4.1), servidas pelo próprio site: o next/font baixa os
// arquivos no build. Nenhum pedido a Google Fonts em produção (FDD 001 §8.1).
import { Atkinson_Hyperlegible, Lexend } from "next/font/google";

export const atkinson = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-atkinson",
});

export const lexend = Lexend({
  weight: ["500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-lexend",
});

/** Classes que expõem as variáveis --font-atkinson e --font-lexend usadas em tokens.css. */
export const fontVariables = `${atkinson.variable} ${lexend.variable}`;
