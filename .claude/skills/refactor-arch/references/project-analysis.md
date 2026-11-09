# Análise de Projeto — Heurísticas de Detecção

Use estas heurísticas na Fase 1. Sempre confirme lendo o arquivo — um único sinal não basta.

## 1. Arquivos a ignorar

`node_modules/`, `venv/`, `.venv/`, `env/`, `__pycache__/`, `dist/`, `build/`, `target/`, `.git/`,
`.claude/`, `coverage/`, lockfiles (`package-lock.json`, `yarn.lock`, `poetry.lock`, `Pipfile.lock`),
bancos locais (`*.db`, `*.sqlite`), arquivos de documentação (`*.md`, `docs/`).

Conte como **source files** apenas código da aplicação (incluindo seed/scripts do projeto).

## 2. Detecção de linguagem

| Sinal (manifesto / extensão) | Linguagem |
|---|---|
| `requirements.txt`, `pyproject.toml`, `setup.py`, `Pipfile`, `*.py` | Python |
| `package.json` + `*.js` / `*.mjs` / `*.cjs` | JavaScript (Node.js) |
| `package.json` + `tsconfig.json` / `*.ts` | TypeScript (Node.js) |
| `go.mod`, `*.go` | Go |
| `pom.xml`, `build.gradle`, `*.java` / `*.kt` | Java / Kotlin |
| `composer.json`, `*.php` | PHP |
| `Gemfile`, `*.rb` | Ruby |
| `*.csproj`, `*.cs` | C# / .NET |

Versão da linguagem: `python_requires` / `.python-version` / `runtime.txt`; `engines.node` / `.nvmrc`.
Se não houver declaração, informe "versão não declarada" e, se útil, a versão instalada (`python --version`, `node --version`).

## 3. Detecção de framework

| Sinal no código / manifesto | Framework |
|---|---|
| `flask` no manifesto; `Flask(__name__)`, `@app.route`, `Blueprint(` | Flask |
| `fastapi`; `FastAPI()`, `@app.get` | FastAPI |
| `django`; `manage.py`, `settings.py`, `urls.py` | Django |
| `express` no `package.json`; `require('express')`, `app.get(`, `express.Router()` | Express |
| `@nestjs/core`; decorators `@Controller` | NestJS |
| `fastify`, `koa`, `hapi` | Fastify / Koa / Hapi |
| `spring-boot-starter`; `@RestController` | Spring Boot |
| `laravel/framework`; `routes/web.php` | Laravel |
| `rails`; `config/routes.rb` | Rails |

Reporte a **versão exata** do manifesto (`flask==3.1.1`, `"express": "^4.18.2"`). Ela é usada na Fase 2 para detectar APIs deprecated.

## 4. Banco de dados e acesso a dados

| Sinal | Banco / camada |
|---|---|
| `import sqlite3`, `sqlite3.connect(`, `require('sqlite3')`, `new sqlite3.Database(` | SQLite, driver nativo (SQL cru) |
| `:memory:` no connect | SQLite em memória (dados perdidos a cada boot) |
| `flask_sqlalchemy`, `SQLAlchemy()`, `db.Model`, `SQLALCHEMY_DATABASE_URI` | SQLAlchemy ORM (URI indica o banco) |
| `psycopg2`, `pg`, `postgres://` | PostgreSQL |
| `pymysql`, `mysql2`, `mysql://` | MySQL |
| `mongoose`, `pymongo`, `mongodb://` | MongoDB |
| `sequelize`, `prisma`, `typeorm`, `knex` | ORM/Query builder Node |

**Tabelas/entidades**: procure `CREATE TABLE <nome>`, `__tablename__ = '<nome>'`, `class X(db.Model)`, `mongoose.model('X'`, `define('x'`.

## 5. Endpoints

| Framework | Padrões de busca (`Grep -n`) |
|---|---|
| Flask | `@\w+\.route\(`, `add_url_rule\(`, `methods=\[` |
| FastAPI | `@\w+\.(get\|post\|put\|patch\|delete)\(` |
| Express | `(app\|router)\.(get\|post\|put\|patch\|delete\|use)\(` |
| Django | `path\(`, `re_path\(` em `urls.py` |

Registre método + path + handler para cada rota. Arquivos como `api.http`, `*.postman_collection.json`, `openapi.yaml` ou o README ajudam a montar exemplos de requisição para a validação.

## 6. Entry point e comando de execução

- Python: arquivo com `if __name__ == "__main__":` + `app.run(`; ou `app = Flask(` em `app.py`/`main.py`/`wsgi.py`. Comando: `python app.py` (ou `flask run`).
- Node: campo `main` e `scripts.start` do `package.json`; arquivo com `app.listen(`. Comando: `npm start` / `node <main>`.
- Porta: argumento de `app.run(port=)`, `app.listen(<porta>)`, `process.env.PORT`, objeto de config.

## 7. Domínio da aplicação

Infira pelo vocabulário dominante em nomes de tabelas, models, rotas e strings:

| Vocabulário | Domínio |
|---|---|
| produtos, pedidos, carrinho, estoque, orders, products, cart | E-commerce |
| courses, enrollments, lessons, students, checkout de curso | LMS / plataforma de cursos (com checkout/pagamentos) |
| tasks, projects, categories, assignees, due_date, priority | Task Manager / gestão de tarefas |
| accounts, transactions, balance | Financeiro |
| patients, appointments | Saúde |

Descreva o domínio com as entidades principais: `E-commerce API (produtos, pedidos, usuários)`.

## 8. Classificação da arquitetura atual

| Classificação | Sinais |
|---|---|
| **Monolítica sem camadas** | Poucos arquivos; rotas, SQL, validação e regras de negócio misturados; arquivos "models"/"controllers" que existem apenas no nome |
| **God Class / God Object** | Uma classe/arquivo concentra banco, rotas e lógica (ex.: uma classe com métodos de inicialização do banco e de registro de rotas) |
| **Parcialmente em camadas** | Pastas `models/`, `routes/`, `services/`, `utils/` existem, mas rotas contêm lógica de negócio/queries, services subutilizados, sem controllers, config hardcoded |
| **MVC / em camadas adequada** | Rotas finas → controllers → services/models; config externa; error handler central |

Na linha `Architecture:` informe a classificação e a evidência principal, ex.:
`Monolítica — 4 arquivos, SQL e regras de negócio misturados nos controllers, sem camada de config`.

## 9. Checklist de saída da Fase 1

- [ ] Linguagem e versão (ou "não declarada")
- [ ] Framework e versão exata do manifesto
- [ ] Dependências relevantes
- [ ] Banco + driver/ORM
- [ ] Domínio com entidades
- [ ] Arquitetura classificada com evidência
- [ ] Entry point + comando de execução + porta
- [ ] Contagem real de arquivos-fonte e linhas
- [ ] Tabelas/entidades
- [ ] Lista de endpoints (método + path)
