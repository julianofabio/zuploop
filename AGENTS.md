# AGENTS.md · ZupLoop

Instruções para qualquer IA que trabalhe neste repositório. Leia este arquivo inteiro antes de cada tarefa.

## O projeto

ZupLoop.com é um site e app de passatempos clássicos para adultos (caça-palavras, sudoku, 2048, damas), em português, espanhol e inglês, gratuito com anúncios discretos. Uma pessoa mantém o projeto nas horas vagas; o código é gerado com IA e revisado por ela.

## Antes de cada tarefa, leia

1. A pasta da feature atual em `docs/specs/NNN-nome/`: `spec.md` (o quê), `plan.md` (o FDD: como) e `tasks.md` (as tarefas).
2. Os ADRs citados no FDD, em `docs/decisions/`.
3. Se a tarefa tocar em interface: `docs/design-system.md` e as telas da feature em `docs/prototipo/` (imagem em `png/`, medidas e textos em `html/`). Se protótipo e padrão divergirem, vale o padrão.
4. Se a tarefa tocar em produto ou arquitetura: `docs/prd.md` e `docs/rfcs/0001-arquitetura-tecnica.md`.

A feature atual e o status de todas estão em `docs/specs/README.md`.

## Regras do produto que nunca mudam

- Jogar nunca exige conta. O progresso é salvo primeiro no aparelho (ADR-0005).
- Nenhum texto de interface no código: tudo vem dos arquivos de idioma. O inglês é a referência (RF-I18N-05).
- O jogo fala com o portal só pelo SDK, recebido por propriedade (ADR-0004, ADR-0014).
- Regras de cada jogo em TypeScript puro, sem React e sem DOM, com testes (RF-SDK-04).
- Anúncios nunca durante a partida; só nas pausas (RF-ADS-01).
- Acessibilidade WCAG 2.2 AA: contraste 4,5:1, toque de 44 px, teclado, rótulos (RNF-02).
- Toda interface segue `docs/design-system.md` e usa os componentes e tokens de `@zuploop/ui` (ADR-0018).
- Nenhum segredo no código, nos logs ou no site. Segredos só em variáveis de ambiente (ADR-0009).

## Stack e versões

Versões fixadas (ADR-0007). **Não mude versão nem acrescente dependência sem pedir.**

| Camada | Versão |
| --- | --- |
| Node.js | 24 LTS (`.nvmrc`) |
| pnpm | 10, fixado em `packageManager` |
| TypeScript | 5.x, modo `strict` |
| React | 19 |
| Next.js | 16.x, exportação estática (`output: "export"`) |
| next-intl | 4.x, sem middleware (ADR-0013) |
| Python | 3.13, com uv |
| FastAPI | com Pydantic 2 e pydantic-settings |
| SQLAlchemy | 2.0 assíncrono, com asyncpg |
| Alembic | 1.x |
| PostgreSQL | 17 |
| Testes | Vitest 3, Testing Library, Playwright, pytest |
| Qualidade | ESLint 9, Prettier 3, Ruff, mypy, gitleaks |

As versões exatas estão em `package.json`, `pnpm-lock.yaml`, `apps/api/pyproject.toml` e `apps/api/uv.lock`.

## Mapa do repositório

| Pasta | Conteúdo |
| --- | --- |
| `apps/web` | Site em Next.js: páginas, registro de rotas, GameHost, mensagens, Nginx |
| `apps/api` | API em FastAPI: rotas, configurações, banco, migrações Alembic |
| `packages/sdk` | SDK do portal: contrato e implementações (storage, i18n, ads, favoritos, eventos) |
| `packages/ui` | Padrão de interface: tokens, componentes e ícones (`@zuploop/ui`) |
| `packages/games/<jogo>` | Um jogo: `manifest.ts`, `rules/`, `Game.tsx`, `messages/` |
| `packages/config` | tsconfig, ESLint e Prettier compartilhados |
| `content/themes/<idioma>` | Temas em JSON (caça-palavras e outros) |
| `docs` | PRD, RFC, ADRs, specs, padrão de interface, protótipo de telas, runbooks |

## Comandos

Na raiz:

| Comando | O que faz |
| --- | --- |
| `pnpm install` | Instala as dependências TypeScript |
| `pnpm dev` | Site em modo de desenvolvimento em `http://localhost:3000` |
| `pnpm build` | Exportação estática em `apps/web/out` |
| `pnpm test` | Testes de unidade e componentes (Vitest) |
| `pnpm test:e2e` | Testes de ponta a ponta (Playwright) contra o build |
| `pnpm lint` | ESLint |
| `pnpm lint:styles` | Procura cores, fontes e tamanhos fora de `tokens.css` |
| `pnpm typecheck` | Verificação de tipos |
| `pnpm format` | Prettier |
| `pnpm check` | Tudo o que o CI roda, incluindo a API |

Em `apps/api`:

| Comando | O que faz |
| --- | --- |
| `uv sync` | Instala as dependências Python |
| `uv run uvicorn app.main:app --reload` | API em `http://localhost:8000` |
| `uv run pytest` | Testes da API (precisa do PostgreSQL do compose: `docker compose up -d db`) |
| `uv run ruff check . && uv run ruff format --check .` | Lint e formatação |
| `uv run mypy app` | Verificação de tipos |
| `uv run alembic revision --autogenerate -m "descricao"` | Nova migração |
| `uv run alembic upgrade head` | Aplica as migrações |

