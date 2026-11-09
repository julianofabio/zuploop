// Exemplos do GameCard (padrão §9.5).
import { GamesIcon, HeartIcon } from "../../icons";
import { IconButton } from "../IconButton/IconButton";
import { GameCard } from "./GameCard";

export const examples = {
  available: () => (
    <GameCard
      name="Caça-palavras"
      description="Ache as palavras escondidas na grade."
      icon={<GamesIcon size="lg" />}
      category="words"
      href="/pt/jogos/caca-palavras/"
      action={<IconButton label="Favoritar: Caça-palavras" icon={<HeartIcon />} variant="subtle" />}
    />
  ),
  comingSoon: () => (
    <GameCard
      name="Damas"
      description="Jogue contra o computador."
      icon={<GamesIcon size="lg" />}
      category="board"
      badge="Em breve"
    />
  ),
};
