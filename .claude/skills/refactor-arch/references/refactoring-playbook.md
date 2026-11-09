# Playbook de Refatoração

Cada padrão (PB-xx) resolve um ou mais anti-patterns (AP-xx) do catálogo. Os exemplos mostram
Python/Flask e Node.js/Express; para outras stacks, aplique a mesma transformação com o idioma
equivalente. **Sempre preserve o contrato HTTP** (paths, métodos, campos e status codes).

| PB | Transformação | Resolve |
|---|---|---|
| PB-01 | Queries parametrizadas | AP-01 |
| PB-02 | Externalizar configuração e segredos | AP-02, AP-11 |
| PB-03 | Decompor God Class em camadas MVC | AP-03 |
| PB-04 | Hash seguro de senhas | AP-04 |
| PB-05 | Proteger endpoints administrativos | AP-05 |
| PB-06 | Remover dados sensíveis de respostas e logs | AP-06 |
| PB-07 | Extrair regra de negócio para model/service (controller fino) | AP-07, AP-09 |
| PB-08 | Composition root + injeção de dependência (sem estado global) | AP-08, AP-09 |
| PB-09 | Achatar callbacks com async/await + transação | AP-10 |
| PB-10 | Eliminar N+1 (JOIN / eager loading / agregação) | AP-12 |
| PB-11 | Validação centralizada de entrada | AP-13 |
| PB-12 | Error handler centralizado | AP-14 |
| PB-13 | Serializer/presenter único | AP-15 |
| PB-14 | Substituir APIs deprecated | AP-16 |
| PB-15 | Integridade referencial em deletes | AP-17 |
| PB-16 | Constantes nomeadas e nomes descritivos | AP-18, AP-19 |
| PB-17 | Logging estruturado e limpeza de código morto | AP-20, AP-21 |

---

## PB-01 — Queries parametrizadas

**Antes**
```python
cursor.execute("SELECT * FROM produtos WHERE id = " + str(id))
cursor.execute("SELECT * FROM usuarios WHERE email = '" + email + "' AND senha = '" + senha + "'")
```
**Depois**
```python
cursor.execute("SELECT * FROM produtos WHERE id = ?", (id,))
cursor.execute("SELECT * FROM usuarios WHERE email = ?", (email,))  # senha verificada via hash (PB-04)
```
**Busca com filtros dinâmicos** — monte a cláusula com placeholders, nunca com valores:
```python
clauses, params = ["1=1"], []
if termo:
    clauses.append("(nome LIKE ? OR descricao LIKE ?)")
    params += [f"%{termo}%", f"%{termo}%"]
if categoria:
    clauses.append("categoria = ?")
    params.append(categoria)
cursor.execute(f"SELECT * FROM produtos WHERE {' AND '.join(clauses)}", params)
```
**Node**
```js
// Antes
db.all(`SELECT * FROM users WHERE email = '${email}'`, cb);
// Depois
db.all('SELECT * FROM users WHERE email = ?', [email], cb);
```

## PB-02 — Externalizar configuração e segredos

**Antes**
```python
app.config["SECRET_KEY"] = "minha-chave-super-secreta-123"
app.run(host="0.0.0.0", port=5000, debug=True)
```
**Depois** — `src/config/settings.py`
```python
import os
import secrets
import logging

logger = logging.getLogger(__name__)

def _env_bool(name: str, default: bool = False) -> bool:
    return os.environ.get(name, str(default)).lower() in ("1", "true", "yes")

class Settings:
    SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_hex(32)
    DEBUG = _env_bool("FLASK_DEBUG", False)
    HOST = os.environ.get("HOST", "127.0.0.1")
    PORT = int(os.environ.get("PORT", "5000"))
    DATABASE_PATH = os.environ.get("DATABASE_PATH", "app.db")
    ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN")  # sem default: rotas admin ficam bloqueadas

if "SECRET_KEY" not in os.environ:
    logger.warning("SECRET_KEY não definido; usando chave efêmera de desenvolvimento.")
```
**Node** — `src/config/settings.js`
```js
// Antes
const config = { dbPass: "senha-fixa", paymentGatewayKey: "chave-fixa", port: 3000 };
// Depois (variáveis lidas de process.env; use dotenv apenas se já for dependência do projeto)
module.exports = Object.freeze({
  port: Number(process.env.PORT) || 3000,
  dbPath: process.env.DB_PATH || ':memory:',
  paymentGatewayKey: process.env.PAYMENT_GATEWAY_KEY || '',
  smtpUser: process.env.SMTP_USER || '',
  adminToken: process.env.ADMIN_TOKEN || '',
});
```
Crie `.env.example` com todas as chaves (valores vazios ou fictícios) e não adicione dependências novas só para isso se `os.environ`/`process.env` bastar.

