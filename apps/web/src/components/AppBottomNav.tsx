"use client";
// Barra inferior do celular, com o item ativo pelo endereço atual.
import { BottomNav } from "@zuploop/ui";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { useNavItems } from "./nav-items";

export function AppBottomNav() {
  const t = useTranslations("nav");
  return <BottomNav label={t("mainLabel")} items={useNavItems()} linkComponent={NextLink} />;
}
