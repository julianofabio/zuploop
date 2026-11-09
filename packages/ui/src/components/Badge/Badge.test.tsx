import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("usa neutral por padrão", () => {
    render(<Badge>Em breve</Badge>);
    expect(screen.getByText("Em breve")).toHaveAttribute("data-variant", "neutral");
  });

  it.each(["neutral", "accent", "success"] as const)("aceita a variante %s", (variant) => {
    render(<Badge variant={variant}>Selo</Badge>);
    expect(screen.getByText("Selo")).toHaveAttribute("data-variant", variant);
  });
});
