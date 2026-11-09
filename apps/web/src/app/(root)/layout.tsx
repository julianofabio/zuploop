// Layout raiz da página "/" (escolha de idioma). As páginas por idioma têm o próprio
// layout raiz em [locale] (FDD 001 §8.1).
import "@zuploop/ui/tokens.css";
import "@zuploop/ui/base.css";
import type { ReactNode } from "react";
import { fontVariables } from "../fonts";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
