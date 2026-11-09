# Tarefas · 001 Fundação

Base: [spec.md](spec.md) e [plan.md (FDD)](plan.md). Faça **uma tarefa por vez**, na ordem. Ao terminar, marque `[x]` e anote a data.

**Como ler cada tarefa**

- **Arquivos:** o que cria ou altera.
- **Teste antes:** o teste que nasce primeiro e falha até a tarefa estar pronta.
- **Pronto quando:** o critério para marcar como feita.
- **Verificar:** o comando que prova.
- `[P]` = pode ser feita em paralelo com a tarefa anterior do mesmo grupo.

**Regras para toda tarefa:** seguir o `AGENTS.md`; nada fora do escopo da tarefa; `pnpm check` passando antes de marcar; nada de texto de interface fora dos arquivos de idioma.

---

## G1 · Monorepo e ferramentas

- [x] **T001 · Esqueleto do monorepo** (8/11/2026)
  - Arquivos: `package.json` (raiz, com `packageManager` pnpm 10 e `engines.node` 24), `pnpm-workspace.yaml`, `.nvmrc`, `.gitignore` (com `.env`, `node_modules`, `out`, `.next`, `.venv`), `.editorconfig`, `README.md` (como rodar).
  - Teste antes: —
  - Pronto quando: `pnpm install` roda numa máquina limpa e cria o `pnpm-lock.yaml`.
  - Verificar: `corepack enable && pnpm install`

- [x] **T002 · Configurações compartilhadas** (8/11/2026)
  - Arquivos: `packages/config/` com `tsconfig.base.json` (`strict`, `noUncheckedIndexedAccess`), `eslint.config.js` (ESLint 9 flat, regras de React Hooks, jsx-a11y e `no-restricted-imports` entre pacotes), `prettier.config.js`.
  - Teste antes: um arquivo de exemplo com `any` e um import proibido fazem `pnpm lint` falhar.
  - Pronto quando: os scripts `lint`, `typecheck` e `format` da raiz funcionam.
  - Verificar: `pnpm lint && pnpm typecheck`

- [x] **T003 · AGENTS.md e CLAUDE.md no repositório** (8/11/2026)
  - Arquivos: `AGENTS.md`, `CLAUDE.md` e a pasta `docs/` (do pacote de documentação) na raiz do repositório.
  - Pronto quando: os comandos do `AGENTS.md` existem de fato (ou estão marcados como "a partir de Txxx").
  - Verificar: leitura.

## G2 · Integração contínua mínima

- [x] **T004 · CI com lint, tipos e segredos** (8/11/2026)
  - Arquivos: `.github/workflows/ci.yml` com os jobs `web` (install, lint, typecheck) e `secrets` (gitleaks).
  - Teste antes: um commit numa branch de teste com um segredo falso (`AKIA…`) faz o job `secrets` falhar.
  - Pronto quando: o CI fica verde no push da `main`.
  - Verificar: aba Actions do GitHub.

## G3 · SDK do portal

- [x] **T005 · Tipos e contrato do SDK** (8/11/2026)
  - Arquivos: `packages/sdk/package.json` (`@zuploop/sdk`), `src/types.ts` com `Locale`, `GameManifest`, `GameMessages`, `GameProps`, `PortalSdk`, `AdResult`, `FavoriteRef`, `GameEventName`, `SDK_VERSION` (FDD 6.1 e 6.2).
  - Teste antes: teste de tipos (`expectTypeOf`) garantindo a forma do contrato.
  - Pronto quando: os tipos compilam e são exportados por `src/index.ts`.
  - Verificar: `pnpm --filter @zuploop/sdk test`

- [x] **T006 · Salvamento com envelope e IndexedDB** (8/11/2026)
  - Arquivos: `src/storage/envelope.ts`, `src/storage/idb.ts` (`idb-keyval`), `src/storage/memory.ts`, `src/storage/index.ts`.
  - Teste antes (com `fake-indexeddb`):
    - grava e lê no slot `main` e em slot nomeado;
    - `clear` apaga;
    - grava no máximo uma vez a cada 300 ms por slot, e grava o pendente no `flush`;
    - save acima de 256 KB é recusado sem lançar erro e registra `save_too_large`;
    - sem IndexedDB, usa memória e `persistent` vira `false`;
    - `QuotaExceededError` não lança e registra `storage_quota`.
  - Pronto quando: todos os testes passam.
  - Verificar: `pnpm --filter @zuploop/sdk test`