## PB-03 — Decompor God Class em camadas MVC

**Antes** — uma classe faz tudo
```js
class Application {
  constructor() { this.db = new sqlite3.Database(':memory:'); }
  initDb() { /* CREATE TABLE ... INSERT ... */ }
  setupRoutes(app) {
    app.post('/api/checkout', (req, res) => { /* validação + SQL + pagamento + log */ });
    app.get('/api/admin/financial-report', (req, res) => { /* SQL + agregação */ });
  }
}
```
**Depois**
```
src/database/connection.js     → createDatabase(config) + initSchema/seed
src/models/courseModel.js      → findActiveById(id)
src/models/userModel.js        → findByEmail(email), create({...})
src/models/enrollmentModel.js  → create(userId, courseId)
src/models/paymentModel.js     → create(enrollmentId, amount, status)
src/services/checkoutService.js→ checkout({...}) — regra + transação
src/controllers/checkoutController.js → lê req.body, chama service, responde
src/views/routes.js            → router.post('/api/checkout', controller.checkout)
src/app.js                     → composition root
```
```js
// src/views/routes.js
const { Router } = require('express');
module.exports = function buildRoutes({ checkoutController, reportController, userController, requireAdmin }) {
  const router = Router();
  router.post('/api/checkout', checkoutController.checkout);
  router.get('/api/admin/financial-report', requireAdmin, reportController.financialReport);
  router.delete('/api/users/:id', requireAdmin, userController.remove);
  return router;
};
```
Para um `models.py` com vários domínios: um arquivo de model por entidade (`produto_model.py`, `usuario_model.py`, `pedido_model.py`) e um controller por recurso.

## PB-04 — Hash seguro de senhas

**Antes**
```python
self.password = hashlib.md5(pwd.encode()).hexdigest()
```
```js
function customHash(pwd) { /* base64 repetido */ }
```
**Depois** — Python (Werkzeug já vem com Flask; sem dependência nova)
```python
from werkzeug.security import generate_password_hash, check_password_hash

def set_password(self, pwd: str) -> None:
    self.password = generate_password_hash(pwd)

def check_password(self, pwd: str) -> bool:
    return check_password_hash(self.password, pwd)
```
**Depois** — Node (módulo nativo `crypto`)
```js
const crypto = require('crypto');
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const candidate = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}
```
Login passa a buscar por e-mail e verificar o hash. Dados de seed são gravados já com hash. Se houver usuários existentes com hash antigo em banco persistente, documente a migração necessária.

## PB-05 — Proteger endpoints administrativos

Mantenha o endpoint (a rota continua respondendo), mas exija autorização; sem `ADMIN_TOKEN` configurado, responda 403. Endpoints que executam SQL arbitrário continuam registrados, mas ficam **desativados**: respondem sempre 403 e não executam SQL, mesmo com token. Registre as duas mudanças como *Breaking change intencional*.

