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
