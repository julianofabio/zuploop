# ADR-0004 · Jogos como pacotes atrás do SDK do portal

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [RFC-001](../rfcs/0001-arquitetura-tecnica.md) · Arquivo: `docs/decisions/0004-jogos-e-sdk.md`

## Contexto

A plataforma precisa receber muitos jogos ao longo do tempo, criados como projetos independentes, sem refazer o portal nem os jogos quando entrarem login, anúncios dos apps ou sincronização.

## Decisão

Cada jogo é um pacote em `packages/games/<jogo>` com regras em TypeScript puro (sem interface, com testes) e tela em React, mais um manifesto com identificador, nomes e endereços por idioma, categoria e fase. O jogo fala com o portal só pelo SDK: salvar e carregar, idioma, intervalos de anúncio, favoritos e eventos.

## Alternativas descartadas

- **Jogos acessando API, anúncios e armazenamento diretamente:** mais rápido no primeiro jogo, mas cada mudança de serviço obrigaria a alterar todos os jogos.

## Consequências

- Um jogo novo não mexe no portal; trocar AdSense por AdMob ou ligar a sincronização não mexe nos jogos.
- O SDK precisa de contrato estável e versionado desde a fase 1.
- As regras separadas podem ser reaproveitadas na validação de partidas no servidor.
