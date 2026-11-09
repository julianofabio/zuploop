// Selo (padrão de interface §9.9): "Em breve", "Novo", "Concluído".
import type { HTMLAttributes } from "react";
import styles from "./Badge.module.css";

export type BadgeVariant = "neutral" | "accent" | "success";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={className ? `${styles.badge} ${className}` : styles.badge}
      data-variant={variant}
    />
  );
}
