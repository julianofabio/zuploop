# ZupLoop

Site e app de passatempos clássicos para adultos (caça-palavras, sudoku, 2048, damas), em português, espanhol e inglês.

- Produto: [docs/prd.md](docs/prd.md)
- Arquitetura: [docs/rfcs/0001-arquitetura-tecnica.md](docs/rfcs/0001-arquitetura-tecnica.md) e [docs/decisions/](docs/decisions/README.md)
- Features e status: [docs/specs/README.md](docs/specs/README.md)
- Regras para quem programa (pessoas e IA): [AGENTS.md](AGENTS.md)

## Pré-requisitos

| Ferramenta | Versão |
| --- | --- |
| Node.js | 24 (veja `.nvmrc`) |
| pnpm | 10, pelo Corepack (`packageManager` no `package.json`) |
| uv | Para a API em Python 3.13 |
| Docker | Com o Compose v2 |

## Como rodar

```sh
# 1. Ativar o pnpm na versão fixada
corepack enable
# Sem permissão de administrador (Windows):
# corepack enable --install-directory "$HOME/.local/bin"

# 2. Instalar as dependências
pnpm install

# 3. Site em modo de desenvolvimento (http://localhost:3000)
pnpm dev

# 4. Tudo o que o CI roda
pnpm check
```

Ambiente completo com site, API e banco:

```sh
cp .env.example .env      # preencha os valores; o .env nunca vai para o Git
docker compose up --build # web em :8080, api em :8000, db em 127.0.0.1:5432
docker compose down       # para tudo e preserva os dados do banco
```

A lista completa de comandos está no [AGENTS.md](AGENTS.md#comandos).
