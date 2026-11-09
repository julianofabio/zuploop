// Textos de idioma de todos os idiomas, para o seletor e a faixa de sugestão: cada idioma
// aparece escrito nele mesmo (padrão §7.2). Montado no servidor e passado por propriedade.
import { locales, type Locale } from "./config";
import { getMessages } from "./messages";

export interface LanguageText {
  selfName: string;
  short: string;
  suggest: string;
  switchTo: string;
  continueIn: string;
  suggestionLabel: string;
  close: string;
}

export type LanguageTexts = Record<Locale, LanguageText>;

export function languageTexts(): LanguageTexts {
  const entries = locales.map((locale) => {
    const { selfName, short, suggest, switchTo, continueIn, suggestionLabel, close } =
      getMessages(locale).lang;
    return [locale, { selfName, short, suggest, switchTo, continueIn, suggestionLabel, close }];
  });
  return Object.fromEntries(entries) as LanguageTexts;
}
