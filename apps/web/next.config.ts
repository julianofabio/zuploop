// Next.js em exportação estática (ADR-0001, FDD 001 §8.1): o build vira arquivos em out/,
// servidos pelo Nginx. Sem servidor Node em produção.
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Pacotes do monorepo são publicados como código-fonte TypeScript (notas N-11).
  transpilePackages: ["@zuploop/ui", "@zuploop/sdk"],
  poweredByHeader: false,
  // Lido no build; repassado ao código do navegador para o registro de rotas ser o mesmo nos dois.
  env: { ZUPLOOP_SHOW_HIDDEN_GAMES: process.env.ZUPLOOP_SHOW_HIDDEN_GAMES ?? "false" },
  reactStrictMode: true,
  // Página 404 de fora dos idiomas com <html> próprio (há dois layouts raiz).
  experimental: { globalNotFound: true },
};

export default withNextIntl(nextConfig);
