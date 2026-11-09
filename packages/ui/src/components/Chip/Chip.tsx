"use client";
// Chip de filtro (padrão de interface §9.8): pílula de 44 px que alterna com aria-pressed;
// selecionado tem fundo suave e ícone de confirmação (cor nunca é o único sinal).
import type { ButtonHTMLAttributes } from "react";
import { CheckIcon } from "../../icons";
import styles from "./Chip.module.css";

export interface ChipProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-pressed" | "type"
> {
  selected: boolean;
}

export function Chip({ selected, className, children, ...rest }: ChipProps) {
  return (
    <button
      {...rest}
      type="button"
      className={className ? `${styles.chip} ${className}` : styles.chip}
      aria-pressed={selected}
    >
      {selected ? <CheckIcon size="sm" /> : null}
      {children}
    </button>
  );
}
