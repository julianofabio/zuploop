#!/usr/bin/env bash
# Teste da imagem do site (T037, FDD 001 §8.4 e §8.5): sobe a imagem e confere /healthz, uma
# página, a 404 do idioma, o cache de /_next/static/ e de /config.json e os cabeçalhos de
# segurança. Uso: scripts/smoke-web.sh   (na raiz do repositório, com Docker)
set -euo pipefail

IMAGE="zuploop-web:smoke"
NAME="zuploop-web-smoke"
PORT="${SMOKE_PORT:-18080}"
BASE="http://127.0.0.1:${PORT}"
failures=0

cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; }
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

header() { curl -s -o /dev/null -D - "$1" | tr -d '\r' | grep -i "^$2:" | head -1 | cut -d' ' -f2-; }
status() { curl -s -o /dev/null -w '%{http_code}' "$1"; }

echo "Gerando a imagem..."
docker build -q -f apps/web/Dockerfile -t "$IMAGE" . >/dev/null

cleanup
docker run -d --name "$NAME" -p "127.0.0.1:${PORT}:8080" \
  -e PUBLIC_ENVIRONMENT=local \
  -e PUBLIC_API_BASE_URL=http://localhost:8000 \
  -e PUBLIC_ANALYTICS_ENABLED=false \
  -e APP_VERSION=2026.11.08-smoke \
  "$IMAGE" >/dev/null

for _ in $(seq 1 30); do
  [ "$(status "$BASE/healthz")" = "200" ] && break
  sleep 1
done

check "/healthz responde 200" '[ "$(status "$BASE/healthz")" = "200" ]'
check "/pt/ responde 200 com lang pt" 'curl -s "$BASE/pt/" | grep -q "<html lang=\"pt\""'
check "/pt/jogos sem barra redireciona" '[ "$(status "$BASE/pt/jogos")" = "301" ]'
check "/pt/nao-existe/ responde 404 com a página do idioma" \
  '[ "$(status "$BASE/pt/nao-existe/")" = "404" ] && curl -s "$BASE/pt/nao-existe/" | grep -q "Página não encontrada"'
check "/nada responde 404 com a página geral" \
  '[ "$(status "$BASE/nada")" = "404" ] && curl -s "$BASE/nada" | grep -q "Page not found"'

asset="$(curl -s "$BASE/pt/" | grep -o '/_next/static/[^"]*\.js' | head -1)"
check "arquivo de /_next/static/ com cache de um ano, imutável" \
  '[[ "$(header "$BASE$asset" cache-control)" == *"max-age=31536000"*"immutable"* ]]'
check "HTML com no-cache" '[[ "$(header "$BASE/pt/" cache-control)" == *"no-cache"* ]]'
check "/config.json com no-store" '[[ "$(header "$BASE/config.json" cache-control)" == *"no-store"* ]]'
check "/config.json traz o ambiente e a versão" \
  'curl -s "$BASE/config.json" | grep -q "\"environment\":\"local\"" && curl -s "$BASE/config.json" | grep -q "2026.11.08-smoke"'
check "/config.json com analyticsEnabled booleano" 'curl -s "$BASE/config.json" | grep -q "\"analyticsEnabled\":false"'

csp="$(header "$BASE/pt/" content-security-policy)"
check "CSP com default-src 'self'" '[[ "$csp" == *"default-src '"'"'self'"'"'"* ]]'
check "CSP com object-src 'none' e frame-ancestors 'none'" \
  '[[ "$csp" == *"object-src '"'"'none'"'"'"* && "$csp" == *"frame-ancestors '"'"'none'"'"'"* ]]'
check "CSP também em /_next/static/ (cabeçalhos em todas as respostas)" \
  '[ -n "$(header "$BASE$asset" content-security-policy)" ]'
check "X-Content-Type-Options nosniff" '[ "$(header "$BASE/pt/" x-content-type-options)" = "nosniff" ]'
check "Referrer-Policy" '[ "$(header "$BASE/pt/" referrer-policy)" = "strict-origin-when-cross-origin" ]'
check "Permissions-Policy" '[ -n "$(header "$BASE/pt/" permissions-policy)" ]'
check "sem HSTS fora de produção" '[ -z "$(header "$BASE/pt/" strict-transport-security)" ]'
check "gzip ligado" '[ "$(curl -s -H "Accept-Encoding: gzip" -o /dev/null -D - "$BASE/pt/" | tr -d "\r" | grep -i "^content-encoding:" | cut -d" " -f2)" = "gzip" ]'
check "versão do Nginx escondida" '[ "$(header "$BASE/pt/" server)" = "nginx" ]'

# Em produção, o HSTS aparece.
docker rm -f "$NAME-prod" >/dev/null 2>&1 || true
docker run -d --name "$NAME-prod" -p "127.0.0.1:$((PORT + 1)):8080" -e PUBLIC_ENVIRONMENT=production "$IMAGE" >/dev/null
for _ in $(seq 1 30); do
  [ "$(status "http://127.0.0.1:$((PORT + 1))/healthz")" = "200" ] && break
  sleep 1
done
check "HSTS em produção" '[[ "$(header "http://127.0.0.1:$((PORT + 1))/pt/" strict-transport-security)" == *"max-age=31536000"* ]]'
docker rm -f "$NAME-prod" >/dev/null 2>&1 || true

if [ "$failures" -gt 0 ]; then
  echo "$failures verificação(ões) falharam."
  docker logs "$NAME" | tail -20
  exit 1
fi
echo "Imagem do site ok."
