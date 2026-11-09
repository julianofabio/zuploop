// Só a grade (padrão §6.4), sem os cards: recebe cada card já renderizado no servidor.
// Fica leve para poder ser usada no navegador pelo CatalogBrowser.
import type { ReactNode } from "react";
import styles from "./GameList.module.css";

export function GameGrid({ items }: { items: readonly { id: string; card: ReactNode }[] }) {
  return (
    <ul className={styles.grid}>
      {items.map(({ id, card }) => (
        <li key={id}>{card}</li>
      ))}
    </ul>
  );
}
