"use client";
// Barra do jogo em tela cheia (padrão de interface §6.5 e §12.1): Voltar, título e ações.
import type { ReactNode } from "react";
import { BackIcon } from "../../icons";
import { IconButton } from "../IconButton/IconButton";
import styles from "./GameBar.module.css";

export interface GameBarProps {
  title: string;
  backLabel: string;
  onBack: () => void;
  /** Ajuda (?) e favorito, quando existirem. */
  actions?: ReactNode;
}

export function GameBar({ title, backLabel, onBack, actions }: GameBarProps) {
  return (
    <div className={styles.bar}>
      <IconButton label={backLabel} icon={<BackIcon />} onClick={onBack} />
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.actions}>{actions}</div>
    </div>
  );
}
