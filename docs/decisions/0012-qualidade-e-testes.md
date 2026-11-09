# ADR-0012 · Ferramentas de qualidade e testes

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [FDD 001 · Fundação](../specs/001-fundacao/plan.md) · Arquivo: `docs/decisions/0012-qualidade-e-testes.md`

## Contexto

O código é gerado por IA e publicado só com testes passando (RNF-09). As ferramentas precisam ser consolidadas, rápidas e conhecidas pelos modelos (ADR-0007).

## Decisão

| Área | TypeScript | Python |
| --- | --- | --- |
| Tipos | TypeScript 5 em modo `strict`, sem `any` explícito | mypy em modo estrito no código da API |
| Lint | ESLint 9 (configuração flat) com regras do Next.js, React Hooks, jsx-a11y e `no-restricted-imports` para as fronteiras entre pacotes | Ruff |
| Formatação | Prettier 3 | Ruff format |
| Unidade e componentes | Vitest 3 e Testing Library | pytest |
| Ponta a ponta | Playwright (Chromium e WebKit) com axe | — |
| Desempenho e SEO | Lighthouse CI nas páginas principais | — |
| Segredos | gitleaks no CI | gitleaks no CI |

- O CI (GitHub Actions) roda tudo em cada push e pull request; nada é publicado por ele (ADR-0009).
- `pnpm check` na raiz roda o mesmo conjunto localmente.
- Testes são escritos antes do código, a partir dos critérios de aceite do FDD.

## Alternativas descartadas

- **Jest:** maduro, mas mais lento e com mais configuração para ESM e TypeScript; o Vitest usa a mesma sintaxe.
- **Cypress:** bom, mas sem WebKit (Safari), e o público usa muito iPhone.
- **Biome no lugar de ESLint e Prettier:** mais rápido, mas sem as regras de acessibilidade e de Next.js que o projeto quer.
- **Black e Flake8:** o Ruff cobre os dois com uma ferramenta só.

## Consequências

- Um padrão único que a IA consegue seguir e verificar sozinha antes de dizer que terminou.
- O CI fica mais longo com Playwright e Lighthouse; se passar de 10 minutos, separar em jobs paralelos.
