// Exemplos da GameBar (padrão §6.5).
import { HelpIcon } from "../../icons";
import { IconButton } from "../IconButton/IconButton";
import { GameBar } from "./GameBar";

export const examples = {
  default: () => (
    <GameBar
      title="Caça-palavras"
      backLabel="Voltar"
      onBack={() => undefined}
      actions={<IconButton label="Como jogar" icon={<HelpIcon />} variant="subtle" />}
    />
  ),
};
