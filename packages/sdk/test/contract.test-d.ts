// Garante a forma do contrato do SDK (FDD 001 §6.1 e §6.2). Mudou aqui, quebrou jogo: exige ADR.
import type { ComponentType } from "react";
import { describe, expectTypeOf, it } from "vitest";
import {
  SDK_VERSION,
  type AdResult,
  type FavoriteRef,
  type GameCategory,
  type GameEventName,
  type GameManifest,
  type GameMessages,
  type GameProps,
  type Locale,
  type PortalSdk,
} from "../src/index";

describe("contrato do SDK", () => {
  it("tem a versão 1", () => {
    expectTypeOf(SDK_VERSION).toEqualTypeOf<1>();
  });

  it("define os idiomas e categorias", () => {
    expectTypeOf<Locale>().toEqualTypeOf<"pt" | "es" | "en">();
    expectTypeOf<GameCategory>().toEqualTypeOf<"words" | "board" | "numbers" | "logic">();
  });

  it("descreve o manifesto de jogo", () => {
    expectTypeOf<GameManifest["id"]>().toEqualTypeOf<string>();
    expectTypeOf<GameManifest["status"]>().toEqualTypeOf<"available" | "coming_soon" | "hidden">();
    expectTypeOf<GameManifest["phase"]>().toEqualTypeOf<1 | 2 | 3 | 4 | 5>();
    expectTypeOf<GameManifest["slugs"]>().toEqualTypeOf<Record<Locale, string>>();
    expectTypeOf<GameManifest["saveVersion"]>().toEqualTypeOf<number>();
    expectTypeOf<GameManifest["migrateSave"]>().toEqualTypeOf<
      ((fromVersion: number, data: unknown) => unknown) | undefined
    >();
    expectTypeOf<GameManifest["messages"]>().toEqualTypeOf<
      Record<Locale, () => Promise<GameMessages>>
    >();
    expectTypeOf<GameManifest["load"]>().toEqualTypeOf<
      () => Promise<{ default: ComponentType<GameProps> }>
    >();
  });

  it("descreve as mensagens do jogo", () => {
    expectTypeOf<GameMessages>().toEqualTypeOf<{
      name: string;
      description: string;
      howToPlay: { rules: string[]; controls: string[]; tip: string };
      ui: Record<string, string>;
    }>();
  });

  it("entrega o SDK por propriedade", () => {
    expectTypeOf<GameProps>().toEqualTypeOf<{ sdk: PortalSdk; onExit: () => void }>();
  });

  it("expõe o contrato completo do portal", () => {
    expectTypeOf<PortalSdk["version"]>().toEqualTypeOf<1>();
    expectTypeOf<PortalSdk["gameId"]>().toEqualTypeOf<string>();
    expectTypeOf<PortalSdk["getLocale"]>().toEqualTypeOf<() => Locale>();
    expectTypeOf<PortalSdk["i18n"]["t"]>().toEqualTypeOf<
      (key: string, params?: Record<string, string | number>) => string
    >();

    expectTypeOf<PortalSdk["storage"]["load"]>().toEqualTypeOf<
      <T>(slot?: string) => Promise<T | null>
    >();
    expectTypeOf<PortalSdk["storage"]["save"]>().toEqualTypeOf<
      <T>(slot: string, data: T) => Promise<void>
    >();
    expectTypeOf<PortalSdk["storage"]["clear"]>().toEqualTypeOf<(slot?: string) => Promise<void>>();
    expectTypeOf<PortalSdk["storage"]["persistent"]>().toEqualTypeOf<boolean>();

    expectTypeOf<PortalSdk["ads"]["commercialBreak"]>().toEqualTypeOf<() => Promise<AdResult>>();
    expectTypeOf<PortalSdk["ads"]["rewardedBreak"]>().toEqualTypeOf<() => Promise<AdResult>>();

    expectTypeOf<PortalSdk["favorites"]["isFavorite"]>().toEqualTypeOf<
      (ref: FavoriteRef) => Promise<boolean>
    >();
    expectTypeOf<PortalSdk["favorites"]["toggle"]>().toEqualTypeOf<
      (ref: FavoriteRef) => Promise<boolean>
    >();

    expectTypeOf<PortalSdk["events"]["track"]>().toEqualTypeOf<
      (name: GameEventName, props?: Record<string, string | number | boolean>) => void
    >();
  });

  it("define resultado de anúncio, favorito e eventos", () => {
    expectTypeOf<AdResult>().toEqualTypeOf<{ shown: boolean; rewarded: boolean }>();
    expectTypeOf<FavoriteRef>().toEqualTypeOf<{
      kind: "game" | "theme" | "level";
      gameId: string;
      id?: string;
    }>();
    expectTypeOf<GameEventName>().toEqualTypeOf<
      | "game_start"
      | "game_end"
      | "game_abandon"
      | "hint_used"
      | "tutorial_skip"
      | "tutorial_done"
      | "result_shared"
      | "favorite_set"
      | "save_discarded"
    >();
  });
});
