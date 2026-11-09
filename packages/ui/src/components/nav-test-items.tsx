// Itens de navegação de exemplo para testes e exemplos dos componentes de layout.
import { GamesIcon, HomeIcon, SettingsIcon } from "../icons";
import type { NavItem } from "./nav-item";

export const navItems: NavItem[] = [
  { id: "home", label: "Início", href: "/home/", icon: HomeIcon, current: true },
  { id: "games", label: "Jogos", href: "/games/", icon: GamesIcon, current: false },
  { id: "settings", label: "Ajustes", href: "/settings/", icon: SettingsIcon, current: false },
];