Ambiente completo:

| Comando | O que faz |
| --- | --- |
| `cp .env.example .env` | Cria o `.env` local (preencha os valores) |
| `docker compose up --build` | Sobe `web` (8080), `api` (8000) e `db` (5432) |
| `docker compose down` | Para tudo e preserva os dados do banco |

## Como trabalhar

1. Faça **uma tarefa do `tasks.md` por vez** e não saia do escopo dela. Melhorias que você notar viram uma nota no fim da resposta, não código.
2. **Escreva o teste antes**, a partir dos critérios de aceite do FDD. Depois implemente até ele passar.
3. Antes de dizer que terminou, rode `pnpm check` (e os comandos da API, se tocou nela) e confirme que tudo passa.
4. Marque a tarefa como feita no `tasks.md` e diga em poucas linhas o que mudou e como verificar.
5. Se a especificação estiver ambígua ou contradizer um ADR, **pare e pergunte**. Não invente regra de produto.
6. Se uma decisão nova afetar mais de uma feature, proponha um ADR em vez de decidir sozinha.

## Padrões de código

### Idioma do código e dos comentários

O código é escrito em **inglês**, e os comentários em **português**.

| Item | Idioma | Exemplo |
| --- | --- | --- |
| Variáveis, funções, classes, tipos, componentes, props | Inglês | `saveVersion`, `GameHost`, `migrateSave` |
| Nomes de arquivos e pastas de código | Inglês | `packages/games/example/`, `language-switcher.test.tsx` |
| Banco: tabelas, colunas, migrações | Inglês | `users`, `created_at`, `add_nickname_to_users` |
| API: rotas, campos JSON, `code` de erro | Inglês | `/health`, `database_unavailable` |
| Chaves de mensagens, nomes de eventos, variáveis de ambiente | Inglês | `catalog.title`, `game_load_failed`, `SITE_URL` |
| Mensagens de log e de exceção (técnicas, não exibidas ao jogador) | Inglês | `"save discarded: version too new"` |
| Comentários e docstrings | **Português** | `// Grava no máximo uma vez a cada 300 ms por slot.` |
| Descrição dos testes (`describe`, `it`, nome de função de teste) | **Português** | `it("descarta save com versão maior")` |
| Texto de interface | Arquivos de idioma (pt, es, en) | Nunca no código (RF-I18N-05) |
| Endereços públicos (slugs) | Traduzidos por idioma | `/pt/jogos/`, `/es/juegos/` (ADR-0013) |
| Documentação em `docs/`, `README.md` e mensagens de commit | Português | Formato do commit no `CLAUDE.md` |

Comentários explicam o **porquê**, não repetem o que o código já diz.

### TypeScript e React

- Sem `any`, sem `@ts-ignore`. Use `unknown` e valide.
- Componentes de servidor por padrão; `"use client"` só onde há estado, efeito ou evento.
- Links internos só com `LocalizedLink`; nunca um `href` começando com `/pt/`, `/es/` ou `/en/`.
- Antes de criar um componente, procure em `@zuploop/ui`. Se faltar, ele nasce lá, seguindo `docs/design-system.md`, nunca dentro de uma tela ou jogo.
- Estilos com CSS Modules e os tokens de `packages/ui/src/tokens.css`; tamanhos em `rem` (ADR-0017). Nenhuma cor, fonte ou tamanho de fonte em `px` fora de `tokens.css` (`pnpm lint:styles`).
- Nomes de arquivos de componentes em `PascalCase.tsx`; demais em `kebab-case.ts`.
- Nada em `packages/games` importa de `apps/web`, de `next` ou de outro jogo; jogos podem importar `@zuploop/sdk` e `@zuploop/ui`.
- Nada em `packages/ui` importa do site, dos jogos, do SDK ou do `next`.

### Python

- Funções de rota assíncronas, com tipos completos e modelos Pydantic na entrada e na saída.
- Configuração só por `app/settings.py`; nunca `os.environ` espalhado.
- Erros no formato Problem Details, com `code` estável registrado em `app/errors.py` (ADR-0016).
- Toda consulta filtra pelo dono do dado; nenhuma rota devolve dados de outra pessoa.
- Logs em JSON com `requestId`; nunca e-mail, token ou senha em log.

### Banco

- Toda mudança de esquema é uma migração Alembic nova. **Nunca edite uma migração já aplicada.**
- Identificadores internos são UUID; nunca use apelido ou e-mail como chave.

## Nunca faça

- Colocar segredos, chaves ou senhas no código, em testes, em exemplos ou em logs.
- Ler, copiar ou commitar o `.env`. Use só o `.env.example`, com valores falsos.
- Usar dados reais de pessoas em testes ou no ambiente local.
- Apagar, pular (`.skip`) ou enfraquecer um teste para ele passar.
- Mudar versões, adicionar dependências ou trocar ferramentas sem pedir.
- Rodar `docker compose down -v` ou qualquer comando que apague o banco sem pedir.
- Criar ou alterar arquivos do Kubernetes: a publicação é manual (ADR-0009).
- Escrever texto de interface fora dos arquivos de idioma.
- Fazer o jogo depender de rede ou da API para funcionar.

## Revisão humana obrigatória

Avise explicitamente quando a tarefa tocar em: login e sessões, acesso a dados pessoais, pagamentos, exclusão de conta, cabeçalhos de segurança ou CORS. Esses trechos são revisados à mão antes de publicar.
