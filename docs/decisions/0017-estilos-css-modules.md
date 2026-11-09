# ADR-0017 · Estilos com CSS Modules e variáveis CSS

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [FDD 001 · Fundação](../specs/001-fundacao/plan.md) · Arquivo: `docs/decisions/0017-estilos-css-modules.md`

## Contexto

O visual do ZupLoop é limpo, com poucas cores e muito cuidado com legibilidade e contraste (RNF-02). Na fase 2, a pessoa poderá aumentar o tamanho do texto e ligar o alto contraste (RF-NAV-06). Os jogos são pacotes independentes e também precisam seguir o visual.

## Decisão

- **CSS Modules** em cada componente, recurso nativo do Next.js, sem biblioteca extra.
- **Tokens em variáveis CSS** num arquivo `tokens.css`: cores, tipografia, espaçamentos, raios e sombras, tirados das telas do protótipo.
- **Tamanhos em `rem`**, para o ajuste de tamanho de texto funcionar mudando só o tamanho da fonte da raiz.
- **Alto contraste por atributo** (`data-contrast="high"` no `<html>`) que troca os valores dos tokens, sem refazer componentes.
- **Os jogos usam os mesmos tokens**, lidos das variáveis CSS, sem importar nada do portal.
- **Fontes** Atkinson Hyperlegible e Lexend servidas pelo próprio site, via `next/font`.

## Alternativas descartadas

- **Tailwind CSS:** muito usado e conhecido pela IA, mas acrescenta uma ferramenta e espalha as decisões de estilo pelo HTML, o que dificulta ajustes globais como o alto contraste.
- **Biblioteca de componentes pronta (MUI, Chakra):** acelera telas genéricas, mas pesa no JavaScript inicial e briga com o visual próprio.
- **CSS-in-JS em tempo de execução:** custo de desempenho e incompatível com componentes de servidor do React.

## Consequências

- Zero JavaScript extra para estilos.
- Componentes básicos (botão, card, cabeçalho) precisam ser escritos à mão na 001 e reaproveitados nas features seguintes.
- O protótipo vira a referência visual; diferenças entre código e protótipo são corrigidas no código ou atualizadas no protótipo.
