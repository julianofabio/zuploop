# ADR-0018 · Biblioteca de interface compartilhada (`packages/ui`)

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [Padrão de interface](../design-system.md) · Arquivo: `docs/decisions/0018-biblioteca-de-interface.md`

## Contexto

O site e os jogos precisam ter a mesma aparência e os mesmos componentes (botões, barra do jogo, folhas, avisos). Os jogos não podem importar nada do portal (ADR-0004), então os componentes não podem morar em `apps/web`. O padrão de interface precisa de um lugar no código que o torne obrigatório, e não só recomendado.

## Decisão

- Criar o pacote **`packages/ui`** (`@zuploop/ui`) com:
  - `tokens.css`, único arquivo com valores literais de cor, fonte e escala;
  - `base.css`, com normalização, foco e utilitários de acessibilidade;
  - componentes React descritos no [padrão de interface](../design-system.md), cada um com CSS Module, testes e exemplo;
  - ícones do ZupLoop como componentes React.
- O site e os jogos podem importar `@zuploop/ui` e `@zuploop/sdk`. A `ui` não importa nada do site, dos jogos, do SDK nem do Next.js.
- Um script `pnpm lint:styles` falha se houver cor, `font-family` ou tamanho de fonte em `px` fora de `tokens.css`.
- Mudanças seguem a ordem: padrão de interface, depois `packages/ui`, depois o protótipo.

## Alternativas descartadas

- **Componentes dentro de `apps/web`:** os jogos não poderiam usá-los sem quebrar o ADR-0004, e cada jogo recriaria botões e barras.
- **Biblioteca pronta (MUI, Chakra, shadcn/ui):** acelera, mas traz outro visual, mais JavaScript e regras que brigam com o padrão próprio (ADR-0017).
- **Storybook para documentar os componentes:** útil, mas mais uma ferramenta; por enquanto, os exemplos ficam no documento e numa página interna `/pt/_ui/` gerada só em desenvolvimento.

## Consequências

- Um botão muda num lugar só e muda em todo o site e em todos os jogos.
- Os componentes básicos entram já na 001; cada feature acrescenta os que faltarem, sempre em `packages/ui`.
- O pacote precisa de testes de acessibilidade próprios (axe nos exemplos), porque um erro nele se espalha por tudo.
