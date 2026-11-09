// Carrega as mensagens de um idioma com o inglês por baixo: chave que falta aparece em inglês
// (RF-I18N-05). O teste de chaves garante que isso não aconteça em produção.
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import pt from "../../messages/pt.json";
import type { Locale } from "./config";

export type Messages = typeof en;

type Tree = { [key: string]: string | Tree };

const byLocale: Record<Locale, Tree> = { en, es, pt };

function merge(base: Tree, override: Tree): Tree {
  const result: Tree = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    result[key] =
      typeof value === "object" && typeof current === "object" ? merge(current, value) : value;
  }
  return result;
}

export function getMessages(locale: Locale): Messages {
  if (locale === "en") return en;
  return merge(en, byLocale[locale]) as Messages;
}
