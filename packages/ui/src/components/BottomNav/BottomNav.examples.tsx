// Exemplos da BottomNav (padrão §7.2).
import { navItems } from "../nav-test-items";
import { BottomNav } from "./BottomNav";

export const examples = {
  home: () => <BottomNav label="Principal" items={navItems} />,
};
