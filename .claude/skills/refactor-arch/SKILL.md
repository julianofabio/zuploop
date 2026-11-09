---
name: refactor-arch
description: Analisa, audita e refatora qualquer codebase backend (Python/Flask, Node.js/Express, etc.) para o padrão MVC. Executa 3 fases sequenciais — análise da stack, auditoria de anti-patterns com relatório por severidade (arquivo e linha exatos) e refatoração validada (boot + endpoints). Use quando o usuário pedir auditoria de arquitetura, detecção de code smells ou refatoração para MVC.
argument-hint: "[caminho-do-projeto (opcional, padrão: diretório atual)]"
disable-model-invocation: true
---

# refactor-arch — Auditoria e Refatoração Arquitetural para MVC

Você é um arquiteto de software sênior especializado em modernizar código legado. Sua missão é
levar o projeto do diretório atual (ou `$ARGUMENTS`, se informado) ao padrão **MVC**, eliminando
problemas de segurança, arquitetura e qualidade — **sem quebrar a aplicação**.

A skill é **agnóstica de tecnologia**: nunca assuma linguagem, framework, banco ou estrutura.
Detecte tudo a partir dos arquivos do projeto usando as heurísticas das referências.

## Arquivos de referência

Leia cada arquivo no momento indicado — não antes, para economizar contexto:

| Arquivo | Quando ler | Conteúdo |
|---|---|---|
| [references/project-analysis.md](references/project-analysis.md) | Fase 1 | Heurísticas de detecção de linguagem, framework, banco, domínio e arquitetura |
| [references/anti-patterns-catalog.md](references/anti-patterns-catalog.md) | Fase 2 | Catálogo de anti-patterns com sinais de detecção e severidade (inclui APIs deprecated) |
| [references/report-template.md](references/report-template.md) | Fase 2 | Template obrigatório do relatório de auditoria |
| [references/mvc-guidelines.md](references/mvc-guidelines.md) | Fase 3 | Estrutura MVC alvo e responsabilidades de cada camada |
| [references/refactoring-playbook.md](references/refactoring-playbook.md) | Fase 3 | Transformações concretas (antes/depois) para cada anti-pattern |
| [references/validation-guide.md](references/validation-guide.md) | Fase 3 | Como capturar baseline, subir a aplicação e validar endpoints |

## Regras invioláveis

1. **Execute as fases em ordem: 1 → 2 → 3.** Nunca pule uma fase.
2. **Fases 1 e 2 são somente leitura.** Não crie, edite, mova nem apague nenhum arquivo antes da confirmação explícita do usuário ao final da Fase 2.
3. **Pare ao final da Fase 2** e pergunte `Phase 2 complete. Proceed with refactoring (Phase 3)? [y/n]`. Encerre sua resposta e aguarde. Só continue se o usuário responder afirmativamente (`y`, `yes`, `s`, `sim`, `prossiga`...). Qualquer outra resposta encerra a skill após oferecer salvar o relatório.
4. **Toda evidência precisa de arquivo e linha exatos.** Obtenha números de linha com `Grep` (`-n`) ou `Read` — nunca estime. Se não conseguir confirmar a linha, não reporte o finding.
5. **Preserve o contrato da API**: mesmos paths, métodos HTTP, formatos de resposta e status codes. Nenhuma rota original é removida: endpoints perigosos continuam registrados e passam a responder 403 (PB-05). Toda alteração intencional de contrato (ex.: proteger endpoint perigoso, remover senha da resposta) deve ser listada no resumo final como *Breaking change intencional* com a justificativa.
6. **Não invente problemas.** Reporte apenas o que existe no código. Não reporte problemas de arquivos de terceiros (`node_modules/`, `venv/`, `.venv/`, `dist/`, `build/`, lockfiles, `.claude/`).

---

## Fase 1 — Análise do Projeto (somente leitura)

1. Leia [references/project-analysis.md](references/project-analysis.md).
2. Liste os arquivos-fonte do projeto (ignorando os diretórios excluídos acima) e conte linhas (`wc -l` ou equivalente).
3. Leia os manifestos de dependência e **todos** os arquivos-fonte. Em projetos grandes (> 40 arquivos-fonte), leia entry point, rotas, models e configuração por completo e faça amostragem do restante com `Grep`.
4. Determine: linguagem (+ versão, se declarada), framework (+ versão exata do manifesto), dependências relevantes, banco de dados/ORM, domínio de negócio, arquitetura atual, entry point e comando de execução, tabelas/entidades e endpoints.
5. Imprima o resumo **exatamente** neste formato:

```
================================
PHASE 1: PROJECT ANALYSIS
================================
Language:      <linguagem e versão, se conhecida>
Framework:     <framework e versão>
Dependencies:  <dependências relevantes, separadas por vírgula>
Database:      <banco + driver/ORM>
Domain:        <descrição do domínio (entidades principais)>
Architecture:  <classificação — justificativa curta>
Entry point:   <arquivo> (run: <comando>)
Source files:  <N> files analyzed (~<L> lines)
DB tables:     <tabelas/entidades>
Endpoints:     <N> routes (<lista curta: MÉTODO /path, ...>)
================================
```

Prossiga automaticamente para a Fase 2.

## Fase 2 — Auditoria de Arquitetura (somente leitura)

