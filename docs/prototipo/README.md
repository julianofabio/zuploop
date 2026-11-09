# Protótipo de telas do ZupLoop

Imagens e HTML das telas desenhadas no protótipo, para dar contexto visual a quem implementa (pessoas e IA).

- **Original e editável:** [Telas do ZupLoop](https://claude.ai/artifact/WctBmtoD4uAnnXeZha8Gof).
- **`png/`:** imagem de cada tela. Celular em 390 × 844 (o dobro de pixels, para ficar nítida); computador em 1280 de largura.
- **`html/`:** a mesma tela em HTML comum, com os estilos escritos em cada elemento. Serve para ler medidas, cores e textos exatos; abre direto no navegador.

## Como usar

1. O protótipo mostra **a aparência e o conteúdo** de cada tela. Ele não é código para copiar: os estilos estão escritos em cada elemento só para desenhar.
2. Na implementação, valem o [padrão de interface](../design-system.md) e os componentes de `@zuploop/ui`. Se protótipo e padrão divergirem, **vale o padrão**.
3. Divergências já conhecidas, corrigidas no padrão:
   - borda dos campos: `#D8D2C4` no protótipo, `--color-border-control` (`#8C8478`) no padrão, por contraste;
   - anel de foco: dourado no protótipo, verde `--color-focus` no padrão, por contraste;
   - textos de exemplo (nomes, datas, números) são ilustrativos; os reais vêm dos arquivos de idioma e dos dados.
4. Cada FDD cita as telas da sua feature. A coluna "Features" abaixo diz onde cada tela é implementada.

## Telas

### Navegação principal (celular)

| Tela | Imagem | HTML | O que mostra | Requisitos | Features |
| --- | --- | --- | --- | --- | --- |
| Início | [Main.png](png/Main.png) | [Main.html](html/Main.html) | Desafio de hoje, Seus favoritos, Continue jogando, barra inferior | RF-NAV-01, RF-FAV-02 | 001, 007, 008 |
| Jogos | [Jogos.png](png/Jogos.png) | [Jogos.html](html/Jogos.html) | Catálogo com busca, filtros por categoria e favoritos | RF-NAV-02, RF-FAV-01 | 001 |
| Desafio do dia | [Desafio.png](png/Desafio.png) | [Desafio.html](html/Desafio.html) | Desafio de hoje, sequência, semana e dias anteriores | RF-DIA-01 a 05 | 007 |
| Ajustes | [Ajustes.png](png/Ajustes.png) | [Ajustes.html](html/Ajustes.html) | Conta, tamanho do texto, idioma, modo tranquilo, alto contraste, lembrete, sem anúncios, sugerir tema | RF-NAV-06, RF-I18N-03 | 001 (idioma), 009 |

### Jogando (celular)

| Tela | Imagem | HTML | O que mostra | Requisitos | Features |
| --- | --- | --- | --- | --- | --- |
| Caça-palavras | [CacaPalavras.png](png/CacaPalavras.png) | [CacaPalavras.html](html/CacaPalavras.html) | Partida em andamento: grade, seleção, palavras encontradas, dica e "Como jogar" | RF-CP-01 a 04 | 002 |
| Fim da partida | [FimPartida.png](png/FimPartida.png) | [FimPartida.html](html/FimPartida.html) | Resultado, tempo, recorde, próximo tema, compartilhar e favoritar | RF-NAV-05, RF-DIA-04 | 002, 007 |
| Damas | [Damas.png](png/Damas.png) | [Damas.html](html/Damas.html) | Partida contra o computador e "Desafiar um amigo" | RF-DM-01, 02 | 017 |
| Sudoku | [Sudoku.png](png/Sudoku.png) | [Sudoku.html](html/Sudoku.html) | Partida com teclado numérico, anotações e ajuda | RF-SD-02 | 006 |
| 2048 | [Jogo2048.png](png/Jogo2048.png) | [Jogo2048.html](html/Jogo2048.html) | Partida com pontos, recorde e desfazer | RF-2048-01 | 015 |
| Como jogar · tutorial | [ComoJogar.png](png/ComoJogar.png) | [ComoJogar.html](html/ComoJogar.html) | Tutorial de até 3 passos na primeira partida | RF-AJ-01, 02 | 002 |

### Site no computador

| Tela | Imagem | HTML | O que mostra | Requisitos | Features |
| --- | --- | --- | --- | --- | --- |
| Site · Início | [SiteInicio.png](png/SiteInicio.png) | [SiteInicio.html](html/SiteInicio.html) | Cabeçalho, destaque do desafio, favoritos, continue jogando, jogos, espaço de anúncio, rodapé | RF-NAV-01, RF-ADS-01 | 001, 003, 005 |
| Site · Jogos | [SiteJogos.png](png/SiteJogos.png) | [SiteJogos.html](html/SiteJogos.html) | Catálogo com filtros e cards | RF-NAV-02 | 001 |
| Site · Caça-palavras | [SiteCacaPalavras.png](png/SiteCacaPalavras.png) | [SiteCacaPalavras.html](html/SiteCacaPalavras.html) | Página do jogo e do tema com "Como jogar" em texto, impressão e temas relacionados | RF-NAV-03, RF-AJ-03, RF-CP-05 | 002, 003, 004 |
| Site · Desafio do dia | [SiteDesafio.png](png/SiteDesafio.png) | [SiteDesafio.html](html/SiteDesafio.html) | Desafio, sequência e calendário | RF-DIA-01 a 05 | 007 |

### Desafiar um amigo por link

| Tela | Imagem | HTML | O que mostra | Requisitos | Features |
| --- | --- | --- | --- | --- | --- |
| Convite · Desafiar um amigo | [ConviteCriar.png](png/ConviteCriar.png) | [ConviteCriar.html](html/ConviteCriar.html) | Escolha de modo e cores, envio do link | RF-MULTI-01, 02 | 018 |
| Convite · Mensagem recebida | [ConviteWhatsApp.png](png/ConviteWhatsApp.png) | [ConviteWhatsApp.html](html/ConviteWhatsApp.html) | Prévia do link num app de mensagens | RF-MULTI-03 | 018 |
| Convite · Quem recebe o link | [ConviteRecebido.png](png/ConviteRecebido.png) | [ConviteRecebido.html](html/ConviteRecebido.html) | Aceitar e jogar sem cadastro | RF-MULTI-04 | 018 |
| Convite · Fim e revanche | [Revanche.png](png/Revanche.png) | [Revanche.html](html/Revanche.html) | Placar, revanche e convite para conhecer o site | RF-MULTI-08 | 018 |

### Conta e Premium

| Tela | Imagem | HTML | O que mostra | Requisitos | Features |
| --- | --- | --- | --- | --- | --- |
| Conta · Entrar | [Entrar.png](png/Entrar.png) | [Entrar.html](html/Entrar.html) | Login opcional com Google, Facebook ou código por e-mail | RF-CONTA-01 | 012 |
| Sem anúncios e Premium | [Premium.png](png/Premium.png) | [Premium.html](html/Premium.html) | Comparação dos planos e compra | RF-PAG-01 a 03 | 016, 020 |

## Fluxos

**Navegação**

- Barra inferior no celular: Início, Jogos, Desafio e Ajustes.
- Fluxo principal: Início → Desafio de hoje ou Continue jogando → jogo em tela cheia (sem barra) → Fim da partida → Próximo tema ou Início.
- Jogos abrem direto, sem cadastro. O progresso fica salvo no aparelho.
- Anúncios só no fim da partida e na dica opcional, nunca durante o jogo.
- Favoritos: coração em jogos, temas e níveis; seção "Seus favoritos" no início. Sem login, ficam no aparelho; com login, sincronizam entre site e apps.

**Convite por link**

1. Na partida de damas, "Desafiar um amigo".
2. Escolhe o modo e as peças e envia o link pelo app de mensagens.
3. O amigo abre o link e joga na hora, sem cadastro.
4. No fim: revanche, desafiar outro amigo e conhecer o resto do site.

Sem chat livre: só mensagens prontas. O link vale para uma partida.

**Conta e compras**

- Ajustes → Entrar: opcional, com Google, Facebook ou código por e-mail (Apple no iPhone).
- Ajustes → Jogar sem anúncios → escolhe Sem anúncios ou Premium vitalício → entra na conta → paga com Pix ou cartão.
- Lançamentos: Sem anúncios na fase 3; Premium na fase 5.
