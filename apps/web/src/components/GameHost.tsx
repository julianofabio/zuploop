"use client";
// Abre o jogo na página (FDD 001 F4, RF-NAV-04): o import() do jogo só acontece ao tocar em
// "Jogar"; o jogo abre em tela cheia, sem a barra inferior, e fecha pelo "Voltar" ou pelo voltar do
// navegador, sem mudar o endereço. Cria um SDK por jogo aberto e o descarta ao fechar (ADR-0014).
import { createPortalSdk, type GameProps, type PortalSdkHandle } from "@zuploop/sdk";
import { AlertIcon, Button, GameBar, Toast } from "@zuploop/ui";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { findGame } from "@/games/registry";
import { isLocale, type Locale } from "@/i18n/config";
import { describeError } from "@/lib/errors";
import { isDev, reportError } from "@/telemetry";
import { GameErrorBoundary } from "./GameErrorBoundary";
import styles from "./GameHost.module.css";

type Phase =
  | { kind: "closed" }
  | { kind: "loading" }
  | { kind: "failed" }
  | { kind: "ready"; Game: ComponentType<GameProps>; sdk: PortalSdkHandle };

/** Marca no <html> que o jogo está aberto (some a rolagem da página por trás). */
const OPEN_ATTRIBUTE = "data-game-open";
/** Avisos que aparecem uma vez por aba. */
const NOT_PERSISTENT_NOTICE_KEY = "zuploop.notice.notPersistent";

function firstTimeThisSession(key: string): boolean {
  try {
    if (window.sessionStorage.getItem(key)) return false;
    window.sessionStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
}

export function GameHost({ gameId, name }: { gameId: string; name: string }) {
  const t = useTranslations("game");
  const current = useLocale();
  const locale: Locale = isLocale(current) ? current : "en";
  const [phase, setPhase] = useState<Phase>({ kind: "closed" });
  const [notices, setNotices] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);
  const playRef = useRef<HTMLButtonElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  // Cada abertura tem um número; resultados de uma abertura antiga são ignorados.
  const session = useRef(0);
  const sdkRef = useRef<PortalSdkHandle | null>(null);

  const open = phase.kind !== "closed";

  async function start() {
    const manifest = findGame(gameId);
    const id = ++session.current;
    setPhase({ kind: "loading" });
    try {
      if (!manifest) throw new Error(`Unknown game "${gameId}".`);
      const [module, messages, fallback] = await Promise.all([
        manifest.load(),
        manifest.messages[locale](),
        manifest.messages.en(),
      ]);
      const sdk = await createPortalSdk({
        game: manifest,
        locale,
        messages: messages.ui,
        fallbackMessages: fallback.ui,
        dev: isDev,
        onError: reportError,
        onEvent: (event) => {
          if (event === "save_discarded") setNotices((list) => [...list, t("saveDiscarded")]);
        },
      });
      if (id !== session.current) {
        void sdk.dispose();
        return;
      }
      sdkRef.current = sdk;
      if (!sdk.storage.persistent && firstTimeThisSession(NOT_PERSISTENT_NOTICE_KEY)) {
        setNotices((list) => [...list, t("notPersistent")]);
      }
      setPhase({ kind: "ready", Game: module.default, sdk });
    } catch (error) {
      if (id !== session.current) return;
      reportError("game_load_failed", { gameId, reason: describeError(error) });
      setPhase({ kind: "failed" });
    }
  }

  function close() {
    session.current += 1;
    void sdkRef.current?.dispose();
    sdkRef.current = null;
    setPhase({ kind: "closed" });
    setNotices([]);
    playRef.current?.focus();
  }

  function play() {
    // O endereço não muda; o estado no histórico faz o voltar do navegador fechar o jogo.
    window.history.pushState({ zuploopGame: gameId }, "");
    void start();
  }

  function requestClose() {
    window.history.back();
  }

  function retryGame() {
    setAttempt((value) => value + 1);
  }

  // Enquanto aberto: o voltar do navegador fecha, e a página por trás não rola.
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });
  useEffect(() => {
    if (!open) return;
    const onPopState = () => closeRef.current();
    window.addEventListener("popstate", onPopState);
    document.documentElement.setAttribute(OPEN_ATTRIBUTE, "");
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.documentElement.removeAttribute(OPEN_ATTRIBUTE);
    };
  }, [open]);

  // Foco no jogo quando ele fica pronto (padrão §10.2).
  useEffect(() => {
    if (phase.kind === "ready") areaRef.current?.focus();
  }, [phase.kind]);

  // Garante o SDK gravado se a página for desmontada com o jogo aberto.
  useEffect(() => () => void sdkRef.current?.dispose(), []);

  return (
    <>
      <Button ref={playRef} size="lg" onClick={play}>
        {t("play")}
      </Button>
      {open
        ? createPortal(
            <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={name}>
              <GameBar title={name} backLabel={t("back")} onBack={requestClose} />
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
                    <Button variant="secondary" onClick={() => void start()}>
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
                          <Button variant="secondary" onClick={requestClose}>
                            {t("back")}
                          </Button>
                          <Button onClick={retryGame}>{t("retry")}</Button>
                        </div>
                      </div>
                    }
                  >
                    <phase.Game sdk={phase.sdk} onExit={requestClose} />
                  </GameErrorBoundary>
                ) : null}
              </div>
              {notices[0] ? (
                <Toast
                  key={notices[0]}
                  message={notices[0]}
                  onDismiss={() => setNotices((list) => list.slice(1))}
                />
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
