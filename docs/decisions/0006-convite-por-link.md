# ADR-0006 · Multijogador por convite, com jogadas validadas no servidor

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [RFC-001](../rfcs/0001-arquitetura-tecnica.md) · Arquivo: `docs/decisions/0006-convite-por-link.md`

## Contexto

Na fase 4, damas ganha partidas contra amigos. No lançamento haverá pouco tráfego, e o público adulto prefere jogar no seu tempo e com conhecidos.

## Decisão

Quem convida cria a partida (no seu tempo ou ao vivo, cor das peças) e envia um link. Quem recebe joga sem cadastro. A partida fica no servidor, que valida cada jogada pelas mesmas regras do jogo e recusa as inválidas. Sem chat livre, só mensagens prontas; o link vale para uma partida e expira após 7 dias sem jogadas. A prévia do link é servida pela API.

## Alternativas descartadas

- **Adversário aleatório desde o início:** precisa de muitos jogadores ao mesmo tempo e de partidas ao vivo, e traz moderação de desconhecidos.
- **Partida validada só no aparelho:** mais simples, mas permite trapaça.

## Consequências

- Funciona com pouco tráfego e divulga o site a cada convite.
- Quem não tem amigo para convidar joga só contra o computador.
- Falta decidir como o servidor em Python reaproveita as regras em TypeScript (Q-09 do RFC-001).
