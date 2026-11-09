"use client";
// Abre o jogo na página (FDD 001 F4, RF-NAV-04): o import() do jogo só acontece ao tocar em
// "Jogar"; o jogo abre em tela cheia, sem a barra inferior, e fecha pelo "Voltar" ou pelo voltar do
// navegador, sem mudar o endereço. Cria um SDK por jogo aberto e o descarta ao fechar (ADR-0014).
// Este arquivo fica leve de propósito: o SDK e a tela cheia (GameOverlay) só são baixados ao
// tocar em "Jogar", para caber no orçamento de JS inicial (RNF-01, FDD 001 §9).
import type { PortalSdkHandle } from "@zuploop/sdk";
import { Button } from "@zuploop/ui";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { findGame } from "@/games/registry";
import { isLocale, type Locale } from "@/i18n/config";
import { describeError } from "@/lib/errors";
import { isDev, reportError } from "@/telemetry";
import type { GamePhase } from "./game-phase";

const GameOverlay = lazy(() => import("./GameOverlay"));

/** Marca no <html> que o jogo está aberto (some a rolagem da página por trás). */
const OPEN_ATTRIBUTE = "data-game-open";
/** Aviso que aparece uma vez por aba. */
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
  const [phase, setPhase] = useState<GamePhase>({ kind: "closed" });
  const [notices, setNotices] = useState<string[]>([]);
  const playRef = useRef<HTMLButtonElement>(null);
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
      const [module, messages, fallback, { createPortalSdk }] = await Promise.all([
        manifest.load(),
        manifest.messages[locale](),
        manifest.messages.en(),
        import("@zuploop/sdk"),
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

  // Garante o SDK gravado se a página for desmontada com o jogo aberto.
  useEffect(() => () => void sdkRef.current?.dispose(), []);

  return (
    <>
      <Button ref={playRef} size="lg" onClick={play}>
        {t("play")}
      </Button>
      {open ? (
        <Suspense fallback={null}>
          <GameOverlay
            gameId={gameId}
            name={name}
            phase={phase}
            notice={notices[0]}
            onDismissNotice={() => setNotices((list) => list.slice(1))}
            onBack={() => window.history.back()}
            onRetryLoad={() => void start()}
          />
        </Suspense>
      ) : null}
    </>
  );
}
