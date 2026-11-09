// Exemplos do TextField (padrão §9.10).
import { TextField } from "./TextField";

export const examples = {
  search: () => (
    <TextField label="Buscar jogos" type="search" value="" onChange={() => undefined} />
  ),
  withHint: () => (
    <TextField
      label="Apelido"
      hint="De 3 a 20 caracteres."
      value="Coruja Azul"
      onChange={() => undefined}
    />
  ),
  withError: () => (
    <TextField
      label="E-mail"
      type="email"
      error="Digite um e-mail válido."
      value="ana@"
      onChange={() => undefined}
    />
  ),
};
