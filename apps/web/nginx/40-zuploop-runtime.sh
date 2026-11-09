#!/bin/sh
# Roda ao iniciar o contêiner (entrypoint oficial da imagem do Nginx). Gera o que muda por
# ambiente: /config.json público (FDD 001 §6.6) e o HSTS, só em produção. Nunca segredos aqui:
# tudo em /config.json fica visível para qualquer visitante.
set -eu

OUT=/tmp/zuploop
mkdir -p "$OUT"

# Valores seguros quando a variável não vem.
PUBLIC_ENVIRONMENT="${PUBLIC_ENVIRONMENT:-local}"
PUBLIC_API_BASE_URL="${PUBLIC_API_BASE_URL:-}"
APP_VERSION="${APP_VERSION:-local}"
case "${PUBLIC_ANALYTICS_ENABLED:-false}" in
  true) PUBLIC_ANALYTICS_ENABLED=true ;;
  *) PUBLIC_ANALYTICS_ENABLED=false ;;
esac

# Só letras, números e alguns símbolos, para nada quebrar o JSON.
for name in PUBLIC_ENVIRONMENT PUBLIC_API_BASE_URL APP_VERSION; do
  eval "value=\$$name"
  case "$value" in
    *[!A-Za-z0-9.:/_-]*)
      echo "40-zuploop-runtime: $name tem caracteres inválidos" >&2
      exit 1
      ;;
  esac
done

export PUBLIC_ENVIRONMENT PUBLIC_API_BASE_URL PUBLIC_ANALYTICS_ENABLED APP_VERSION
envsubst '${PUBLIC_ENVIRONMENT} ${PUBLIC_API_BASE_URL} ${PUBLIC_ANALYTICS_ENABLED} ${APP_VERSION}' \
  < /etc/zuploop/config.json.template > "$OUT/config.json"

if [ "$PUBLIC_ENVIRONMENT" = "production" ]; then
  echo 'add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;' > "$OUT/hsts.conf"
else
  : > "$OUT/hsts.conf"
fi
