// Confere tokens.css contra as tabelas do padrão de interface (T010, seções 3 a 5).
// O documento é a fonte: mudou lá, este teste aponta o que falta mudar aqui.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const designSystem = readFileSync(path.resolve(here, "../../../docs/design-system.md"), "utf8");
const tokensCss = readFileSync(path.resolve(here, "../src/tokens.css"), "utf8");
const baseCss = readFileSync(path.resolve(here, "../src/base.css"), "utf8");

/** Trecho do documento entre dois títulos de nível 2. */
function section(from: string, to: string): string {
  const start = designSystem.indexOf(from);
  const end = designSystem.indexOf(to, start);
  if (start < 0 || end < 0) throw new Error(`Seção não encontrada: ${from}`);
  return designSystem.slice(start, end);
}

/** Corpo do primeiro bloco CSS cujo seletor é exatamente `selector`. */
function block(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css);
  if (!match?.[1]) throw new Error(`Bloco não encontrado: ${selector}`);
  return match[1];
}

/** Lê as declarações `--nome: valor;` de um bloco CSS. */
function declarations(body: string): Map<string, string> {
  const result = new Map<string, string>();
  for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    result.set(match[1] ?? "", (match[2] ?? "").trim().replace(/\s+/g, " "));
  }
  return result;
}

const root = declarations(block(tokensCss, ":root"));

/** Linhas de tabela do tipo | `--token` | valor | … */
function tableRows(markdown: string): { tokens: string[]; cells: string[] }[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("| `--"))
    .map((line) => {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());
      const tokens = [...(cells[0] ?? "").matchAll(/`(--[\w-]+)`/g)].map((m) => m[1] ?? "");
      return { tokens, cells };
    });
}

const colorsSection = section("## 3. Cores", "### 3.5 Alto contraste");
const typographySection = section("## 4. Tipografia", "### 4.3 Regras");
const spaceSection = section("## 5. Espaço, forma e camadas", "## 6. Layout");

/** Todos os tokens citados nas seções 3 a 5 do padrão. */
const documentedTokens = new Set(
  [colorsSection, typographySection, spaceSection].flatMap((md) =>
    [...md.matchAll(/`(--[\w-]+)`/g)].map((m) => m[1] ?? ""),
  ),
);

const remFromPx = (px: number) => `${px / 16}rem`;
const decimal = (text: string) => Number(text.replace(",", "."));

describe("tokens.css", () => {
  it("define todos os tokens citados nas seções 3 a 5 do padrão", () => {
    const missing = [...documentedTokens].filter((token) => !root.has(token));
    expect(missing).toEqual([]);
  });

  it("usa as cores do padrão", () => {
    for (const { tokens, cells } of tableRows(colorsSection)) {
      const values = [...(cells[1] ?? "").matchAll(/`(#[0-9A-Fa-f]{6})`/g)].map((m) => m[1]);
      tokens.forEach((token, index) => {
        const expected = values[index] ?? values[0];
        if (!expected) return;
        expect(root.get(token)?.toUpperCase(), token).toBe(expected.toUpperCase());
      });
    }
  });

  it("usa a escala de texto do padrão, em rem", () => {
    for (const { tokens, cells } of tableRows(typographySection)) {
      const token = tokens[0] ?? "";
      const value = cells[1] ?? "";
      if (token.startsWith("--text-")) {
        expect(root.get(token), token).toBe(`${decimal(value)}rem`);
      }
      if (token.startsWith("--leading-")) {
        expect(root.get(token), token).toBe(String(decimal(value)));
      }
      if (token === "--tracking-tight") {
        expect(root.get(token), token).toBe(value.replace(",", "."));
      }
    }
  });

  it("usa espaços, raios e controles do padrão, em rem", () => {
    for (const { tokens, cells } of tableRows(spaceSection)) {
      const pxValues = (cells[1] ?? "").split("/").map((v) => Number(v.trim()));
      tokens.forEach((token, index) => {
        const px = pxValues[index];
        if (px === undefined || Number.isNaN(px)) return;
        if (/^--(space|control|icon)-/.test(token)) {
          expect(root.get(token), token).toBe(remFromPx(px));
        }
        if (token.startsWith("--radius-")) {
          expect(root.get(token), token).toBe(token === "--radius-pill" ? "999px" : remFromPx(px));
        }
        if (token.startsWith("--z-")) {
          expect(root.get(token), token).toBe(String(px));
        }
      });
    }
  });

  it("usa a sombra, as durações e a curva do padrão", () => {
    expect(root.get("--shadow-overlay")).toBe("0 8px 24px rgb(29 36 34 / 0.14)");
    expect(root.get("--duration-fast")).toBe("120ms");
    expect(root.get("--duration-base")).toBe("200ms");
    expect(root.get("--duration-slow")).toBe("320ms");
    expect(root.get("--ease-standard")).toBe("cubic-bezier(0.2, 0, 0, 1)");
  });

  it("usa Atkinson Hyperlegible no texto e Lexend nos títulos", () => {
    expect(root.get("--font-text")).toContain("Atkinson Hyperlegible");
    expect(root.get("--font-display")).toContain("Lexend");
  });

  it("troca os tokens no alto contraste", () => {
    const high = declarations(block(tokensCss, ':root[data-contrast="high"]'));
    expect(high.get("--color-bg")?.toUpperCase()).toBe("#FFFFFF");
    expect(high.get("--color-text")?.toUpperCase()).toBe("#000000");
    expect(high.get("--color-text-reading")?.toUpperCase()).toBe("#000000");
    expect(high.get("--color-text-muted")?.toUpperCase()).toBe("#1D2422");
    expect(high.get("--color-border")?.toUpperCase()).toBe("#1D2422");
    expect(high.get("--color-border-strong")?.toUpperCase()).toBe("#1D2422");
    expect(high.get("--color-border-control")?.toUpperCase()).toBe("#1D2422");
    expect(high.get("--color-primary")?.toUpperCase()).toBe("#0A3D36");
    expect(high.get("--color-surface-muted")?.toUpperCase()).toBe("#FFFFFF");
  });

  it("aumenta o texto trocando só o tamanho da raiz (100%, 112,5% e 125%)", () => {
    expect(block(tokensCss, ":root")).toMatch(/font-size:\s*100%/);
    expect(block(tokensCss, ':root[data-text-size="md"]')).toMatch(/font-size:\s*112\.5%/);
    expect(block(tokensCss, ':root[data-text-size="lg"]')).toMatch(/font-size:\s*125%/);
  });

  it("zera as durações no modo tranquilo e com movimento reduzido", () => {
    const calm = declarations(block(tokensCss, ':root[data-calm="true"]'));
    for (const token of ["--duration-fast", "--duration-base", "--duration-slow"]) {
      expect(calm.get(token), token).toBe("0ms");
    }
    expect(tokensCss).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });
});

describe("base.css", () => {
  it("tem anel de foco visível com o token de foco", () => {
    expect(baseCss).toMatch(/:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--color-focus\)/);
    expect(baseCss).toMatch(/\[data-surface="dark"\] :focus-visible/);
  });

  it("tem utilitário visually-hidden e link de pular para o conteúdo", () => {
    expect(baseCss).toContain(".visually-hidden");
    expect(baseCss).toContain(".skip-link");
  });

  it("usa a fonte de texto e o tamanho base no body", () => {
    const body = block(baseCss, "body");
    expect(body).toContain("var(--font-text)");
    expect(body).toContain("var(--text-base)");
    expect(body).toContain("var(--color-bg)");
  });
});
