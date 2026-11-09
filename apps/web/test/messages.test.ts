// Mensagens de interface (T015, FDD 001 §6.5, RF-I18N-05): o inglês é a referência.
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const dir = path.resolve(import.meta.dirname, "../messages");
const load = (locale: string): unknown =>
  JSON.parse(readFileSync(path.join(dir, `${locale}.json`), "utf8"));

/** Achata { a: { b: "x" } } em ["a.b"]; valores que não são texto viram erro. */
function flatten(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") return [prefix];
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Valor inválido em "${prefix}": só textos e grupos.`);
  }
  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key),
  );
}

const en = new Set(flatten(load("en")));

describe.each(["pt", "es"])("mensagens em %s", (locale) => {
  const keys = new Set(flatten(load(locale)));

  it("não têm chaves que não existem em inglês", () => {
    expect([...keys].filter((key) => !en.has(key))).toEqual([]);
  });

  it("têm todas as chaves do inglês", () => {
    expect([...en].filter((key) => !keys.has(key))).toEqual([]);
  });

  it("não têm textos vazios", () => {
    const empty = flatten(load(locale)).filter((key) => {
      const text = key
        .split(".")
        .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], load(locale));
      return typeof text === "string" && text.trim() === "";
    });
    expect(empty).toEqual([]);
  });
});

describe("mensagens em en", () => {
  it("existem e têm as áreas iniciais", () => {
    const areas = new Set([...en].map((key) => key.split(".")[0]));
    for (const area of ["nav", "catalog", "game", "lang", "errors"]) {
      expect(areas, area).toContain(area);
    }
  });
});
