# ADR-0015 · Imagens Docker, docker-compose e configuração pública em tempo de execução

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [FDD 001 · Fundação](../specs/001-fundacao/plan.md) · Arquivo: `docs/decisions/0015-docker-compose-e-configuracao.md`

## Contexto

O ADR-0009 definiu segredos em `.env`, testes com docker-compose e publicação manual no Kubernetes. Falta decidir como as imagens são montadas e como o site, que é estático, recebe valores que mudam por ambiente.

## Decisão

- **Imagem do site**: build em duas etapas. A primeira, com Node.js 24, gera a exportação estática; a final usa `nginxinc/nginx-unprivileged` (estável vigente), sem Node.js, servindo na porta 8080 como usuário sem privilégios.
- **Imagem da API**: `python:3.13-slim` com dependências instaladas pelo uv a partir do `uv.lock`, usuário sem privilégios, porta 8000. O contêiner roda `alembic upgrade head` e depois o Uvicorn.
- **Configuração pública do site em tempo de execução**: o contêiner do Nginx gera `/config.json` ao iniciar, a partir de variáveis de ambiente (`PUBLIC_*`), com o recurso de templates da imagem oficial. A mesma imagem serve teste e produção.
- **Só a URL do site é fixada no build** (`SITE_URL=https://zuploop.com`), porque entra no HTML (`canonical`, `hreflang`, mapas do site).
- **Nenhum segredo no site**: tudo em `/config.json` é público por definição.
- **docker-compose** com `web`, `api` e `db` (PostgreSQL 17), lendo o `.env` da raiz, com verificações de saúde e volume nomeado para o banco. O banco escuta só em `127.0.0.1`.
- **Versão nas imagens**: tag `AAAA.MM.DD-<commit curto>`, a mesma exposta em `/version` e em `/config.json`.

## Alternativas descartadas

- **Variáveis `NEXT_PUBLIC_*` no build para tudo:** exigiria uma imagem por ambiente, e o que foi testado não seria exatamente o que vai para produção.
- **Servir o site com Node.js (`next start`):** descartado no ADR-0001; mais memória e mais um processo para manter de pé.
- **Imagens Alpine para o Python:** menores, mas com problemas de compatibilidade com pacotes compilados; a `slim` evita isso.

## Consequências

- O que roda no compose é a mesma imagem que vai para o cluster.
- O site faz um pedido a mais (`/config.json`) ao abrir; ele é pequeno, sem cache, e o site funciona com valores seguros se falhar.
- O roteiro de publicação precisa criar no Kubernetes as mesmas variáveis do `.env`: segredos como Secret e o resto como ConfigMap.
