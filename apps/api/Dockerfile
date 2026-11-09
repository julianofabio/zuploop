# Imagem da API (FDD 001 §8.4, ADR-0015). Contexto: a raiz do monorepo.
#   docker build -f apps/api/Dockerfile -t zuploop-api .
# Ao iniciar, aplica as migrações e sobe o Uvicorn com 1 worker; para escalar, mais réplicas.

FROM python:3.13.18-slim-bookworm AS build
COPY --from=ghcr.io/astral-sh/uv:0.12.23 /uv /bin/uv
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    UV_PROJECT_ENVIRONMENT=/app/.venv
WORKDIR /app

# Dependências primeiro, para o cache do Docker valer quando só o código muda.
COPY apps/api/pyproject.toml apps/api/uv.lock apps/api/.python-version ./
RUN uv sync --frozen --no-dev

COPY apps/api/alembic.ini ./
COPY apps/api/migrations migrations
COPY apps/api/app app

FROM python:3.13.18-slim-bookworm
ENV PATH=/app/.venv/bin:$PATH \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
RUN groupadd --system --gid 10001 zuploop \
    && useradd --system --uid 10001 --gid zuploop --no-create-home --shell /usr/sbin/nologin zuploop
WORKDIR /app
COPY --from=build --chown=zuploop:zuploop /app /app
USER 10001:10001
EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head && exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1 --no-access-log --proxy-headers --forwarded-allow-ips '*'"]