- [x] **T007 · Migração e descarte de saves** (8/11/2026) `[P]`
  - Arquivos: `src/storage/migrate.ts`.
  - Teste antes:
    - save com `v` menor chama `migrateSave` e regrava com a versão nova;
    - `migrateSave` que lança → descarta, registra `save_discarded`, devolve `null`;
    - save com `v` maior → descarta e devolve `null`;
    - jogo sem `migrateSave` e save antigo → descarta.
  - Pronto quando: todos os testes passam.
  - Verificar: `pnpm --filter @zuploop/sdk test`

- [x] **T008 · Idioma e textos do jogo** (8/11/2026)
  - Arquivos: `src/i18n.ts`.
  - Teste antes: `getLocale` devolve o idioma recebido; `t()` substitui parâmetros; chave ausente cai no inglês; ausente nos dois devolve a chave e avisa só em desenvolvimento.
  - Pronto quando: testes passam.
  - Verificar: `pnpm --filter @zuploop/sdk test`

- [x] **T009 · Implementações provisórias e `createPortalSdk`** (8/11/2026) `[P]`
  - Arquivos: `src/ads.ts`, `src/favorites.ts`, `src/events.ts`, `src/create.ts`.
  - Teste antes: `commercialBreak` e `rewardedBreak` resolvem `{ shown: false, rewarded: true }`; favoritos em memória ligam e desligam; `track` escreve no console só em desenvolvimento; nenhuma função rejeita; `createPortalSdk` monta tudo e faz `flush` em `pagehide`.
  - Pronto quando: testes passam e o pacote tem cobertura acima de 90%.
  - Verificar: `pnpm --filter @zuploop/sdk test -- --coverage`

## G4 · Biblioteca de interface

- [x] **T010 · Pacote `@zuploop/ui` com tokens e base** (8/11/2026)
  - Arquivos: `packages/ui/package.json`, `src/tokens.css` (todos os valores das seções 3 a 5 do [padrão de interface](../../design-system.md)), `src/base.css` (normalização, foco, `.visually-hidden`, link "Pular para o conteúdo").
  - Teste antes: teste que lê `tokens.css` e confere que cada token citado no padrão existe.
  - Pronto quando: os tokens batem com o padrão, inclusive alto contraste, tamanho de texto e modo tranquilo.
  - Verificar: `pnpm --filter @zuploop/ui test`

- [x] **T011 · Verificador de estilos** (8/11/2026) `[P]`
  - Arquivos: `scripts/lint-styles.mjs`, script `lint:styles` na raiz, passo no CI.
  - Teste antes: um CSS de exemplo com `#fff` fora de `tokens.css` faz o script falhar; `tokens.css` passa.
  - Pronto quando: o script roda no CI.
  - Verificar: `pnpm lint:styles`

- [x] **T012 · Ícones** (8/11/2026)
  - Arquivos: `packages/ui/src/icons/*.tsx` com o conjunto base da seção 8 do padrão (traço 2 px, grade 24, `currentColor`).
  - Teste antes: cada ícone renderiza com `aria-hidden` por padrão e aceita `title` quando usado sozinho.
  - Pronto quando: todos os ícones da lista existem.
  - Verificar: `pnpm --filter @zuploop/ui test`

- [x] **T013 · Componentes básicos** (8/11/2026)
  - Arquivos: em `packages/ui/src/components/`: `Button`, `IconButton`, `Link`, `Badge`, `GameCard`, `Banner`, `Toast`, `Sheet` (cada um com `.tsx`, `.module.css`, teste e exemplo), seguindo a seção 9 do padrão.
  - Teste antes, por componente: variantes por `data-*`, estados (desabilitado, carregando), rótulos acessíveis, foco preso no `Sheet` e retorno ao fechar, `Toast` com `role="status"`, axe sem falhas.
  - Pronto quando: os oito componentes passam nos testes e no axe.
  - Verificar: `pnpm --filter @zuploop/ui test`

