// Mescla das mensagens com o inglês por baixo (RF-I18N-05).
import { describe, expect, it } from "vitest";
import { mergeMessages } from "./messages";

describe("mergeMessages", () => {
  it("usa o inglês onde falta a chave", () => {
    expect(mergeMessages({ a: { b: "en", c: "en" } }, { a: { b: "pt" } })).toEqual({
      a: { b: "pt", c: "en" },
    });
  });

  it("não mistura mensagens compiladas (arrays) com o inglês", () => {
    const compiledEn = ["en", 1, { one: "x" }];
    const compiledPt = ["pt", 1];
    expect(mergeMessages({ a: compiledEn }, { a: compiledPt })).toEqual({ a: compiledPt });
  });
});
