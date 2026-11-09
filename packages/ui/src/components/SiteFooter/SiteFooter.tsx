// Rodapé do site (padrão de interface §6.3): marca, frase e links do site.
import type { ElementType, ReactNode } from "react";
import type { NavItem } from "../nav-item";
import styles from "./SiteFooter.module.css";

export interface SiteFooterProps {
  brand: ReactNode;
  tagline: string;
  linksLabel: string;
  links: readonly Pick<NavItem, "id" | "label" | "href">[];
  linkComponent?: ElementType;
}

export function SiteFooter({ brand, tagline, linksLabel, links, linkComponent }: SiteFooterProps) {
  const LinkComponent = linkComponent ?? "a";
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.name}>{brand}</span>
          <span className={styles.tagline}>{tagline}</span>
        </div>
        <nav aria-label={linksLabel}>
          <ul className={styles.links}>
            {links.map(({ id, label, href }) => (
              <li key={id}>
                <LinkComponent href={href} className={styles.link}>
                  {label}
                </LinkComponent>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