## G5 · Site em Next.js

- [x] **T014 · App Next.js com exportação estática** (8/11/2026)
  - Arquivos: `apps/web/package.json` (`@zuploop/web`), `next.config.ts` (`output: "export"`, `trailingSlash: true`, `images.unoptimized: true`), `tsconfig.json`.
  - Teste antes: —
  - Pronto quando: `pnpm build` gera `apps/web/out/` sem erros.
  - Verificar: `pnpm build && ls apps/web/out`

- [x] **T015 · Idiomas com next-intl, sem middleware** (8/11/2026)
  - Arquivos: `src/i18n/config.ts` (`pt`, `es`, `en`), `src/i18n/request.ts`, `messages/{pt,es,en}.json` com as chaves iniciais (`nav.*`, `catalog.*`, `game.*`, `lang.*`, `errors.*`), `app/[locale]/layout.tsx` com `generateStaticParams` e `setRequestLocale`, `<html lang>`.
  - Teste antes: teste de mensagens: toda chave de `pt` e `es` existe em `en` e vice-versa.
  - Pronto quando: `out/pt/index.html`, `out/es/index.html` e `out/en/index.html` existem com o `lang` certo.
  - Verificar: `pnpm test && pnpm build`

- [x] **T016 · Fontes e estilos globais** (8/11/2026) `[P]`
  - Arquivos: fontes Atkinson Hyperlegible e Lexend via `next/font`; import de `@zuploop/ui/tokens.css` e `base.css` no layout.
  - Teste antes: —
  - Pronto quando: o build não faz nenhum pedido a `fonts.googleapis.com`; a página usa as duas fontes.
  - Verificar: `grep -r "fonts.googleapis" apps/web/out` vazio.

## G6 · Rotas e idiomas

- [x] **T017 · Registro de rotas** (8/11/2026)
  - Arquivos: `src/routes/registry.ts` (`home`, `catalog`, `game`, `settings`, `not-found` com slugs por idioma), `getPath`, `getAlternates`.
  - Teste antes: caminhos únicos em cada idioma; `getAlternates` devolve a mesma página nos três idiomas; página de jogo usa os slugs do manifesto; conflito de slug entre jogos falha o teste.
  - Pronto quando: testes passam.
  - Verificar: `pnpm --filter @zuploop/web test`

- [x] **T018 · Rota `[...slug]` e `LocalizedLink`** (8/11/2026)
  - Arquivos: `app/[locale]/[...slug]/page.tsx` com `generateStaticParams` a partir do registro; `components/LocalizedLink.tsx`; regra de lint proibindo `href` iniciado por `/pt/`, `/es/` ou `/en/`.
  - Teste antes: `LocalizedLink page="catalog"` gera `/es/juegos/` em espanhol; a regra de lint pega um `href="/pt/jogos/"`.
  - Pronto quando: `out/pt/jogos/index.html`, `out/es/juegos/index.html` e `out/en/games/index.html` existem.
  - Verificar: `pnpm test && pnpm build`

- [x] **T019 · Raiz `/` com escolha de idioma** (8/11/2026)
  - Arquivos: `app/(root)/layout.tsx`, `app/(root)/page.tsx` (logotipo e três links, `hreflang="x-default"`), `public/lang.js`.
  - Teste antes (unidade de `lang.js`): escolha salva vence; `es-MX` vai para `es`; `fr-FR` vai para `en`; `localStorage` bloqueado não quebra.
  - Pronto quando: abrir `/` redireciona com `location.replace`; sem JavaScript, os três links aparecem.
  - Verificar: `pnpm test`

