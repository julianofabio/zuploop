// Link interno do site (ADR-0013): o caminho vem do registro de rotas, no idioma da página
// ou no idioma pedido. Nunca escreva "/pt/…" à mão (o lint barra).
import { Link } from "@zuploop/ui";
import { useLocale } from "next-intl";
import NextLink from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { isLocale, type Locale } from "@/i18n/config";
import { routes, type StaticPageId } from "@/routes";

type Target = { page: StaticPageId; gameId?: never } | { page: "game"; gameId: string };

export type LocalizedLinkProps = Target &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "hrefLang"> & {
    /** Outro idioma: o link leva à mesma página nele (seletor de idioma). */
    locale?: Locale;
    /** `plain` não aplica o estilo de link (cards, logotipo, barra de navegação). */
    variant?: "inline" | "menu" | "plain";
  };

export function LocalizedLink({
  page,
  gameId,
  locale,
  variant = "inline",
  ...rest
}: LocalizedLinkProps) {
  const current = useLocale();
  const target: Locale = locale ?? (isLocale(current) ? current : "en");
  const href = routes.getPath(target, page === "game" ? { id: "game", gameId } : { id: page });
  const hrefLang = locale && locale !== current ? locale : undefined;

  if (variant === "plain") {
    return <NextLink {...rest} href={href} hrefLang={hrefLang} />;
  }
  return <Link {...rest} component={NextLink} href={href} hrefLang={hrefLang} variant={variant} />;
}
