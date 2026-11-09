# ADR-0016 · Formato de erros da API (Problem Details)

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [FDD 001 · Fundação](../specs/001-fundacao/plan.md) · Arquivo: `docs/decisions/0016-formato-de-erros-da-api.md`

## Contexto

A API vai atender o site e os apps. Cada cliente precisa saber, sem adivinhar, o que deu errado para mostrar a mensagem certa no idioma da pessoa. Definir o formato agora evita que cada rota invente o seu.

## Decisão

- **Todos os erros seguem o Problem Details (RFC 9457)**, com `Content-Type: application/problem+json` e os campos `type`, `title`, `status`, `detail` e `instance`.
- **Campos extras**: `code` (identificador estável em `snake_case`, que o cliente usa para escolher a mensagem traduzida) e `requestId`.
- **Erros de validação** (`422`) trazem `errors: [{ "field": "...", "code": "..." }]`.
- `title` e `detail` são em inglês e servem a pessoas e logs; a mensagem que a pessoa vê vem dos arquivos de idioma do cliente, pelo `code`.
- **Erros inesperados** viram `500` com `code: "internal_error"`, sem detalhes internos na resposta.
- **Todo pedido tem `X-Request-ID`**: o recebido, se vier, ou um novo; devolvido na resposta e presente em todos os logs.
- Os códigos ficam listados num único arquivo da API (`app/errors.py`) e documentados no FDD de cada feature que os criar.

## Alternativas descartadas

- **Formato próprio (`{ "error": "..." }`):** mais curto, mas sem padrão e diferente a cada rota.
- **Mensagens traduzidas vindas da API:** a API precisaria conhecer o idioma de cada tela; mantendo a tradução no cliente, a API fica simples.

## Consequências

- O SDK e o site têm um tratamento de erro único para toda a API.
- Um código novo exige a tradução correspondente nos três idiomas do cliente; o teste de mensagens pega a falta.
