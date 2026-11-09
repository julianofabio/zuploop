// Exemplos do Link (padrão §9.4).
import { Link } from "./Link";

export const examples = {
  inline: () => (
    <p>
      Veja todos os <Link href="/pt/jogos/">jogos</Link>.
    </p>
  ),
  menu: () => (
    <nav aria-label="Exemplo">
      <Link href="/pt/" variant="menu" aria-current="page">
        Início
      </Link>
    </nav>
  ),
};
