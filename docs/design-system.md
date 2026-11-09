# Padrão de interface do ZupLoop

| Campo | Valor |
| --- | --- |
| Versão | 1.0 · 8 de novembro de 2026 |
| Status | Proposto, aguardando revisão |
| Dono | Juliano Fabio Miranda |
| Código | `packages/ui` (tokens e componentes), ver [ADR-0018](decisions/0018-biblioteca-de-interface.md) |
| Referência visual | [Protótipo de telas](prototipo/README.md) (imagens e HTML) · [original editável](https://claude.ai/artifact/WctBmtoD4uAnnXeZha8Gof) |
| Decisões ligadas | [ADR-0017 · Estilos com CSS Modules](decisions/0017-estilos-css-modules.md) |

Este documento define como o ZupLoop se parece e se comporta: cores, tipografia, espaçamentos, navegação, componentes, padrões dos jogos, textos e CSS. Ele vale para o site, para os jogos e para os apps.

**Regra de ouro:** nenhuma tela inventa cor, tamanho ou componente. Tudo sai daqui ou de `packages/ui`. Se faltar algo, este documento ganha a novidade primeiro e o código depois.

---

## 1. Princípios

1. **Calmo.** Fundo claro e quente, poucas cores, nada piscando. Um passatempo, não um cassino.
2. **Legível antes de bonito.** Texto base de 17 px, fontes feitas para leitura (Atkinson Hyperlegible), contraste alto. O público inclui pessoas mais velhas.
3. **Um destaque por tela.** Só uma ação principal em verde cheio por tela. O resto é secundário.
4. **Toque generoso.** Nenhum alvo menor que 44 × 44 px; ações principais com 56 px de altura.
5. **O jogo é o centro.** Durante a partida, nada compete com o jogo: sem barra de navegação, sem anúncio, sem pop-up.
6. **Acessível por padrão.** WCAG 2.2 AA é o mínimo, não um extra (RNF-02).
7. **Igual em três idiomas.** Os layouts aguentam textos até 30% mais longos (espanhol costuma ser o mais longo).

---

## 2. Como usar este padrão

- **Tokens** (cores, tamanhos, espaços) ficam em `packages/ui/src/tokens.css` como variáveis CSS. Componentes usam `var(--…)`; **nunca** um valor hexadecimal ou um `px` solto.
- **Componentes** prontos ficam em `packages/ui` (botões, cards, campos etc.). O site e os jogos importam de `@zuploop/ui`.
- **Estilos próprios** de uma tela ou jogo usam CSS Modules (ADR-0017) e só os tokens.
- **Verificação automática:** o CI falha se encontrar cor hexadecimal, `rgb()` ou `font-family` fora de `tokens.css` (script `pnpm lint:styles`).
- **Protótipo:** as telas do ZupLoop são a referência visual. Se código e protótipo divergirem, vale este documento; o protótipo é atualizado depois.

---

## 3. Cores

Todas as combinações de texto abaixo foram medidas e passam no nível AA (4,5:1 para texto, 3:1 para ícones, bordas de controles e foco).

### 3.1 Base

| Token | Valor | Uso | Contraste |
| --- | --- | --- | --- |
| `--color-bg` | `#F6F4EE` | Fundo da página | — |
| `--color-surface` | `#FFFFFF` | Cards, cabeçalho, barra inferior, campos | — |
| `--color-surface-muted` | `#EFECE4` | Chips neutros, fundo de ícone, linhas de lista | — |
| `--color-text` | `#1D2422` | Texto principal e títulos | 14,4:1 no fundo |
| `--color-text-reading` | `#3A4340` | Textos longos ("Como jogar", descrições) | 10,2:1 no branco |
| `--color-text-muted` | `#555E5A` | Texto secundário, legendas, itens inativos da navegação | 6,1:1 no fundo |
| `--color-border` | `#E4E0D6` | Divisórias e contorno de cards (decorativo) | — |
| `--color-border-strong` | `#D8D2C4` | Contorno de botões secundários e cards selecionáveis (decorativo) | — |
| `--color-border-control` | `#8C8478` | **Novo.** Borda de campos, caixas de seleção e chave desligada | 3,7:1 no branco |

`--color-border-control` corrige o protótipo: a borda `#D8D2C4` dos campos tem só 1,5:1 e some para quem enxerga pouco.

### 3.2 Marca e ação

| Token | Valor | Uso | Contraste |
| --- | --- | --- | --- |
| `--color-primary` | `#12645A` | Botão principal, links, item ativo, seleção | 7,0:1 no branco |
| `--color-primary-hover` | `#0C4A42` | Botão principal ao passar o mouse ou pressionar; texto sobre `primary-soft` | 8,5:1 no soft |
| `--color-primary-soft` | `#DDEFEA` | Fundo do item ativo da navegação, selos de confirmação | — |
| `--color-on-primary` | `#FFFFFF` | Texto e ícones sobre `primary` | 7,0:1 |
| `--color-on-primary-muted` | `#D6EEE8` | Texto secundário sobre `primary` (cartão do desafio) | 5,8:1 |
| `--color-accent` | `#F2B33D` | Destaque: quadrado do logotipo, selo "Mais completo", sequência do desafio | — |
| `--color-on-accent` | `#3D2A00` | Texto sobre `accent` | 7,4:1 |
| `--color-accent-soft` | `#FCEFD2` | Fundo de avatar e de ícone de destaque | — |
| `--color-on-accent-soft` | `#6B4A00` | Texto sobre `accent-soft` | 7,1:1 |

O dourado nunca é usado como texto ou borda sobre fundo claro (1,9:1). Ele é sempre fundo, com `--color-on-accent` por cima.

### 3.3 Estados

| Token | Valor | Uso | Contraste |
| --- | --- | --- | --- |
| `--color-favorite` | `#D9482B` | Coração de favorito (só ícone) | 4,3:1 no branco |
| `--color-favorite-soft` | `#FBE3DC` | Fundo de ícone ligado a favoritos | — |
| `--color-success` | `#12645A` | Sucesso usa a cor primária, com ícone de confirmação | 7,0:1 |
| `--color-danger` | `#B42318` | **Novo.** Erros, ação destrutiva ("Excluir conta") | 6,5:1 no branco |
| `--color-danger-soft` | `#FEF3F2` | Fundo de mensagem de erro | — |
| `--color-focus` | `#12645A` | Anel de foco sobre fundos claros | 6,4:1 no fundo |
| `--color-focus-on-dark` | `#F2B33D` | Anel de foco sobre fundo `primary` | 3,8:1 |

Cor nunca é o único sinal. Erro tem ícone e texto; favorito tem o coração cheio ou vazado e o rótulo muda; palavra encontrada fica riscada além de colorida.

### 3.4 Cores dos jogos

Os jogos usam estas cores para o tabuleiro e para marcar o que a pessoa fez. Cada par (fundo e texto) passa no AA.

| Token | Valor | Uso |
| --- | --- | --- |
| `--game-select-bg` / `--game-select-fg` | `#12645A` / `#FFFFFF` | Seleção em andamento (letras arrastadas, casa ativa) |
| `--game-mark-1-bg` / `--game-mark-1-fg` | `#CDEBDD` / `#0C4A42` | Primeira palavra encontrada, primeira marcação |
| `--game-mark-2-bg` / `--game-mark-2-fg` | `#FBE2B4` / `#5C3D00` | Segunda |
| `--game-mark-3-bg` / `--game-mark-3-fg` | `#F8D3C8` / `#7A2A18` | Terceira (depois volta à primeira) |
| `--game-board-light` | `#F1E4CC` | Casas claras do tabuleiro de damas |
| `--game-board-dark` | `#B07F52` | Casas escuras |
| `--game-board-frame` | `#6E4B2E` | Moldura do tabuleiro |
| `--game-piece-dark` / `--game-piece-dark-ring` | `#2A2F2D` / `#4A524F` | Peça escura e seu anel |
| `--game-piece-light` / `--game-piece-light-ring` | `#FFFFFF` / `#D8D2C4` | Peça clara e seu anel |

A escala de cores das peças do 2048 é definida no FDD da feature 015, partindo de `--color-surface-muted` até `--color-accent`.

### 3.5 Alto contraste

Ligado em Ajustes (RF-NAV-06), coloca `data-contrast="high"` no `<html>` e troca os tokens:

| Token | Normal | Alto contraste |
| --- | --- | --- |
| `--color-bg` | `#F6F4EE` | `#FFFFFF` |
| `--color-text`, `--color-text-reading` | `#1D2422`, `#3A4340` | `#000000` |
| `--color-text-muted` | `#555E5A` | `#1D2422` |
| `--color-border`, `--color-border-strong`, `--color-border-control` | claros | `#1D2422` |
| `--color-primary` | `#12645A` | `#0A3D36` |
| `--color-surface-muted` | `#EFECE4` | `#FFFFFF` com borda |

Nenhum componente tem regra própria para alto contraste: só os tokens mudam.

### 3.6 Modo escuro

Não existe nesta versão. O público e o visual pedem fundo claro. Se vier, entra como outro conjunto de tokens (`data-theme="dark"`), sem mexer em componentes.

---

## 4. Tipografia

### 4.1 Fontes

| Token | Fonte | Uso |
| --- | --- | --- |
| `--font-text` | Atkinson Hyperlegible, 400 e 700 | Todo o texto, botões, campos |
| `--font-display` | Lexend, 500 e 700 | Títulos, logotipo, números grandes (tempo, pontos) |

As duas são servidas pelo próprio site via `next/font`, com `font-display: swap` e só os caracteres latinos (português, espanhol, inglês).

### 4.2 Escala

A base é **17 px** (1,0625 rem). Todos os tamanhos são em `rem`, para o ajuste "Tamanho do texto" funcionar trocando só o tamanho da raiz (100%, 112,5% e 125%).

| Token | rem | px | Fonte e peso | Uso |
| --- | --- | --- | --- | --- |
| `--text-xs` | 0,8125 | 13 | Texto 700 | Selos ("Em breve"), endereço em prévia de link |
| `--text-sm` | 0,875 | 14 | Texto 400/700 | Rótulos da barra inferior, notas legais |
| `--text-md` | 1 | 16 | Texto 400 | Texto secundário, descrições curtas |
| `--text-base` | 1,0625 | 17 | Texto 400 | **Texto padrão**, botões, itens de lista |
| `--text-lg` | 1,125 | 18 | Texto 400/700 | Texto de destaque, "Como jogar" no computador |
| `--text-xl` | 1,25 | 20 | Display 700 | Títulos de seção (h3), nome do logotipo |
| `--text-2xl` | 1,5 | 24 | Display 700 | Títulos de seção grandes (h2) |
| `--text-3xl` | 1,75 | 28 | Display 700 | Título da página no celular (h1) |
| `--text-4xl` | 2,75 | 44 | Display 700 | Título da página no computador (h1) |
| `--text-5xl` | 3,25 | 52 | Display 700 | Título de destaque da página inicial no computador |

| Token | Valor | Uso |
| --- | --- | --- |
| `--leading-tight` | 1,2 | Títulos |
| `--leading-normal` | 1,5 | Texto corrido |
| `--leading-relaxed` | 1,6 | Textos longos ("Como jogar", política de privacidade) |
| `--tracking-tight` | -0,01em | Títulos de 24 px para cima |

### 4.3 Regras

- Um único `h1` por página. Hierarquia sem pular níveis.
- Linhas de texto corrido com no máximo **70 caracteres** (`max-width: 38rem`).
- Nada em itálico para ênfase; use **negrito**. Nada todo em maiúsculas, exceto as letras dentro das grades de jogo.
- Números que mudam (tempo, pontos) usam `font-variant-numeric: tabular-nums`, para não "pularem".
- Peso 500 só em Lexend. Atkinson usa 400 e 700.

---

## 5. Espaço, forma e camadas

### 5.1 Espaçamento

Grade de 4 px. Use sempre um token.

| Token | px | Uso típico |
| --- | --- | --- |
| `--space-1` | 4 | Entre ícone e rótulo pequeno |
| `--space-2` | 8 | Entre itens de um grupo, dentro de chips |
| `--space-3` | 12 | Entre ícone e texto em botões, entre cards no celular |
| `--space-4` | 16 | Padding de cards, entre blocos relacionados |
| `--space-5` | 20 | **Margem lateral no celular** |
| `--space-6` | 24 | Margem lateral no computador, entre seções no celular |
| `--space-8` | 32 | Entre seções no computador |
| `--space-10` | 40 | Respiro de cabeçalhos de página |
| `--space-12` | 48 | Entre grandes blocos da página inicial |
| `--space-16` | 64 | Topo e rodapé no computador |

### 5.2 Raios

| Token | px | Uso |
| --- | --- | --- |
| `--radius-sm` | 8 | Ícones pequenos com fundo, casas de grade |
| `--radius-md` | 14 | Campos, ícones de 44 a 52 px com fundo |
| `--radius-lg` | 16 | Botões, cards compactos |
| `--radius-xl` | 20 | Cards de jogo, cartão do desafio, folhas inferiores |
| `--radius-pill` | 999 | Chips, selos, botões redondos, item ativo da navegação no computador |

### 5.3 Bordas e sombras

- Borda padrão: `1px solid var(--color-border)`.
- **Sem sombras** em cards e botões; a separação vem da borda e do fundo. O visual é chapado de propósito.
- Única sombra, para o que flutua (menus, folhas inferiores, avisos): `--shadow-overlay: 0 8px 24px rgb(29 36 34 / 0.14)`.

### 5.4 Tamanhos de controle

| Token | px | Uso |
| --- | --- | --- |
| `--control-lg` | 56 | Botão principal, "Jogar", ações de fim de partida |
| `--control-md` | 52 | Campos de texto, linhas de ajustes |
| `--control-sm` | 44 | Mínimo para qualquer alvo de toque; botões redondos de ícone |
| `--icon-sm` / `--icon-md` / `--icon-lg` | 16 / 20 / 24 | Ícones dentro de botões, ícones de lista, ícones da navegação |

### 5.5 Camadas (z-index)

| Token | Valor | O que fica nessa camada |
| --- | --- | --- |
| `--z-base` | 0 | Conteúdo |
| `--z-sticky` | 10 | Cabeçalho fixo |
| `--z-nav` | 20 | Barra inferior |
| `--z-banner` | 30 | Faixa de idioma, aviso de cookies |
| `--z-overlay` | 40 | Folhas inferiores, menus, fundo escurecido |
| `--z-game` | 50 | Jogo em tela cheia |
| `--z-toast` | 60 | Avisos temporários (acima até do jogo) |

### 5.6 Movimento

| Token | Valor | Uso |
| --- | --- | --- |
| `--duration-fast` | 120 ms | Hover, pressionar, trocar cor |
| `--duration-base` | 200 ms | Abrir e fechar folhas, faixas, avisos |
| `--duration-slow` | 320 ms | Celebração de fim de partida |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Padrão |

- Com `prefers-reduced-motion: reduce` ou "Modo tranquilo" ligado, as transições caem para 0 ms e não há animação de celebração.
- Nada se move sozinho por mais de 5 segundos, e nada pisca mais de 3 vezes por segundo.

---

## 6. Layout

### 6.1 Pontos de quebra

| Nome | Largura | Layout |
| --- | --- | --- |
| Celular | até 767 px | Uma coluna, barra inferior, margem de 20 px |
| Tablet | 768 a 1023 px | Duas colunas de cards, barra inferior, margem de 24 px |
| Computador | a partir de 1024 px | Cabeçalho com navegação, conteúdo em até 1200 px centralizado, margem de 24 px |

Em CSS: `@media (min-width: 48rem)` (768 px) e `@media (min-width: 64rem)` (1024 px). Mobile first: o estilo base é o do celular.

O site precisa funcionar a partir de **360 px** de largura (RNF-07) e com o texto em 125%, sem rolagem horizontal.

### 6.2 Estrutura no celular

```
┌──────────────────────────────┐
│ Cabeçalho: logo · idioma     │  ← rola junto com a página
├──────────────────────────────┤
│                              │
│ Conteúdo                     │  margem lateral 20 px
│                              │
├──────────────────────────────┤
│ Início · Jogos · Desafio ·   │  ← barra inferior fixa, 4 itens
│ Ajustes                      │    altura mínima 56 px + área segura
└──────────────────────────────┘
```

- A barra inferior respeita a área segura do iPhone: `padding-bottom: max(var(--space-3), env(safe-area-inset-bottom))`.
- O conteúdo tem `padding-bottom` igual à altura da barra, para nada ficar escondido atrás dela.

### 6.3 Estrutura no computador

```
┌────────────────────────────────────────────────────────┐
│ Logo   Início  Jogos  Desafio      [PT]  Entrar        │  cabeçalho, 72 px
├────────────────────────────────────────────────────────┤
│        ┌──────────────── 1200 px ───────────────┐      │
│        │ Conteúdo                               │      │
│        └────────────────────────────────────────┘      │
├────────────────────────────────────────────────────────┤
│ Rodapé: jogos · sobre · privacidade · termos · idioma  │
└────────────────────────────────────────────────────────┘
```

- Item ativo da navegação: fundo `--color-primary-soft`, texto `--color-primary-hover`, formato pílula.
- Ajustes, no computador, fica no menu do cabeçalho (ícone de engrenagem) e no rodapé.

### 6.4 Grades de cards

| Largura | Cards de jogo | Cards de tema |
| --- | --- | --- |
| Celular | 1 coluna (card horizontal) | 2 colunas |
| Tablet | 2 colunas | 3 colunas |
| Computador | 3 ou 4 colunas | 4 colunas |

Espaço entre cards: `--space-3` no celular e `--space-4` a partir do tablet. Use `grid-template-columns: repeat(auto-fill, minmax(…, 1fr))` com o mínimo da tabela do componente.

### 6.5 Modo jogo (tela cheia)

```
┌──────────────────────────────┐
│ ← Voltar   Título   ?   ♡    │  barra do jogo, 56 px
├──────────────────────────────┤
│                              │
│        Área do jogo          │  ocupa o resto, centralizada
│                              │
├──────────────────────────────┤
│ Ações do jogo (dica, desfazer)│  opcional, 64 px
└──────────────────────────────┘
```

- Sem barra inferior, sem cabeçalho do site, sem anúncio.
- Fundo `--color-bg`. Área do jogo com o maior quadrado possível, mantendo as margens.
- No computador, a área do jogo fica centralizada com no máximo 720 px de largura, e a lista lateral (palavras, por exemplo) vai para a direita.

---

## 7. Navegação

### 7.1 Mapa

| Página | Celular | Computador | Endereço (pt) |
| --- | --- | --- | --- |
| Início | Barra inferior | Cabeçalho | `/pt/` |
| Jogos (catálogo) | Barra inferior | Cabeçalho | `/pt/jogos/` |
| Página de um jogo | Card no início ou no catálogo | Card | `/pt/jogos/caca-palavras/` |
| Tema ou nível | Card na página do jogo | Card | `/pt/jogos/caca-palavras/frutas/` |
| Desafio do dia | Barra inferior | Cabeçalho | `/pt/desafio/` |
| Ajustes | Barra inferior | Menu do cabeçalho e rodapé | `/pt/ajustes/` |
| Entrar, Perfil, Sem anúncios | A partir de Ajustes | Botão "Entrar" no cabeçalho | `/pt/entrar/`, `/pt/perfil/`, `/pt/sem-anuncios/` |

### 7.2 Regras

- **Barra inferior com 4 itens fixos**: Início, Jogos, Desafio, Ajustes. Ícone de 24 px e rótulo de 14 px, sempre os dois. Item ativo em `--color-primary` com o ícone preenchido de `--color-primary-soft`; inativos em `--color-text-muted`. O item ativo tem `aria-current="page"`.
- **No máximo dois toques** da página inicial até um jogo começar (RF-NAV-04).
- **Voltar** no canto superior esquerdo em todas as páginas internas no celular: botão redondo de 44 px com seta. Ele volta à página anterior do site; se a pessoa chegou direto (por um link), vai para o pai lógico (tema → jogo → catálogo).
- **Jogo em tela cheia**: "Voltar" fecha o jogo e mantém a pessoa na página do jogo; o botão voltar do navegador faz o mesmo.
- **Seletor de idioma** no cabeçalho: botão com a sigla (PT, ES, EN) que abre a lista com o nome de cada idioma escrito nele mesmo (Português, Español, English). Leva à mesma página no outro idioma.
- **Links internos** só com o componente `LocalizedLink` (ADR-0013).
- **Endereço não muda** ao abrir um jogo, ao abrir o "Como jogar" ou ao abrir uma folha inferior.
- **Rolagem** volta ao topo ao trocar de página e é preservada ao voltar.
- **Migalhas** (Jogos › Caça-palavras › Frutas) só no computador, acima do título das páginas de tema.

---

## 8. Iconografia

- Ícones de linha, traço de 2 px, pontas e junções arredondadas, grade de 24 px. Preenchimento só no estado ativo (barra inferior, coração favoritado).
- Cor herdada do texto (`currentColor`).
- Ícone sozinho precisa de rótulo acessível (`aria-label`) e, de preferência, de dica visível no computador.
- Ícone decorativo ao lado de texto leva `aria-hidden="true"`.
- Os ícones ficam em `packages/ui/src/icons/` como componentes React, desenhados para o ZupLoop. Não usar emoji como ícone.

Conjunto base: início, jogos (grade 2×2), desafio (calendário), ajustes (controles deslizantes), voltar, fechar, ajuda (?), coração, compartilhar, imprimir, dica (lâmpada), desfazer, apagar, tempo (relógio), sequência (chama), conta (pessoa), idioma (globo), cadeado (Premium), confirmar, alerta, mais.

---

## 9. Componentes

Cada componente existe uma vez, em `packages/ui`, com CSS Module próprio, testes e exemplo. As variantes são definidas por propriedade e refletidas em atributos `data-*`, nunca por classes soltas.

### 9.1 Botão (`Button`)

| Variante | Fundo | Texto | Borda | Uso |
| --- | --- | --- | --- | --- |
| `primary` | `--color-primary` | `--color-on-primary` | — | A ação principal da tela; uma por tela |
| `secondary` | `--color-surface` | `--color-text` | `--color-border-strong` | Ações alternativas ("Como jogar", "Compartilhar") |
| `ghost` | transparente | `--color-primary` | — | Ações terciárias, "Ver todos" |
| `danger` | `--color-surface` | `--color-danger` | `--color-danger` | Ações destrutivas, sempre com confirmação |

| Tamanho | Altura | Fonte | Padding lateral | Raio |
| --- | --- | --- | --- | --- |
| `lg` (padrão) | `--control-lg` (56) | `--text-base` 700 | `--space-5` | `--radius-lg` |
| `md` | 48 | `--text-md` 700 | `--space-4` | `--radius-lg` |
| `sm` | `--control-sm` (44) | `--text-md` 700 | `--space-4` | `--radius-pill` |

- **Estados:** hover e pressionado escurecem (`primary` → `primary-hover`; demais ganham fundo `--color-surface-muted`); desabilitado com 45% de opacidade e `aria-disabled`; carregando mostra um indicador no lugar do ícone e mantém a largura.
- Ícone opcional à esquerda (20 px), com `--space-3` de distância.
- Texto do botão é um verbo: "Jogar", "Continuar", "Receber código". Nunca "OK" ou "Clique aqui".
- Botão de largura total no celular quando é a ação principal de uma folha ou de um formulário.

### 9.2 Botão de ícone (`IconButton`)

Círculo de 44 px, fundo `--color-surface`, borda `--color-border`, ícone de 20 px. Variante `subtle` sem borda e sem fundo. Sempre com `aria-label`. Usado em Voltar, Ajuda, Favorito, Fechar e Idioma.

### 9.3 Favorito (`FavoriteButton`)

- Coração de 20 px em `--color-favorite`: vazado quando desligado, cheio quando ligado.
- `aria-pressed="true|false"` e rótulo que muda: "Favoritar: Sudoku" ↔ "Remover dos favoritos: Sudoku".
- Ao ligar, aviso curto "Adicionado aos favoritos" (`Toast`), anunciado a leitores de tela.
- Aparece nos cards, no topo da página do jogo, na barra do jogo e no fim da partida.

### 9.4 Link (`Link`, `LocalizedLink`)

Cor `--color-primary`, sublinhado só no hover dentro de menus; em texto corrido, sempre sublinhado. Hover em `--color-primary-hover`. Links externos abrem na mesma aba, exceto políticas de terceiros.

### 9.5 Card de jogo (`GameCard`)

```
┌────────────────────────────────────┐
│ ┌──────┐  Caça-palavras        ♡   │
│ │ ícone│  Ache as palavras         │
│ └──────┘  escondidas na grade      │
└────────────────────────────────────┘
```

- Fundo `--color-surface`, borda `--color-border`, raio `--radius-xl`, padding `--space-4`.
- Ícone do jogo em quadrado de 52 px com raio `--radius-md` e fundo suave da categoria.
- Nome em `--text-lg` 700, descrição em `--text-md` `--color-text-muted`, no máximo duas linhas.
- O card inteiro é um link (área de toque grande); o coração é um botão separado, fora do link.
- Jogo "Em breve": sem link, com o selo e opacidade normal (não parece desabilitado demais).
- Largura mínima na grade: 280 px.

### 9.6 Card de tema (`ThemeCard`)

Quadrado com raio `--radius-xl`, ilustração ou ícone no topo, nome do tema em `--text-base` 700, nível em `--text-sm`. Indicação de concluído com ícone de confirmação e texto "Concluído" (não só cor). Largura mínima: 150 px.

### 9.7 Cartão do desafio (`ChallengeCard`)

Destaque da página inicial: fundo `--color-primary`, texto `--color-on-primary`, secundário em `--color-on-primary-muted`, raio `--radius-xl`, padding `--space-5`. Mostra a data, o jogo, a sequência (ícone de chama em `--color-accent`) e o botão "Jogar o desafio" em variante clara (fundo `--color-surface`, texto `--color-primary`). Foco dentro dele usa `--color-focus-on-dark`.

### 9.8 Chip e filtro (`Chip`)

Pílula de 44 px de altura, fundo `--color-surface`, borda `--color-border-strong`, texto `--text-md` 700. Selecionado: fundo `--color-primary-soft`, texto `--color-primary-hover`, ícone de confirmação. Filtros do catálogo são um grupo com `role="group"` e cada chip com `aria-pressed`.

### 9.9 Selo (`Badge`)

Pílula pequena, `--text-xs` 700, padding 3 px 10 px.

| Variante | Fundo | Texto | Uso |
| --- | --- | --- | --- |
| `neutral` | `--color-surface-muted` | `--color-text-muted` | "Em breve" |
| `accent` | `--color-accent` | `--color-on-accent` | "Mais completo", "Novo" |
| `success` | `--color-primary-soft` | `--color-primary-hover` | "Concluído", "Ativo" |

### 9.10 Campo de texto (`TextField`)

- Rótulo visível acima, em `--text-md` 700. Nunca só placeholder.
- Campo com altura `--control-md`, raio `--radius-md`, fundo `--color-surface`, borda `1px solid var(--color-border-control)`, texto `--text-base`.
- Foco: anel padrão (seção 10.2).
- Erro: borda `--color-danger` de 2 px, ícone de alerta e mensagem abaixo em `--color-danger`, ligada por `aria-describedby`; o campo recebe `aria-invalid="true"`.
- Ajuda abaixo em `--text-sm` `--color-text-muted`.
- `autocomplete` e `inputmode` corretos (e-mail, código numérico).
- Código de 6 dígitos: um campo só, `inputmode="numeric"`, `autocomplete="one-time-code"`, letras espaçadas; não seis caixas separadas.

### 9.11 Chave (`Switch`) e linha de ajuste (`SettingRow`)

- Linha com altura mínima `--control-md`, texto `--text-base` à esquerda e controle à direita, divisória `--color-surface-muted`. A linha inteira é clicável.
- Chave de 52 × 32 px: desligada com trilho `--color-surface-muted` e borda `--color-border-control`; ligada com trilho `--color-primary`. Usa `role="switch"` e `aria-checked`.
- Escolha entre opções (tamanho do texto, idioma): grupo de botões segmentados ou lista com rádio, nunca um `<select>` pequeno.

### 9.12 Faixa (`Banner`)

Barra de largura total no topo do conteúdo, fundo `--color-primary-soft`, texto `--color-text`, altura mínima 56 px, com até duas ações (`ghost`). Usada na sugestão de idioma e em avisos de sistema. Espaço reservado para não deslocar a página (CLS). Fecha com botão de ícone.

### 9.13 Aviso temporário (`Toast`)

Pílula escura (`--color-text` de fundo, texto `--color-surface`), `--text-md`, no centro inferior, acima da barra inferior, por 4 segundos. Anunciado com `role="status"`. No máximo um por vez. Nunca usado para erro que exige ação.

### 9.14 Folha inferior e diálogo (`Sheet`, `Dialog`)

- **No celular**, folha que sobe de baixo, raio `--radius-xl` no topo, alça de arraste, fundo escurecido `rgb(29 36 34 / 0.4)`.
- **No computador**, diálogo centralizado de até 560 px.
- Título em `--text-2xl`, botão "Fechar" sempre visível, fecha com Esc e com toque fora (exceto confirmações destrutivas).
- O foco vai para o título ao abrir, fica preso dentro e volta ao botão que abriu ao fechar.
- Usos: "Como jogar" durante a partida, confirmações, escolha de idioma, compra.

### 9.15 Tutorial (`Tutorial`)

Até 3 passos (RF-AJ-01), cada um com ilustração, texto curto e botão "Próximo". Indicador de passos (pontos de 8 px, ativo em `--color-primary`) e "Pular" sempre visível. Lido em voz alta como "Passo 1 de 3".

### 9.16 Estado vazio, erro e carregando

| Estado | Padrão |
| --- | --- |
| Vazio | Ícone de 48 px em `--color-text-muted`, uma frase do que falta e uma ação ("Você ainda não tem favoritos. Toque no coração de um jogo para guardar aqui.") |
| Erro | Ícone de alerta em `--color-danger`, o que aconteceu, o que fazer e o botão "Tentar de novo" |
| Carregando | Esqueleto com a forma do conteúdo, fundo `--color-surface-muted`, sem animação no modo tranquilo; nunca um indicador girando por mais de 1 s sem texto |

### 9.17 Espaço de anúncio (`AdSlot`)

- Sempre **fora** da área do jogo e nunca no modo jogo (RF-ADS-01).
- Altura reservada antes de carregar (sem deslocar a página): 50 px no celular, 90 px no computador, 250 px nos espaços de bloco.
- Rótulo "Publicidade" em `--text-xs` `--color-text-muted` acima do anúncio.
- Fundo `--color-surface-muted` enquanto vazio; se não houver anúncio, o espaço some sem pular conteúdo acima dele.
- Quem comprou "Sem anúncios" não vê nem o espaço.

### 9.18 Avatar (`Avatar`)

Círculo com a inicial do apelido, fundo `--color-accent-soft`, letra `--color-on-accent-soft` em Lexend 700. Tamanhos 32, 44 e 56 px. Sem fotos.

---

## 10. Acessibilidade

### 10.1 Mínimos

| Item | Regra |
| --- | --- |
| Contraste | Texto 4,5:1; texto a partir de 24 px (ou 19 px em negrito) 3:1; ícones, bordas de controles e foco 3:1 |
| Alvos de toque | Mínimo 44 × 44 px, com pelo menos 8 px entre alvos vizinhos |
| Teclado | Tudo acessível por Tab na ordem visual; Enter e Espaço ativam; Esc fecha |
| Jogos no teclado | Setas movem na grade, Enter ou Espaço seleciona, atalhos listados no "Como jogar" |
| Leitores de tela | Rótulos em todos os controles; anúncio das mudanças de jogo ("Palavra encontrada: CAJU. Faltam 3.") por região `aria-live="polite"` |
| Texto | Funciona com 125% e com zoom de 200% sem cortar nem sobrepor |
| Idioma | `lang` correto no `<html>` e em trechos de outro idioma (nomes dos idiomas no seletor) |
| Movimento | Respeita `prefers-reduced-motion` e o modo tranquilo |
| Tempo | Nenhum tempo limite obrigatório; cronômetro pode ser escondido |
| Pular | Link "Pular para o conteúdo" como primeiro item focável |

### 10.2 Foco

```css
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
[data-surface="dark"] :focus-visible {
  outline-color: var(--color-focus-on-dark);
}
```

O foco nunca é removido (`outline: none` só com substituto equivalente). O anel dourado do protótipo foi trocado pelo verde, porque o dourado sobre fundo claro não chega a 3:1.

---

## 11. Textos da interface

### 11.1 Tom

- Trata a pessoa por **você** (pt), **tú** (es) e **you** (en). Simpático e direto, sem gírias nem infantilização.
- Frases curtas. Uma ideia por frase.
- Calma: sem urgência falsa ("Corra!"), sem culpa ("Você perdeu sua sequência!"). Prefira "Sua sequência recomeça hoje."
- Exclamação só em celebração, e uma só.
- Números por `Intl` no idioma da pessoa: "1.250 pontos" (pt), "1.250 puntos" (es), "1,250 points" (en); datas por extenso curto ("Sexta, 6 de novembro").

### 11.2 Padrões

| Situação | Padrão | Exemplo |
| --- | --- | --- |
| Botão | Verbo no infinitivo | "Jogar", "Receber código", "Tentar de novo" |
| Erro | O que houve + o que fazer | "Não foi possível abrir o jogo. Verifique a conexão e tente de novo." |
| Confirmação destrutiva | Diz a consequência e nomeia a ação | "Excluir sua conta apaga seu progresso em todos os aparelhos." · "Excluir conta" / "Cancelar" |
| Vazio | O que falta + como resolver | "Nenhum favorito ainda. Toque no coração de um jogo." |
| Sucesso | Curto, no passado | "Adicionado aos favoritos" |

### 11.3 Glossário fixo

Estes termos são sempre os mesmos, em todo o site e nos apps.

| Conceito | pt | es | en |
| --- | --- | --- | --- |
| Jogar | Jogar | Jugar | Play |
| Desafio do dia | Desafio do dia | Desafío del día | Daily challenge |
| Sequência | Sequência | Racha | Streak |
| Favoritos | Favoritos | Favoritos | Favorites |
| Como jogar | Como jogar | Cómo jugar | How to play |
| Dica | Dica | Pista | Hint |
| Ajustes | Ajustes | Ajustes | Settings |
| Entrar | Entrar | Entrar | Sign in |
| Sem anúncios | Sem anúncios | Sin anuncios | No ads |
| Premium vitalício | Premium vitalício | Premium de por vida | Lifetime Premium |
| Desafiar um amigo | Desafiar um amigo | Retar a un amigo | Challenge a friend |
| Modo tranquilo | Modo tranquilo | Modo tranquilo | Calm mode |
| Em breve | Em breve | Próximamente | Coming soon |

---

## 12. Padrões dos jogos

### 12.1 Estrutura comum

Todo jogo segue o modo jogo (seção 6.5) e usa os componentes de `@zuploop/ui`:

1. **Barra do jogo**: Voltar, nome e tema, Ajuda (?) e Favorito.
2. **Informações** (opcional, uma linha): tempo, pontos ou progresso ("3 de 8 palavras"), em `--text-md` com números tabulares. O tempo pode ser escondido no modo tranquilo.
3. **Área do jogo**: o maior espaço possível.
4. **Ações** (opcional): dica, desfazer, apagar, em botões de 56 px com ícone e rótulo.

### 12.2 Interação

- Toque e mouse com a mesma lógica; arrastar sempre tem alternativa de tocar início e fim.
- Seleção em andamento com `--game-select-bg`; resultado marcado com `--game-mark-*` em rodízio.
- Retorno imediato a cada ação (menos de 100 ms); jogada inválida mostra um tremor curto (desligado no modo tranquilo) e uma mensagem para leitores de tela, nunca um som alto.
- Sem sons por padrão nesta versão.

### 12.3 Fim da partida

Tela própria (RF-NAV-05), com:

- título de celebração em `--text-3xl`, curto ("Muito bem!");
- resumo (tempo, pontos, recorde) em blocos com números grandes em Lexend;
- ação principal "Próximo tema" (`primary`), secundárias "Jogar de novo" e "Compartilhar", favorito;
- o intervalo de anúncio, quando houver, aparece **antes** dessa tela, nunca no meio dela.

### 12.4 Impressão

Folha de estilo de impressão (`@media print`): só a grade e a lista, em preto sobre branco, sem cores de marcação, com título, regras no topo e gabarito em página separada (RF-CP-05). Cabe em A4 e Carta.

---

## 13. CSS

### 13.1 Arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `packages/ui/src/tokens.css` | Todos os tokens (`:root`) e as trocas de alto contraste e tamanho de texto |
| `packages/ui/src/base.css` | Normalização mínima, fontes, foco, `body`, links, utilitários de acessibilidade (`.visually-hidden`) |
| `packages/ui/src/components/<Nome>/<Nome>.module.css` | Estilo de cada componente |
| `apps/web/src/**/<Nome>.module.css` | Estilo de páginas e montagens do site |
| `packages/games/<jogo>/src/**/*.module.css` | Estilo do jogo |

`tokens.css` e `base.css` são importados uma vez no layout raiz do site.

### 13.2 Regras

- **Só tokens.** Proibido hexadecimal, `rgb()`, nome de cor, `font-family` e `px` de tamanho de fonte fora de `tokens.css`. `px` é aceito só para bordas (1 a 3 px).
- **Mobile first**: estilo base para o celular; `@media (min-width: 48rem)` e `@media (min-width: 64rem)` acrescentam.
- **Propriedades lógicas** (`margin-inline`, `padding-block`, `inset-inline-start`), para não precisar refazer nada se um dia houver idioma da direita para a esquerda.
- **Variantes por atributo**: `<button data-variant="primary" data-size="lg">` e no CSS `.button[data-variant="primary"]`.
- **Classes em camelCase** no CSS Module (`.cardTitle`), sem prefixos manuais; o CSS Module já isola.
- **Sem `!important`**, sem seletores de ID, no máximo dois níveis de aninhamento.
- **Sem estilos inline** (`style={{…}}`), exceto valores calculados em tempo de execução (posição de seleção na grade), sempre com tokens.
- **Animações** só com `transform` e `opacity`, usando os tokens de duração.
- **z-index** só com os tokens de camada.

### 13.3 Exemplo

```css
/* packages/ui/src/components/Button/Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  min-block-size: var(--control-lg);
  padding-inline: var(--space-5);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  font: 700 var(--text-base) / var(--leading-tight) var(--font-text);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.button[data-variant="primary"] {
  background: var(--color-primary);
  color: var(--color-on-primary);
}
.button[data-variant="primary"]:hover,
.button[data-variant="primary"]:active {
  background: var(--color-primary-hover);
}

.button[data-variant="secondary"] {
  background: var(--color-surface);
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.button[data-size="sm"] {
  min-block-size: var(--control-sm);
  padding-inline: var(--space-4);
  border-radius: var(--radius-pill);
  font-size: var(--text-md);
}

.button[aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
}
```

---

## 14. Checklist de uma tela nova

- [ ] Usa só componentes de `@zuploop/ui` e tokens; nenhuma cor ou tamanho solto.
- [ ] Uma única ação principal (`primary`).
- [ ] Funciona em 360 px, em 1280 px e com texto em 125%.
- [ ] Todos os alvos com 44 px ou mais.
- [ ] Ordem de foco correta, foco visível, Esc fecha o que abriu.
- [ ] Textos em `messages/` nos três idiomas, seguindo o glossário; layout aguenta o espanhol.
- [ ] Estados vazio, erro e carregando desenhados.
- [ ] Nenhum anúncio na área do jogo nem em tela cheia.
- [ ] axe sem falhas e Lighthouse de acessibilidade em 100.
- [ ] Alto contraste e modo tranquilo conferidos.

---

## 15. Manutenção

- Mudança de token ou componente: primeiro este documento, depois `packages/ui`, depois o protótipo.
- Mudança que altere o visual de várias telas (nova cor de marca, nova fonte) exige um ADR.
- Cada componente novo entra com variantes, estados, regras de acessibilidade e exemplo nesta seção 9.
- A versão deste documento sobe a cada mudança: correção (1.0.1), acréscimo (1.1), mudança que quebra telas (2.0).
