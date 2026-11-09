// Exemplos do SiteHeader (padrão §6.3).
import { Logo } from "../Logo/Logo";
import { navItems } from "../nav-test-items";
import { SiteHeader } from "./SiteHeader";

export const examples = {
  default: () => (
    <SiteHeader
      logo={
        <a href="/x/">
          <Logo name="ZupLoop" />
        </a>
      }
      navLabel="Principal"
      items={navItems}
      actions={<button type="button">PT</button>}
    />
  ),
};
