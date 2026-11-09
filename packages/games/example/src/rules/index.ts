// Regras do jogo de exemplo, em TypeScript puro (RF-SDK-04): sem React, sem DOM.
// Um contador: cada jogada soma 1 ou 2 pontos; o jogo termina na 10ª jogada.

export const MAX_MOVES = 10;
export const VALID_AMOUNTS: readonly number[] = [1, 2];

export interface ExampleState {
  moves: number;
  score: number;
}

export type MoveResult =
  { ok: true; state: ExampleState } | { ok: false; reason: "invalid_amount" | "game_over" };

export function initialState(): ExampleState {
  return { moves: 0, score: 0 };
}

export function isFinished(state: ExampleState): boolean {
  return state.moves >= MAX_MOVES;
}

/** Aplica uma jogada sem mudar o estado recebido. */
export function applyMove(state: ExampleState, amount: number): MoveResult {
  if (isFinished(state)) return { ok: false, reason: "game_over" };
  if (!VALID_AMOUNTS.includes(amount)) return { ok: false, reason: "invalid_amount" };
  return { ok: true, state: { moves: state.moves + 1, score: state.score + amount } };
}

/** Confere um estado vindo do armazenamento, que pode estar corrompido. */
export function isSaveState(value: unknown): value is ExampleState {
  if (typeof value !== "object" || value === null) return false;
  const { moves, score } = value as Record<string, unknown>;
  return (
    Number.isInteger(moves) &&
    Number.isInteger(score) &&
    (moves as number) >= 0 &&
    (moves as number) <= MAX_MOVES &&
    (score as number) >= 0
  );
}
