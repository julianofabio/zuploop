// Exemplos do IconButton (padrão §9.2).
import { BackIcon, CloseIcon, HeartIcon, HelpIcon } from "../../icons";
import { IconButton } from "./IconButton";

export const examples = {
  back: () => <IconButton label="Voltar" icon={<BackIcon />} />,
  subtle: () => <IconButton label="Ajuda" icon={<HelpIcon />} variant="subtle" />,
  toggle: () => (
    <IconButton label="Remover dos favoritos: Sudoku" icon={<HeartIcon filled />} pressed />
  ),
  disabled: () => <IconButton label="Fechar" icon={<CloseIcon />} disabled />,
};
