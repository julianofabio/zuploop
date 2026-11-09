// Manifesto do jogo de exemplo: oculto, save na versão 2 e migração da versão 1 (T025, F5).
import { describe, expect, it } from "vitest";
import { manifest } from "../src/manifest";

describe("manifesto do jogo de exemplo", () => {
  it("é oculto em produção e grava na versão 2", () => {
    expect(manifest.id).toBe("example");
    expect(manifest.status).toBe("hidden");
    expect(manifest.saveVersion).toBe(2);
  });

  it("migra o save da versão 1 ({ count }) para a 2 ({ moves, score })", () => {
    expect(manifest.migrateSave?.(1, { count: 3 })).toEqual({ moves: 3, score: 3 });
  });

  it("migração de dado estranho lança erro (o SDK descarta o save)", () => {
    expect(() => manifest.migrateSave?.(1, { other: true })).toThrow();
    expect(() => manifest.migrateSave?.(7, { count: 3 })).toThrow();
  });

  it("tem mensagens nos três idiomas, com as mesmas chaves de interface", async () => {
    const [pt, es, en] = await Promise.all([
      manifest.messages.pt(),
      manifest.messages.es(),
      manifest.messages.en(),
    ]);
    expect(Object.keys(pt.ui).sort()).toEqual(Object.keys(en.ui).sort());
    expect(Object.keys(es.ui).sort()).toEqual(Object.keys(en.ui).sort());
    expect(en.howToPlay.rules.length).toBeGreaterThan(0);
  });
});
