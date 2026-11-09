"use client";
// Aviso temporário (padrão de interface §9.13): 4 segundos, anunciado a leitores de tela.
// Nunca para erro que exige ação. Um por vez: quem usa controla qual está visível.
import { useEffect, useRef } from "react";
import styles from "./Toast.module.css";

export const TOAST_DURATION_MS = 4000;

export interface ToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, onDismiss, duration = TOAST_DURATION_MS }: ToastProps) {
  // Guarda o callback mais novo sem reiniciar o tempo quando o pai renderiza de novo.
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(() => onDismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  );
}
