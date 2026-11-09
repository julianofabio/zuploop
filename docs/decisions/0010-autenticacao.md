# ADR-0010 · Login com Google, Facebook e código por e-mail

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [RFC-001](../rfcs/0001-arquitetura-tecnica.md) · Arquivo: `docs/decisions/0010-autenticacao.md`

## Contexto

O login é opcional e entra na fase 3, para sincronizar progresso, guardar compras e convidar amigos. O público é adulto, inclusive mais velho, e usa muito o Facebook. O desenvolvedor quer login pelo Google e pelo Facebook, mantendo o código por e-mail para quem não usa nenhum dos dois.

## Decisão

**Formas de entrar**

| Forma | Onde | Fase |
| --- | --- | --- |
| Google | Site, Android e iOS | 3 |
| Facebook | Site, Android e iOS | 3 |
| Código de 6 dígitos por e-mail, válido por 10 minutos, sem senha | Site, Android e iOS | 3 |
| Apple | Só no app iOS, exigido pela Apple quando há login social | 5 |

**Como funciona**

1. **No site:** a API conduz o fluxo OAuth com PKCE pela biblioteca Authlib, confere a resposta do provedor e abre uma sessão num cookie `HttpOnly`, `Secure` e `SameSite=Lax`, válido para o domínio do site e da API. A sessão fica registrada no PostgreSQL e pode ser encerrada pela pessoa.
2. **Nos apps:** o login usa o SDK nativo de cada provedor. O app envia o comprovante para a API, que o valida com o provedor e devolve um token de sessão guardado no armazenamento seguro do aparelho. No iPhone, o login do Facebook pode vir no modo reduzido (Limited Login), com um token diferente que a API também precisa validar.
3. **Dados pedidos:** só identificador, nome e e-mail. O apelido público é gerado pelo ZupLoop, e a foto não é usada.
4. **Uma conta, várias formas de entrar:** cada conta guarda uma lista de identidades (provedor e identificador). O mesmo e-mail confirmado em provedores diferentes leva à mesma conta, e a pessoa pode ligar ou desligar formas de entrar no perfil. Conta do Facebook sem e-mail fica ligada só ao identificador do Facebook.
5. **Proteções:** limite de tentativas por IP e por e-mail no código, código de uso único, confirmação de idade mínima na criação da conta.
6. **Chaves dos provedores:** identificadores e segredos de Google, Facebook e Apple ficam no `.env` (ADR-0009).
7. **Exigências dos provedores:** política de privacidade publicada em cada idioma, termos de uso e, para o Facebook, uma forma de pedir a exclusão dos dados ligada à exclusão de conta (RF-CONTA-06).

## Alternativas descartadas

- **Só Google e Facebook:** dispensaria o serviço de e-mail, mas deixaria de fora quem não usa nenhum dos dois ou não quer ligá-los ao jogo.
- **E-mail e senha:** exige guardar senhas, recuperar senha e proteger contra vazamento; o código por e-mail resolve sem senha.
- **Serviço pronto de autenticação:** menos código, mas contraria a API própria do ADR-0002.

## Consequências

- Três fluxos de login para testar e manter, mais o da Apple na fase 5.
- O serviço de envio de e-mail continua necessário (Q-03 do RFC-001).
- Se o Google ou o Facebook mudarem regras ou recusarem o app, o código por e-mail mantém todos com acesso à conta.
- O código de login precisa de revisão manual antes de publicar, como todo trecho de segurança gerado por IA.
