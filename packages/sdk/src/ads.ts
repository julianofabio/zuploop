// Anúncios provisórios (FDD 001 §6.2): não mostram nada e liberam a recompensa,
// para o jogo seguir e a dica funcionar. A implementação real chega na 005.
import type { PortalSdk } from "./types";

const NO_AD = { shown: false, rewarded: true } as const;

export function createAds(): PortalSdk["ads"] {
  return {
    commercialBreak: async () => ({ ...NO_AD }),
    rewardedBreak: async () => ({ ...NO_AD }),
  };
}
