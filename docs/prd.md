# PRD do ZupLoop

8 de novembro de 2026 · Juliano Fabio Miranda

Requisitos do produto ZupLoop.com: site e apps de passatempos clássicos para adultos, em português, espanhol e inglês. Cada requisito tem um código (por exemplo, RF-CP-01) para ser citado nas especificações, nas tarefas e nos testes.

## Resumo e contexto da feature

Este PRD cobre o produto ZupLoop.com inteiro, da primeira versão no ar (fase 1) aos apps e ao Premium (fase 5); cada funcionalidade será detalhada depois numa especificação própria, que cita os códigos de requisito daqui.

O ZupLoop.com é um site e app de passatempos clássicos para adultos (caça-palavras, sudoku, 2048 e damas), em português, espanhol e inglês, gratuito com anúncios discretos e compras únicas para tirar os anúncios. É construído por uma pessoa, nas horas vagas, com ajuda de IA para gerar o código. O negócio, as estimativas e o cronograma estão no [Plano da Plataforma de Jogos](https://claude.ai/artifact/9YBHPgcCpV3hEHqrxYzQw7); as telas estão em [Telas do ZupLoop](https://claude.ai/artifact/WctBmtoD4uAnnXeZha8Gof).

## Problema e motivação

Quem procura passatempos clássicos na internet encontra apps cheios de anúncios, portais genéricos com dezenas de cópias, PDFs para imprimir e sites que exigem cadastro ou funcionam mal no celular.

- **Para o jogador:** falta um lugar calmo, fácil de ler e que abra na hora, com um motivo para voltar todo dia.
- **Para o negócio:** em português e espanhol, a concorrência em caça-palavras e damas na web é fraca, e paciência, palavras cruzadas, sudoku e mahjong estão entre os clássicos mais buscados. O custo de manter um site estático é baixo, o que permite crescer pelo Google sem anunciar.
- **Para o autor:** uma renda extra que cresce com o tempo e um projeto de portfólio com Next.js, Python e Kubernetes.

## Público-alvo e cenários de uso

O público são adultos, inclusive mais velhos, que jogam alguns minutos por dia no celular ou no computador; as personas abaixo são fictícias e servem para decidir detalhes de tela e de texto.

| Persona | Contexto | O que precisa |
| --- | --- | --- |
| Marta, 62 anos, Brasil | Joga caça-palavras no celular todo fim de tarde; enxerga mal letras pequenas | Letras grandes, nada de cadastro, desafio do dia, versão para imprimir |
| Diego, 35 anos, México | Faz um sudoku no computador no intervalo do trabalho | Abrir rápido, continuar de onde parou, níveis de dificuldade |
| Ana, 45 anos, Portugal | Joga damas com um amigo que mora longe | Mandar um link e jogar no seu tempo, sem cadastro para o amigo |
| Jogador frequente | Joga todo dia e se incomoda com anúncios | Comprar uma vez e jogar sem anúncios, com os dados em todos os aparelhos |

Contas são só para quem tem 13 anos ou mais; crianças podem jogar como convidadas, sem dados pessoais.

**Cenários de uso**

1. Marta recebe no WhatsApp o resultado do desafio de uma amiga, abre o link e joga o caça-palavras do dia, sem cadastro, com letras grandes.
2. Diego busca "sudoku difícil online", cai na página desse nível, joga no intervalo e no dia seguinte continua do ponto onde parou.
3. Ana desafia um amigo nas damas por link; cada um joga quando pode e recebe aviso quando é a sua vez.
4. Uma professora imprime um caça-palavras de tema escolar com gabarito.
5. Um jogador frequente compra "Sem anúncios" no site e continua sem anúncios quando instala o app.

## Objetivos e métricas de sucesso

Três objetivos guiam as decisões: fazer o jogador voltar todo dia, crescer pela busca do Google e gerar receita sem poluir a experiência.

| Objetivo | Métrica | Meta (3 meses após o lançamento) | Onde medir |
| --- | --- | --- | --- |
| Crescer pela busca | Visitas vindas do Google | Crescendo todo mês | Search Console |
| Engajar | Partidas por visita | 2 ou mais | Analytics |
| Fazer voltar | Jogadores que voltam na mesma semana | 15% a 20% ou mais | Analytics |
| Gerar receita | Compras de "Sem anúncios" (após a fase 3) | Ao menos algumas por semana | Painel de pagamentos |

Eventos registrados desde a fase 1: partida iniciada, terminada e abandonada; dica usada; tutorial pulado ou concluído; resultado compartilhado; favorito marcado; idioma trocado; convite enviado e aceito; compra iniciada e concluída. A contagem de partidas por jogo, tema e idioma alimenta a futura seção "Mais jogados". As metas são referências do projeto, não dados de mercado.

## Escopo (incluso e fora de escopo)

O produto sai em seis fases ao longo de cerca de 22 semanas; cada requisito abaixo indica a fase em que entra.

| Fase | Semanas | Entrega |
| --- | --- | --- |
| 0 · Preparação | 0 | Nome, domínio, contas, VPS pronta |
| 1 · Primeira versão | 1 a 5 | Site em 3 idiomas, SDK, caça-palavras com 30 temas, impressão, anúncios e consentimento |
| 2 · Hábito diário | 6 a 9 | Sudoku, desafio do dia, favoritos locais, modo tranquilo, acessibilidade, PWA, temas em espanhol |
| 3 · Contas e Sem anúncios | 10 a 13 | API, login opcional, sincronização, perfil, 2048, compra "Sem anúncios" |
| 4 · Jogar com amigos | 14 a 16 | Damas contra o computador e contra amigos por link |
| 5 · Apps e Premium | 17 a 22 | Android, iOS e Premium vitalício |

**Fora de escopo nesta versão:** ranking de jogadores, chat livre, adversário aleatório e partidas ao vivo com desconhecidos, criação de jogos pelos usuários, contas para menores de 13 anos, plano anual, área do professor, outros idiomas além de português, espanhol e inglês, e a seção "Mais jogados" visível (os dados são coletados, mas a seção fica desligada).

## Requisitos funcionais

Cada requisito tem código, critérios de aceite verificáveis e a fase em que entra; as especificações de cada funcionalidade devem citar esses códigos.

### Navegação e idiomas

Toda página existe em português, espanhol e inglês, com endereço próprio, e o jogador chega ao jogo em até dois toques a partir da página inicial.

| ID | Requisito | Critérios de aceite | Fase |
| --- | --- | --- | --- |
| RF-NAV-01 | Página inicial | Mostra o desafio do dia, "Seus favoritos" (quando houver), "Continue jogando" (quando houver partida salva) e acesso a todos os jogos | 1 (favoritos na 2) |
| RF-NAV-02 | Catálogo de jogos | Lista os jogos por categoria (Palavras, Tabuleiro, Números), com busca e filtros; jogos ainda não lançados aparecem como "Em breve" | 1 |
| RF-NAV-03 | Página por jogo e por tema | Cada jogo, tema e nível tem página própria com título, descrição, o jogo e a seção "Como jogar"; o jogo só carrega ao tocar em "Jogar" | 1 |
| RF-NAV-04 | Navegação no celular | Barra inferior com Início, Jogos, Desafio e Ajustes; jogos abrem em tela cheia, sem a barra, com botão de voltar | 1 |
| RF-NAV-05 | Fim da partida | Mostra resultado, tempo e recorde; oferece próximo tema, jogar de novo, compartilhar e favoritar; o único intervalo de anúncio da partida acontece aqui | 1 |
| RF-NAV-06 | Ajustes | Tamanho do texto (3 opções), idioma, modo tranquilo, alto contraste, lembrete do desafio, acesso à conta e à compra, links legais e "Sugira um tema" | 2 |
| RF-I18N-01 | Endereços por idioma | Rotas `/pt/`, `/es/` e `/en/`, com nomes traduzidos dos jogos (`/pt/caca-palavras`, `/es/sopa-de-letras`, `/en/word-search`) | 1 |
| RF-I18N-02 | Escolha do idioma | Ordem: escolha salva > idioma do endereço > idioma do navegador > inglês; redirecionamento automático só na raiz `/` | 1 |
| RF-I18N-03 | Seletor de idioma | Leva à mesma página no outro idioma; sem equivalente, leva à lista daquele jogo; a escolha fica salva | 1 |
| RF-I18N-04 | Sugestão de idioma | Se o idioma do link for diferente do navegador, mostra a faixa "Ver em português?" sem redirecionar | 1 |
| RF-I18N-05 | Textos traduzíveis | Nenhum texto de interface fica no código; todos vêm de arquivos por idioma; o que faltar aparece em inglês | 1 |
| RF-I18N-06 | Idioma no jogo | O jogo recebe o idioma do SDK e mostra botões, regras e mensagens nesse idioma | 1 |

### SDK, jogos e instruções

Todo jogo fala com o portal apenas pelo SDK e tem as regras separadas da tela, com testes automáticos; nenhum jogo vai ao ar sem instruções.

| ID | Requisito | Critérios de aceite | Fase |
| --- | --- | --- | --- |
| RF-SDK-01 | Contrato único | Os jogos só usam o SDK para salvar, carregar, idioma, anúncios, favoritos e eventos; nenhum jogo acessa API, anúncios ou armazenamento diretamente | 1 |
| RF-SDK-02 | Salvamento automático | O estado da partida é salvo no aparelho a cada jogada e ao sair; reabrir o jogo retoma a partida | 1 |
| RF-SDK-03 | Versão do formato salvo | Cada save tem número de versão; um save antigo é convertido ou descartado com aviso, nunca quebra o jogo | 1 |
| RF-SDK-04 | Regras separadas | As regras de cada jogo ficam num módulo sem interface, com testes que cobrem jogadas válidas, inválidas e fim de jogo | 1 |
| RF-CP-01 | Caça-palavras: grade | Gera grade com as palavras do tema na horizontal, vertical e diagonal; toda palavra cabe e pode ser encontrada | 1 |
| RF-CP-02 | Caça-palavras: seleção | Arrastar da primeira à última letra marca a palavra; funciona com mouse e toque; palavra achada fica riscada na lista | 1 |
| RF-CP-03 | Caça-palavras: acentos | Sem acentos na grade em português; o Ñ é mantido em espanhol; regra definida por idioma | 1 |
| RF-CP-04 | Caça-palavras: dica | Dica opcional revela a primeira letra de uma palavra, após um anúncio com recompensa (sem anúncio para quem comprou) | 1 |
| RF-CP-05 | Caça-palavras: impressão | Versão para imprimir com regras no topo e gabarito em outra página; cabe em uma folha A4 ou Carta | 1 |
| RF-SD-01 | Sudoku: gerador | Gera quebra-cabeças com solução única em 4 níveis | 2 |
| RF-SD-02 | Sudoku: jogo | Teclado numérico, anotações, desfazer, apagar, dica e destaque de linha, coluna e quadrado; erros contados e escondidos no modo tranquilo | 2 |
| RF-2048-01 | 2048 | Deslizar ou setas movem as peças; desfazer uma jogada; pontos e recorde; partida longa salva | 3 |
| RF-DM-01 | Damas: regras | Regras da damas brasileira (tabuleiro 8×8, captura obrigatória, dama que anda várias casas), confirmadas na questão em aberto Q-02 | 4 |
| RF-DM-02 | Damas: computador | Três níveis de dificuldade; jogada do computador em até 2 segundos no celular | 4 |
| RF-AJ-01 | Tutorial | Na primeira partida de cada jogo, tutorial de até 3 passos com opção de pular; não aparece de novo | 1 |
| RF-AJ-02 | Botão "?" | Abre as regras a qualquer momento sem perder a partida | 1 |
| RF-AJ-03 | "Como jogar" na página | Regras, controles e uma dica de estratégia em texto HTML, no idioma da página, diferente para cada jogo | 1 |

### Conteúdo e desafio do dia

Temas e desafios são dados, não código: publicar um tema novo é adicionar um arquivo revisado, e os desafios ficam agendados com semanas de antecedência.

| ID | Requisito | Critérios de aceite | Fase |
| --- | --- | --- | --- |
| RF-CONT-01 | Temas em arquivos | Cada tema é um arquivo JSON por idioma com identificador, título, descrição, palavras, nível e endereço; a página do tema é gerada a partir dele | 1 |
| RF-CONT-02 | Fábrica de temas | Serviço interno gera rascunhos com IA, confere as palavras num dicionário, aplica filtro de palavras impróprias e só publica depois de aprovação manual | 2 |
| RF-CONT-03 | Unicidade de conteúdo | Cada tema tem palavras e descrição próprias; a publicação recusa temas com mais da metade das palavras iguais a outro | 2 |
| RF-CONT-04 | Sugira um tema | Formulário simples (tema e idioma) que grava a sugestão para revisão, sem exigir conta | 2 |
| RF-DIA-01 | Desafio do dia | Um desafio por dia, igual para todos no mesmo idioma nos jogos de palavras e igual para todos no sudoku; muda à meia-noite no horário do aparelho | 2 |
| RF-DIA-02 | Agendamento | Desafios definidos com pelo menos 2 semanas de antecedência; se faltar um dia, o sistema escolhe um tema aprovado automaticamente | 2 |
| RF-DIA-03 | Sequência | Conta dias seguidos com desafio concluído e o recorde; mostra a semana atual | 2 |
| RF-DIA-04 | Compartilhar | Gera texto curto com número do desafio, tempo e sequência, mais o link, sem revelar a resposta | 2 |
| RF-DIA-05 | Dias anteriores | Os últimos 7 dias podem ser jogados por todos; todos os anteriores só no Premium | 2 (Premium na 5) |

### Favoritos, conta e sincronização

Jogar nunca exige conta; a conta só leva progresso, favoritos e compras para todos os aparelhos.

| ID | Requisito | Critérios de aceite | Fase |
| --- | --- | --- | --- |
| RF-FAV-01 | Favoritar | Coração em jogos, temas e níveis (cards, página do jogo, topo da partida e fim da partida); tocar de novo remove | 2 |
| RF-FAV-02 | Seus favoritos | Seção na página inicial com os favoritos; sem login, mostra o aviso "Salvos neste aparelho" | 2 |
| RF-CONTA-01 | Login opcional | Entrar com Google, com Facebook ou com código de 6 dígitos por e-mail (válido por 10 minutos); "Entrar com Apple" no app iOS; o mesmo e-mail confirmado em provedores diferentes leva à mesma conta | 3 (Apple na 5) |
| RF-CONTA-02 | Idade mínima | Ao criar a conta, a pessoa confirma ter 13 anos ou mais (16 onde a lei exigir); abaixo disso, só joga como convidada | 3 |
| RF-CONTA-03 | Sincronização | Saves, favoritos, sequência do desafio e compras sincronizam entre site e apps; sem internet, o aparelho guarda e envia depois | 3 |
| RF-CONTA-04 | Juntar ao entrar | No primeiro login, o progresso e os favoritos do aparelho vão para a conta; em conflito do mesmo jogo, fica o save mais recente | 3 |
| RF-CONTA-05 | Perfil | Apelido público único (RF-CONTA-08), sair, baixar meus dados e excluir conta | 3 |
| RF-CONTA-06 | Exclusão de conta | Excluir apaga dados pessoais e progresso em até 30 dias e mantém só o registro de compras exigido por lei | 3 |
| RF-CONTA-07 | Lembrete do desafio | Notificação diária opcional (PWA ou app), desligada por padrão, com horário escolhido pela pessoa | 3 |
| RF-CONTA-08 | Apelido único | Cada conta tem um apelido único, gerado na criação (ex.: "Coruja Azul 482", no idioma da pessoa) e editável no perfil; 3 a 20 caracteres com letras (acentos e Ñ), números, espaço e hífen; a unicidade ignora maiúsculas, acentos e espaços repetidos ("Ana Lu" = "ana  lú"); apelido em uso mostra 3 sugestões livres; filtro de palavras impróprias em PT, ES e EN, nomes reservados (ZupLoop, admin, suporte) e nada que pareça e-mail, telefone ou link; troca no máximo 1 vez a cada 30 dias; apelido liberado (por troca ou exclusão de conta) só volta a ficar disponível após 90 dias; apelido denunciado e confirmado volta a um gerado; internamente a conta é identificada por um ID, nunca pelo apelido | 3 |

### Anúncios e compras

Anúncios aparecem só nas pausas e nunca durante o jogo; as compras são únicas, ficam na conta e são confirmadas pelo servidor.

| ID | Requisito | Critérios de aceite | Fase |
| --- | --- | --- | --- |
| RF-ADS-01 | Onde aparecem | Banner fora da área do jogo, com espaço reservado (a página não pula); intervalo só no fim da partida; dica com anúncio opcional | 1 |
| RF-ADS-02 | Frequência | Nenhum intervalo na primeira partida da sessão; no máximo um intervalo a cada 3 minutos; nunca anúncio com som automático ou por cima do jogo | 1 |
| RF-ADS-03 | Consentimento | Banner de consentimento certificado antes de qualquer anúncio personalizado; quem recusa vê anúncios não personalizados | 1 |
| RF-ADS-04 | Camada única | O SDK escolhe a rede de anúncios (AdSense no site, AdMob nos apps) sem mudança nos jogos | 1 (AdMob na 5) |
| RF-PAG-01 | Sem anúncios | Compra única que remove todos os anúncios, inclusive o da dica: R$ 7,90, US$ 2,99, € 2,99; Pix e cartão no site | 3 |
| RF-PAG-02 | Premium vitalício | Compra única: sem anúncios, temas extras, impressão sem marca com gabarito, estatísticas e todos os desafios anteriores: R$ 14,90, US$ 5,99, € 5,99 | 5 |
| RF-PAG-03 | Upgrade | Quem tem "Sem anúncios" vira Premium pagando a diferença | 5 |
| RF-PAG-04 | Preço por país | O preço e a moeda seguem o país do jogador | 3 |
| RF-PAG-05 | Compra ligada à conta | Comprar exige login; o direito de uso só é liberado quando o servidor recebe a confirmação do pagamento | 3 |
| RF-PAG-06 | Restaurar compra | Botão "Restaurar compra" no site e nos apps; a mesma compra vale em todos os aparelhos da conta | 3 |
| RF-PAG-07 | Compras nos apps | Nos apps, compras pelas lojas, unificadas pelo RevenueCat e ligadas à mesma conta | 5 |

### Jogar com amigos por link

Quem convida precisa de conta; quem recebe o link joga na hora, sem cadastro, e o servidor é quem decide se cada jogada vale.

| ID | Requisito | Critérios de aceite | Fase |
| --- | --- | --- | --- |
| RF-MULTI-01 | Criar convite | Na partida de damas, "Desafiar um amigo" cria a partida com modo (no seu tempo ou ao vivo) e cor das peças (claras, escuras ou sorteio) e gera um link | 4 |
| RF-MULTI-02 | Compartilhar | Botão de enviar usa o compartilhamento do aparelho; "Copiar link" como alternativa | 4 |
| RF-MULTI-03 | Prévia do link | O link mostra imagem do tabuleiro e "Fulano te desafiou para uma partida de damas" no idioma de quem recebe | 4 |
| RF-MULTI-04 | Entrar sem cadastro | Quem abre o link vê quem convidou, as cores e o modo, e joga ao tocar em "Aceitar e jogar"; pode recusar | 4 |
| RF-MULTI-05 | Jogadas no servidor | A partida fica no servidor; cada jogada é conferida pelas mesmas regras do RF-SDK-04; jogada inválida é recusada | 4 |
| RF-MULTI-06 | Sua vez | Avisa quem deve jogar (notificação ou e-mail, para quem tem conta); o convidado sem conta vê a vez ao reabrir o link | 4 |
| RF-MULTI-07 | Segurança | Sem chat livre: só mensagens prontas; bloquear e denunciar; o link vale para uma partida e expira após 7 dias sem jogadas | 4 |
| RF-MULTI-08 | Fim e revanche | Mostra placar entre os dois, revanche, desafiar outro amigo, o desafio do dia e convite para criar conta | 4 |

### Site instalável e apps

O site e os apps saem do mesmo código exportado em arquivos estáticos; os apps acrescentam notificações, compras das lojas e AdMob.

| ID | Requisito | Critérios de aceite | Fase |
| --- | --- | --- | --- |
| RF-APP-01 | Site instalável (PWA) | Pode ser instalado na tela inicial; jogos já abertos funcionam sem internet; convite para instalar só após a segunda ou terceira visita | 2 |
| RF-APP-02 | App Android | Publicado na Google Play com Capacitor, com AdMob, compras da loja e notificações | 5 |
| RF-APP-03 | App iOS | Publicado na App Store, com "Entrar com Apple", compras da loja, notificações e modo offline (para não ser apenas um site embrulhado) | 5 |
| RF-APP-04 | Mesma conta | Progresso, favoritos e compras iguais no site e nos apps | 5 |
| RF-APP-05 | Idioma do aparelho | O app usa o idioma do celular na primeira abertura e permite trocar em Ajustes | 5 |

## Requisitos não funcionais

O site tem de ser rápido no celular, acessível, bem lido pelo Google e seguro com os dados das pessoas, mesmo rodando numa única VPS.

| ID | Área | Requisito e critério de aceite |
| --- | --- | --- |
| RNF-01 | Desempenho | Core Web Vitals "bons" no celular (LCP até 2,5 s, INP até 200 ms, CLS até 0,1) nas páginas de jogo e de tema; o jogo só carrega ao tocar em "Jogar" |
| RNF-02 | Acessibilidade | WCAG 2.2 nível AA: contraste mínimo de 4,5:1, áreas de toque de pelo menos 44 px, uso pelo teclado, rótulos para leitores de tela, texto ajustável e cores que não dependem só do tom |
| RNF-03 | SEO | Páginas em HTML estático com título e descrição únicos; tags `hreflang`; mapa do site por idioma; "Como jogar" em texto na página |
| RNF-04 | Segurança | HTTPS em tudo; cada pessoa só lê e grava os próprios dados; limite de tentativas no login e na API; compras confirmadas só por aviso do meio de pagamento ao servidor; segredos só em variáveis de ambiente (arquivo .env fora do Git, lido pelo docker-compose, e Secrets no Kubernetes), nunca no código |
| RNF-05 | Privacidade | LGPD e GDPR: consentimento de cookies, coleta mínima (e-mail, apelido, progresso), baixar e excluir dados, política de privacidade em cada idioma, nenhum dado pessoal de menores |
| RNF-06 | Disponibilidade | O site e os jogos funcionam mesmo com a API fora do ar; backup diário do banco fora da VPS; restauração testada uma vez por mês; monitor que avisa quedas |
| RNF-07 | Compatibilidade | Últimas duas versões do Chrome, Safari, Firefox e Edge; celulares a partir de 360 px de largura; Android e iOS nas versões suportadas pelo Capacitor escolhido |
| RNF-08 | Observabilidade | Registro de erros do site, dos apps e da API (GlitchTip ou Sentry); logs da API; métricas básicas do servidor |
| RNF-09 | Qualidade | Testes automáticos das regras dos jogos e da API; testes de ponta a ponta (Playwright) dos fluxos principais; publicação só com testes passando |
| RNF-10 | Versões | Versões fixadas conforme o plano: Next.js 16, React 19, Node.js 24, TypeScript 5, Python 3.13, FastAPI com Pydantic 2, SQLAlchemy 2.0, Alembic 1, PostgreSQL 17 |
| RNF-11 | Infraestrutura | Tudo na VPS com Kubernetes (Nginx, API, Postgres com CloudNativePG, CronJobs), sem CDN na frente (DNS do provedor do domínio, HTTPS com Let's Encrypt na VPS); custo fixo inicial só de VPS e domínio |

## Decisões e trade-offs principais

As decisões abaixo já foram tomadas; mudá-las exige revisar este PRD antes das especificações.

| Decisão | Alternativa descartada | O que se ganha | O que se perde |
| --- | --- | --- | --- |
| Nicho de passatempos para adultos | Portal genérico ou plataforma de criação com IA | Concorrência mais fraca, páginas que ranqueiam, identidade clara | Teto de público menor |
| Next.js 16 em exportação estática | Astro; Next.js como servidor | Mercado de trabalho, muito material para a IA, mesmo resultado para site e apps | Mais pesado e mais difícil de aprender que o Astro; sem recursos de servidor do Next.js |
| API própria em Python (FastAPI) com Postgres | Serviço pronto (Supabase) | Controle total e aprendizado | Mais código de segurança e cerca de uma semana a mais na fase 3 |
| Tudo na VPS com Kubernetes | Hospedagem gerenciada | Custo fixo só de VPS e domínio | Ponto único de falha; backups e atualizações por sua conta |
| Login opcional desde a fase 3 | Login obrigatório | Ninguém desiste por causa de cadastro | Parte do progresso fica só no aparelho |
| Salvamento sempre local primeiro | Só na nuvem | Funciona sem internet e com a API fora | Lógica de juntar dados ao entrar |
| Anúncios só nas pausas + compras únicas | Mais anúncios ou assinatura mensal | Experiência limpa; compra fácil de aceitar | Menos receita por visita no início |
| Convite por link antes de adversário aleatório | Partidas aleatórias desde o início | Funciona com pouco tráfego e divulga o site | Quem não tem amigo para convidar joga só contra o computador |
| Sem ranking de jogadores | Ranking global | Público adulto não se sente desmotivado; nada de trapaça para combater | Menos competição para quem gosta |
| Versões consolidadas e fixadas | Sempre a mais nova | A IA conhece bem; menos surpresas | Recursos novos chegam mais tarde |

Modelo de dados, contratos da API e interface do SDK ficam no plano técnico de cada especificação, não neste PRD.

## Dependências

O produto depende de alguns serviços externos e de requisitos que precisam existir antes de outros; as especificações devem seguir essa ordem.

**Serviços externos**

| Dependência | Para quê | Fase | Custo |
| --- | --- | --- | --- |
| Domínio ZupLoop.com e busca de marca | Endereço e nome do produto | 0 | Registro anual |
| VPS com Kubernetes | Site, API, banco e tarefas | 0 | Mensalidade da VPS |
| DNS do provedor do domínio | Apontar o domínio para a VPS | 0 | Em geral incluído no registro do domínio |
| Google AdSense e solução para jogos HTML5 | Anúncios no site (exige aprovação) | 1 | Gera receita |
| Banner de consentimento certificado | LGPD e GDPR | 1 | Grátis |
| Google Analytics e Search Console | Medição e busca | 1 | Grátis |
| Serviço de envio de e-mail | Códigos de login e lista de e-mails | 2 | Plano gratuito |
| Armazenamento externo (Backblaze B2 ou compatível com S3) | Backup do banco | 3 | Plano gratuito |
| Login com Google e Facebook | Entrar na conta | 3 | Grátis |
| Stripe ou Mercado Pago | Compras no site, com Pix e cartão | 3 | Parte de cada venda |
| Google Play e App Store | Publicar os apps | 5 | Taxa única (Google) e anuidade (Apple) |
| AdMob, RevenueCat e Entrar com Apple | Anúncios, compras e login nos apps | 5 | Grátis até certo volume ou parte de cada venda |

**Ordem entre requisitos**

1. RF-I18N e RF-SDK vêm antes de qualquer jogo.
2. RF-CONT-01 vem antes do caça-palavras e do desafio do dia.
3. RF-CONTA (API e login) vem antes de RF-PAG e de RF-MULTI.
4. RF-SDK-04 (regras separadas) vem antes de RF-MULTI-05, que reaproveita as regras no servidor.
5. RF-APP-01 (PWA) e RF-ADS-04 vêm antes dos apps (RF-APP-02 e RF-APP-03).

## Riscos e mitigação

O maior risco é o tráfego do Google demorar; os demais têm mitigação simples desde o início.

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Tráfego do Google demora a crescer | Alta | Alto | Lançar a fase 1 cedo, 3 a 5 temas por semana, Pinterest, desafio compartilhável e convite por link |
| Nome ZupLoop com conflito de marca (série de jogos "Zup!") | Média | Alto | Busca no INPI, USPTO e EUIPO antes de investir na marca |
| Código gerado por IA com falhas de segurança | Média | Alto | Revisão manual de login, acesso a dados e pagamentos; testes automáticos; publicação só com testes passando |
| Aprendizado de React e Next.js atrasa a fase 1 | Média | Médio | Uma semana a mais no cronograma; começar pelo caça-palavras; pedir à IA que explique cada trecho |
| VPS fora do ar ou perda de dados | Baixa | Alto | Backup diário fora da VPS, restauração testada, limite de requisições no Nginx, firewall, salvamento local como reserva, monitor de quedas |
| Palavras erradas ou impróprias nos temas | Média | Médio | Dicionário, filtro e aprovação manual (RF-CONT-02) |
| Conteúdo repetido rebaixado pelo Google | Média | Médio | Temas únicos e revisados (RF-CONT-03) |
| Anúncios recusados ou conta suspensa | Baixa | Alto | Seguir as políticas, nada de tráfego falso, consentimento correto |
| Abuso no convite por link | Baixa | Médio | Sem chat livre, mensagens prontas, bloquear e denunciar, link de uma partida |
| Trapaça nas partidas | Baixa | Baixo | Jogadas conferidas no servidor |
| Revisão das lojas recusa o app iOS | Média | Médio | Recursos próprios de app: offline, notificações e compras nativas |
| Versões ficam sem suporte | Baixa | Médio | Versões fixadas e revisão anual |

## Critérios de aceitação

Cada requisito funcional tem seus critérios nas tabelas acima; uma fase só é lançada quando todos os requisitos dela passam nos critérios e nos itens gerais abaixo.

**Válido para toda fase**

- [ ] Todos os requisitos da fase passam nos critérios de aceite da tabela
- [ ] Telas em português, espanhol e inglês, sem texto fixo no código
- [ ] Core Web Vitals "bons" no celular nas páginas novas (RNF-01)
- [ ] Verificação de acessibilidade sem erros de nível AA (RNF-02)
- [ ] Testes automáticos passando e fluxos principais testados em celular Android, iPhone e computador
- [ ] Instruções de como jogar em todo jogo novo (RF-AJ)
- [ ] Eventos da fase aparecendo no analytics

**Fluxos principais**

```gherkin
# language: pt
Funcionalidade: Desafio do dia sem cadastro
  Cenário: Jogar e compartilhar o desafio
    Dado que abro o ZupLoop pela primeira vez, sem conta, com o navegador em português
    Quando toco em "Jogar o desafio" e encontro todas as palavras
    Então vejo meu tempo e a sequência de 1 dia
    E posso compartilhar um texto com o link, sem revelar as palavras
    E nenhum anúncio de intervalo aparece nessa primeira partida

Funcionalidade: Continuar de onde parei
  Cenário: Retomar o sudoku no dia seguinte
    Dado que deixei um sudoku médio pela metade neste aparelho
    Quando volto ao ZupLoop no dia seguinte
    Então vejo "Continue jogando" com o sudoku
    E a partida abre exatamente como deixei

Funcionalidade: Juntar progresso ao criar conta
  Cenário: Entrar pela primeira vez com favoritos no aparelho
    Dado que favoritei 3 temas sem estar logado
    Quando entro com o Google
    Então os 3 favoritos continuam lá
    E aparecem também quando entro em outro aparelho

Funcionalidade: Comprar Sem anúncios
  Cenário: Compra confirmada pelo servidor
    Dado que estou logado no Brasil
    Quando compro "Sem anúncios" por R$ 7,90 com Pix
    Então os anúncios somem só depois que o servidor recebe a confirmação do pagamento
    E continuam sumidos no app ao entrar com a mesma conta

Funcionalidade: Desafiar um amigo
  Cenário: Amigo joga sem cadastro
    Dado que criei uma partida de damas "no seu tempo" e enviei o link
    Quando meu amigo abre o link sem ter conta
    Então ele vê meu nome, as cores e joga ao tocar em "Aceitar e jogar"
    E uma jogada inválida dele é recusada pelo servidor
```

## Estratégia de testes e validação

O código é validado por testes automáticos em camadas antes de cada publicação, e o produto é validado com jogadores reais e com as métricas de sucesso depois de cada fase.

| Camada | O que cobre | Ferramenta | Quando roda |
| --- | --- | --- | --- |
| Testes de regras | Gerador do caça-palavras, sudoku com solução única, jogadas do 2048 e das damas, migração de saves | Vitest | A cada alteração |
| Testes de componentes | Telas e interações isoladas (seleção de palavras, favoritar, seletor de idioma) | Vitest com Testing Library | A cada alteração |
| Testes da API | Login, sincronização, juntar dados, compras, partidas e acesso só aos próprios dados | pytest com banco Postgres de teste | A cada alteração |
| Testes de ponta a ponta | Os fluxos dos critérios de aceitação, em celular e computador | Playwright | Antes de cada publicação |
| Acessibilidade | Contraste, rótulos e uso pelo teclado | axe com Playwright e revisão manual | Antes de cada publicação |
| Desempenho e SEO | Core Web Vitals, títulos, `hreflang` e mapa do site | Lighthouse | Antes de cada publicação |
| Pagamentos | Compra, confirmação, reembolso e restauração | Ambientes de teste do Stripe ou Mercado Pago e das lojas | Fases 3 e 5 |
| Backup | Restaurar o banco a partir do backup externo | Rotina manual | Uma vez por mês |

**Publicação**

- O GitHub Actions roda os testes a cada alteração; o docker-compose sobe a aplicação inteira para testes locais; a publicação no Kubernetes é manual e só acontece com todos os testes passando.
- Toda especificação traz os critérios de aceite do PRD como testes antes de a IA escrever o código.
- Erros em produção chegam pelo GlitchTip ou Sentry e viram um teste novo quando corrigidos.

**Validação com pessoas e números**

- Antes de cada lançamento: 5 ou 6 pessoas do público (incluindo pessoas mais velhas) jogam no próprio celular enquanto você observa onde travam.
- Depois do lançamento: acompanhar as métricas de sucesso e os eventos; cerca de 3 meses após a fase 1, decidir entre seguir, ajustar ou rever o nicho, como descrito no plano.
- Teste de pronto para o Google: cada página nova aparece no Search Console como indexada em até algumas semanas.
