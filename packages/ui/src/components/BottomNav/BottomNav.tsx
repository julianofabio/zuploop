// Barra inferior do celular (padrão de interface §6.2 e §7.2): ícone de 24 px e rótulo de 14 px,
// sempre os dois. Fica escondida a partir de 1024 px, onde a navegação vai para o cabeçalho.
import type { ElementType } from "react";
import type { NavItem } from "../nav-item";
import styles from "./BottomNav.module.css";

export interface BottomNavProps {
  /** Nome da navegação para leitores de tela. */
  label: string;
  items: readonly NavItem[];
  /** Componente do link (o do Next.js no site); por padrão, `<a>`. */
  linkComponent?: ElementType;
}

export function BottomNav({ label, items, linkComponent }: BottomNavProps) {
  const LinkComponent = linkComponent ?? "a";
  return (
    <nav className={styles.bottomNav} aria-label={label}>
      <ul className={styles.list}>
        {items.map(({ id, label: itemLabel, href, icon: Icon, current }) => (
          <li key={id} className={styles.item}>
            <LinkComponent
              href={href}
              className={styles.link}
              aria-current={current ? "page" : undefined}
            >
              <Icon size="lg" filled={current} />
              <span className={styles.label}>{itemLabel}</span>
            </LinkComponent>
          </li>
        ))}
      </ul>
    </nav>
  );
}
