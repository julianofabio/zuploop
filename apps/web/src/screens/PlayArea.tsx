// Botão "Jogar" da página do jogo. A T027 troca este botão pelo GameHost, que abre o jogo.
import { Button } from "@zuploop/ui";
import { useTranslations } from "next-intl";

export function PlayArea({ gameId }: { gameId: string }) {
  const t = useTranslations("game");
  return (
    <Button data-game-id={gameId} size="lg">
      {t("play")}
    </Button>
  );
}
