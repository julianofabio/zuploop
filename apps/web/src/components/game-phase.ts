// Estado do jogo aberto pelo GameHost.
import type { GameProps, PortalSdkHandle } from "@zuploop/sdk";
import type { ComponentType } from "react";

export type GamePhase =
  | { kind: "closed" }
  | { kind: "loading" }
  | { kind: "failed" }
  | { kind: "ready"; Game: ComponentType<GameProps>; sdk: PortalSdkHandle };
