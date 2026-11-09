"use client";
// Tela cheia do jogo aberto (padrão §6.5): barra do jogo, área do jogo, erros e avisos.
// Carregado só ao tocar em "Jogar" (GameHost usa React.lazy).
import { AlertIcon, Button, GameBar, Toast } from "@zuploop/ui";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { describeError } from "@/lib/errors";
import { reportError } from "@/telemetry";
import type { GamePhase } from "./game-phase";
import { GameErrorBoundary } from "./GameErrorBoundary";
import styles from "./GameHost.module.css";

export interface GameOverlayProps {
  gameId: string;
  name: string;
  phase: GamePhase;
  notice: string | undefined;
  onDismissNotice: () => void;
  onBack: () => void;
  onRetryLoad: () => void;
}

export default function GameOverlay({
  gameId,
  name,
  phase,
  notice,
  onDismissNotice,
  onBack,
  onRetryLoad,
}: GameOverlayProps) {
  const t = useTranslations("game");
  const areaRef = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);

  // Foco no jogo quando ele fica pronto (padrão §10.2).
  useEffect(() => {
    if (phase.kind === "ready") areaRef.current?.focus();
  }, [phase.kind]);

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={name}>
      <GameBar title={name} backLabel={t("back")} onBack={onBack} />
      <div ref={areaRef} className={styles.area} tabIndex={-1} data-testid="game-area">
        {phase.kind === "loading" ? (
          <p className={styles.status} role="status">
            {t("loading")}
          </p>
        ) : null}
        {phase.kind === "failed" ? (
          <div className={styles.problem} role="alert">
            <span className={styles.problemIcon}>
              <AlertIcon size="lg" />
            </span>
            <p>{t("loadFailed")}</p>
            <Button variant="secondary" onClick={onRetryLoad}>
              {t("retry")}
            </Button>
          </div>
        ) : null}
        {phase.kind === "ready" ? (
          <GameErrorBoundary
            key={attempt}
            onError={(error) =>
              reportError("game_crashed", { gameId, reason: describeError(error) })
            }
            fallback={
              <div className={styles.problem} role="alert">
                <span className={styles.problemIcon}>
                  <AlertIcon size="lg" />
                </span>
                <p>{t("crashed")}</p>
                <div className={styles.problemActions}>
                  <Button variant="secondary" onClick={onBack}>
                    {t("back")}
                  </Button>
                  <Button onClick={() => setAttempt((value) => value + 1)}>{t("retry")}</Button>
                </div>
              </div>
            }
          >
            <phase.Game sdk={phase.sdk} onExit={onBack} />
          </GameErrorBoundary>
        ) : null}
      </div>
      {notice ? <Toast key={notice} message={notice} onDismiss={onDismissNotice} /> : null}
    </div>,
    document.body,
  );
}
