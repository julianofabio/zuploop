# Catálogo de Anti-Patterns

Cada entrada tem: **ID**, **severidade padrão**, **sinais de detecção** (o que procurar e regex para `Grep`),
**exemplos** em Python e JavaScript, e o **padrão do playbook** que resolve.

## Escala de severidade

- **CRITICAL** — falha grave de segurança ou arquitetura: expõe dados sensíveis (credenciais hardcoded, SQL Injection, senha em texto plano/hash fraco), permite execução arbitrária, ou viola completamente a separação de responsabilidades (God Class com banco + lógica + roteamento).
- **HIGH** — forte violação de MVC/SOLID que dificulta muito manutenção e testes: lógica de negócio pesada em controllers/rotas, acoplamento forte sem injeção de dependência, estado global mutável.
- **MEDIUM** — padronização, duplicação, performance moderada: N+1, middlewares inadequados, validação ausente, tratamento de erro inconsistente, APIs deprecated.
- **LOW** — legibilidade: nomes ruins, magic numbers, imports não usados, `print` como log, código morto.

Regra de ajuste: suba um nível se o problema estiver em fluxo de autenticação/pagamento ou exposto publicamente; desça um nível se estiver apenas em script de seed/dev. Justifique no finding.

## Índice

| ID | Anti-pattern | Severidade |
|---|---|---|
| AP-01 | SQL Injection / query por concatenação | CRITICAL |
| AP-02 | Credenciais e segredos hardcoded | CRITICAL |
| AP-03 | God Class / God File | CRITICAL |
| AP-04 | Senhas em texto plano ou hash fraco | CRITICAL |
| AP-05 | Endpoint administrativo/destrutivo sem autenticação | CRITICAL |
| AP-06 | Exposição de dados sensíveis (resposta ou log) | CRITICAL / HIGH |
| AP-07 | Lógica de negócio no controller/rota (Fat Controller) | HIGH |
| AP-08 | Estado global mutável / conexão singleton global | HIGH |
| AP-09 | Acoplamento forte sem injeção de dependência | HIGH |
| AP-10 | Callback Hell / fluxo assíncrono aninhado sem transação | HIGH |
| AP-11 | Debug mode / configuração insegura em produção | HIGH |
| AP-12 | Query N+1 | MEDIUM |
| AP-13 | Validação de entrada ausente ou duplicada | MEDIUM |
| AP-14 | Tratamento de erro ausente/inconsistente (bare except, vazamento de stack) | MEDIUM |
| AP-15 | Duplicação de código (serialização, regras) | MEDIUM |
| AP-16 | Uso de APIs deprecated | MEDIUM |
| AP-17 | Integridade referencial ignorada (delete sem cascade) | MEDIUM |
| AP-18 | Magic numbers / strings | LOW |
| AP-19 | Nomenclatura ruim | LOW |
| AP-20 | `print`/`console.log` como logging | LOW |
| AP-21 | Imports não usados / código morto | LOW |

---

## AP-01 — SQL Injection / query por concatenação · CRITICAL

