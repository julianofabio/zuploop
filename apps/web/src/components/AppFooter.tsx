// Rodapé do site: marca e links (jogos e ajustes; no computador, Ajustes fica aqui, padrão §6.3).
import { SiteFooter } from "@zuploop/ui";
import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import { isLocale } from "@/i18n/config";
import { routes } from "@/routes";

export function AppFooter() {
  const t = useTranslations();
  const current = useLocale();
  const locale = isLocale(current) ? current : "en";
  const links = [
    { id: "catalog", label: t("nav.games"), href: routes.getPath(locale, { id: "catalog" }) },
    { id: "settings", label: t("nav.settings"), href: routes.getPath(locale, { id: "settings" }) },
  ];
  return (
    <SiteFooter
      brand={t("meta.siteName")}
      tagline={t("footer.rights")}
      linksLabel={t("nav.footerLabel")}
      links={links}
      linkComponent={NextLink}
    />
  );
}
