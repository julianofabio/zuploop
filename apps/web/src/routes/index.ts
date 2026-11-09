// Instância do registro de rotas do site, a partir dos jogos registrados.
import { allGames } from "../games/registry";
import { createRouteRegistry } from "./registry";

export const routes = createRouteRegistry(allGames);

export type { PageRef, StaticPageId } from "./registry";
