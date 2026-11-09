import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("mostra o nome, com a marca decorativa", () => {
    const { container } = render(<Logo name="ZupLoop" />);
    expect(screen.getByText("ZupLoop")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