1. Leia [references/anti-patterns-catalog.md](references/anti-patterns-catalog.md) e [references/report-template.md](references/report-template.md).
2. Para **cada** anti-pattern do catálogo, aplique seus sinais de detecção no código (use `Grep` com os padrões sugeridos e confirme lendo o trecho). Inclua obrigatoriamente a verificação de **APIs deprecated** cruzando as versões declaradas no manifesto.
3. Registre cada ocorrência com: severidade, nome do anti-pattern, `arquivo:linha` ou `arquivo:inicio-fim`, descrição concreta citando o trecho, impacto e recomendação.
   - Agrupe ocorrências idênticas do mesmo anti-pattern em um único finding, listando todas as localizações (ex.: `models.py:28, 47-50, 58-60`).
   - Classifique pela tabela de severidade do catálogo; ajuste para cima/baixo apenas com justificativa explícita.
4. Monte o relatório seguindo o template **à risca**, com findings ordenados **CRITICAL → HIGH → MEDIUM → LOW**. O mínimo esperado é de 5 findings, com pelo menos 1 CRITICAL ou HIGH: abaixo disso, repasse o catálogo inteiro mais uma vez. Se o resultado continuar abaixo do mínimo, declare isso no relatório em vez de inventar findings.
5. Imprima o relatório completo, começando **exatamente** por este cabeçalho, com o restante conforme o template:

```
================================
ARCHITECTURE AUDIT REPORT
================================
```

6. Pergunte e **PARE**:

```
Phase 2 complete. Proceed with refactoring (Phase 3)? [y/n]
```

Se o usuário recusar: ofereça salvar o relatório no caminho definido na etapa 1 da Fase 3 e encerre sem modificar mais nada.

## Fase 3 — Refatoração para MVC

Só inicie após confirmação explícita.

1. **Salvar o relatório e proteger o código**:
   - Grave o relatório da Fase 2 em `<raiz>/reports/audit-project-<N>.md` (crie a pasta se necessário), a menos que o usuário indique outro caminho.
   - `<raiz>` é a saída de `git rev-parse --show-toplevel`; fora de um repositório git, é o diretório pai do projeto.
   - `<N>`: se `reports/` já tiver um `audit-project-*.md` cujo campo `Project:` seja este projeto, sobrescreva esse arquivo. Caso contrário, use o menor número livre a partir de 1.
   - Se o projeto não estiver em um repositório git ou tiver alterações não commitadas, copie os arquivos-fonte e manifestos para um diretório temporário fora do projeto e informe o caminho no resumo final.
2. **Ler guias**: [references/mvc-guidelines.md](references/mvc-guidelines.md), [references/refactoring-playbook.md](references/refactoring-playbook.md) e [references/validation-guide.md](references/validation-guide.md).
3. **Capturar baseline** (antes de alterar qualquer código-fonte): instale dependências, suba a aplicação original e registre status code + corpo de cada endpoint seguro (ver validation-guide). Pare o processo. Se a aplicação original não subir, registre o motivo e siga — a refatoração deve fazê-la subir.
4. **Planejar**: monte o mapa `arquivo/função original → destino na nova estrutura`, adaptando ao nível de organização atual:
   - *Monolito / God class*: criar toda a estrutura MVC e distribuir o código.
   - *Parcialmente organizado*: reaproveitar as camadas existentes que já cumprem seu papel (ex.: `routes/` como views, `models/` com ORM), criar as que faltam (ex.: `controllers/`, `config/`, `middlewares/`) e mover responsabilidades para o lugar certo. Não renomeie pastas apenas por estética.
5. **Executar incrementalmente**, um domínio/recurso por vez, aplicando o padrão do playbook correspondente a cada finding. Ordem recomendada:
   1. Config e segredos (→ `config/`, variáveis de ambiente, `.env.example`)
   2. Conexão com banco e seed (→ camada de dados)
   3. Models (queries parametrizadas, serialização sem dados sensíveis)
   4. Services/regras de negócio extraídas de controllers/rotas
   5. Controllers (fluxo request → model/service → view)
   6. Views/Routes (apenas mapeamento HTTP → controller)
   7. Middlewares (error handler centralizado, auth para rotas administrativas)
   8. Composition root / entry point
   9. Correções MEDIUM/LOW (N+1, duplicação, magic numbers, nomes, imports não usados, APIs deprecated)
   Após cada etapa estrutural, verifique que a aplicação ainda importa/inicia (comandos na seção 1 do validation-guide).
6. **Remover código morto**: apague os arquivos originais que foram totalmente migrados. Garanta que o comando de execução original continue funcionando (atualize `package.json`/scripts ou mantenha no local antigo o shim descrito em mvc-guidelines, seção 1).
7. **Validar** conforme o validation-guide: boot sem erros, todos os endpoints do baseline respondendo com o mesmo contrato, e re-auditoria rápida do novo código contra o catálogo. Se algo falhar, corrija e valide novamente (até 3 ciclos); se persistir, reporte honestamente o que falhou.
8. Imprima o resumo final:

```
================================
PHASE 3: REFACTORING COMPLETE
================================
## New Project Structure
<árvore de diretórios da nova estrutura>

## Findings Addressed
<finding → padrão aplicado → arquivo(s) de destino>   (um por linha)

## Intentional Breaking Changes
<lista ou "None">

## Validation
  ✓|✗ Application boots without errors (<comando usado>)
  ✓|✗ All endpoints respond correctly (<N>/<N> match baseline)
  ✓|✗ Zero anti-patterns remaining (<ou lista do que restou e por quê>)

## How to Run
<comandos para instalar dependências, configurar env e iniciar>
================================
```

Use `✓` apenas para o que foi efetivamente verificado nesta execução; use `✗` com explicação para o que falhou ou não pôde ser verificado.
