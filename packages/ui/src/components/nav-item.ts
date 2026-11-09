// Item de navegação usado pela barra inferior, pelo cabeçalho e pelo rodapé.
import type { IconComponent } from "../icons";

export interface NavItem {
  id: string;
  /** Rótulo visível (vem dos arquivos de idioma do site). */
  label: string;
  href: string;
  icon: IconComponent;
  /** Página atual: vira aria-current="page" e ícone preenchido. */
  current: boolean;
}
