# Guidelines de Arquitetura — MVC Alvo

Em uma API backend, o MVC se traduz assim: **Model** = dados e regras de domínio; **View** = a
representação exposta ao cliente (definição das rotas HTTP + formato JSON da resposta);
**Controller** = orquestra o fluxo de cada requisição. Camadas de apoio (config, middlewares,
services) mantêm cada uma dessas responsabilidades limpa.

## 1. Estrutura de diretórios alvo

Adapte extensão e convenção de nomes à linguagem (`snake_case.py` em Python, `camelCase.js` / `kebab-case.js` em Node).

```
src/
├── config/
│   └── settings.(py|js)          # Lê variáveis de ambiente; único lugar com valores de configuração
├── database/
│   ├── connection.(py|js)        # Cria/fornece conexão ou sessão (sem estado global mutável exposto)
│   └── seed.(py|js)              # Schema + dados iniciais (se o projeto original tinha)
├── models/
│   └── <entidade>_model.(py|js)  # Acesso a dados e regras da entidade; queries parametrizadas
├── services/                     # (opcional) Regras de negócio que envolvem várias entidades ou integrações
│   └── <dominio>_service.(py|js)
├── controllers/
│   └── <entidade>_controller.(py|js)  # Fluxo: input → validação → model/service → view
├── views/
│   ├── routes.(py|js)            # Mapeamento HTTP (método + path) → controller. Nada além disso
│   └── <entidade>_view.(py|js)   # (opcional) Serializers/presenters: formato JSON da resposta
├── middlewares/
│   ├── error_handler.(py|js)     # Tratamento centralizado de erros
│   └── auth.(py|js)              # (se necessário) Proteção de rotas administrativas
└── app.(py|js)                   # Composition root: cria app, injeta dependências, registra rotas
.env.example                      # Todas as variáveis de ambiente necessárias, sem valores reais
```

**Projetos já parcialmente organizados**: reaproveite pastas que já cumprem o papel (ex.: `routes/` com Blueprints pode ser a camada de views; `models/` com ORM continua sendo models; `services/` existente continua). Crie apenas o que falta (tipicamente `config/`, `controllers/`, `middlewares/`) e mova a lógica das rotas para controllers/services. Se mantiver `routes/` em vez de `views/`, declare no resumo final que `routes/` é a camada View.

**Entry point**: o comando de execução original deve continuar funcionando. Opções:
- Node: atualizar `main`/`scripts.start` no `package.json` para `src/app.js`.
- Python: novo `src/app.py` executável (`python src/app.py`) **ou** manter `app.py` na raiz como shim. Se mudar o comando, documente em *How to Run*. O shim precisa usar `runpy`, porque `from app import ...` colide com o nome do próprio arquivo e `import app` falha com import circular:
  ```python
  import runpy
  import sys
  from pathlib import Path

  if __name__ == "__main__":
      src = Path(__file__).resolve().parent / "src"
      sys.path.insert(0, str(src))
      runpy.run_path(str(src / "app.py"), run_name="__main__")
  ```

## 2. Responsabilidades por camada

### Config (`config/`)
- **Faz**: ler `os.environ` / `process.env` com defaults seguros apenas para valores não sensíveis (porta, caminho do banco de dev); expor um objeto/módulo de settings.
- **Não faz**: conter segredos reais. Segredos sem env → gerar valor efêmero de dev (ex.: `secrets.token_hex(32)`) com warning, ou ficar vazio e desabilitar a funcionalidade que depende dele.
- `DEBUG` vem de env e é `False` por padrão.

### Models (`models/`)
- **Faz**: queries (sempre parametrizadas ou via ORM), mapeamento linha → entidade, regras intrínsecas da entidade (ex.: `task.is_overdue()`, `produto.tem_estoque(qtd)`), hash/verificação de senha.
- **Não faz**: ler `request`/`req`, devolver respostas HTTP, chamar `jsonify`/`res.json`, conhecer status codes.
- Recebe a conexão/sessão por parâmetro ou de um provider de `database/` (injeção), nunca de uma variável global mutável.
- Serialização pública **nunca** inclui senha/hash.

### Services (`services/`, opcional)
- **Faz**: regras de negócio que coordenam múltiplos models ou integrações externas (checkout = usuário + matrícula + pagamento + auditoria; criação de pedido com baixa de estoque; envio de e-mail). Transações ficam aqui.
- **Não faz**: lidar com HTTP.
- Use quando a regra não pertence naturalmente a uma única entidade. Em projetos pequenos, a regra pode morar no model.

### Controllers (`controllers/`)
- **Faz**: extrair dados do request, validar input (ou delegar a um validator), chamar model/service, escolher status code e delegar a formatação à view/serializer.
- **Não faz**: SQL, cálculos de domínio, montagem manual de dicts campo a campo repetida, `try/except` genérico em todo handler (isso é do error handler).
- Tamanho-alvo: handlers de ≤ 20–25 linhas.

### Views / Routes (`views/`)
- **Faz**: declarar rotas (método + path → controller) e o formato da resposta (serializers/presenters).
- **Não faz**: lógica, validação, acesso a dados.
- Paths, métodos e formatos de resposta originais são preservados.

### Middlewares (`middlewares/`)
- **Error handler**: converte exceções de domínio (`NotFoundError`, `ValidationError`) em respostas padronizadas; exceções inesperadas → 500 com mensagem genérica e log do stack (sem vazar `str(e)` ao cliente).
- **Auth**: protege rotas administrativas/destrutivas (token de admin vindo de env, ou mecanismo já existente no projeto).

### Composition root (`app.(py|js)`)
- Cria o app, carrega config, inicializa banco, instancia dependências (repositories/services) e as injeta nos controllers, registra rotas e middlewares, sobe o servidor.
- Python: preferir *application factory* `create_app(config)`.
- É o **único** lugar que conhece todas as camadas.

## 3. Regras de dependência

```
views/routes ──▶ controllers ──▶ services ──▶ models ──▶ database
      │               │              │           │
      └───────────────┴──────────────┴───────────┴──▶ config
middlewares ◀── registrados pelo app (composition root)
```

- Dependências apontam apenas para a direita/baixo. Models nunca importam controllers; controllers nunca importam views.
- Nenhum ciclo de import.
- Nenhuma camada além de `config/` lê variáveis de ambiente.
- Nenhuma camada além de `database/` e `models/` conhece SQL/ORM.

## 4. Checklist de conformidade (usar na validação)

- [ ] Estrutura de diretórios MVC criada (ou mapeada a partir da existente, com justificativa)
- [ ] Configuração extraída para `config/`, sem segredos hardcoded; `.env.example` criado
- [ ] Models abstraem os dados; queries parametrizadas; sem dados sensíveis na serialização
- [ ] Views/Routes contêm apenas mapeamento HTTP e formatação
- [ ] Controllers concentram o fluxo e são finos
- [ ] Error handling centralizado
- [ ] Entry point claro (composition root) e comando de execução funcionando
- [ ] Nenhum estado global mutável; dependências injetadas
- [ ] Arquivos legados migrados foram removidos (sem código duplicado/morto)
