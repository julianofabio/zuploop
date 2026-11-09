# Tracker · ZupLoop

| Campo | Valor |
| --- | --- |
| Tipo | Rastreabilidade (transversal) |
| Pergunta que responde | *De onde veio cada coisa e onde ela está no código?* |
| Atualizado em | 9 de novembro de 2026 |
| Estado do código | 001 implementada até a T040 (branch `feature/001-fundacao`); decisões em `specs/001-fundacao/notas.md` |

Este arquivo liga cada item do projeto (requisito, decisão, regra, questão) à **origem** (sessão de definição, PRD, RFC, ADR, FDD) e ao **destino** (spec, tarefa, código e teste). Ele não repete o conteúdo dos documentos: só aponta para eles.

## Como usar

- **Ao fechar uma tarefa:** troque os caminhos "planejado" pelos caminhos reais e preencha o teste que prova o item. O status passa a "Feito".
- **Ao criar um requisito, ADR ou questão:** acrescente a linha aqui no mesmo commit.
- **Ao decidir uma questão em aberto:** registre a data, quem decidiu e o documento que mudou.
- **Item sem origem conhecida:** escreva "Origem a confirmar". Não invente a origem.

**Status:** `Sem spec` (nenhuma spec cobre) · `A fazer` · `Planejado` (já tem tarefa) · `Em andamento` · `Feito`.

---

## 1. Fontes de origem

