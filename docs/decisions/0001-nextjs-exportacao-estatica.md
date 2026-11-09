# ADR-0001 · Next.js 16 em exportação estática

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [RFC-001](../rfcs/0001-arquitetura-tecnica.md) · Arquivo: `docs/decisions/0001-nextjs-exportacao-estatica.md`

## Contexto

O ZupLoop cresce pela busca do Google em 3 idiomas, precisa de páginas rápidas no celular e será empacotado em apps. O desenvolvedor quer TypeScript no front-end, pensando no mercado de trabalho, e não quer Python gerando páginas.

## Decisão

Usar Next.js 16 com React 19 e `output: 'export'`: cada idioma, jogo, tema e nível vira HTML no build, servido pelo Nginx. Idiomas com next-intl em `/pt/`, `/es/` e `/en/`; PWA com Serwist.

## Alternativas descartadas

- **Astro com TypeScript:** mais leve e fácil, mas com menos mercado e menos material para a IA.
- **Next.js como servidor:** exige um processo Node no ar e derruba o site junto com o servidor.
- **HTML, CSS e JavaScript puros com Python gerando páginas:** código repetido em 3 idiomas e Python fora do papel desejado.

## Consequências

- O site funciona sem API e os arquivos ficam em cache no navegador.
- Não há middleware, rotas de API nem renderização por visita do Next.js: o redirecionamento de idioma fica só na raiz, e a prévia do link de convite é servida pela API.
- Mais curva de aprendizado: +1 semana na fase 1.
