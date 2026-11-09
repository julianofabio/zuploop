"use client";
// Botão de ícone (padrão de interface §9.2): círculo de 44 px, sempre com rótulo acessível.
import type { ButtonHTMLAttributes, MouseEvent, ReactNode, Ref } from "react";
import styles from "./IconButton.module.css";

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled" | "aria-label" | "aria-pressed" | "children"
> {
  /** Nome acessível (vira aria-label); vem dos arquivos de idioma. */
  label: string;
  icon: ReactNode;
  variant?: "default" | "subtle";
  /** Para botões que alternam (favorito): vira aria-pressed. */
  pressed?: boolean;
  disabled?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function IconButton({
  label,
  icon,
  variant = "default",
  pressed,
  disabled = false,
  type = "button",
  className,
  onClick,
  ref,
  ...rest
}: IconButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={className ? `${styles.iconButton} ${className}` : styles.iconButton}
      data-variant={variant}
      aria-label={label}
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