**Sinais**
- String SQL construída com `+`, f-string, `%`, `.format()` ou template literal contendo variáveis.
- Regex: `execute\(\s*f?["'].*(SELECT|INSERT|UPDATE|DELETE).*["']\s*\+`, `execute\(f["']`, `"\s*\+\s*str\(`, `` `(SELECT|INSERT|UPDATE|DELETE)[^`]*\$\{ ``, `query\s*\+=`.
- Endpoint que executa SQL vindo do request (`cursor.execute(dados["sql"])`) — reportar também como AP-05.

**Exemplo**
```python
cursor.execute("SELECT * FROM produtos WHERE id = " + str(id))
```
```js
db.all(`SELECT * FROM users WHERE email = '${email}'`)
```
**Não é finding**: placeholders (`?`, `%s`, `:nome`, `$1`) com parâmetros separados; ORM (`Model.query.filter_by`).
**Playbook**: PB-01.

## AP-02 — Credenciais e segredos hardcoded · CRITICAL

**Sinais**
- Literais atribuídos a chaves sensíveis: regex `(?i)(secret|password|passwd|pass|pwd|senha|token|api_?key|gateway_?key|private_?key|db_?pass|smtp)\w*\s*[:=]\s*["'][^"']+["']`.
- `app.config["SECRET_KEY"] = "..."`, objetos `config = { dbPass: "..." }`, chaves com prefixo `pk_live_`, `sk_live_`, `AKIA`.
- Usuários seed com senhas fixas são finding apenas se armazenadas sem hash (ver AP-04).

**Playbook**: PB-02.

## AP-03 — God Class / God File · CRITICAL

**Sinais**
- Um único arquivo/classe contém **ao mesmo tempo** ≥ 2 de: conexão/DDL de banco, definição de rotas, regras de negócio, validação, serialização, integrações (pagamento, e-mail).
- Classe com métodos de inicialização do banco e de registro de rotas; arquivo `models.py` com > 250 linhas cobrindo vários domínios; arquivo de rotas com SQL e regras.
- Métodos com > 50 linhas ou > 3 níveis de aninhamento (God Method).

Reporte o intervalo `arquivo:1-<última>` para o arquivo inteiro ou `inicio-fim` do método.
**Playbook**: PB-03.

## AP-04 — Senhas em texto plano ou hash fraco · CRITICAL

**Sinais**
- Senha salva direto do request: `INSERT ... senha` com valor sem hash; comparação `WHERE senha = '...'`.
- Hash fraco: `hashlib.md5`, `hashlib.sha1`, `crypto.createHash('md5'|'sha1')`, base64 usado como "hash", funções caseiras de "criptografia".
- Senha padrão quando ausente (`p || "123456"`).

**Playbook**: PB-04.

## AP-05 — Endpoint administrativo/destrutivo sem autenticação · CRITICAL

**Sinais**
- Rotas `admin`, `reset`, `query`, `delete` sem decorator/middleware de auth: regex `route\(["']/admin`, `\.(post|get|delete)\(['"]/api/admin`.
- Endpoint que executa SQL arbitrário ou apaga todas as tabelas.
- `DELETE /users/:id` acessível sem autenticação.

**Playbook**: PB-05.

## AP-06 — Exposição de dados sensíveis · CRITICAL (credenciais/cartão) / HIGH (dados pessoais)

**Sinais**
- Serialização que inclui senha/hash: `"senha": row["senha"]`, `'password': self.password` em `to_dict`.
- Log de dado de cartão, senha ou chave: `console.log(\`...${cc}...${config.paymentGatewayKey}\`)`, `print("senha" ...)`.
- `str(e)` de exceções devolvido ao cliente (vaza estrutura interna) → também AP-14.
- Health check/endpoint que devolve configuração, caminhos ou segredos.

**Playbook**: PB-06.

## AP-07 — Lógica de negócio no controller/rota (Fat Controller) · HIGH

**Sinais**
- Handler HTTP com cálculos de domínio (descontos, totais, faturamento, status), regras condicionais de negócio, controle de estoque, decisão de pagamento (`cc.startsWith("4") ? "PAID"`).
- Handler HTTP fazendo queries diretas (`db.session.query`, `Model.query`, `cursor.execute`, `db.run`) **e** montando resposta.
- Handler com > 30 linhas ou validação + persistência + notificação no mesmo bloco.
- Pasta `services/` existente mas não usada pelas rotas.

**Playbook**: PB-07.

## AP-08 — Estado global mutável / conexão singleton global · HIGH

**Sinais**
- `global db_connection`, variáveis de módulo mutadas por funções (`cache[key] = ...`, `total += ...`).
- Conexão única compartilhada com `check_same_thread=False`.
- Listas em memória usadas como armazenamento (`self.notifications = []` em service instanciado por request).

**Playbook**: PB-08.

## AP-09 — Acoplamento forte sem injeção de dependência · HIGH

**Sinais**
- Funções que chamam `get_db()` / `new Database()` / `new EmailService()` internamente em vez de receber a dependência.
- Controllers importando o módulo de banco diretamente; models importando `request`.
- Integrações externas (SMTP, gateway) instanciadas dentro da regra de negócio, impossibilitando mock.

**Playbook**: PB-08 (composition root) e PB-07.

## AP-10 — Callback Hell / fluxo assíncrono aninhado sem transação · HIGH

**Sinais**
- ≥ 3 níveis de callbacks aninhados (`db.get(..., (err, x) => { db.run(..., function(err) { ...`).
- Contadores manuais para sincronizar callbacks (`pending--; if (pending === 0) res.json(...)`).
- Escritas relacionadas (matrícula + pagamento + log) sem transação; `err` ignorado em callbacks.

**Playbook**: PB-09.

## AP-11 — Debug mode / configuração insegura · HIGH

**Sinais**
- `app.run(debug=True)`, `app.config["DEBUG"] = True`, `host="0.0.0.0"` fixo.
- `CORS(app)` / `app.use(cors())` sem restrição de origem em API com dados sensíveis (MEDIUM se isolado).
- Banco `:memory:` ou caminho de banco fixo no código (MEDIUM).

**Playbook**: PB-02.

## AP-12 — Query N+1 · MEDIUM

**Sinais**
- Query executada **dentro de loop** sobre resultado de outra query: `for row in rows:` seguido de `execute(`/`.query.get(`/`.filter_by(`; `forEach(... => db.get(`.
- Várias `count()` sequenciais que poderiam ser um `GROUP BY`.
- `Model.query.get(t.user_id)` dentro de loop quando há `relationship` disponível.

**Playbook**: PB-10.

## AP-13 — Validação de entrada ausente ou duplicada · MEDIUM

**Sinais**
- `request.get_json()` / `req.body` usado sem checar tipos, campos obrigatórios ou limites.
- Mesma validação copiada em create e update; listas de valores válidos repetidas em vários arquivos.
- Validação de e-mail fraca ou inexistente; campos de body com nomes crípticos e sem schema.

**Playbook**: PB-11.

## AP-14 — Tratamento de erro ausente/inconsistente · MEDIUM

**Sinais**
- `except:` (bare), `except Exception as e: return {"erro": str(e)}, 500` repetido em todo handler.
- Callbacks que ignoram `err`; respostas de erro em formatos diferentes (`res.send("Erro DB")` vs JSON).
- Ausência de error handler global (`@app.errorhandler`, `app.use((err, req, res, next) => ...)`).

**Playbook**: PB-12.

## AP-15 — Duplicação de código · MEDIUM

**Sinais**
- O mesmo bloco de serialização dict/objeto repetido (ex.: montar `{"id": row["id"], ...}` em várias funções; `to_dict()` existente mas reescrito à mão na rota).
- Mesma regra (ex.: "está atrasada?") implementada em vários arquivos.
- Funções quase idênticas diferindo por um filtro (`get_pedidos_usuario` vs `get_todos_pedidos`).

**Playbook**: PB-13.

## AP-16 — Uso de APIs deprecated · MEDIUM

Cruze com as versões do manifesto. Reporte a API obsoleta, a versão em que foi depreciada e o substituto moderno.

| Stack | API deprecated | Substituto moderno |
|---|---|---|
| Python ≥ 3.12 | `datetime.utcnow()`, `datetime.utcfromtimestamp()` | `datetime.now(timezone.utc)`, `datetime.fromtimestamp(ts, timezone.utc)` |
| SQLAlchemy ≥ 2.0 / Flask-SQLAlchemy ≥ 3.0 | `Model.query.get(id)` (legacy Query API) | `db.session.get(Model, id)` |
| SQLAlchemy ≥ 2.0 | `Model.query.filter_by(...).all()` (legacy, ainda funciona) | `db.session.execute(db.select(Model).filter_by(...)).scalars().all()` |
| Flask ≥ 2.3 | `@app.before_first_request`, `flask.json.JSONEncoder`, `app.json_encoder` | inicialização no app factory / `with app.app_context()`, `app.json` provider |
| Flask ≥ 2.2 | `send_file(attachment_filename=)` | `download_name=` |
| Werkzeug ≥ 2.1 | `request.charset`, `safe_str_cmp` | `hmac.compare_digest` |
| Python | `logging.warn`, `imp`, `distutils`, `asyncio.get_event_loop()` fora de loop | `logging.warning`, `importlib`, `setuptools`, `asyncio.run` |
| Node.js | `new Buffer()` / `Buffer()` | `Buffer.from()` / `Buffer.alloc()` |
| Node.js | `url.parse()`, `querystring` | `new URL()`, `URLSearchParams` |
| Node.js | `fs.exists()`, `util.isArray()`, `util.inherits` | `fs.existsSync`/`fs.promises.access`, `Array.isArray`, `class extends` |
| Node.js | `crypto.createCipher()` | `crypto.createCipheriv()` |
| Express 4 → 5 | `req.param()`, `res.send(status)`, `res.json(status, obj)`, `app.del()` | `req.params`/`req.query`/`req.body`, `res.sendStatus()`, `res.status().json()`, `app.delete()` |

Também é AP-16: versão de dependência com fim de suporte ou com CVE conhecida declarada no manifesto (cite a versão).
**Playbook**: PB-14.

## AP-17 — Integridade referencial ignorada · MEDIUM

**Sinais**
- `DELETE FROM users WHERE id = ?` sem tratar registros dependentes em outras tabelas.
- Tabelas com `*_id` sem `FOREIGN KEY`; `ON DELETE` ausente.

**Playbook**: PB-15.

## AP-18 — Magic numbers / strings · LOW

**Sinais**
- Literais de regra de negócio no meio do código: limites (`len(nome) > 200`, `p >= 1 and p <= 5`), porcentagens de desconto (`0.1`, `0.05`), status (`'pendente'`, `'PAID'`), portas, iterações (`10000`).
- Listas de valores válidos inline (`categorias_validas = [...]`) em vez de constantes/enums.
- Constantes definidas (ex.: lista de status válidos em um módulo utilitário) mas não utilizadas onde o literal se repete.

**Playbook**: PB-16.

## AP-19 — Nomenclatura ruim · LOW

**Sinais**
- Variáveis de 1–3 letras fora de loops curtos (`u`, `e`, `p`, `cc`, `cid`, `t`, `x`), nomes genéricos (`data`, `result`, `self = this`, `Manager`, `utils`), funções com nomes enganosos (`process`, `saveAndNotify` fazendo duas coisas).
- Mistura de idiomas/convenções no mesmo escopo (`camelCase` + `snake_case`).

**Playbook**: PB-16.

## AP-20 — `print` / `console.log` como logging · LOW

**Sinais**
- `print(` ou `console.log(` em código de aplicação (não em scripts CLI/seed) para erros, eventos ou "notificações" simuladas.
- Regex: `^\s*print\(`, `console\.(log|error)\(`.

**Playbook**: PB-17.

## AP-21 — Imports não usados / código morto · LOW

**Sinais**
- `import os, sys, json, time` sem uso no arquivo; imports dentro de funções sem motivo; variáveis exportadas nunca usadas; funções nunca chamadas.
- Confirme com `Grep` do identificador no projeto antes de reportar.

**Playbook**: PB-17.
