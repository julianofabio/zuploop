// Botão (padrão de interface §9.1). Uma ação principal (primary) por tela.
import type { ButtonHTMLAttributes, MouseEvent, ReactNode, Ref } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "lg" | "md" | "sm";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ícone à esquerda, de 20 px. */
  icon?: ReactNode;
  /** Mostra um indicador no lugar do ícone e mantém a largura. */
  loading?: boolean;
  /** Desabilitado com aria-disabled: continua focável e anunciado (padrão §9.1). */
  disabled?: boolean;
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = "primary",
  size = "lg",
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  className,
  onClick,
  children,
  ref,
  ...rest
}: ButtonProps) {
  const blocked = disabled || loading;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (blocked) {
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
      className={className ? `${styles.button} ${className}` : styles.button}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
    >
      {loading ? (
        <span className={styles.spinner} data-spinner="" aria-hidden="true" />
      ) : icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
    </button>
  );
}
