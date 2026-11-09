# Imagem do site (FDD 001 §8.4, ADR-0015). Contexto: a raiz do monorepo.
#   docker build -f apps/web/Dockerfile -t zuploop-web .
# Estágio 1: Node 24 gera a exportação estática em out/.
# Estágio 2: Nginx sem privilégios, na porta 8080, serve out/ e gera /config.json ao iniciar.

FROM node:24.19.0-bookworm-slim AS build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /repo

# Dependências primeiro, para o cache do Docker valer quando só o código muda.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json apps/web/
COPY packages/config/package.json packages/config/
COPY packages/sdk/package.json packages/sdk/
COPY packages/ui/package.json packages/ui/
COPY packages/games/example/package.json packages/games/example/
RUN pnpm install --frozen-lockfile --filter "@zuploop/web..."

COPY packages packages
COPY apps/web apps/web

# Jogos ocultos só em builds de teste (ZUPLOOP_SHOW_HIDDEN_GAMES=true).
ARG ZUPLOOP_SHOW_HIDDEN_GAMES=false
ENV ZUPLOOP_SHOW_HIDDEN_GAMES=${ZUPLOOP_SHOW_HIDDEN_GAMES}
RUN pnpm --filter @zuploop/web build

FROM nginxinc/nginx-unprivileged:1.30.6-alpine
# O template vira /etc/nginx/conf.d/default.conf ao iniciar (entrypoint oficial da imagem).
COPY apps/web/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY apps/web/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY apps/web/nginx/config.json.template /etc/zuploop/config.json.template
COPY --chmod=755 apps/web/nginx/40-zuploop-runtime.sh /docker-entrypoint.d/40-zuploop-runtime.sh
COPY --from=build /repo/apps/web/out /usr/share/nginx/html
EXPOSE 8080
