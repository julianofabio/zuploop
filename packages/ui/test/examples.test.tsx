// Todos os exemplos de todos os componentes passam no axe (T013).
import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { examples as badge } from "../src/components/Badge/Badge.examples";
import { examples as banner } from "../src/components/Banner/Banner.examples";
import { examples as button } from "../src/components/Button/Button.examples";
import { examples as gameCard } from "../src/components/GameCard/GameCard.examples";
import { examples as iconButton } from "../src/components/IconButton/IconButton.examples";
import { examples as link } from "../src/components/Link/Link.examples";
import { examples as sheet } from "../src/components/Sheet/Sheet.examples";
import { examples as toast } from "../src/components/Toast/Toast.examples";
import { expectNoAxeViolations } from "./axe";

const all = { badge, banner, button, gameCard, iconButton, link, sheet, toast };

describe.each(Object.entries(all))("exemplos de %s", (_component, group) => {
  it.each(Object.entries(group))("%s passa no axe", async (_name, Example) => {
    const { container } = render(<main>{Example()}</main>);
    await expectNoAxeViolations(container);
  });
});
