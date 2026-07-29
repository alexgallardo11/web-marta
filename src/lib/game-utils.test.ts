import { describe, expect, it, vi } from "vitest";
import {
  agreeAdjectiveWithCharacter,
  pickRandom,
  wrapCanvasText,
} from "@/lib/game-utils";

describe("pickRandom", () => {
  it("selecciona el elemento correspondiente al valor aleatorio", () => {
    expect(pickRandom(["a", "b", "c"], () => 0)).toBe("a");
    expect(pickRandom(["a", "b", "c"], () => 0.5)).toBe("b");
    expect(pickRandom(["a", "b", "c"], () => 0.999)).toBe("c");
  });

  it("rechaza colecciones vacías", () => {
    expect(() => pickRandom([], vi.fn())).toThrow(
      "No se puede elegir de una colección vacía",
    );
  });
});

describe("agreeAdjectiveWithCharacter", () => {
  it("pasa al femenino los adjetivos acabados en o", () => {
    expect(agreeAdjectiveWithCharacter("Una científica", "divertido")).toBe(
      "divertida",
    );
    expect(agreeAdjectiveWithCharacter("Una bruja", "un poco loco")).toBe(
      "un poco loca",
    );
  });

  it("mantiene los adjetivos invariables y los personajes masculinos", () => {
    expect(agreeAdjectiveWithCharacter("Una abuela", "intrigante")).toBe(
      "intrigante",
    );
    expect(agreeAdjectiveWithCharacter("Un fantasma", "orgulloso")).toBe(
      "orgulloso",
    );
  });
});

describe("wrapCanvasText", () => {
  it("divide el texto respetando el ancho máximo", () => {
    const context = {
      measureText: (value: string) => ({ width: value.length * 10 }),
    } as CanvasRenderingContext2D;

    expect(wrapCanvasText(context, "uno dos tres cuatro", 80)).toEqual([
      "uno dos",
      "tres",
      "cuatro",
    ]);
  });
});
