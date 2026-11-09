// Leitura do site gerado em out/ para os testes de HTML.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const OUT = path.resolve(import.meta.dirname, "../out");

export function readOut(relative: string): string {
  const file = path.join(OUT, relative);
  if (!existsSync(file)) {
    throw new Error(
      `${relative} não existe. Rode "pnpm --filter @zuploop/web build:hidden" antes.`,
    );
  }
  return readFileSync(file, "utf8");
}

/** Arquivos JS do build que contêm o texto procurado. */
export function chunksContaining(text: string): string[] {
  const dir = path.join(OUT, "_next/static/chunks");
  const files: string[] = [];
  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".js") && readFileSync(full, "utf8").includes(text)) {
        files.push(path.basename(full));
      }
    }
  };
  walk(dir);
  return files;
}