- [x] **T020 · Seletor de idioma e faixa de sugestão** (8/11/2026)
  - Arquivos: `components/LanguageSwitcher.tsx`, `components/LanguageSuggestion.tsx` (usa `Banner`).
  - Teste antes: trocar para espanhol em `/pt/jogos/` leva a `/es/juegos/` e salva `es`; a faixa aparece quando o idioma do navegador difere da página, não redireciona, e "Continuar" salva e esconde; espaço reservado (sem deslocar a página).
  - Pronto quando: testes de componente passam.
  - Verificar: `pnpm --filter @zuploop/web test`

- [x] **T021 · Página 404 por idioma** (8/11/2026) `[P]`
  - Arquivos: entrada `not-found` no registro; `app/not-found.tsx` para fora dos idiomas.
  - Pronto quando: `out/pt/404/index.html` e equivalentes existem, com links para início e jogos.
  - Verificar: `pnpm build`

## G7 · Layout e páginas

- [x] **T022 · Barra inferior, cabeçalho e rodapé** (8/11/2026)
  - Arquivos: em `packages/ui`: `BottomNav`, `SiteHeader`, `SiteFooter`; montagem no `app/[locale]/layout.tsx` do site.
  - Teste antes: item ativo com `aria-current="page"`; barra inferior só abaixo de 1024 px e cabeçalho com navegação a partir de 1024 px; área segura do iPhone respeitada.
  - Pronto quando: bate com as telas [Início](../../prototipo/png/Main.png) e [Site · Início](../../prototipo/png/SiteInicio.png) na estrutura (conteúdo de desafio e favoritos fica para depois).
  - Verificar: `pnpm --filter @zuploop/ui test` e revisão visual.

- [x] **T023 · Página inicial e catálogo** (8/11/2026)
  - Arquivos: `src/games/registry.ts`; páginas `home` e `catalog` lendo os manifestos (`GameCard`; jogos `coming_soon` com selo "Em breve" e sem link; `hidden` só com `ZUPLOOP_SHOW_HIDDEN_GAMES=true`).
  - Teste antes: o catálogo lista jogos `available` e `coming_soon`, esconde `hidden` por padrão e mostra com a variável ligada.
  - Pronto quando: bate com as telas [Jogos](../../prototipo/png/Jogos.png) e [Site · Jogos](../../prototipo/png/SiteJogos.png) na estrutura.
  - Verificar: `pnpm --filter @zuploop/web test`

- [ ] **T024 · Ajustes (só idioma)** `[P]`
  - Arquivos: página `settings` com a escolha de idioma em lista de opções.
  - Pronto quando: trocar o idioma em Ajustes tem o mesmo efeito do seletor do cabeçalho.
  - Verificar: `pnpm --filter @zuploop/web test`

## G8 · Jogo de exemplo e GameHost

- [ ] **T025 · Pacote do jogo de exemplo**
  - Arquivos: `packages/games/example/` com `manifest.ts` (`status: "hidden"`, `saveVersion: 2`, `migrateSave` de 1 para 2), `rules/` (um contador de jogadas com uma jogada inválida possível), `Game.tsx` (usa só `sdk` e `@zuploop/ui`), `messages/{pt,es,en}.ts`.
  - Teste antes (regras puras): jogada válida soma; inválida é recusada; fim do jogo em 10 jogadas.
  - Pronto quando: testes passam e o ESLint não acusa import proibido.
  - Verificar: `pnpm --filter @zuploop/game-example test && pnpm lint`

- [ ] **T026 · Página de jogo genérica**
  - Arquivos: página `game` no registro, com título, descrição e "Como jogar" (regras, controles e dica) em HTML, a partir de `GameMessages`, e o botão "Jogar".
  - Teste antes: o HTML gerado da página contém o "Como jogar" no idioma e nenhum script do jogo.
  - Pronto quando: `out/pt/jogos/exemplo/index.html` existe quando o build mostra ocultos.
  - Verificar: `ZUPLOOP_SHOW_HIDDEN_GAMES=true pnpm build`

