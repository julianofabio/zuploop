// Faixa (padrão de interface §9.12): sugestão de idioma e avisos de sistema.
// Quem usa reserva o espaço (altura fixa) para não deslocar a página (CLS).
import type { ReactNode } from "react";
import { CloseIcon } from "../../icons";
import { IconButton } from "../IconButton/IconButton";
import styles from "./Banner.module.css";

export interface BannerProps {
  /** Nome da região, para leitores de tela. */
  label: string;
  children: ReactNode;
  /** Até duas ações, em botões `ghost`. */
  actions?: ReactNode;
  onClose?: () => void;
  /** Rótulo do botão de fechar; obrigatório quando há `onClose`. */
  closeLabel?: string;
  /** Idioma do conteúdo, quando diferente do da página (faixa "Ver em português?"). */
  lang?: string;
}

export function Banner({ label, children, actions, onClose, closeLabel, lang }: BannerProps) {
  return (
    <section className={styles.banner} aria-label={label} lang={lang}>
      <p className={styles.message}>{children}</p>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
      {onClose ? (
        <IconButton
          className={styles.close}
          label={closeLabel ?? label}
          icon={<CloseIcon />}
          variant="subtle"
          onClick={onClose}
        />
      ) : null}
    </section>
  );
}
