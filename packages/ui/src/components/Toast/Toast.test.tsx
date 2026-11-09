import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";

afterEach(() => {
  vi.useRealTimers();
});

describe("Toast", () => {
  it("anuncia a mensagem com role status", () => {
    render(<Toast message="Adicionado aos favoritos" onDismiss={() => undefined} />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Adicionado aos favoritos");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("some depois de 4 segundos", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast message="Salvo" onDismiss={onDismiss} />);

    act(() => vi.advanceTimersByTime(3999));
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("aceita outra duração", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast message="Salvo" onDismiss={onDismiss} duration={1000} />);
    act(() => vi.advanceTimersByTime(1000));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
