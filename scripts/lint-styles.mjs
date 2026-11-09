#!/usr/bin/env node
// Verificador de estilos (padrão de interface §13.2, ADR-0017).
// Fora de packages/ui/src/tokens.css, nenhum CSS pode ter cor, font-family ou tamanho em px.
// px só é aceito de 1 a 3, para bordas, contornos e afastamento do foco.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TOKENS_FILE = "packages/ui/src/tokens.css";

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "out",
  "dist",
  "coverage",
  "docs",
  ".claude",
  "playwright-report",
  "test-results",
  ".lighthouseci",
  ".venv",
]);

// Propriedades em que um nome solto pode ser uma cor.
const COLOR_PROPERTIES =
  /^(color|background(-color)?|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?|outline(-color)?|fill|stroke|box-shadow|text-shadow|text-decoration(-color)?|caret-color|accent-color|column-rule(-color)?)$/;

// Nomes de cor do CSS (CSS Color 4). Palavras-chave como transparent e currentColor são aceitas.
const NAMED_COLORS = new Set(
  (
    "aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet " +
    "brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue " +
    "darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange " +
    "darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise " +
    "darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia " +
    "gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo " +
    "ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan " +
    "lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue " +
    "lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon " +
    "mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue " +
    "mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin " +
    "navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen " +
    "paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red " +
    "rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue " +
    "slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white " +
    "whitesmoke yellow yellowgreen"
  ).split(" "),
);

/** Troca comentários por espaços, mantendo as quebras de linha (para a contagem de linhas). */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "));
}

function lineAt(text, index) {
  return text.slice(0, index).split("\n").length;
}

/**
 * Procura problemas num CSS. Só olha declarações (`propriedade: valor`), não seletores.
 * @param {string} css
 * @param {string} file caminho relativo à raiz do repositório
 * @returns {{ file: string, line: number, rule: string, text: string }[]}
 */
export function findStyleProblems(css, file) {
  if (file.replaceAll("\\", "/") === TOKENS_FILE) return [];
  const source = stripComments(css);
  const problems = [];
  const declaration = /([\w-]+)\s*:\s*([^;{}]*?)\s*(?=;|\})/g;

  for (const match of source.matchAll(declaration)) {
    const property = match[1].toLowerCase();
    const value = match[2];
    const line = lineAt(source, match.index);
    const report = (rule) => problems.push({ file, line, rule, text: `${property}: ${value}` });

    // Só nome de fonte escrito à mão é problema; var(--font-…) vem dos tokens.
    if (property === "font-family" && !/^(var\(--[\w-]+\)|inherit|initial|unset)$/.test(value)) {
      report("font-family");
    }
    if (/#[0-9a-f]{3,8}\b/i.test(value)) report("hex-color");
    if (/\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i.test(value)) report("color-function");
    if (COLOR_PROPERTIES.test(property)) {
      const words = value.toLowerCase().split(/[\s,/()]+/);
      if (words.some((word) => NAMED_COLORS.has(word))) report("named-color");
    }
    const pxValues = [...value.matchAll(/(\d*\.?\d+)px\b/g)].map((m) => Number(m[1]));
    if (pxValues.some((px) => px > 3)) report("px-size");
  }
  return problems;
}

function listCssFiles(root, dir = root) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name))
        files.push(...listCssFiles(root, path.join(dir, entry.name)));
    } else if (entry.name.endsWith(".css")) {
      files.push(path.relative(root, path.join(dir, entry.name)).replaceAll("\\", "/"));
    }
  }
  return files;
}

/** Verifica todos os CSS do repositório e devolve os problemas encontrados. */
export function lintStyles(root) {
  return listCssFiles(root).flatMap((file) =>
    findStyleProblems(readFileSync(path.join(root, file), "utf8"), file),
  );
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const problems = lintStyles(root);
  for (const p of problems) {
    console.error(`${p.file}:${p.line}  ${p.rule}  ${p.text}`);
  }
  if (problems.length > 0) {
    console.error(
      `\n${problems.length} problema(s) de estilo. Use os tokens de ${TOKENS_FILE} (ADR-0017).`,
    );
    process.exit(1);
  }
  console.log("lint:styles: nenhum problema.");
}
