// Carrega as mensagens de um idioma com o inglês por baixo: chave que falta aparece em inglês
// (RF-I18N-05). O teste de chaves garante que isso não aconteça em produção.
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import pt from "../../messages/pt.json";
import type { Locale } from "./config";

export type Messages = typeof en;

// Com o precompile do next-intl, uma mensagem pode ser texto ou um array já compilado (plural etc.).
type Leaf = string | readonly unknown[];
type Tree = { [key: string]: Leaf | Tree };

function isTree(value: Leaf | Tree | undefined): value is Tree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const byLocale: Record<Locale, Tree> = { en, es, pt };

export { merge as mergeMessages };

function merge(base: Tree, override: Tree): Tree {
  const result: Tree = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    // Arrays são mensagens compiladas: valem inteiras, nunca são mescladas.
    result[key] = isTree(value) && isTree(current) ? merge(current, value) : value;
  }
  return result;
}

export function getMessages(locale: Locale): Messages {
  if (locale === "en") return en;
  return merge(en, byLocale[locale]) as Messages;
}
