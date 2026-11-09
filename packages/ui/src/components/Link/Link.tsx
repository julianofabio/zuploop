// Link (padrão de interface §9.4). Sublinhado sempre em texto corrido; em menus, só no hover.
// O site passa o próprio componente de link (Next.js) em `component`; a interface não importa o Next.
import type { AnchorHTMLAttributes, ElementType } from "react";
import styles from "./Link.module.css";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "inline" | "menu";
  /** Componente que renderiza o `<a>`; por padrão, o próprio `<a>`. */
  component?: ElementType;
}

export function Link({ variant = "inline", component, className, ...rest }: LinkProps) {
  const Component = component ?? "a";
  return (
    <Component
      {...rest}
      className={className ? `${styles.link} ${className}` : styles.link}
      data-variant={variant}
    />
  );
}