**Antes**
```python
@app.route("/admin/reset-db", methods=["POST"])
def reset_database():
    ...
```
**Depois** — `src/middlewares/auth.py`
```python
import hmac
from functools import wraps
from flask import request, current_app
from middlewares.error_handler import ForbiddenError

def require_admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        expected = current_app.config.get("ADMIN_TOKEN")
        provided = request.headers.get("X-Admin-Token", "")
        if not expected or not hmac.compare_digest(provided, expected):
            raise ForbiddenError("Acesso administrativo negado")
        return fn(*args, **kwargs)
    return wrapper
```
**Node**
```js
const crypto = require('crypto');
module.exports = (config) => (req, res, next) => {
  const provided = Buffer.from(req.get('X-Admin-Token') || '');
  const expected = Buffer.from(config.adminToken || '');
  if (!expected.length || provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return res.status(403).json({ error: 'Acesso administrativo negado' });
  }
  next();
};
```

## PB-06 — Remover dados sensíveis de respostas e logs

**Antes**
```python
return {"id": row["id"], "email": row["email"], "senha": row["senha"]}
```
```js
console.log(`Processando cartão ${cc} na chave ${config.paymentGatewayKey}`);
```
**Depois**
```python
def to_public_dict(row):
    return {"id": row["id"], "nome": row["nome"], "email": row["email"], "tipo": row["tipo"]}
```
```js
logger.info('Processando pagamento', { cardLast4: card.slice(-4) });
```
Respostas de erro 500 nunca devolvem `str(e)`; use mensagem genérica (PB-12).

## PB-07 — Extrair regra de negócio para model/service (controller fino)

**Antes** — regra de desconto e estoque dentro do handler/model genérico
```python
def criar_pedido():
    dados = request.get_json()
    total = 0
    for item in dados["itens"]:
        produto = cursor.execute("SELECT * FROM produtos WHERE id = " + str(item["produto_id"])).fetchone()
        if produto["estoque"] < item["quantidade"]:
            return jsonify({"erro": "Estoque insuficiente"}), 400
        total += produto["preco"] * item["quantidade"]
    if total > 1000: total *= 0.9
    ...
```
**Depois**
```python
# services/pedido_service.py
class PedidoService:
    def __init__(self, produto_model, pedido_model):
        self.produtos = produto_model
        self.pedidos = pedido_model

    def criar(self, usuario_id: int, itens: list[dict]) -> dict:
        total = 0.0
        for item in itens:
            produto = self.produtos.buscar_por_id(item["produto_id"])
            if produto is None:
                raise NotFoundError(f"Produto {item['produto_id']} não encontrado")
            if produto["estoque"] < item["quantidade"]:
                raise ValidationError(f"Estoque insuficiente para {produto['nome']}")
            total += produto["preco"] * item["quantidade"]
        total = aplicar_desconto(total)
        return self.pedidos.criar(usuario_id, itens, total)

# controllers/pedido_controller.py
def criar_pedido(service):
    def handler():
        dados = validar_pedido(request.get_json())
        resultado = service.criar(dados["usuario_id"], dados["itens"])
        return jsonify({"dados": resultado, "sucesso": True}), 201
    return handler
```
**Node** — decisão de pagamento sai da rota:
```js
// services/paymentService.js
const APPROVED_CARD_PREFIX = '4';
exports.authorize = (cardNumber) => (cardNumber.startsWith(APPROVED_CARD_PREFIX) ? 'PAID' : 'DENIED');
```
Em projetos com `services/` já existente, conecte-o às rotas via injeção em vez de duplicar lógica.

## PB-08 — Composition root + injeção de dependência (sem estado global)

