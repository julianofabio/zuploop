# ADR-0011 · Monorepo com pnpm workspaces e uv

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [FDD 001 · Fundação](../specs/001-fundacao/plan.md) · Arquivo: `docs/decisions/0011-monorepo-pnpm-uv.md`

## Contexto

O ZupLoop tem site em TypeScript, API em Python, um SDK e um pacote por jogo. Os jogos precisam ser independentes do portal (ADR-0004), mas mudar o contrato do SDK e os jogos que o usam deve ser um único commit. Uma pessoa mantém tudo, com código gerado por IA.

## Decisão

- **Um repositório só** com `apps/web`, `apps/api`, `packages/sdk`, `packages/games/*`, `packages/config`, `content/` e `docs/`.
- **pnpm workspaces** para o lado TypeScript, com a versão fixada no campo `packageManager` do `package.json` e ativada pelo Corepack do Node.js 24. Dependências internas com `workspace:*`.
- **uv** para o lado Python, com `pyproject.toml`, `uv.lock` e `.python-version` em `apps/api`.
- **Sem orquestrador de monorepo** (Turborepo, Nx). Os scripts da raiz chamam os de cada pacote com `pnpm -r` e os do Python com `uv run`.
- Um script `pnpm check` na raiz roda tudo o que o CI roda.

## Alternativas descartadas

- **Repositórios separados por jogo ou por app:** isolamento maior, mas cada mudança no SDK viraria várias versões publicadas e vários pull requests.
- **npm ou Yarn:** funcionam, mas o pnpm instala mais rápido, ocupa menos disco e impede que um pacote use dependência que não declarou.
- **Turborepo ou Nx:** cache de tarefas e grafo de dependências, mas mais uma ferramenta para aprender e configurar; com poucos pacotes, não compensa.
- **pip com requirements.txt ou Poetry:** o uv faz o mesmo com lockfile, instala muito mais rápido e já é amplamente usado e conhecido pelos modelos de IA.

## Consequências

- Um clone, um `pnpm install`, um `uv sync`.
- Fronteiras entre pacotes precisam ser vigiadas por regra (ESLint `no-restricted-imports`), já que tudo está no mesmo lugar.
- Se o build ficar lento com muitos jogos, adotar Turborepo é uma mudança local, registrada num novo ADR.
