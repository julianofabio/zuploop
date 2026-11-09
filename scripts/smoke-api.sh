#!/usr/bin/env bash
# Teste da imagem da API (FDD 001 §8.4): sobe a imagem com um PostgreSQL 17 e confere que ela
# aplica as migrações, roda sem privilégios e responde /health, /ready e /version.
# Uso: scripts/smoke-api.sh   (na raiz do repositório, com Docker). Valores falsos.
set -euo pipefail

# SMOKE_IMAGE usa uma imagem já gerada; sem ela, o script gera a imagem.
IMAGE="${SMOKE_IMAGE:-zuploop-api:smoke}"
NETWORK="zuploop-api-smoke"
DB="zuploop-api-smoke-db"
API="zuploop-api-smoke"
PORT="${SMOKE_PORT:-18000}"
BASE="http://127.0.0.1:${PORT}"
DB_ENV=(-e POSTGRES_USER=zuploop -e POSTGRES_PASSWORD=senha-falsa-de-teste -e POSTGRES_DB=zuploop)
failures=0

cleanup() {
  docker rm -f "$API" "$DB" >/dev/null 2>&1 || true
  docker network rm "$NETWORK" >/dev/null 2>&1 || true
}
trap cleanup EXIT

check() {
  local description="$1" condition="$2"
  if eval "$condition"; then
    echo "ok    $description"
  else
    echo "FALHA $description"
    failures=$((failures + 1))
  fi
}

if [ -z "${SMOKE_IMAGE:-}" ]; then
  echo "Gerando a imagem..."
  docker build -q -f apps/api/Dockerfile -t "$IMAGE" . >/dev/null
fi

cleanup
docker network create "$NETWORK" >/dev/null
docker run -d --name "$DB" --network "$NETWORK" "${DB_ENV[@]}" postgres:17.11 >/dev/null
for _ in $(seq 1 30); do
  docker exec "$DB" pg_isready -U zuploop -d zuploop >/dev/null 2>&1 && break
  sleep 1
done

docker run -d --name "$API" --network "$NETWORK" -p "127.0.0.1:${PORT}:8000" "${DB_ENV[@]}" \
  -e DB_HOST="$DB" -e APP_VERSION=2026.11.08-smoke "$IMAGE" >/dev/null

ready=""
for _ in $(seq 1 40); do
  if curl -sf "$BASE/health" >/dev/null 2>&1; then ready=1; break; fi
  sleep 1
done
if [ -z "$ready" ]; then
  echo "FALHA a API não respondeu em $BASE/health"
  docker logs "$API" 2>&1 | tail -30
  exit 1
fi

check "/health responde ok" '[ "$(curl -s "$BASE/health")" = "{\"status\":\"ok\"}" ]'
check "/ready responde ready com o banco" '[ "$(curl -s "$BASE/ready")" = "{\"status\":\"ready\"}" ]'
check "/version devolve versão e commit" \
  '[ "$(curl -s "$BASE/version")" = "{\"version\":\"2026.11.08-smoke\",\"commit\":\"smoke\"}" ]'
check "migrações aplicadas" \
  '[ "$(docker exec "$DB" psql -U zuploop -d zuploop -tAc "select count(*) from alembic_version")" = "1" ]'
check "roda sem privilégios (uid 10001)" '[ "$(docker exec "$API" id -u)" = "10001" ]'
check "devolve X-Request-ID" 'curl -s -D - -o /dev/null "$BASE/health" | grep -qi "^x-request-id:"'

docker stop "$DB" >/dev/null
check "/ready responde 503 sem o banco" '[ "$(curl -s -o /dev/null -w "%{http_code}" "$BASE/ready")" = "503" ]'
check "/health continua 200 sem o banco" '[ "$(curl -s -o /dev/null -w "%{http_code}" "$BASE/health")" = "200" ]'

if [ "$failures" -gt 0 ]; then
  echo "$failures verificação(ões) falharam."
  docker logs "$API" 2>&1 | tail -20
  exit 1
fi
echo "Imagem da API ok."
