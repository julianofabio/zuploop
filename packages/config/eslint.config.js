// Configuração ESLint compartilhada (ADR-0012), no formato flat do ESLint 9.
// A raiz do repositório reexporta este arquivo; os pacotes não têm config própria.
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const TS_FILES = ["**/*.{ts,tsx,mts,cts}"];
const JSX_FILES = ["**/*.{tsx,jsx}"];

// Fronteiras entre pacotes (ADR-0004, ADR-0018, FDD 001 §8.2).
// Cada bloco abaixo restringe imports de uma parte do repositório.
const nextImports = {
  group: ["next", "next/*", "next-intl", "next-intl/*"],
  message: "Este pacote não pode depender do Next.js (FDD 001 §8.2).",
};
const webImports = {
  group: ["@zuploop/web", "@zuploop/web/*", "**/apps/web/**"],
  message: "Nada fora de apps/web importa do site (FDD 001 §8.2).",
};
const gameImports = {
  group: ["@zuploop/game-*", "**/packages/games/**"],
  message: "Um jogo não importa de outro jogo, e a interface não importa dos jogos (ADR-0004).",
};
const sdkImports = {
  group: ["@zuploop/sdk", "@zuploop/sdk/*"],
  message: "@zuploop/ui não depende do SDK (ADR-0018).",
};
const reactImports = {
  group: ["react", "react/*", "react-dom", "react-dom/*", "@zuploop/ui", "@zuploop/ui/*"],
  message: "Regras de jogo são TypeScript puro, sem React e sem interface (RF-SDK-04).",
};

// Caminho que começa com um idioma: /pt, /pt/…, /es…, /en….
const LOCALE_PATH = String.raw`/^\/(pt|es|en)(\/|$)/`;
const HREF_MESSAGE =
  "Links internos usam <LocalizedLink page=…>, nunca um caminho com idioma escrito à mão (ADR-0013).";

// Globais do navegador proibidos nas regras dos jogos (sem DOM, RF-SDK-04).
const domGlobals = [
  "window",
  "document",
  "navigator",
  "localStorage",
  "sessionStorage",
  "indexedDB",
  "location",
  "fetch",
].map((name) => ({ name, message: "Regras de jogo não usam o navegador (RF-SDK-04)." }));

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/out/**",
      "**/.next/**",
      "**/dist/**",
      "**/coverage/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/.lighthouseci/**",
      "**/next-env.d.ts",
      "apps/api/**",
      "docs/**",
      ".claude/**",
    ],
  },
  js.configs.recommended,
  {
    files: TS_FILES,
    extends: [tseslint.configs.strict],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": "allow-with-description" },
      ],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,mts,cts,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: JSX_FILES,
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: JSX_FILES,
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    files: ["apps/web/**/*.{ts,tsx,js,mjs}"],
    ...nextPlugin.configs["core-web-vitals"],
    settings: { next: { rootDir: "apps/web/" } },
  },

  // Links internos só pelo LocalizedLink (ADR-0013): nada de href começando com /pt/, /es/ ou /en/.
  // Testes, exemplos e e2e ficam de fora, porque conferem justamente esses caminhos.
  {
    files: ["apps/web/**/*.{ts,tsx}", "packages/**/*.{ts,tsx}"],
    ignores: ["**/*.test.{ts,tsx}", "**/*.examples.tsx", "**/e2e/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...[
          "JSXAttribute[name.name='href'] > Literal",
          "JSXAttribute[name.name='href'] > JSXExpressionContainer > Literal",
          "Property[key.name='href'] > Literal",
        ].map((selector) => ({
          selector: `${selector}[value=${LOCALE_PATH}]`,
          message: HREF_MESSAGE,
        })),
        {
          selector: `JSXAttribute[name.name='href'] TemplateLiteral > TemplateElement:first-child[value.raw=${LOCALE_PATH}]`,
          message: HREF_MESSAGE,
        },
      ],
    },
  },

  // Jogos: nada do site, do Next.js ou de outro jogo.
  {
    files: ["packages/games/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [nextImports, webImports, gameImports] }],
    },
  },
  // Regras dos jogos: sem React, sem interface e sem navegador.
  {
    files: ["packages/games/*/src/rules/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [nextImports, webImports, gameImports, reactImports] },
      ],
      "no-restricted-globals": ["error", ...domGlobals],
    },
  },
  // Interface: nada do site, dos jogos, do SDK ou do Next.js.
  {
    files: ["packages/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [nextImports, webImports, gameImports, sdkImports] },
      ],
    },
  },
  // SDK: TypeScript puro, sem Next.js, sem site e sem jogos.
  {
    files: ["packages/sdk/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [nextImports, webImports, gameImports] }],
    },
  },
);
