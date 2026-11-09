# ADR-0008 · Apps com Capacitor sobre o build estático

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [RFC-001](../rfcs/0001-arquitetura-tecnica.md) · Arquivo: `docs/decisions/0008-apps-capacitor.md`

## Contexto

Na fase 5 o ZupLoop ganha apps Android e iOS, mantidos pela mesma pessoa, com a mesma conta, progresso e compras do site.

## Decisão

Empacotar o mesmo build estático do site com Capacitor. Os apps acrescentam notificações, compras das lojas unificadas pelo RevenueCat, AdMob pelo SDK do portal, "Entrar com Apple" e modo offline. A versão do Capacitor é escolhida no início da fase 5 (Q-06 do RFC-001).

## Alternativas descartadas

- **Apps nativos separados:** melhor experiência, mas dois códigos a mais para uma pessoa manter.
- **Só o PWA:** sem custo de loja, mas fora das buscas das lojas e com compras e notificações limitadas no iPhone.

## Consequências

- Um só código de front-end para site e apps.
- A exportação estática (ADR-0001) é condição para isso.
- Risco de recusa na App Store se o app parecer só um site, mitigado pelos recursos nativos.
