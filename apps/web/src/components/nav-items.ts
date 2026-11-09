"use client";
// Itens da navegação principal, com o item ativo pelo endereço atual (padrão §7.1 e §7.2).
// O "Desafio" entra na 007, quando a página existir.
import { GamesIcon, HomeIcon, SettingsIcon, type NavItem } from "@zuploop/ui";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { routes, type StaticPageId } from "@/routes";
import { pageFromPathname } from "@/routes/current";

const MAIN_PAGES = [
  { id: "home", key: "home", icon: HomeIcon },
  { id: "catalog", key: "games", icon: GamesIcon },
  { id: "settings", key: "settings", icon: SettingsIcon },
] as const satisfies readonly { id: StaticPageId; key: string; icon: NavItem["icon"] }[];

export function useNavItems(): NavItem[] {
  const t = useTranslations("nav");
  const current = useLocale();
  const locale = isLocale(current) ? current : "en";
  const page = pageFromPathname(usePathname())?.page;
  // A página de um jogo fica dentro de "Jogos".
  const activeId = page?.id === "game" ? "catalog" : page?.id;

  return MAIN_PAGES.map(({ id, key, icon }) => ({
    id,
    label: t(key),
    href: routes.getPath(locale, { id }),
    icon,
    current: activeId === id,
  }));
}
