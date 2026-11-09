# ADR-0005 · Salvamento local primeiro e login opcional

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [RFC-001](../rfcs/0001-arquitetura-tecnica.md) · Arquivo: `docs/decisions/0005-local-primeiro-login-opcional.md`

## Contexto

O público desiste quando precisa se cadastrar, mas o desenvolvedor quer salvar o estado dos jogos (por exemplo, uma partida longa de 2048) desde o início, sem refazer os jogos quando o login chegar na fase 3.

## Decisão

Todo save vai primeiro para o aparelho, pelo SDK, com número de versão do formato. O login é opcional a partir da fase 3; ao entrar pela primeira vez, progresso e favoritos do aparelho vão para a conta e, em conflito do mesmo jogo, fica o save mais recente. Sem internet, o aparelho guarda e envia depois.

## Alternativas descartadas

- **Login obrigatório:** simplifica a sincronização, mas afasta quem só quer jogar alguns minutos.
- **Salvar só na nuvem:** o jogo pararia sem internet ou com a API fora do ar.

## Consequências

- Jogar nunca exige conta e funciona sem servidor.
- Os jogos não mudam quando a sincronização é ligada; só o SDK muda.
- É preciso testar bem a lógica de juntar dados ao entrar e a conversão de saves antigos.
