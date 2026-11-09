// Servidor estático de out/ para o e2e e o Lighthouse, com as mesmas regras do Nginx
// (FDD 001 §8.5): try_files $uri $uri/index.html, 404 por idioma e /404.html fora deles.
// Uso: node scripts/serve-out.mjs [porta]
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../out");
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4173);
const LOCALES = ["pt", "es", "en"];

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function isFile(file) {
  return existsSync(file) && statSync(file).isFile();
}

/** Arquivo para o caminho pedido, como o try_files do Nginx. */
function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, "");
  const candidate = path.join(OUT, clean);
  if (!candidate.startsWith(OUT)) return null;
  if (isFile(candidate)) return candidate;
  const index = path.join(candidate, "index.html");
  if (isFile(index)) return index;
  return null;
}

function notFoundFile(urlPath) {
  const locale = urlPath.split("/")[1];
  if (LOCALES.includes(locale)) return path.join(OUT, locale, "404", "index.html");
  return path.join(OUT, "404.html");
}

// Compressão como no Nginx: HTML, CSS, JS, JSON, XML e SVG.
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".json", ".xml", ".svg", ".txt"]);

function send(req, res, status, file) {
  const gzip =
    COMPRESSIBLE.has(path.extname(file)) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  res.writeHead(status, {
    "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
    "Cache-Control": file.includes(`${path.sep}_next${path.sep}static`)
      ? "public, max-age=31536000, immutable"
      : "no-cache",
    Vary: "Accept-Encoding",
    ...(gzip ? { "Content-Encoding": "gzip" } : {}),
  });
  const stream = createReadStream(file);
  if (gzip) stream.pipe(createGzip()).pipe(res);
  else stream.pipe(res);
}

createServer((req, res) => {
  const urlPath = new URL(req.url ?? "/", "http://localhost").pathname;
  // Sem barra no fim, como o Nginx com trailingSlash: /pt/jogos → /pt/jogos/
  if (!path.extname(urlPath) && !urlPath.endsWith("/") && resolveFile(`${urlPath}/`)) {
    res.writeHead(301, { Location: `${urlPath}/` });
    res.end();
    return;
  }
  const file = resolveFile(urlPath);
  if (file) send(req, res, 200, file);
  else send(req, res, 404, notFoundFile(urlPath));
}).listen(PORT, () => {
  console.log(`out/ em http://localhost:${PORT}`);
});
