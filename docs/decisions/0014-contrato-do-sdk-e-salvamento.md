# ADR-0014 · Contrato do SDK e salvamento em IndexedDB

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [FDD 001 · Fundação](../specs/001-fundacao/plan.md) · Arquivo: `docs/decisions/0014-contrato-do-sdk-e-salvamento.md`

## Contexto

O ADR-0004 definiu que os jogos falam com o portal só pelo SDK, e o ADR-0005 que o progresso é salvo primeiro no aparelho. Falta decidir a forma do contrato e onde guardar os saves, de modo que login, anúncios e favoritos entrem depois sem mexer nos jogos.

## Decisão

- **Contrato completo desde a 001**, com versão (`SDK_VERSION = 1`): `getLocale`, `i18n.t`, `storage`, `ads`, `favorites` e `events`. Partes que ainda não existem têm implementações provisórias com o mesmo contrato.
- **O jogo recebe o SDK por propriedade** (`GameProps.sdk`), criado pelo portal para cada jogo aberto. O jogo não importa nada do portal.
- **Nenhuma função do SDK rejeita por falha de infraestrutura**: armazenamento cheio, IndexedDB bloqueado ou anúncio indisponível resolvem com um valor neutro e um evento de erro.
- **Saves em IndexedDB** (banco `zuploop`, store `saves`, chave `<gameId>:<slot>`), pela biblioteca `idb-keyval`, com reserva em memória quando o IndexedDB não está disponível.
- **Envelope com versão**: `{ v, sdk, gameId, slot, updatedAt, data }`. Cada jogo declara `saveVersion` e `migrateSave`. Save que não migra é descartado com aviso, nunca quebra o jogo.
- **Gravações espaçadas** (no máximo uma a cada 300 ms por slot) e gravação imediata em `pagehide` e `visibilitychange`.
- **Textos do jogo** ficam no pacote do jogo e chegam pelo `sdk.i18n`, não pelo next-intl do portal.

## Alternativas descartadas

- **localStorage:** mais simples, mas síncrono (trava a tela em saves grandes), limitado a cerca de 5 MB e sem transações.
- **Jogos usando next-intl, storage ou anúncios diretamente:** mais rápido no primeiro jogo, mas cada mudança de serviço obrigaria a alterar todos os jogos.
- **Implementar só as partes usadas agora e crescer o contrato depois:** cada parte nova mudaria a interface que os jogos conhecem.

## Consequências

- Login e sincronização (013), anúncios (005) e favoritos (008) trocam só a implementação dentro do SDK.
- O `updatedAt` do envelope já serve para a regra "o save mais recente vence" da sincronização.
- Mudança que quebre o contrato exige `SDK_VERSION` novo e um ADR.
