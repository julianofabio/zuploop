// Exemplos do Banner (padrão §9.12).
import { Button } from "../Button/Button";
import { Banner } from "./Banner";

export const examples = {
  languageSuggestion: () => (
    <Banner
      label="Sugestão de idioma"
      lang="pt"
      actions={
        <>
          <Button variant="ghost" size="sm">
            Ver em português
          </Button>
          <Button variant="ghost" size="sm" lang="en">
            Continue in English
          </Button>
        </>
      }
    >
      Ver em português?
    </Banner>
  ),
  dismissible: () => (
    <Banner label="Aviso" onClose={() => undefined} closeLabel="Fechar aviso">
      Seu progresso não será salvo neste modo do navegador.
    </Banner>
  ),
};
