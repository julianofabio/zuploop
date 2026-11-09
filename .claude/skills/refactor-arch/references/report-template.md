# Template do Relatório de Auditoria (Fase 2)

O relatório deve seguir **exatamente** a estrutura abaixo, sem campos ou seções adicionais. Ele é
impresso no terminal ao final da Fase 2 e salvo em arquivo no início da Fase 3.

## Regras

1. Findings ordenados por severidade: todos os CRITICAL, depois HIGH, MEDIUM e LOW. Dentro da mesma severidade, ordene pelo impacto.
2. O título do finding é o nome do anti-pattern em inglês (`God Class / God Method`, `Hardcoded Credentials`, `SQL Injection`). Os demais campos são escritos em português.
3. `File:` sempre com caminho relativo à raiz do projeto e linha(s) exata(s): `models.py:28`, `models.py:47-50`, ou várias localizações separadas por vírgula (`routes/task_routes.py:42, 51`).
4. `Description:` cita o trecho concreto (nome da função, variável ou literal) — nada genérico.
5. `Recommendation:` diz o que fazer, sem citar IDs do catálogo ou do playbook.
6. Os números do `Summary` devem bater com a contagem real dos findings, e `Total` com a soma.
7. APIs deprecated entram como findings comuns, com o título `Deprecated API: <api>`. `Description:` informa a versão em que a API foi depreciada e `Recommendation:` informa o substituto moderno.

## Estrutura

````markdown
================================
ARCHITECTURE AUDIT REPORT
================================
Project: <nome da pasta do projeto>
Stack:   <Linguagem> + <Framework>
Files:   <N> analyzed | ~<L> lines of code

## Summary
CRITICAL: <n> | HIGH: <n> | MEDIUM: <n> | LOW: <n>

## Findings

### [CRITICAL] <Nome do anti-pattern>
File: <arquivo>:<linha ou intervalo>[, <arquivo>:<linha> ...]
Description: <o que foi encontrado, citando o código>
Impact: <consequência concreta: segurança, manutenção, performance, testabilidade>
Recommendation: <ação concreta>

### [HIGH] ...

================================
Total: <N> findings
================================
````

## Exemplo de finding bem escrito

```markdown
### [CRITICAL] SQL Injection
File: models.py:28, 47-50, 57-61, 68, 92, 109-111
Description: Queries montadas por concatenação de strings com entrada do usuário, ex.: `"SELECT * FROM usuarios WHERE email = '" + email + "' AND senha = '" + senha + "'"` em `login_usuario`.
Impact: Permite bypass de login (`' OR '1'='1`) e leitura/alteração arbitrária do banco.
Recommendation: Usar queries parametrizadas com placeholders `?` em toda a camada de models.
```

## Exemplo de finding mal escrito (não fazer)

```markdown
### [HIGH] Código ruim
File: models.py
Description: O código tem problemas de segurança.
```
(Sem linha, sem trecho citado, sem impacto, sem recomendação.)
