// Idioma sugerido para a página (T020, FDD 001 F3, RF-I18N-04).
import { describe, expect, it } from "vitest";
import { browserLocale, suggestedLocale } from "./detect";

describe("browserLocale", () => {
  it("usa o primeiro idioma suportado do navegador", () => {
    expect(browserLocale(["fr-FR", "es-MX", "pt"])).toBe("es");
    expect(browserLocale(["pt-BR"])).toBe("pt");
  });

  it("devolve null sem idioma suportado", () => {
    expect(browserLocale(["fr-FR", "de"])).toBeNull();
    expect(browserLocale([])).toBeNull();
  });
});

describe("suggestedLocale", () => {
  it("sugere o idioma do navegador quando difere da página e não há escolha", () => {
    expect(suggestedLocale("en", null, ["pt-BR"])).toBe("pt");
  });

  it("não sugere quando o navegador está no idioma da página", () => {
    expect(suggestedLocale("pt", null, ["pt-BR"])).toBeNull();
  });

  it("a escolha salva vale mais que o navegador", () => {
    expect(suggestedLocale("en", "en", ["pt-BR"])).toBeNull();
    expect(suggestedLocale("pt", "es", ["pt-BR"])).toBe("es");
  });

  it("escolha salva inválida é ignorada", () => {
    expect(suggestedLocale("en", "fr", ["es"])).toBe("es");
  });

  it("navegador sem idioma suportado não gera sugestão", () => {
    expect(suggestedLocale("en", null, ["fr-FR"])).toBeNull();
  });
});
