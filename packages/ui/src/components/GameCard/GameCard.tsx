// Card de jogo (padrão de interface §9.5). O card inteiro é um link; a ação (favorito) fica fora dele.
// Jogo "Em breve" não tem link e mostra o selo.
import type { ElementType, ReactNode } from "react";
import { Badge } from "../Badge/Badge";
import styles from "./GameCard.module.css";

export type GameCardCategory = "words" | "board" | "numbers" | "logic";

export interface GameCardProps {
  name: string;
  description: string;
  /** Ícone do jogo, num quadrado de 52 px com o fundo suave da categoria. */
  icon: ReactNode;
  category: GameCardCategory;
  /** Sem `href`, o card não é link (jogo "Em breve"). */
  href?: string;
  /** Texto do selo, por exemplo "Em breve" (vem dos arquivos de idioma). */
  badge?: string;
  /** Ação separada do link, como o botão de favorito. */
  action?: ReactNode;
  /** Componente do link (o do Next.js no site); por padrão, `<a>`. */
  linkComponent?: ElementType;
  headingLevel?: 2 | 3 | 4;
}

export function GameCard({
  name,
  description,
  icon,
  category,
  href,
  badge,
  action,
  linkComponent,
  headingLevel = 3,
}: GameCardProps) {
  const Heading = `h${headingLevel}` as const;
  const LinkComponent = linkComponent ?? "a";
  const content = (
    <>
      <span className={styles.icon} data-category={category} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.text}>
        <Heading className={styles.name}>{name}</Heading>
        <span className={styles.description}>{description}</span>
        {badge ? <Badge className={styles.badge}>{badge}</Badge> : null}
      </span>
    </>
  );

  return (
    <article className={styles.card} data-linked={Boolean(href)}>
      {href ? (
        <LinkComponent href={href} className={styles.body}>
          {content}
        </LinkComponent>
      ) : (
        <div className={styles.body}>{content}</div>
      )}
      {action ? <div className={styles.action}>{action}</div> : null}
    </article>
  );
}
