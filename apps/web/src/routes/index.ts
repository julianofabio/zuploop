// Instância do registro de rotas do site: só jogos com página própria (FDD 001 §6.1).
import { routableGames } from "../games/registry";
import { createRouteRegistry } from "./registry";

export const routes = createRouteRegistry(routableGames());

export type { PageRef, StaticPageId } from "./registry";
