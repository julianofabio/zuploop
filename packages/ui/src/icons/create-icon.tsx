// Fábrica dos ícones do ZupLoop: grade de 24, traço de 2 px, currentColor (padrão §8).
import type { ReactNode } from "react";
import styles from "./Icon.module.css";

export type IconSize = "sm" | "md" | "lg";

export interface IconProps {
  /** Nome acessível. Use só quando o ícone aparece sozinho, sem texto ao lado. */
  title?: string;
  size?: IconSize;
  /** Estado ativo (item da barra inferior, coração favoritado). */
  filled?: boolean;
  className?: string;
}

export type IconComponent = ((props: IconProps) => ReactNode) & { displayName: string };

export function createIcon(displayName: string, shapes: ReactNode): IconComponent {
  function Icon({ title, size = "md", filled = false, className }: IconProps) {
    const classes = className ? `${styles.icon} ${className}` : styles.icon;
    // Decorativo por padrão; com title, vira imagem com nome (padrão §8).
    const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        className={classes}
        data-size={size}
        data-filled={filled}
        {...a11y}
      >
        {title ? <title>{title}</title> : null}
        {shapes}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
