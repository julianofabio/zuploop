// Layout raiz da página "/" (escolha de idioma). As páginas por idioma têm o próprio
// layout raiz em [locale] (FDD 001 §8.1).
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