**Antes**
```python
db_connection = None
def get_db():
    global db_connection
    if db_connection is None:
        db_connection = sqlite3.connect(db_path, check_same_thread=False)
    return db_connection
```
**Depois** — conexão por request via contexto do Flask
```python
# database/connection.py
import sqlite3
from flask import g, current_app

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE_PATH"])
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(_exc=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

def init_app(app):
    app.teardown_appcontext(close_db)
```
```python
# app.py — composition root
def create_app(settings=Settings):
    app = Flask(__name__)
    app.config.from_object(settings)
    connection.init_app(app)
    with app.app_context():
        seed.init_db(connection.get_db())
    register_error_handlers(app)
    app.register_blueprint(build_routes())
    return app
```
**Node**
```js
// src/app.js
const config = require('./config/settings');
const { createDatabase } = require('./database/connection');
const db = await createDatabase(config);           // dentro de uma função async main()
const userModel = createUserModel(db);
const checkoutService = createCheckoutService({ db, userModel, courseModel, enrollmentModel, paymentModel });
const checkoutController = createCheckoutController({ checkoutService });
app.use(buildRoutes({ checkoutController, ... }));
```
Caches globais mutáveis viram dependência explícita (ex.: classe `Cache` injetada) ou são removidos se não usados.

## PB-09 — Achatar callbacks com async/await + transação

**Antes**
```js
this.db.get("SELECT * FROM courses WHERE id = ?", [cid], (err, course) => {
  this.db.get("SELECT id FROM users WHERE email = ?", [e], (err, user) => {
    this.db.run("INSERT INTO enrollments ...", [userId, cid], function (err) {
      self.db.run("INSERT INTO payments ...", [this.lastID, course.price, status], function (err) {
        res.status(200).json({ msg: "Sucesso", enrollment_id: enrId });
      });
    });
  });
});
```
**Depois** — wrapper Promise sobre `sqlite3` (sem dependência nova)
```js
// src/database/connection.js
function promisify(db) {
  return {
    get: (sql, params = []) => new Promise((ok, fail) => db.get(sql, params, (e, row) => (e ? fail(e) : ok(row)))),
    all: (sql, params = []) => new Promise((ok, fail) => db.all(sql, params, (e, rows) => (e ? fail(e) : ok(rows)))),
    run: (sql, params = []) => new Promise((ok, fail) =>
      db.run(sql, params, function (e) { e ? fail(e) : ok({ lastID: this.lastID, changes: this.changes }); })),
  };
}

// src/services/checkoutService.js
async function checkout({ name, email, password, courseId, card }) {
  const course = await courseModel.findActiveById(courseId);
  if (!course) throw new NotFoundError('Curso não encontrado');
  if (paymentService.authorize(card) === 'DENIED') throw new PaymentDeniedError('Pagamento recusado');

  await db.run('BEGIN');
  try {
    const user = (await userModel.findByEmail(email)) ?? (await userModel.create({ name, email, password }));
    const enrollmentId = await enrollmentModel.create(user.id, course.id);
    await paymentModel.create(enrollmentId, course.price, 'PAID');
    await auditModel.log(`Checkout curso ${course.id} por ${user.id}`);
    await db.run('COMMIT');
    return { enrollmentId };
  } catch (err) {
    await db.run('ROLLBACK');
    throw err;
  }
}
```
Controllers Express async devem encaminhar erros: `(req, res, next) => handler(req, res).catch(next)`.

## PB-10 — Eliminar N+1

**Antes**
```python
for row in pedidos:
    cursor.execute("SELECT * FROM itens_pedido WHERE pedido_id = " + str(row["id"]))
    for item in cursor.fetchall():
        cursor.execute("SELECT nome FROM produtos WHERE id = " + str(item["produto_id"]))
```
**Depois** — uma query com JOIN e agrupamento em memória
```python
rows = db.execute("""
    SELECT p.id AS pedido_id, p.usuario_id, p.status, p.total, p.criado_em,
           i.produto_id, i.quantidade, i.preco_unitario, pr.nome AS produto_nome
    FROM pedidos p
    LEFT JOIN itens_pedido i ON i.pedido_id = p.id
    LEFT JOIN produtos pr ON pr.id = i.produto_id
    WHERE (? IS NULL OR p.usuario_id = ?)
    ORDER BY p.id
""", (usuario_id, usuario_id)).fetchall()
```
**ORM (SQLAlchemy)**
```python
# Antes: User.query.get(t.user_id) dentro do loop
# Depois:
from sqlalchemy.orm import joinedload
tasks = db.session.execute(
    db.select(Task).options(joinedload(Task.user), joinedload(Task.category))
).scalars().all()
```
**Contagens múltiplas → agregação**
```python
# Antes: 4x Task.query.filter_by(status=...).count()
counts = dict(db.session.execute(db.select(Task.status, db.func.count()).group_by(Task.status)).all())
```

