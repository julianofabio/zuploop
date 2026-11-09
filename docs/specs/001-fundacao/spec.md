# Spec 001 · Fundação

| Campo | Valor |
| --- | --- |
| Fase | 1 · Primeira versão |
| Status | Em revisão |
| Como construir | [plan.md (FDD)](plan.md) |
| Tarefas | [tasks.md](tasks.md) |

## O quê

Colocar de pé o esqueleto do ZupLoop: o site nos três idiomas, com navegação, catálogo e página de jogo; o SDK do portal com o contrato completo; um jogo de exemplo que prova o salvamento; a API mínima ligada ao banco; e o ambiente local com docker-compose.

## Por quê

Todas as features seguintes só acrescentam a este esqueleto: um jogo, uma página, uma rota. Resolver idiomas, rotas, SDK, salvamento, imagens Docker e publicação logo no começo tira os maiores riscos técnicos antes do primeiro jogo real (RFC-001).

## Requisitos do PRD

| Requisito | Resumo |
| --- | --- |
| RF-I18N-01 a RF-I18N-06 | Endereços por idioma com nomes traduzidos; escolha do idioma; seletor; faixa de sugestão; textos em arquivos; idioma no jogo |
| RF-SDK-01 a RF-SDK-04 | Contrato único do SDK; salvamento automático; versão do save; regras separadas e testadas |
| RF-NAV-02 a RF-NAV-04 | Catálogo; página por jogo; navegação no celular e jogo em tela cheia |
| RF-NAV-01 (parcial) | Página inicial com acesso aos jogos (desafio e favoritos entram na 007 e 008) |
| RNF-01 a RNF-03 | Desempenho, acessibilidade e SEO base |
| RNF-04, RNF-06, RNF-07 | Segurança base, disponibilidade, compatibilidade |
| RNF-09 a RNF-11 | Qualidade, versões fixadas, infraestrutura |

## Fora desta spec

Jogos reais, anúncios, consentimento e analytics, favoritos funcionando, ajustes além do idioma, PWA, login e qualquer rota de negócio na API. Detalhes na seção 2 do [FDD](plan.md).

## Telas de referência

[Início](../../prototipo/png/Main.png) · [Jogos](../../prototipo/png/Jogos.png) · [Ajustes](../../prototipo/png/Ajustes.png) (só idioma) · [Site · Início](../../prototipo/png/SiteInicio.png) · [Site · Jogos](../../prototipo/png/SiteJogos.png)

Nesta spec, as seções de desafio, favoritos e "Continue jogando" aparecem só como estrutura vazia ou ficam ocultas; elas ganham conteúdo nas specs 007, 008 e 013.

## Critérios de aceite

Os cenários e o checklist estão na [seção 11 do FDD](plan.md#11-critérios-de-aceite). A spec está pronta quando todos passam e o site responde em `https://zuploop.com/` publicado pelo roteiro.

## Decisão pendente

**F001-Q2:** o esqueleto da API fica nesta spec (proposta do FDD). Se você decidir movê-lo para a 012, o grupo G11 do `tasks.md` sai daqui inteiro, e o docker-compose sobe só o site.
