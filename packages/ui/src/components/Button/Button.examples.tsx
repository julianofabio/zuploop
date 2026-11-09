// Exemplos do Button (padrão §9.1). Usados nos testes de acessibilidade e como referência.
import { HintIcon } from "../../icons";
import { Button } from "./Button";

export const examples = {
  primary: () => <Button>Jogar</Button>,
  secondary: () => <Button variant="secondary">Como jogar</Button>,
  ghost: () => <Button variant="ghost">Ver todos</Button>,
  danger: () => <Button variant="danger">Excluir conta</Button>,
  withIcon: () => (
    <Button variant="secondary" icon={<HintIcon />}>
      Dica
    </Button>
  ),
  sizes: () => (
    <>
      <Button size="lg">Jogar</Button>
      <Button size="md">Jogar</Button>
      <Button size="sm">Jogar</Button>
    </>
  ),
  disabled: () => <Button disabled>Jogar</Button>,
  loading: () => (
    <Button loading icon={<HintIcon />}>
      Dica
    </Button>
  ),
  fullWidth: () => <Button fullWidth>Continuar</Button>,
};
