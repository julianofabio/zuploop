"use client";
// Folha inferior no celular e diálogo no computador (padrão de interface §9.14).
// Foco vai para o título ao abrir, fica preso dentro e volta a quem abriu ao fechar.
import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon } from "../../icons";
import { IconButton } from "../IconButton/IconButton";
import styles from "./Sheet.module.css";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Rótulo do botão "Fechar", sempre visível. */
  closeLabel: string;
  children: ReactNode;
  /** `false` em confirmações destrutivas: Esc e toque fora não fecham. */
  dismissible?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Tab no último volta ao primeiro; Shift+Tab no primeiro (ou no título) vai ao último. */
function trapFocus(event: KeyboardEvent, panel: HTMLElement | null, title: HTMLElement | null) {
  if (!panel) return;
  const focusables = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (!first || !last) return;
  const active = document.activeElement;
  const outside = !(active instanceof Node) || !panel.contains(active);
  if (event.shiftKey && (outside || active === first || active === title)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (outside || active === last)) {
    event.preventDefault();
    first.focus();
  }
}

export function Sheet({
  open,
  onClose,
  title,
  closeLabel,
  children,
  dismissible = true,
}: SheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Guarda as funções mais novas sem refazer o efeito de foco a cada render.
  const onCloseRef = useRef(onClose);
  const dismissibleRef = useRef(dismissible);
  useEffect(() => {
    onCloseRef.current = onClose;
    dismissibleRef.current = dismissible;
  }, [onClose, dismissible]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    titleRef.current?.focus();

    function onDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && dismissibleRef.current) {
        event.stopPropagation();
        onCloseRef.current();
      }
      if (event.key === "Tab") trapFocus(event, panelRef.current, titleRef.current);
    }
    document.addEventListener("keydown", onDocumentKeyDown);
    return () => {
      document.removeEventListener("keydown", onDocumentKeyDown);
      opener?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.root}>
      <div
        className={styles.scrim}
        data-testid="sheet-scrim"
        aria-hidden="true"
        onClick={dismissible ? onClose : undefined}
      />
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.handle} aria-hidden="true" />
        <div className={styles.header}>
          <h2 ref={titleRef} id={titleId} className={styles.title} tabIndex={-1}>
            {title}
          </h2>
          <IconButton label={closeLabel} icon={<CloseIcon />} variant="subtle" onClick={onClose} />
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
