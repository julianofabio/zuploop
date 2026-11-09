# ADR-0002 · API própria em FastAPI com PostgreSQL

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [RFC-001](../rfcs/0001-arquitetura-tecnica.md) · Arquivo: `docs/decisions/0002-api-fastapi-postgres.md`

## Contexto

A partir da fase 3 o ZupLoop precisa de contas, sincronização, compras confirmadas pelo servidor e, na fase 4, partidas por convite. O desenvolvedor quer Python só para serviços e banco de dados.

## Decisão

Escrever a API em FastAPI (Python 3.13, Pydantic 2), com SQLAlchemy 2.0, migrações pelo Alembic e PostgreSQL 17 gerenciado pelo CloudNativePG no cluster. Login com Google, Facebook, código por e-mail e Apple nos apps iOS (ADR-0010).

## Alternativas descartadas

- **Supabase ou serviço pronto:** cerca de 1 semana a menos, mas menos controle e aprendizado, e dependência dos limites do plano gratuito.
- **Python também gerando as páginas:** recusado pelo desenvolvedor; o front-end fica no Next.js.

## Consequências

- Controle total dos dados e nenhum custo extra fixo.
- Mais código de segurança para revisar à mão (login, acesso aos dados, pagamentos): +1 semana na fase 3.
- A validação das damas no servidor exige decidir como reaproveitar as regras em TypeScript (Q-09 do RFC-001).
