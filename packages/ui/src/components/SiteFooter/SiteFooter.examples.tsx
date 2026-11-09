// Exemplos do SiteFooter (padrão §6.3).
import { navItems } from "../nav-test-items";
import { SiteFooter } from "./SiteFooter";

export const examples = {
  default: () => (
    <SiteFooter
      brand="ZupLoop"
      tagline="Passatempos clássicos para adultos."
      linksLabel="Links do site"
      links={navItems}
    />
  ),
};
