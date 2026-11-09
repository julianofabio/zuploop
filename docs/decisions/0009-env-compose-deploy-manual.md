# ADR-0009 · Segredos em .env, docker-compose para testes e deploy manual

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [RFC-001](../rfcs/0001-arquitetura-tecnica.md) · Arquivo: `docs/decisions/0009-env-compose-deploy-manual.md`

## Contexto

O desenvolvedor quer um jeito único de guardar chaves, senhas e tokens, subir a aplicação inteira para testes com um comando e manter o controle de quando algo vai para produção.

## Decisão

- Toda configuração sensível (chaves de API, senhas do banco, segredos de login e de pagamento) é lida de variáveis de ambiente. Nenhum valor fica no código.
- Na máquina de desenvolvimento, os valores ficam num arquivo `.env` lido pelo `docker-compose`, que sobe site, API, banco e tarefas para testes.
- O `.env` nunca vai para o Git: está no `.gitignore`. O repositório tem um `.env.example` com os nomes das variáveis e valores falsos.
- A publicação no Kubernetes é manual, feita pelo desenvolvedor. As mesmas variáveis viram Secrets do Kubernetes, criados à mão.
- O GitHub Actions só roda os testes; não publica nem guarda segredos de produção.

## Alternativas descartadas

- **Publicação automática pelo GitHub Actions:** menos passos, mas exige guardar acesso ao cluster no GitHub e tira do desenvolvedor o controle de quando publicar.
- **Valores em arquivos de configuração versionados:** mais simples, mas põe segredos no histórico do Git.

## Consequências

- O mesmo código roda no docker-compose e no Kubernetes; só muda de onde vêm as variáveis.
- A lista de variáveis é definida no plano da especificação 001 e mantida no `.env.example`.
- Os valores de produção precisam de uma cópia segura fora da VPS, por exemplo num gerenciador de senhas.
- Publicar depende de um roteiro manual (`docs/runbooks/publicar.md`) seguido sempre igual.
