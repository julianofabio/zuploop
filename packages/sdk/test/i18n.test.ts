// Idioma e textos do jogo pelo SDK (T008, RF-I18N-05, RF-I18N-06).
import { describe, expect, it, vi } from "vitest";
import { createI18n } from "../src/i18n";

const en = {
  play: "Play",
  moves: "{count} moves",
  greet: "Hi {name}, {count} left",
  onlyEn: "Only",
};
const pt = { play: "Jogar", moves: "{count} jogadas", greet: "Oi {name}, faltam {count}" };

describe("i18n do SDK", () => {
  it("getLocale devolve o idioma recebido", () => {
    const i18n = createI18n({ locale: "pt", messages: pt, fallback: en, dev: false });
    expect(i18n.getLocale()).toBe("pt");
  });

  it("t devolve o texto do idioma", () => {
    const i18n = createI18n({ locale: "pt", messages: pt, fallback: en, dev: false });
    expect(i18n.t("play")).toBe("Jogar");
  });

  it("t substitui parâmetros", () => {
    const i18n = createI18n({ locale: "pt", messages: pt, fallback: en, dev: false });
    expect(i18n.t("moves", { count: 3 })).toBe("3 jogadas");
    expect(i18n.t("greet", { name: "Ana", count: 2 })).toBe("Oi Ana, faltam 2");
  });

  it("mantém marcador sem parâmetro correspondente", () => {
    const i18n = createI18n({ locale: "pt", messages: pt, fallback: en, dev: false });
    expect(i18n.t("moves")).toBe("{count} jogadas");
  });

  it("chave ausente cai no inglês", () => {
    const i18n = createI18n({ locale: "pt", messages: pt, fallback: en, dev: false });
    expect(i18n.t("onlyEn")).toBe("Only");
  });

  it("chave ausente nos dois devolve a própria chave e avisa só em desenvolvimento", () => {
    const warn = vi.fn();
    const dev = createI18n({ locale: "pt", messages: pt, fallback: en, dev: true, warn });
    expect(dev.t("missing.key")).toBe("missing.key");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.lastCall?.[0]).toContain("missing.key");

    const prodWarn = vi.fn();
    const prod = createI18n({
      locale: "pt",
      messages: pt,
      fallback: en,
      dev: false,
      warn: prodWarn,
    });
    expect(prod.t("missing.key")).toBe("missing.key");
    expect(prodWarn).not.toHaveBeenCalled();
  });

  it("não confunde propriedades herdadas com chaves", () => {
    const i18n = createI18n({ locale: "pt", messages: pt, fallback: en, dev: false });
    expect(i18n.t("toString")).toBe("toString");
  });
});
