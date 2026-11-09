# Guia de Validação (Fase 3)

Objetivo: provar que a aplicação refatorada **inicia sem erros** e que **todos os endpoints originais
respondem com o mesmo contrato**. Funciona em Linux, macOS e Windows (Git Bash/PowerShell).

## 1. Preparar o ambiente

| Stack | Instalação | Verificação rápida de sintaxe/import |
|---|---|---|
| Python | `python -m venv .venv` (se não existir) e `pip install -r requirements.txt` | `python -c "import sys; sys.path.insert(0, 'src'); import app"` (omita o `sys.path` se não houver `src/`) |
| Node | `npm install` (ou `npm ci` se houver lockfile) | `node --check <arquivo>` em cada arquivo alterado |

- No Windows, o Python do venv fica em `.venv/Scripts/python`; em Unix, `.venv/bin/python`.
- Se uma dependência nova for realmente necessária, adicione-a ao manifesto e justifique no resumo. Prefira a stdlib / dependências já declaradas.
- Bancos SQLite em arquivo (`*.db`): faça backup antes do baseline (`cp app.db app.db.bak`) e restaure antes da validação final, para comparar respostas sobre os mesmos dados. Remova o backup ao final.

## 2. Capturar o baseline (antes de modificar o código)

1. Suba a aplicação original **em background** com o comando detectado na Fase 1 (ex.: `python app.py`, `npm start`), usando a ferramenta de shell com execução em background.
2. Aguarde a porta responder (poll curto, ex.: até 15 tentativas de `curl -s -o /dev/null -w "%{http_code}" http://localhost:<porta>/`).
3. Para cada endpoint **seguro** (GET e operações idempotentes de leitura), registre `método path → status + corpo (truncado)`:
   ```bash
   curl -s -w "\n%{http_code}\n" http://localhost:5000/produtos
   ```
4. Para endpoints de escrita (POST/PUT/DELETE), use payloads de exemplo do `api.http`, README ou derivados do código, na ordem: criar → ler → atualizar → deletar recurso criado no teste. **Não** execute no baseline endpoints destrutivos globais (reset de banco, SQL arbitrário) — apenas registre que existem.
5. Pare o processo (encerre a tarefa em background; em último caso `kill <pid>` / `Stop-Process`).
6. Guarde o baseline na conversa como uma tabela — não é necessário criar arquivos.

## 3. Validar a versão refatorada

1. Rode a verificação de sintaxe/import (tabela da seção 1).
2. Suba a aplicação com o comando documentado em *How to Run* (e confirme que o comando original também funciona, se foi mantido).
3. Verifique o log de boot: nenhum traceback/stack trace, nenhum warning de import.
4. Repita **as mesmas requisições** do baseline e compare:
   - Status code igual.
   - Mesmas chaves no JSON de topo e nos itens (valores podem diferir em IDs/timestamps).
   - Diferenças só são aceitáveis se listadas como *Intentional Breaking Changes* (ex.: senha removida da resposta, rota admin agora exige `X-Admin-Token` e retorna 403 sem ele).
5. Teste as rotas protegidas nos dois cenários: sem token (403) e com token (`ADMIN_TOKEN=teste` no ambiente + header) → comportamento original. Exceções:
   - Endpoint de SQL arbitrário: fica desativado (PB-05), então espere 403 nos dois cenários.
   - Endpoint destrutivo global (ex.: reset de banco): execute com token somente contra um banco temporário. Se o banco não puder ser redirecionado, não execute e marque esse cenário como não verificado.
6. Teste ao menos um caso de erro por recurso (ID inexistente → 404, body inválido → 400) para validar o error handler centralizado.
7. Pare o processo e restaure/remova arquivos temporários (backups de banco, bancos de teste criados).

## 4. Re-auditoria

Execute novamente os sinais de detecção do catálogo **sobre o código novo** (principalmente os `Grep` de AP-01, AP-02, AP-04, AP-06, AP-08, AP-12, AP-20, AP-21). Para cada ocorrência remanescente:
- corrija, ou
- liste em `Zero anti-patterns remaining` como `✗` com a justificativa (ex.: "print mantido no script CLI de seed").

## 5. Critérios de sucesso

| Verificação | Critério |
|---|---|
| Boot | Processo sobe, porta responde, sem stack trace |
| Endpoints | 100% das rotas do baseline respondem com status e chaves equivalentes (exceto breaking changes declarados) |
| Estrutura | Checklist de `mvc-guidelines.md` seção 4 atendido |
| Re-auditoria | Nenhum CRITICAL/HIGH remanescente |

Se algum critério falhar: leia o erro, corrija e valide de novo (até 3 ciclos). Reporte com honestidade o que continuar falhando — nunca marque `✓` sem ter executado a verificação.
