// Configuração do next-intl por pedido (sem middleware, ADR-0013). Na exportação estática,
// o idioma vem do parâmetro [locale] via setRequestLocale.
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "./config";
import { getMessages } from "./messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;
  return { locale, messages: getMessages(locale) };
});
