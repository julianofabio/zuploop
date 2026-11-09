// Prova que o lint barra "any" e os imports proibidos entre pacotes (T002).
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
const eslint = new ESLint({
  cwd: repoRoot,
  overrideConfigFile: path.join(repoRoot, "packages/config/eslint.config.js"),
});

/** Faz o lint de um código como se estivesse no caminho informado e devolve as regras violadas. */
async function violations(relativePath, code) {
  const [result] = await eslint.lintText(code, { filePath: path.join(repoRoot, relativePath) });
  return result.messages.filter((m) => m.severity === 2).map((m) => m.ruleId);
}

describe("configuração do ESLint", () => {
  it("recusa any explícito", async () => {
    const rules = await violations("packages/sdk/src/example.ts", "export const value: any = 1;\n");
    expect(rules).toContain("@typescript-eslint/no-explicit-any");
  });

  it("aceita um arquivo limpo", async () => {
    const rules = await violations(
      "packages/sdk/src/example.ts",
      "export const value: number = 1;\n",
    );
    expect(rules).toEqual([]);
  });

  it("recusa jogo importando do Next.js", async () => {
    const rules = await violations(
      "packages/games/example/src/Game.tsx",
      'import Link from "next/link";\nexport const L = Link;\n',
    );
    expect(rules).toContain("no-restricted-imports");
  });

  it("recusa jogo importando de outro jogo", async () => {
    const rules = await violations(
      "packages/games/example/src/Game.tsx",
      'import { x } from "@zuploop/game-sudoku";\nexport const y = x;\n',
    );
    expect(rules).toContain("no-restricted-imports");
  });

  it("recusa jogo importando do site", async () => {
    const rules = await violations(
      "packages/games/example/src/Game.tsx",
      'import { x } from "../../../../apps/web/src/x";\nexport const y = x;\n',
    );
    expect(rules).toContain("no-restricted-imports");
  });

  it("recusa React e navegador nas regras do jogo", async () => {
    const rules = await violations(
      "packages/games/example/src/rules/counter.ts",
      'import { useState } from "react";\nexport const a = useState;\nexport const w = window.innerWidth;\n',
    );
    expect(rules).toContain("no-restricted-imports");
    expect(rules).toContain("no-restricted-globals");
  });

  it("permite o SDK no jogo", async () => {
    const rules = await violations(
      "packages/games/example/src/Game.tsx",
      'import type { GameProps } from "@zuploop/sdk";\nexport type P = GameProps;\n',
    );
    expect(rules).toEqual([]);
  });

  it("recusa a interface importando do SDK ou do Next.js", async () => {
    const sdk = await violations(
      "packages/ui/src/components/Button.tsx",
      'import { x } from "@zuploop/sdk";\nexport const y = x;\n',
    );
    const next = await violations(
      "packages/ui/src/components/Button.tsx",
      'import Link from "next/link";\nexport const L = Link;\n',
    );
    expect(sdk).toContain("no-restricted-imports");
    expect(next).toContain("no-restricted-imports");
  });

  it("recusa o SDK importando do Next.js", async () => {
    const rules = await violations(
      "packages/sdk/src/example.ts",
      'import { notFound } from "next/navigation";\nexport const n = notFound;\n',
    );
    expect(rules).toContain("no-restricted-imports");
  });

  it("recusa href com idioma escrito à mão (use LocalizedLink)", async () => {
    const jsx = await violations(
      "apps/web/src/components/Example.tsx",
      'export const A = () => <a href="/pt/jogos/">Jogos</a>;\n',
    );
    const object = await violations(
      "apps/web/src/components/Example.tsx",
      'export const link = { href: "/es/juegos/" };\n',
    );
    const template = await violations(
      "packages/ui/src/components/Example.tsx",
      "export const A = () => <a href={`/en/games/${1}`}>x</a>;\n",
    );
    expect(jsx).toContain("no-restricted-syntax");
    expect(object).toContain("no-restricted-syntax");
    expect(template).toContain("no-restricted-syntax");
  });

  it("aceita href externo, âncora e raiz", async () => {
    const rules = await violations(
      "apps/web/src/components/Example.tsx",
      [
        "export const A = () => (",
        "  <>",
        '    <a href="https://zuploop.com/">a</a>',
        '    <a href="#main">b</a>',
        '    <a href="/">c</a>',
        '    <a href="/portal/">d</a>',
        "  </>",
        ");",
        "",
      ].join("\n"),
    );
    expect(rules).toEqual([]);
  });
});
