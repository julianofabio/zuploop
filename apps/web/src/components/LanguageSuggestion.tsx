"use client";
// Faixa "Ver em português?" (FDD 001 F3, RF-I18N-04): aparece quando a escolha salva ou o
// navegador pedem outro idioma; nunca redireciona sozinha. O lang.js marca o <html> antes da
// pintura, e o CSS reserva o espaço só nesse caso, para a faixa não deslocar a página.
import { Banner, Button } from "@zuploop/ui";
import { useLocale } from "next-intl";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { isLocale, type Locale } from "@/i18n/config";
import { navigatorLanguages, readSavedLocale, saveLocale, suggestedLocale } from "@/i18n/detect";
import type { LanguageTexts } from "@/i18n/language-texts";
import { routes } from "@/routes";
import { pageFromPathname } from "@/routes/current";
import styles from "./LanguageSuggestion.module.css";

const SUGGEST_ATTRIBUTE = "data-lang-suggest";

// O idioma do navegador não muda durante a visita: não há o que assinar.
const subscribe = () => () => undefined;

/** null no servidor e na hidratação; no navegador, o idioma a sugerir. */
function useSuggestion(pageLocale: Locale): Locale | null {
  return useSyncExternalStore(
    subscribe,
    () => suggestedLocale(pageLocale, readSavedLocale(), navigatorLanguages()),
    () => null,
  );
}

export function LanguageSuggestion({ texts }: { texts: LanguageTexts }) {
  const current = useLocale();
  const pageLocale: Locale = isLocale(current) ? current : "en";
  const pathname = usePathname();
  const suggestion = useSuggestion(pageLocale);
  const [dismissed, setDismissed] = useState(false);

  const page = pageFromPathname(pathname);
  const show = suggestion !== null && page !== null && !dismissed;

  function stay() {
    saveLocale(pageLocale);
    document.documentElement.removeAttribute(SUGGEST_ATTRIBUTE);
    setDismissed(true);
  }

  return (
    <div className={styles.slot} data-banner-slot="" data-visible={show}>
      {show ? (
        <Banner
          label={texts[suggestion].suggestionLabel}
          lang={suggestion}
          onClose={stay}
          closeLabel={texts[suggestion].close}
          actions={
            <>
              <NextLink
                href={routes.getPath(suggestion, page.page)}
                hrefLang={suggestion}
                className={styles.action}
                onClick={() => saveLocale(suggestion)}
              >
                {texts[suggestion].switchTo}
              </NextLink>
              <Button variant="ghost" size="sm" lang={pageLocale} onClick={stay}>
                {texts[pageLocale].continueIn}
              </Button>
            </>
          }
        >
          {texts[suggestion].suggest}
        </Banner>
      ) : null}
    </div>
  );
}
