# ADR-0007 · Versões consolidadas e fixadas

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [RFC-001](../rfcs/0001-arquitetura-tecnica.md) · Arquivo: `docs/decisions/0007-versoes-fixadas.md`

## Contexto

O código será gerado por IA, e os modelos podem não conhecer a documentação das versões mais novas.

## Decisão

Usar versões consolidadas e com suporte, fixadas sem `^` no `package.json`, com lockfile, `.nvmrc` e dependências Python fixadas, e listá-las no `AGENTS.md`:

| Camada | Versão |
| --- | --- |
| Node.js | 24 LTS |
| TypeScript | 5.x |
| React | 19 |
| Next.js | 16.x |
| Python | 3.13 |
| FastAPI e Pydantic | FastAPI com Pydantic 2 |
| SQLAlchemy | 2.0 |
| Alembic | 1.x |
| PostgreSQL | 17 |
| Capacitor | Escolhido no início da fase 5 |

## Alternativas descartadas

- **Sempre a versão mais nova:** recursos recentes, mas mais código errado gerado pela IA.
- **Next.js 15:** mais conhecido, mas sai do suporte em outubro de 2026.

## Consequências

- Menos surpresas no código gerado.
- Recursos novos chegam mais tarde.
- Revisão anual das versões, registrada num novo ADR que substitui este.