## PB-11 — Validação centralizada de entrada

**Antes** — mesma validação copiada em criar/atualizar
```python
if "nome" not in dados: return jsonify({"erro": "Nome é obrigatório"}), 400
if "preco" not in dados: return jsonify({"erro": "Preço é obrigatório"}), 400
if dados["preco"] < 0: ...
```
**Depois** — validador reutilizável que lança `ValidationError` (mesmas mensagens de erro originais)
```python
# controllers/validators.py
def validar_produto(dados: dict | None) -> dict:
    if not dados:
        raise ValidationError("Dados inválidos")
    for campo, msg in (("nome", "Nome é obrigatório"), ("preco", "Preço é obrigatório"), ("estoque", "Estoque é obrigatório")):
        if campo not in dados:
            raise ValidationError(msg)
    if not isinstance(dados["preco"], (int, float)) or dados["preco"] < 0:
        raise ValidationError("Preço não pode ser negativo")
    if not MIN_NOME <= len(dados["nome"]) <= MAX_NOME:
        raise ValidationError("Nome muito curto" if len(dados["nome"]) < MIN_NOME else "Nome muito longo")
    if dados.get("categoria", "geral") not in CATEGORIAS_VALIDAS:
        raise ValidationError(f"Categoria inválida. Válidas: {CATEGORIAS_VALIDAS}")
    return dados
```
Se o projeto já declara uma lib de schema (ex.: `marshmallow`, `joi`, `zod`), prefira usá-la. Não troque os nomes dos campos do body (contrato).

## PB-12 — Error handler centralizado

**Antes** — repetido em todo handler
```python
except Exception as e:
    print("ERRO: " + str(e))
    return jsonify({"erro": str(e)}), 500
```
**Depois** — `middlewares/error_handler.py`
```python
import logging
from flask import jsonify

logger = logging.getLogger(__name__)

class AppError(Exception):
    status_code = 400
    def __init__(self, message):
        super().__init__(message)
        self.message = message

class ValidationError(AppError): status_code = 400
class ForbiddenError(AppError): status_code = 403
class NotFoundError(AppError): status_code = 404

def register_error_handlers(app, error_key="erro"):
    @app.errorhandler(AppError)
    def handle_app_error(err):
        return jsonify({error_key: err.message, "sucesso": False}), err.status_code

    @app.errorhandler(Exception)
    def handle_unexpected(err):
        logger.exception("Erro não tratado")
        return jsonify({error_key: "Erro interno do servidor", "sucesso": False}), 500
```
Mantenha a chave de erro original do projeto (`erro` ou `error`) e os campos já existentes (ex.: `sucesso`).

**Node**
```js
// src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).send(status >= 500 ? 'Erro interno' : err.message);
};
// registrado por último em app.js: app.use(errorHandler);
```
(Use `.send` ou `.json` conforme o formato original das respostas de erro.)

## PB-13 — Serializer/presenter único