| ID | Fonte | O que contém | Onde está |
| --- | --- | --- | --- |
| S-DEF | Sessões de definição, de 6 a 8 de novembro de 2026 (Juliano Fabio Miranda e Claude) | Escolhas de produto e de stack, alternativas descartadas, questões abertas | **A transcrição não está no repositório.** Os resumos estão no RFC-001 (Alternativas e Questões em aberto) e nos ADRs |
| S-PLANO | Plano da Plataforma de Jogos | Negócio, estimativas, cronograma | [artifact](https://claude.ai/artifact/9YBHPgcCpV3hEHqrxYzQw7) |
| S-TELAS | Telas do ZupLoop | Protótipo visual | [artifact](https://claude.ai/artifact/WctBmtoD4uAnnXeZha8Gof) · cópia em [prototipo/](prototipo/README.md) |
| PRD | PRD do ZupLoop | Requisitos RF e RNF, fases, riscos | [prd.md](prd.md) |
| RFC-001 | Arquitetura técnica | Proposta técnica, ADRs 0001 a 0010, Q-01 a Q-09 | [rfcs/0001-arquitetura-tecnica.md](rfcs/0001-arquitetura-tecnica.md) |
| DS | Padrão de interface | Tokens, componentes, acessibilidade, ADR-0018 | [design-system.md](design-system.md) |
| FDD-001 | Plano da 001 Fundação | Contratos, fluxos, ADRs 0011 a 0017, F001-Q1 a Q3 | [specs/001-fundacao/plan.md](specs/001-fundacao/plan.md) |

Cadeia de derivação: **S-DEF → PRD (com S-PLANO) → RFC-001 → ADRs → spec/FDD → tasks → código e testes.**

---

## 2. Requisitos da feature 001 (detalhado)

| Requisito | Origem | Spec | Tarefas | Código | Teste que prova | Status |
| --- | --- | --- | --- | --- | --- | --- |
| RF-I18N-01 Endereços por idioma | PRD · ADR-0013 | 001 | T015, T017, T018 | `apps/web/src/i18n/config.ts`, `apps/web/src/routes/registry.ts`, `apps/web/src/app/[locale]/[section]/page.tsx` e `[section]/[item]/page.tsx` | Unidade do registro (caminhos únicos, slugs sem conflito); build gera `out/es/juegos/` | Feito |
| RF-I18N-02 Escolha do idioma | PRD · ADR-0013 · FDD F1 | 001 | T019 | `apps/web/public/lang.js`, `apps/web/src/app/(root)/page.tsx` | Unidade de `lang.js`; e2e "Escolha de idioma pela raiz" (3 cenários) | Feito |
| RF-I18N-03 Seletor de idioma | PRD · FDD F2 | 001 | T020, T024 | `apps/web/src/components/LanguageSwitcher.tsx`, página `settings` | Componente; e2e "Mesma página em outro idioma" | Feito |
| RF-I18N-04 Sugestão de idioma | PRD · FDD F3 | 001 | T020 | `apps/web/src/components/LanguageSuggestion.tsx` (usa `Banner`) | Componente; e2e "Faixa de sugestão sem redirecionar" | Feito |
| RF-I18N-05 Textos traduzíveis | PRD · AGENTS | 001 | T015, T008, T025 | `apps/web/messages/{pt,es,en}.json`, `packages/games/example/src/messages/` | Teste de chaves pt/es ↔ en | Feito |
| RF-I18N-06 Idioma no jogo | PRD · ADR-0014 | 001 | T008 | `packages/sdk/src/i18n.ts` | Unidade de `getLocale` e `t()` com fallback | Feito |
| RF-SDK-01 Contrato único | PRD · ADR-0004 · ADR-0014 | 001 | T002, T005, T009 | `packages/sdk/src/types.ts`, `packages/sdk/src/create.ts`, regra `no-restricted-imports` | `expectTypeOf` do contrato; lint pega import proibido | Feito |
| RF-SDK-02 Salvamento automático | PRD · ADR-0005 · ADR-0014 | 001 | T006, T027 | `packages/sdk/src/storage/{envelope,idb,memory,index}.ts` | Unidade com `fake-indexeddb`; e2e "Continuar de onde parei" | Feito |
| RF-SDK-03 Versão do save | PRD · ADR-0014 · FDD F5 | 001 | T006, T007, T025, T027 | `packages/sdk/src/storage/migrate.ts`, `migrateSave` do jogo de exemplo | Unidade de migração e descarte; e2e "Save de versão mais nova" | Feito |
| RF-SDK-04 Regras separadas | PRD · ADR-0004 · AGENTS | 001 | T002, T025 | `packages/games/example/src/rules/` | Unidade: jogada válida, inválida e fim | Feito |
| RF-NAV-01 Página inicial (parcial) | PRD | 001, 007, 008 | T023 | Página `home` | Componente da home | Feito |
| RF-NAV-02 Catálogo | PRD | 001 | T013, T023 | `apps/web/src/games/registry.ts`, `GameCard`, `Badge` | Componente: `available`, `coming_soon` e `hidden` | Feito, com busca e filtros (T043) |
| RF-NAV-03 Página por jogo | PRD · ADR-0001 | 001, 003 | T026, T027 | Página `game` | Teste do HTML (sem script do jogo); e2e "Jogo só carrega ao tocar em Jogar" | Feito |
| RF-NAV-04 Navegação no celular | PRD · DS 6 e 7 | 001 | T022, T027 | `packages/ui`: `BottomNav`, `SiteHeader`, `GameBar`; `apps/web/src/components/GameHost.tsx` e `GameOverlay.tsx` | Componente: `aria-current`, pontos de quebra, foco | Feito |
| RF-AJ-03 "Como jogar" na página (estrutura) | PRD | 001 (estrutura), 002 | T026 | Página `game` a partir de `GameMessages` | Teste do HTML gerado | Feito |
| RNF-01 Desempenho | PRD · ADR-0001 | 001 | T027, T031 | `import()` do jogo no GameHost; Lighthouse CI | Lighthouse: LCP ≤ 2,5 s, CLS ≤ 0,1, JS ≤ 150 KB | Feito |
| RNF-02 Acessibilidade | PRD · DS 10 · AGENTS | 001, 009 | T010, T012, T013, T022, T030 | `packages/ui/src/tokens.css`, `base.css`, componentes | axe nos componentes e no e2e; Lighthouse 100 | Feito |
| RNF-03 SEO | PRD | 001, 003 | T026, T028, T029 | `generateMetadata`, `sitemap-*.xml`, `public/robots.txt` | `test:html`: `canonical`, 4 `hreflang`, mapas sem `hidden` | Feito |
| RNF-04 Segurança (base) | PRD · ADR-0009 · ADR-0015 | 001, 012 | T004, T034, T037, T039, T041 | gitleaks no CI, `app/errors.py`, CORS, `nginx/default.conf.template` (CSP), `.env.example` | gitleaks; pytest de CORS; `scripts/smoke-web.sh` | Feito · **revisão humana** (CORS e cabeçalhos) |
| RNF-06 Disponibilidade (base) | PRD · ADR-0005 | 001 | T044 | — (o site não chama a API na 001) | `e2e/offline-api.spec.ts` | Feito: e2e com a API bloqueada (T044) |
| RNF-07 Compatibilidade | PRD | 001 | T030 | `apps/web/playwright.config.ts`, `apps/web/e2e/layout.spec.ts` | e2e em Chromium, WebKit e Firefox, 390 e 1280 px; sem rolagem horizontal a 360 px | Feito (T045, L-04). Edge usa o motor do Chromium |
| RNF-09 Qualidade | PRD · ADR-0012 | 001 | T004, T030, T036, T040 | `.github/workflows/ci.yml` | CI verde | Feito |
| RNF-10 Versões | PRD · ADR-0007 | 001 | T001, T032 | `package.json`, `.nvmrc`, `apps/api/pyproject.toml`, `.python-version` | `pnpm install` e `uv sync` numa máquina limpa | Feito |
| RNF-11 Infraestrutura | PRD · ADR-0003 · ADR-0009 | 001 | T037, T038, T041 | `apps/web/Dockerfile`, `apps/api/Dockerfile`, `docs/runbooks/publicar.md` | `curl -f https://zuploop.com/healthz` | Feito |
| Esqueleto da API (sem RF) | FDD-001 §2 | 001 (F001-Q2 decidida) | T032 a T036 | `apps/api/app/{settings,logging,errors,db,main}.py`, `app/routes/health.py`, `migrations/` | pytest de `/health`, `/ready`, `/version` | Feito · F001-Q2 ainda aberta |

---

## 3. Todos os requisitos do PRD → spec

Origem de todos: **PRD**, que vem de S-DEF e S-PLANO. A tela vem de S-TELAS ([prototipo/README.md](prototipo/README.md)).

| Requisito | Fase | Spec | Tela | Status |
| --- | --- | --- | --- | --- |
| RF-NAV-01 Página inicial | 1 (fav. na 2) | 001 (parcial), 007 | Main, SiteInicio | Planejado (001) |
| RF-NAV-02 Catálogo | 1 | 001 | Jogos, SiteJogos | Planejado |
| RF-NAV-03 Página por jogo e tema | 1 | 001, 003 | SiteCacaPalavras | Planejado (001) |
| RF-NAV-04 Navegação no celular | 1 | 001 | Main | Planejado |
| RF-NAV-05 Fim da partida | 1 | **nenhuma** no índice (ver L-01) | FimPartida (002, 007) | Sem spec |
| RF-NAV-06 Ajustes | 2 | 009 (idioma na 001) | Ajustes | A fazer |
| RF-I18N-01 a 06 | 1 | 001 | — | Planejado |
| RF-SDK-01 a 04 | 1 | 001 | — | Planejado |
| RF-CP-01 a 04 | 1 | 002 | CacaPalavras | A fazer |
| RF-CP-05 Impressão | 1 | 004 | SiteCacaPalavras | A fazer |
| RF-SD-01, 02 | 2 | 006 | Sudoku | A fazer |
| RF-2048-01 | 3 | 015 | Jogo2048 | A fazer |
| RF-DM-01, 02 | 4 | 017 (depende de Q-02) | Damas | A fazer |
| RF-AJ-01, 02 | 1 | 002 | ComoJogar | A fazer |
| RF-AJ-03 | 1 | 002 (estrutura na 001) | SiteCacaPalavras | Planejado (estrutura) |
| RF-CONT-01 | 1 | 003 | SiteCacaPalavras | A fazer |
| RF-CONT-02 a 04 | 2 | 011 | Ajustes ("Sugira um tema") | A fazer |
| RF-DIA-01 a 04 | 2 | 007 | Desafio, SiteDesafio | A fazer |
| RF-DIA-05 | 2 (Premium na 5) | 007, 020 | Desafio | A fazer |
| RF-FAV-01, 02 | 2 | 008 | Main, Jogos | A fazer |
| RF-CONTA-01 | 3 (Apple na 5) | 012, 021 | Entrar | A fazer · **revisão humana** |
| RF-CONTA-02 | 3 | 012 | Entrar | A fazer · **revisão humana** |
| RF-CONTA-03, 04 | 3 | 013 | — | A fazer · **revisão humana** |
| RF-CONTA-05 a 07 | 3 | 014 | Ajustes | A fazer · **revisão humana** (exclusão e dados pessoais) |
| RF-CONTA-08 Apelido | 3 | 012 | — | A fazer |
| RF-ADS-01 a 04 | 1 (AdMob na 5) | 005 | SiteInicio (AdSlot) | A fazer |
| RF-PAG-01, 04 a 06 | 3 | 016 (depende de Q-01) | Premium | A fazer · **revisão humana** |
| RF-PAG-02, 03 | 5 | 020 | Premium | A fazer · **revisão humana** |
| RF-PAG-07 | 5 | 019 | — | A fazer · **revisão humana** |
| RF-MULTI-01 a 08 | 4 | 018 (depende de Q-09) | ConviteCriar, ConviteWhatsApp, ConviteRecebido, Revanche | A fazer |
| RF-APP-01 PWA | 2 | 010 | — | A fazer |
| RF-APP-02, 04, 05 | 5 | 019 | — | A fazer |
| RF-APP-03 | 5 | 021 | — | A fazer |
| RNF-01 a 03 | — | 001 (+ 003, 009) | — | Planejado |
| RNF-04 | — | 001 (base), 012 | — | Planejado (base) |
| RNF-05 Privacidade | — | 005, 014 | — | A fazer |
| RNF-06, RNF-07 | — | 001 (só no `spec.md`, ver L-02) | — | Planejado |
| RNF-08 Observabilidade | — | **nenhuma** (ver L-01) | — | Sem spec |
| RNF-09 a 11 | — | 001 | — | Planejado |

---

## 4. Decisões (ADRs)

Todos os ADRs estão como **Proposto**. Eles passam a Aceito quando o RFC-001 for aprovado (revisão até 15 de novembro de 2026) ou, no caso de 0011 a 0018, na T042.

| ADR | Decisão | Origem | O que foi discutido em S-DEF | Aplicado em | Onde vira código ou checagem |
| --- | --- | --- | --- | --- | --- |
| 0001 | Next.js 16 em exportação estática | RFC-001 | Astro chegou a ser escolhido e foi trocado por causa do mercado; Python gerando páginas e Next como servidor foram descartados | 001 | `next.config.ts` (`output: "export"`), T014 |
| 0002 | API em FastAPI com PostgreSQL | RFC-001 | Supabase descartado | 001 (esqueleto), 012+ | `apps/api/`, T032 a T035 |
| 0003 | Tudo na VPS, sem CDN | RFC-001 | Hospedagem gerenciada descartada; Cloudflare descartada pelo dono do produto em 8/11/2026 | 001 | Nginx (T037), runbook (T041) |
| 0004 | Jogos como pacotes atrás do SDK | RFC-001 | — | 001+ | `packages/games/*`, `no-restricted-imports` (T002) |
| 0005 | Local primeiro, login opcional | RFC-001 | Login obrigatório descartado | 001, 012, 013 | `packages/sdk/src/storage/` (T006) |
| 0006 | Convite por link, jogadas no servidor | RFC-001 | Adversário aleatório descartado | 018 | — |
| 0007 | Versões fixadas | RFC-001 | "Sempre a mais nova" e Next.js 15 descartados | Todas | `package.json`, `pnpm-lock.yaml`, `uv.lock` (T001, T032) |
| 0008 | Apps com Capacitor | RFC-001 | Versão adiada (Q-06) | 019, 021 | — |
| 0009 | `.env`, compose para testes, deploy manual | RFC-001 | — | 001 | `.env.example`, `.gitignore`, gitleaks (T001, T004, T039) |
| 0010 | Login com Google, Facebook e código por e-mail | RFC-001 | — | 012 | — |
| 0011 | Monorepo pnpm e uv | FDD-001 | — | 001 | `pnpm-workspace.yaml` (T001) |
| 0012 | Qualidade e testes | FDD-001 | — | 001 | `ci.yml`, Vitest, Playwright, pytest (T004, T030, T036) |
| 0013 | Rotas traduzidas, sem middleware | FDD-001 | — | 001 | `routes/registry.ts`, `LocalizedLink`, `lang.js` (T017 a T019) |
| 0014 | Contrato do SDK e IndexedDB | FDD-001 | — | 001 | `packages/sdk/` (T005 a T009) |
| 0015 | Docker, compose e `/config.json` | FDD-001 | — | 001 | Dockerfiles, `config.json.template`, `docker-compose.yml` (T037 a T039). O site passa a ler `/config.json` na 005 (S-05) |
| 0016 | Erros em Problem Details | FDD-001 | — | 001, 012+ | `apps/api/app/errors.py` (T034) |
| 0017 | CSS Modules e variáveis | FDD-001 | — | 001+ | `*.module.css`, `scripts/lint-styles.mjs` (T011) |
| 0018 | Biblioteca `packages/ui` | DS | — | 001+ | `packages/ui/` (T010 a T013, T022) |

Na coluna S-DEF entra só o que o RFC-001 registra explicitamente como discutido nas sessões. "—" quer dizer que o documento não registra.

---

## 5. Regras fixas do AGENTS.md → origem e checagem

| Regra | Origem | Como é verificada |
| --- | --- | --- |
| Jogar nunca exige conta; progresso salvo no aparelho primeiro | ADR-0005 · PRD (decisões) | Teste do SDK (T006); e2e sem login |
| Nenhum texto de interface no código; inglês é a referência | RF-I18N-05 | Teste de chaves (T015) e revisão |
| Jogo fala com o portal só pelo SDK, recebido por propriedade | ADR-0004 · ADR-0014 · RF-SDK-01 | `no-restricted-imports` (T002) |
| Regras em TypeScript puro, sem React e sem DOM, com testes | RF-SDK-04 | Lint de imports em `rules/`; testes das regras (T025) |
| Anúncios só nas pausas | RF-ADS-01, RF-ADS-02 | Spec 005 (a fazer); na 001 os anúncios são provisórios (T009) |
| WCAG 2.2 AA | RNF-02 · DS 10 | axe (T013, T030); Lighthouse (T031) |
| Interface segue o DS e usa `@zuploop/ui` | ADR-0018 · ADR-0017 | `pnpm lint:styles` (T011); regra de imports |
| Segredos só em variáveis de ambiente | ADR-0009 · RNF-04 | gitleaks (T004); `.env` no `.gitignore` (T001) |
| Versões fixadas, sem dependência nova sem pedir | ADR-0007 · RNF-10 | Lockfiles; revisão |
| Kubernetes publicado à mão | ADR-0009 | Revisão: nenhum manifesto no repositório |
| Código em inglês, comentários e descrições de teste em português | Pedido do dono do produto em 8/11/2026, registrado no `AGENTS.md` | Revisão (não há checagem automática) |

---

## 6. Questões em aberto

| ID | Questão | Origem | Decidir antes de | Decisão | Status |
| --- | --- | --- | --- | --- | --- |
| Q-01 | Meio de pagamento (Stripe ou Mercado Pago) | S-DEF → RFC-001 | 016 | — | Aberta |
| Q-02 | Regras das damas | S-DEF → RFC-001 · RF-DM-01 | 017 | — | Aberta |
| Q-03 | Envio de e-mail (Brevo ou Resend) | S-DEF → RFC-001 | 012 | — | Aberta |
| Q-04 | Registro de erros (GlitchTip ou Sentry) | S-DEF → RFC-001 · RNF-08 | 005 | — | Aberta (ver L-01) |
| Q-05 | Destino do backup | S-DEF → RFC-001 | 012 | — | Aberta |
| Q-06 | Versão do Capacitor | S-DEF → RFC-001 | 019 | Adiada de propósito | Adiada |
| Q-07 | Conflito de marca ZupLoop | S-DEF → RFC-001 · PRD (riscos) | Divulgação paga ou registro de marca | — | Aberta |
| Q-08 | Quando ligar "Mais jogados" | S-DEF → RFC-001 | Volume relevante | — | Aberta |
| Q-09 | Validação das damas no servidor (TS × Python) | RFC-001 (ponto novo) | 018 | — | Aberta |
| F001-Q1 | Registro de imagens Docker | FDD-001 | T041 | — | Aberta |
| F001-Q2 | Esqueleto da API na 001 | FDD-001 · spec 001 | Revisão do FDD | Fica na 001 | Decidida em 9/11/2026: a API fica na 001 |
| F001-Q3 | Nome e permanência do jogo de exemplo | FDD-001 | Fim da 002 | — | Aberta |

---

## 7. Lacunas e divergências encontradas

Pontos que este levantamento achou entre os documentos. Cada um precisa de uma decisão sua; nenhum foi corrigido.

| ID | O que é | Onde | Sugestão |
| --- | --- | --- | --- |
| L-01 | **RF-NAV-05 (Fim da partida, fase 1)** e **RNF-08 (Observabilidade)** não aparecem em nenhuma linha do índice de specs. O protótipo liga a tela FimPartida às specs 002 e 007, e a Q-04 deve ser decidida antes da 005 | [specs/README.md](specs/README.md) | Incluir RF-NAV-05 na 002 e RNF-08 na 005 (ou criar uma spec) |
| L-02 | O `spec.md` da 001 cita RNF-04, RNF-06, RNF-07 e RF-NAV-01 (parcial), mas a linha da 001 no índice de specs não cita | [specs/README.md](specs/README.md) × [001/spec.md](specs/001-fundacao/spec.md) | Alinhar a linha do índice com o `spec.md` |
| L-03 | **Resolvida em 9/11/2026:** busca e filtros entraram na 001 (T043). O RF-NAV-02 pede busca e filtros por categoria, e a tela Jogos mostra os dois, mas a T023 só lista os jogos e o FDD fala em "versão inicial" sem dizer o que fica de fora | [tasks.md T023](specs/001-fundacao/tasks.md) × [prd.md](prd.md) | Dizer no FDD se busca e filtros ficam na 001 ou vão para outra spec |
| L-04 | **Resolvida em 9/11/2026:** Firefox e 360 px entraram no e2e (T045). O RNF-07 pede Chrome, Safari, Firefox e Edge e telas a partir de 360 px, mas a T030 testa só Chromium e WebKit, em 390 e 1280 px | [tasks.md T030](specs/001-fundacao/tasks.md) × [prd.md](prd.md) | Acrescentar Firefox e a largura de 360 px, ou registrar que a 001 cobre só parte do RNF-07 |
| L-05 | **Resolvida em 9/11/2026:** teste T044. O FDD liga o RNF-06 à 001, mas nenhuma tarefa prova que o site funciona com a API fora do ar | [plan.md §2](specs/001-fundacao/plan.md) | Um cenário de e2e ou de smoke com a API parada |
| L-06 | O RF-I18N-03 diz que, sem página equivalente, o seletor leva "à lista daquele jogo"; o FDD (F2) leva ao catálogo do idioma | [prd.md](prd.md) × [plan.md F2](specs/001-fundacao/plan.md) | Confirmar qual vale. Na 001 dá no mesmo, mas diverge a partir da 003 (temas) |
| L-07 | A transcrição das sessões de definição (S-DEF) não está no repositório; a origem de cada decisão só pode ser rastreada até o resumo do RFC-001 | — | Se quiser rastrear até a conversa, guardar um resumo datado em `docs/sessoes/` |
