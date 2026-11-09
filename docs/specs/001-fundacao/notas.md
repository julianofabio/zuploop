# Notas da implementação · 001 Fundação

Decisões tomadas durante a implementação quando a spec, o FDD ou os ADRs não diziam o bastante. Em cada uma, foi escolhida a opção mais simples que respeita o FDD e os ADRs. Revise e, se discordar, abra uma tarefa para ajustar.

| ID | Tarefa | Situação | Decisão | Por quê |
| --- | --- | --- | --- | --- |
| N-01 | T001 | `corepack enable` falha sem administrador no Windows (`EPERM` em `C:\Program Files\nodejs`) | O README documenta `corepack enable --install-directory "$HOME/.local/bin"` como alternativa | Mantém o pnpm fixado em `packageManager` sem instalar nada global |
| N-02 | T001 | Versão exata do pnpm 10 | `pnpm@10.34.9`, a última da linha 10 no registro em 8/11/2026 | ADR-0007: versão consolidada e fixada |
| N-03 | T002 | Lint com ou sem checagem de tipos | `typescript-eslint` no modo `strict` sem informação de tipos; os tipos ficam com o `tsc` (`pnpm typecheck`) | Lint rápido e sem um `tsconfig` por arquivo; o `tsc` em modo `strict` já cobre o resto |
| N-04 | T002 | Prettier reformataria as tabelas dos documentos | `.prettierignore` exclui `*.md` e `docs/`; Prettier vale para código e configs | Os documentos são escritos à mão e revisados como texto |
| N-05 | T002 | `core.autocrlf` do Windows converte LF em CRLF | `.gitattributes` com `eol=lf` e `.npmrc` com `save-exact=true` | Scripts de shell e imagens Docker quebram com CRLF; versões exatas (ADR-0007) |
| N-06 | T002 | Regras de jogo "sem DOM" | Além de proibir React e `@zuploop/ui`, o lint proíbe globais do navegador (`window`, `document`, `localStorage`…) em `packages/games/*/src/rules/` | Torna verificável a regra do RF-SDK-04 |
| N-07 | T004 | O gitleaks no CI | Imagem oficial `ghcr.io/gitleaks/gitleaks:v8.30.1` via `docker run`, com histórico completo | Versão fixada (ADR-0007) e sem a licença que a `gitleaks-action` pede para organizações |
| N-08 | T004 | "CI verde no push da `main`" depende de push, que não faço sem pedido seu | Provado localmente: segredo falso (`AKIA…`) num repositório de teste → gitleaks sai com 1; este repositório → sai com 0. O job `web` roda os mesmos comandos do `pnpm check` | **Pendente de validação sua:** fazer push da branch e conferir a aba Actions |
| N-09 | T005 | `GameCategory` do FDD usa valores em português (`palavras`, `tabuleiro`…), contra a regra de código em inglês do `AGENTS.md` | `"words" \| "board" \| "numbers" \| "logic"`; o rótulo exibido vem dos arquivos de idioma | Regra de idioma do código; o FDD §6.1 precisa ser atualizado |
| N-10 | T005 | O SDK precisa do tipo `ComponentType` do React no manifesto | `react` como `peerDependency` e só `import type` no SDK; `@types/react` como dependência de desenvolvimento | O SDK continua sem código de React em tempo de execução |
| N-11 | T005 | Pacotes internos publicados como código-fonte | `exports` aponta para `src/*.ts`; o Next.js transpila (`transpilePackages`) | Sem etapa de build por pacote (ADR-0011: sem orquestrador) |
| N-12 | T006 | `storage.persistent` é síncrono, mas só se sabe se o IndexedDB funciona depois de abri-lo | `createStorage` (e, na T009, `createPortalSdk`) é assíncrono: abre o banco, faz uma leitura de teste e só então entrega o SDK ao jogo | O valor de `persistent` fica correto desde o início; o GameHost já espera o `import()` do jogo |
| N-13 | T006 | Política dos 300 ms | A primeira gravação de um slot sai na hora; as seguintes, dentro do intervalo, viram uma só, com o estado mais novo, no fim do intervalo. `load` lê primeiro a cópia em memória | Nada se perde entre a jogada e a gravação, e a memória é a reserva no `QuotaExceededError` |
| N-14 | T006 | Erros de infraestrutura além dos do FDD | Códigos `storage_unavailable` (IndexedDB não abriu) e `storage_error` (outras falhas de leitura, gravação ou exclusão), além de `save_too_large` e `storage_quota` | O FDD diz para registrar o erro e resolver com valor neutro, sem dar nome a esses dois casos |
