// Cabeçalho do site (padrão de interface §6.2 e §6.3). No celular: logotipo e ações (idioma).
// A partir de 1024 px: também a navegação, com o item ativo em pílula.
import type { ElementType, ReactNode } from "react";
import type { NavItem } from "../nav-item";
import styles from "./SiteHeader.module.css";

export interface SiteHeaderProps {
  /** Logotipo, normalmente um link para o início. */
  logo: ReactNode;
  navLabel: string;
  items: readonly NavItem[];
  /** Ações à direita, como o seletor de idioma. */
  actions?: ReactNode;
  linkComponent?: ElementType;
}

export function SiteHeader({ logo, navLabel, items, actions, linkComponent }: SiteHeaderProps) {
  const LinkComponent = linkComponent ?? "a";
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>{logo}</div>
        <nav className={styles.nav} aria-label={navLabel}>
          <ul className={styles.list}>
            {items.map(({ id, label, href, current }) => (
              <li key={id}>
                <LinkComponent
                  href={href}
                  className={styles.link}
                  aria-current={current ? "page" : undefined}
                >
                  {label}
                </LinkComponent>
              </li>
            ))}
          </ul>
        </nav>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </header>
  );
}
