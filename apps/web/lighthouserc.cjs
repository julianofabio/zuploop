// Lighthouse CI (FDD 001 §9, T031): metas de desempenho e acessibilidade no celular.
// Mede o build estático servido como no Nginx (com gzip). Antes: `pnpm build:hidden`.
module.exports = {
  ci: {
    collect: {
      startServerCommand: "node scripts/serve-out.mjs 4174",
      startServerReadyPattern: "out/ em",
      url: [
        "http://localhost:4174/pt/",
        "http://localhost:4174/pt/jogos/",
        "http://localhost:4174/pt/jogos/exemplo/",
      ],
      numberOfRuns: 1,
      settings: {
        // Celular é o padrão do Lighthouse (tela pequena e rede/CPU limitadas).
        chromeFlags: "--no-sandbox --headless=new",
      },
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        // JS inicial ≤ 150 KB comprimido (o jogo fica fora: só baixa ao tocar em "Jogar").
        "resource-summary:script:size": ["error", { maxNumericValue: 153600 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
};
