"use client";
// Tela do jogo de exemplo. Fala com o portal só pelo `sdk` recebido (ADR-0004) e usa só
// componentes de @zuploop/ui. As regras ficam em ./rules.
import type { GameProps } from "@zuploop/sdk";
import { Button } from "@zuploop/ui";
import { useEffect, useRef, useState } from "react";
import styles from "./Game.module.css";
import { MAX_MOVES, applyMove, initialState, isFinished, isSaveState } from "./rules";
import type { ExampleState } from "./rules";

const SLOT = "main";

export default function Game({ sdk }: GameProps) {
  const { t } = sdk.i18n;
  const [state, setState] = useState<ExampleState | null>(null);
  const [message, setMessage] = useState("");
  const started = useRef(false);

  // Carrega a partida salva uma vez ao abrir; save estranho começa do zero.
  useEffect(() => {
    let active = true;
    void sdk.storage.load<unknown>(SLOT).then((saved) => {
      if (!active) return;
      const restored = isSaveState(saved) ? saved : initialState();
      setState(restored);
      if (!started.current && restored.moves === 0) {
        started.current = true;
        sdk.events.track("game_start");
      }
    });
    return () => {
      active = false;
    };
  }, [sdk]);

  function play(amount: number) {
    if (!state) return;
    const result = applyMove(state, amount);
    if (!result.ok) {
      setMessage(t("invalid"));
      return;
    }
    setState(result.state);
    setMessage("");
    void sdk.storage.save(SLOT, result.state);
    if (isFinished(result.state)) {
      sdk.events.track("game_end", { score: result.state.score });
      setMessage(t("finished", { score: result.state.score }));
    }
  }

  function restart() {
    const fresh = initialState();
    setState(fresh);
    setMessage("");
    void sdk.storage.save(SLOT, fresh);
    sdk.events.track("game_start");
  }

  if (!state) return <div className={styles.game} aria-busy="true" />;

  const finished = isFinished(state);
  return (
    <div className={styles.game}>
      <p className={styles.status} data-testid="example-moves">
        <span>{t("moves", { count: state.moves, max: MAX_MOVES })}</span>
        <span>{t("score", { score: state.score })}</span>
      </p>
      <div className={styles.actions}>
        <Button variant="secondary" disabled={finished} onClick={() => play(1)}>
          {t("addOne")}
        </Button>
        <Button variant="secondary" disabled={finished} onClick={() => play(2)}>
          {t("addTwo")}
        </Button>
      </div>
      <p className={styles.message} role="status" aria-live="polite">
        {message}
      </p>
      {finished ? (
        <Button variant="primary" onClick={restart}>
          {t("restart")}
        </Button>
      ) : null}
    </div>
  );
}
