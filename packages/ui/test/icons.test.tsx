// Ícones do conjunto base (T012, padrão de interface §8).
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as icons from "../src/icons";

// Conjunto base do §8, na ordem do documento.
const BASE_SET = [
  "HomeIcon",
  "GamesIcon",
  "ChallengeIcon",
  "SettingsIcon",
  "BackIcon",
  "CloseIcon",
  "HelpIcon",
  "HeartIcon",
  "ShareIcon",
  "PrintIcon",
  "HintIcon",
  "UndoIcon",
  "EraseIcon",
  "TimeIcon",
  "StreakIcon",
  "AccountIcon",
  "LanguageIcon",
  "LockIcon",
  "CheckIcon",
  "AlertIcon",
  "PlusIcon",
] as const;

const registry = icons as unknown as Record<string, icons.IconComponent>;

describe("ícones", () => {
  it("existe todo o conjunto base", () => {
    const missing = BASE_SET.filter((name) => typeof registry[name] !== "function");
    expect(missing).toEqual([]);
  });

  it.each(BASE_SET)("%s segue a grade de 24, traço de 2 px e currentColor", (name) => {
    const Icon = registry[name];
    if (!Icon) throw new Error(name);
    const { container } = render(<Icon />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("stroke-width", "2");
    expect(svg).toHaveAttribute("stroke-linecap", "round");
    expect(svg).toHaveAttribute("stroke-linejoin", "round");
    expect(svg?.childElementCount).toBeGreaterThan(0);
  });

  it.each(BASE_SET)("%s é decorativo por padrão (aria-hidden)", (name) => {
    const Icon = registry[name];
    if (!Icon) throw new Error(name);
    const { container } = render(<Icon />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).not.toHaveAttribute("role");
  });

  it("aceita title quando usado sozinho e vira imagem com nome", () => {
    render(<icons.HeartIcon title="Favorito" />);
    const img = screen.getByRole("img", { name: "Favorito" });
    expect(img).not.toHaveAttribute("aria-hidden");
    expect(img.querySelector("title")).toHaveTextContent("Favorito");
  });

  it("preenche só quando pedido (estado ativo)", () => {
    const { container, rerender } = render(<icons.HeartIcon />);
    expect(container.querySelector("svg")).toHaveAttribute("data-filled", "false");
    rerender(<icons.HeartIcon filled />);
    expect(container.querySelector("svg")).toHaveAttribute("data-filled", "true");
  });

  it("tem tamanhos sm, md e lg, com md como padrão", () => {
    const { container, rerender } = render(<icons.HomeIcon />);
    expect(container.querySelector("svg")).toHaveAttribute("data-size", "md");
    rerender(<icons.HomeIcon size="lg" />);
    expect(container.querySelector("svg")).toHaveAttribute("data-size", "lg");
  });
});
