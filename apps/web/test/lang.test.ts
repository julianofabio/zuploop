// Escolha de idioma na raiz "/" (T019, FDD 001 F1, RF-I18N-02).
// Roda o próprio public/lang.js com navegador falso e confere para onde ele manda.
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(path.resolve(import.meta.dirname, "../public/lang.js"), "utf8");

interface FakeBrowser {
  path?: string;
  saved?: string | null;
  languages?: readonly string[] | undefined;
  language?: string;
  blockedStorage?: boolean;
}

function run(browser: FakeBrowser): ReturnType<typeof vi.fn> {
  return runWithDocument(browser).replace;
}

function runWithDocument(browser: FakeBrowser) {
  const replace = vi.fn();
  const attributes = new Map<string, string>();
  const document = {
    documentElement: {
      setAttribute: (name: string, value: string) => attributes.set(name, value),
    },
  };
  const storage = {
    getItem: (key: string) => (key === "zuploop.locale" ? (browser.saved ?? null) : null),
  };
  const window = {
    get localStorage() {
      if (browser.blockedStorage) throw new DOMException("blocked", "SecurityError");
      return storage;
    },
    location: { replace, pathname: browser.path ?? "/" },
  };
  const navigator = { languages: browser.languages, language: browser.language ?? "" };
  vm.runInNewContext(script, { window, navigator, document });
  return { replace, attributes };
}

describe("lang.js", () => {
  it("navegador em espanhol, primeira visita: vai para /es/", () => {
    expect(run({ languages: ["es-MX", "es"] })).toHaveBeenCalledWith("/es/");
  });

  it("escolha salva vence o navegador", () => {
    expect(run({ saved: "en", languages: ["pt-BR"] })).toHaveBeenCalledWith("/en/");
  });

  it("idioma sem suporte vai para /en/", () => {
    expect(run({ languages: ["fr-FR", "fr"] })).toHaveBeenCalledWith("/en/");
  });

  it("usa o primeiro idioma suportado da lista", () => {
    expect(run({ languages: ["fr-FR", "pt-BR", "es"] })).toHaveBeenCalledWith("/pt/");
  });

  it("ignora escolha salva que não é um idioma do site", () => {
    expect(run({ saved: "fr", languages: ["es"] })).toHaveBeenCalledWith("/es/");
  });

  it("localStorage bloqueado não quebra e usa o navegador", () => {
    expect(run({ blockedStorage: true, languages: ["pt-PT"] })).toHaveBeenCalledWith("/pt/");
  });

  it("sem navigator.languages usa navigator.language", () => {
    expect(run({ languages: undefined, language: "es-AR" })).toHaveBeenCalledWith("/es/");
  });

  it("lista vazia ou valores estranhos vão para /en/", () => {
    expect(run({ languages: [], language: "" })).toHaveBeenCalledWith("/en/");
    expect(run({ languages: ["", "x"] })).toHaveBeenCalledWith("/en/");
  });

  it("não confunde prefixo parecido (ptx, english)", () => {
    expect(run({ languages: ["ptx", "english"] })).toHaveBeenCalledWith("/en/");
  });
});

describe("lang.js nas páginas por idioma", () => {
  it("nunca redireciona fora da raiz", () => {
    const { replace } = runWithDocument({ path: "/en/games/", languages: ["pt-BR"] });
    expect(replace).not.toHaveBeenCalled();
  });

  it("marca no html o idioma sugerido, para reservar o espaço da faixa antes da pintura", () => {
    const { attributes } = runWithDocument({ path: "/en/games/", languages: ["pt-BR"] });
    expect(attributes.get("data-lang-suggest")).toBe("pt");
  });

  it("não marca nada quando o idioma já é o da página", () => {
    const { attributes } = runWithDocument({ path: "/pt/jogos/", languages: ["pt-BR"] });
    expect(attributes.size).toBe(0);
  });

  it("a escolha salva igual à página não gera sugestão", () => {
    const { attributes } = runWithDocument({
      path: "/en/games/",
      saved: "en",
      languages: ["pt-BR"],
    });
    expect(attributes.size).toBe(0);
  });

  it("caminho fora dos idiomas não faz nada", () => {
    const { replace, attributes } = runWithDocument({ path: "/404.html", languages: ["pt"] });
    expect(replace).not.toHaveBeenCalled();
    expect(attributes.size).toBe(0);
  });
});
