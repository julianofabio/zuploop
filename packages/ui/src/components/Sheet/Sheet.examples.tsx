// Exemplos do Sheet (padrão §9.14).
import { Button } from "../Button/Button";
import { Sheet } from "./Sheet";

export const examples = {
  howToPlay: () => (
    <Sheet open onClose={() => undefined} title="Como jogar" closeLabel="Fechar">
      <p>Arraste da primeira à última letra para marcar uma palavra.</p>
      <Button fullWidth>Continuar</Button>
    </Sheet>
  ),
  destructive: () => (
    <Sheet
      open
      onClose={() => undefined}
      title="Excluir conta"
      closeLabel="Cancelar"
      dismissible={false}
    >
      <p>Excluir sua conta apaga seu progresso em todos os aparelhos.</p>
      <Button variant="danger">Excluir conta</Button>
    </Sheet>
  ),
};
