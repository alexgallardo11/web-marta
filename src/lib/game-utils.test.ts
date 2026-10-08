import { describe, expect, it, vi } from "vitest";
import {
  agreeAdjectiveWithCharacter,
  formatCountdown,
  pickDifferentIndex,
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

describe("pickDifferentIndex", () => {
  it("nunca repite la forma anterior", () => {
    expect(pickDifferentIndex(5, 2, () => 0.5)).toBe(3);
    expect(pickDifferentIndex(5, 2, () => 0.3)).toBe(1);
    expect(pickDifferentIndex(5, 4, () => 0.999)).toBe(3);
  });

  it("elige libremente cuando no hay forma anterior", () => {
    expect(pickDifferentIndex(5, null, () => 0.999)).toBe(4);
    expect(pickDifferentIndex(1, 0, () => 0.7)).toBe(0);
  });

  it("rechaza colecciones vacías", () => {
    expect(() => pickDifferentIndex(0, null)).toThrow();
  });
});

describe("formatCountdown", () => {
  it("muestra minutos y segundos redondeando hacia arriba", () => {
    expect(formatCountdown(180_000)).toBe("3:00");
    expect(formatCountdown(61_200)).toBe("1:02");
    expect(formatCountdown(400)).toBe("0:01");
    expect(formatCountdown(-5)).toBe("0:00");
  });
});
