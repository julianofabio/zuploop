// Exemplos do Badge (padrão §9.9).
import { Badge } from "./Badge";

export const examples = {
  neutral: () => <Badge>Em breve</Badge>,
  accent: () => <Badge variant="accent">Novo</Badge>,
  success: () => <Badge variant="success">Concluído</Badge>,
};
