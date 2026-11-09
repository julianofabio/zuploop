# ADR-0013 · Rotas traduzidas com registro de rotas, sem middleware

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [FDD 001 · Fundação](../specs/001-fundacao/plan.md) · Arquivo: `docs/decisions/0013-rotas-traduzidas-sem-middleware.md`

## Contexto

O PRD exige endereços com nomes traduzidos por idioma (`/pt/jogos/`, `/es/juegos/`, `/en/games/`) e redirecionamento automático só na raiz (RF-I18N-01 e RF-I18N-02). O site é uma exportação estática (ADR-0001), e nela o Next.js não roda middleware. O recurso de caminhos traduzidos do next-intl depende de middleware para reescrever endereços.

## Decisão

- **Registro de rotas** em `apps/web/src/routes/registry.ts`: cada página tem um identificador e os segmentos do endereço em cada idioma. As páginas de jogos vêm dos manifestos.
- **Uma rota `[locale]/[...slug]`** com `generateStaticParams` gera todos os endereços do registro, e a página decide o que mostrar pelo identificador.
- **next-intl 4** só para mensagens e formatação, com `setRequestLocale` em cada layout e página, sem middleware.
- **Raiz `/`** em um layout próprio (grupo de rota), com links para os três idiomas e um script pequeno (`/lang.js`) que escolhe o idioma: escolha salva, depois o navegador, depois inglês.
- **`trailingSlash: true`**, para cada página virar `pasta/index.html` e o Nginx servir sem regras especiais.
- Seletor de idioma, faixa de sugestão, `hreflang` e mapas do site usam o mesmo registro.

## Alternativas descartadas

- **Pastas físicas por idioma (`app/[locale]/jogos`, `app/[locale]/juegos`):** cada página repetida três vezes, com risco de uma ficar desatualizada.
- **Endereços em inglês para todos os idiomas (`/pt/games/`):** simples, mas pior para a busca em português e espanhol, que é a aposta do produto.
- **Redirecionar pelo Nginx com o cabeçalho `Accept-Language`:** funcionaria na raiz, mas ignora a escolha salva pela pessoa, que só existe no navegador.
- **Next.js como servidor para ter middleware:** descartado no ADR-0001.

## Consequências

- Uma página nova é uma entrada no registro, não três pastas.
- Links internos precisam usar o componente `LocalizedLink`; um caminho escrito à mão quebra a tradução. Uma regra de lint proíbe `href` começando com `/pt/`, `/es/` ou `/en/`.
- A primeira visita pela raiz tem um passo a mais (a página de escolha e o redirecionamento por script), sem efeito nas demais páginas.
