// Verificador de estilos (T011): cores, fontes e tamanhos só em tokens.css (ADR-0017, padrão §13.2).
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findStyleProblems, lintStyles } from "../../../scripts/lint-styles.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
const file = "packages/ui/src/components/Example/Example.module.css";

const rules = (css) => findStyleProblems(css, file).map((p) => p.rule);

describe("lint:styles", () => {
  it("recusa cor hexadecimal fora de tokens.css", () => {
    expect(rules(".a { color: #fff; }")).toEqual(["hex-color"]);
  });

  it("recusa rgb(), hsl() e nomes de cor", () => {
    expect(rules(".a { background: rgb(0 0 0 / 0.5); }")).toEqual(["color-function"]);
    expect(rules(".a { color: hsl(10 20% 30%); }")).toEqual(["color-function"]);
    expect(rules(".a { border-color: white; }")).toEqual(["named-color"]);
  });

  it("recusa font-family fora de tokens.css", () => {
    expect(rules('.a { font-family: "Comic Sans MS"; }')).toEqual(["font-family"]);
    expect(rules(".a { font-family: var(--font-display); }")).toEqual([]);
  });

  it("recusa tamanho em px, exceto bordas finas de 1 a 3 px", () => {
    expect(rules(".a { font-size: 16px; }")).toEqual(["px-size"]);
    expect(rules(".a { padding: 12px; }")).toEqual(["px-size"]);
    expect(rules(".a { border: 1px solid var(--color-border); outline-offset: 2px; }")).toEqual([]);
  });

  it("aceita tokens, palavras-chave e comentários", () => {
    const css = `
      /* Comentário com #fff e 16px não conta. */
      .a {
        color: var(--color-text);
        background: transparent;
        border-color: currentColor;
        font: 700 var(--text-base) / var(--leading-tight) var(--font-text);
        inset: 0;
      }
    `;
    expect(rules(css)).toEqual([]);
  });

  it("não confunde seletor de id ou hash com cor", () => {
    expect(rules(".a[data-x='#abc'] { color: var(--color-text); }")).toEqual([]);
  });

  it("informa a linha do problema", () => {
    const [problem] = findStyleProblems(".a {\n  color: red;\n}", file);
    expect(problem).toMatchObject({ file, line: 2, rule: "named-color" });
  });

  it("aceita o tokens.css de verdade", () => {
    const tokensPath = "packages/ui/src/tokens.css";
    const css = readFileSync(path.join(repoRoot, tokensPath), "utf8");
    expect(findStyleProblems(css, tokensPath)).toEqual([]);
  });

  it("o repositório inteiro passa", () => {
    expect(lintStyles(repoRoot)).toEqual([]);
  });
});