**Antes** — dict montado campo a campo em 4 funções / rota ignora `to_dict()`
```python
task_data = {}
task_data['id'] = t.id
task_data['title'] = t.title
# ... 10 linhas iguais em 3 rotas
```
**Depois**
```python
# models/task.py
def to_dict(self, include_relations: bool = False) -> dict:
    data = {
        "id": self.id, "title": self.title, "description": self.description,
        "status": self.status, "priority": self.priority,
        "user_id": self.user_id, "category_id": self.category_id,
        "created_at": str(self.created_at), "updated_at": str(self.updated_at),
        "due_date": str(self.due_date) if self.due_date else None,
        "tags": self.tags.split(",") if self.tags else [],
        "overdue": self.is_overdue(),
    }
    if include_relations:
        data["user_name"] = self.user.name if self.user else None
        data["category_name"] = self.category.name if self.category else None
    return data
```
Garanta que o JSON resultante tenha exatamente as mesmas chaves que cada endpoint retornava antes.

## PB-14 — Substituir APIs deprecated

**Antes**
```python
created_at = db.Column(db.DateTime, default=datetime.utcnow)
user = User.query.get(user_id)
```
**Depois**
```python
from datetime import datetime, timezone

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)  # mantém datetimes "naive" compatíveis com dados existentes

created_at = db.Column(db.DateTime, default=utcnow)
user = db.session.get(User, user_id)
```
**Node**
```js
// Antes
const b = new Buffer(pwd);
res.send(404);
// Depois
const b = Buffer.from(pwd);
res.sendStatus(404);
```
Cuidado: troque somente quando o substituto existe na versão instalada; preserve formato de datas no JSON.

## PB-15 — Integridade referencial em deletes

**Antes**
```js
db.run("DELETE FROM users WHERE id = ?", [id], () => res.send("Usuário deletado"));
```
**Depois** — remoção em cascata dentro de transação, no model/service
```js
async function deleteUser(id) {
  await db.run('BEGIN');
  try {
    await db.run('DELETE FROM payments WHERE enrollment_id IN (SELECT id FROM enrollments WHERE user_id = ?)', [id]);
    await db.run('DELETE FROM enrollments WHERE user_id = ?', [id]);
    const { changes } = await db.run('DELETE FROM users WHERE id = ?', [id]);
    await db.run('COMMIT');
    return changes > 0;
  } catch (e) { await db.run('ROLLBACK'); throw e; }
}
```
Alternativas: `FOREIGN KEY ... ON DELETE CASCADE` (SQLite exige `PRAGMA foreign_keys = ON`) ou `cascade="all, delete-orphan"` no SQLAlchemy. Se a mensagem de resposta original descrevia o bug, atualize-a e registre como breaking change intencional.

## PB-16 — Constantes nomeadas e nomes descritivos

**Antes**
```python
if total > 1000: desconto = 0.1
if p >= 1 and p <= 5: ...
```
```js
let u = req.body.nm; let e = req.body.mail; let c = req.body.card;
```
**Depois**
```python
# models/constants.py (ou config/constants.py)
DESCONTO_FAIXAS = ((1000, 0.10), (500, 0.05))
PRIORIDADE_MIN, PRIORIDADE_MAX = 1, 5
STATUS_VALIDOS = ("pending", "in_progress", "done", "cancelled")

if PRIORIDADE_MIN <= prioridade <= PRIORIDADE_MAX: ...
```
```js
const { nm: name, mail: email, card: cardNumber } = req.body; // campos do contrato preservados
```
Reutilize constantes já existentes no projeto em vez de criar duplicatas.

## PB-17 — Logging estruturado e limpeza de código morto

**Antes**
```python
import os, sys, json, time
print("ERRO ao criar produto: " + str(e))
print("ENVIANDO EMAIL: Pedido " + str(pid))
```
**Depois**
```python
import logging
logger = logging.getLogger(__name__)

logger.info("Pedido %s criado", pedido_id)
```
```js
const logger = { info: (...a) => console.log('[INFO]', ...a), error: (...a) => console.error('[ERROR]', ...a) };
```
- Configure o logging uma única vez no composition root (`logging.basicConfig(level=...)`).
- "Notificações" simuladas com `print` viram chamadas a um serviço de notificação injetado (que pode só logar).
- Remova imports e exports não usados após confirmar com `Grep` que não há referências.
