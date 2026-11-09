// Regras puras do jogo de exemplo (T025, RF-SDK-04): jogadas válidas, inválidas e fim.
import { describe, expect, it } from "vitest";
import { MAX_MOVES, applyMove, initialState, isFinished, isSaveState } from "../src/rules";

describe("regras do jogo de exemplo", () => {
  it("começa sem jogadas e sem pontos", () => {
    expect(initialState()).toEqual({ moves: 0, score: 0 });
  });

  it("jogada válida soma os pontos e conta a jogada", () => {
    const one = applyMove(initialState(), 1);
    expect(one).toEqual({ ok: true, state: { moves: 1, score: 1 } });
    if (!one.ok) throw new Error("jogada recusada");
    expect(applyMove(one.state, 2)).toEqual({ ok: true, state: { moves: 2, score: 3 } });
  });

  it.each([0, 3, -1, 1.5, Number.NaN])(
    "jogada inválida (%s) é recusada sem mudar o estado",
    (amount) => {
      const state = { moves: 4, score: 6 };
      expect(applyMove(state, amount)).toEqual({ ok: false, reason: "invalid_amount" });
      expect(state).toEqual({ moves: 4, score: 6 });
    },
  );

  it("o jogo termina em 10 jogadas", () => {
    let state = initialState();
    for (let i = 0; i < MAX_MOVES; i += 1) {
      expect(isFinished(state)).toBe(false);
      const result = applyMove(state, 1);
      if (!result.ok) throw new Error("jogada recusada");
      state = result.state;
    }
    expect(MAX_MOVES).toBe(10);
    expect(isFinished(state)).toBe(true);
  });

  it("depois do fim, toda jogada é recusada", () => {
    expect(applyMove({ moves: 10, score: 12 }, 1)).toEqual({ ok: false, reason: "game_over" });
  });

  it("reconhece um estado salvo válido", () => {
    expect(isSaveState({ moves: 3, score: 4 })).toBe(true);
    expect(isSaveState({ moves: 11, score: 4 })).toBe(false);
    expect(isSaveState({ moves: "3", score: 4 })).toBe(false);
    expect(isSaveState(null)).toBe(false);
  });
});