- [ ] **T027 · GameHost**
  - Arquivos: `components/GameHost.tsx` (`"use client"`), `components/GameBar.tsx` em `packages/ui`.
  - Teste antes:
    - o `import()` do jogo só acontece ao tocar em "Jogar";
    - abre em tela cheia sem barra inferior, com foco no jogo;
    - "Voltar" e o botão voltar do navegador fecham e devolvem o foco ao "Jogar";
    - falha ao baixar mostra erro com "Tentar de novo" e registra `game_load_failed`;
    - exceção dentro do jogo cai no error boundary com "Voltar" e "Tentar de novo";
    - aviso "Não foi possível recuperar sua partida anterior." quando o save é descartado;
    - aviso único quando `storage.persistent` é `false`.
  - Pronto quando: testes de componente passam.
  - Verificar: `pnpm --filter @zuploop/web test`

## G9 · SEO

- [ ] **T028 · Metadados e hreflang**
  - Arquivos: `generateMetadata` em cada página (título e descrição únicos, `canonical`, `alternates.languages` com pt, es, en e `x-default` → `/`), a partir do registro e de `SITE_URL`.
  - Teste antes: teste que lê o HTML de `out/` e confere `canonical` e os quatro `hreflang` em três páginas.
  - Pronto quando: teste passa.
  - Verificar: `pnpm build && pnpm --filter @zuploop/web test:html`

- [ ] **T029 · Mapas do site e robots.txt** `[P]`
  - Arquivos: geração no build de `sitemap.xml` (índice) e `sitemap-pt.xml`, `sitemap-es.xml`, `sitemap-en.xml` com alternates; `public/robots.txt` apontando para o índice.
  - Teste antes: os mapas listam todas as páginas públicas, sem jogos `hidden`.
  - Pronto quando: teste passa.
  - Verificar: `pnpm build && pnpm --filter @zuploop/web test:html`

## G10 · Testes de ponta a ponta

- [ ] **T030 · Playwright e axe**
  - Arquivos: `apps/web/playwright.config.ts` (Chromium e WebKit; viewports 390 × 844 e 1280 × 800; servidor estático de `out/`), `e2e/*.spec.ts` com todos os cenários da seção 11 do FDD; axe em início, catálogo, jogo e ajustes.
  - Pronto quando: todos os cenários passam nos dois navegadores; axe sem falhas A ou AA.
  - Verificar: `pnpm test:e2e`

- [ ] **T031 · Lighthouse no CI** `[P]`
  - Arquivos: configuração do Lighthouse CI para `/pt/`, `/pt/jogos/` e a página do jogo de exemplo; jobs `web` do CI com build e e2e.
  - Pronto quando: metas da seção 9 do FDD cumpridas (LCP ≤ 2,5 s, CLS ≤ 0,1, acessibilidade 100, JS inicial ≤ 150 KB).
  - Verificar: CI verde.

## G11 · API (ver decisão F001-Q2 na spec)

- [ ] **T032 · Projeto Python**
  - Arquivos: `apps/api/pyproject.toml`, `.python-version` (3.13), `uv.lock`, `app/__init__.py`; Ruff, mypy e pytest configurados.
  - Pronto quando: `uv sync` funciona e as ferramentas rodam sem arquivos para checar.
  - Verificar: `cd apps/api && uv sync && uv run ruff check . && uv run mypy app`

- [ ] **T033 · Configurações e logs**
  - Arquivos: `app/settings.py` (pydantic-settings; monta a URL do banco a partir de `POSTGRES_*`, `DB_HOST` e `DB_PORT`), `app/logging.py` (JSON com `requestId`).
  - Teste antes: variável obrigatória faltando para o processo com mensagem que diz qual; o valor da senha nunca aparece no erro nem no log.
  - Pronto quando: testes passam.
  - Verificar: `uv run pytest`

- [ ] **T034 · Erros e X-Request-ID**
  - Arquivos: `app/errors.py` (Problem Details, ADR-0016, catálogo de `code`), middleware de `X-Request-ID`, CORS a partir de `API_CORS_ORIGINS`.
  - Teste antes: erro inesperado vira `500` `internal_error` sem detalhes; `X-Request-ID` recebido é devolvido; sem ele, um novo é criado; origem fora da lista não recebe cabeçalhos de CORS.
  - Pronto quando: testes passam.
  - Verificar: `uv run pytest`

