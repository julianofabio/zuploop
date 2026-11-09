// Exemplos do Chip (padrão §9.8): grupo de filtros com role="group".
import { Chip } from "./Chip";

export const examples = {
  filters: () => (
    <div role="group" aria-label="Categorias">
      <Chip selected>Todas</Chip>
      <Chip selected={false}>Palavras</Chip>
      <Chip selected={false}>Números</Chip>
    </div>
  ),
};