- [ ] **T035 · Banco, Alembic e rotas de saúde**
  - Arquivos: `app/db.py` (SQLAlchemy 2.0 assíncrono com asyncpg), `alembic.ini`, `migrations/` com revisão inicial vazia, `app/routes/health.py` (`/health`, `/ready`, `/version`), `app/main.py`.
  - Teste antes: `/health` 200; `/ready` 200 com banco e 503 `database_unavailable` sem banco (em até 2 s); `/version` devolve `APP_VERSION`.
  - Pronto quando: testes passam contra o PostgreSQL do compose.
  - Verificar: `docker compose up -d db && uv run alembic upgrade head && uv run pytest`

- [ ] **T036 · Job da API no CI** `[P]`
  - Arquivos: job `api` em `ci.yml` (uv, Ruff, mypy, pytest com serviço PostgreSQL 17).
  - Pronto quando: CI verde.
  - Verificar: aba Actions.

## G12 · Docker e ambiente local

- [ ] **T037 · Imagem do site**
  - Arquivos: `apps/web/Dockerfile` (Node 24 gera `out/`; final `nginxinc/nginx-unprivileged` na porta 8080), `nginx/default.conf.template` (`try_files`, 404 por idioma, cache, gzip, cabeçalhos de segurança e CSP do FDD 8.5, `/healthz`), `nginx/config.json.template`.
  - Teste antes: script `scripts/smoke-web.sh` que sobe a imagem e confere `/healthz`, `/pt/`, um 404 em `/pt/nao-existe/`, `Cache-Control` de um arquivo em `/_next/static/` e de `/config.json`, e a presença da CSP.
  - Pronto quando: o script passa.
  - Verificar: `scripts/smoke-web.sh`

- [ ] **T038 · Imagem da API** `[P]`
  - Arquivos: `apps/api/Dockerfile` (`python:3.13-slim`, uv, usuário sem privilégios, porta 8000, `alembic upgrade head` antes do Uvicorn).
  - Pronto quando: a imagem sobe e responde `/health` com um banco disponível.
  - Verificar: `docker compose up api` (após T039)

- [ ] **T039 · docker-compose e .env.example**
  - Arquivos: `docker-compose.yml` (`web`, `api`, `db` com verificações de saúde, `db` só em `127.0.0.1`, volume `db-data`), `.env.example` com as variáveis da seção 6.8 do FDD e valores falsos.
  - Teste antes: —
  - Pronto quando: o cenário "Subir tudo com um comando" do FDD passa numa máquina limpa.
  - Verificar: `cp .env.example .env && docker compose up --build`, depois `curl -f localhost:8080/pt/ && curl -f localhost:8000/ready`

- [ ] **T040 · Build das imagens no CI** `[P]`
  - Arquivos: job `docker` em `ci.yml` (build das duas imagens, sem publicar).
  - Pronto quando: CI verde.
  - Verificar: aba Actions.

## G13 · Publicação

- [ ] **T041 · Roteiro de publicação**
  - Arquivos: `docs/runbooks/publicar.md` com:
    - gerar as imagens com a tag `AAAA.MM.DD-<commit>`;
    - enviar ao registro (decisão F001-Q1);
    - criar Secret e ConfigMap com as variáveis do `.env`;
    - aplicar no cluster;
    - Ingress com HTTPS (cert-manager) e limite de requisições por IP e rota;
    - conferir `/healthz`, `/ready` e `/version`;
    - como voltar para a versão anterior.
  - Pronto quando: o roteiro foi seguido uma vez e `https://zuploop.com/` responde.
  - Verificar: abrir o site e `curl -f https://zuploop.com/healthz`

- [ ] **T042 · Fechamento da spec**
  - Arquivos: `docs/specs/README.md` (001 como "Feita"), ADRs 0011 a 0018 como "Aceito", checklist da seção 11 do FDD marcado.
  - Pronto quando: todos os itens marcados.
  - Verificar: leitura.
