import { describe, expect, it } from "vitest";
import {
  formatPaletteText,
  generatePalette,
  hslToHex,
  normalizeHex,
  readableTextColor,
  swapDominantAndAccent,
} from "./palette-utils";

describe("palette-utils", () => {
  it("normaliza hexadecimales válidos e inválidos", () => {
    expect(normalizeHex("#4e8f4a")).toBe("#4E8F4A");
    expect(normalizeHex("c85")).toBe("#CC8855");
    expect(normalizeHex("zzzzzz")).toBeNull();
    expect(normalizeHex("#12345")).toBeNull();
  });

  it("convierte HSL a hexadecimal", () => {
    expect(hslToHex(0, 100, 50)).toBe("#FF0000");
    expect(hslToHex(120, 100, 50)).toBe("#00FF00");
    expect(hslToHex(0, 0, 100)).toBe("#FFFFFF");
  });

  it("genera siempre tres colores hexadecimales", () => {
    for (let i = 0; i < 50; i++) {
      const palette = generatePalette();
      expect(palette).toHaveLength(3);
      palette.forEach((color) => expect(normalizeHex(color)).toBe(color));
    }
  });

  it("intercambia dominante y acento", () => {
    expect(swapDominantAndAccent(["#111111", "#222222", "#333333"])).toEqual([
      "#333333",
      "#222222",
      "#111111",
    ]);
  });

  it("elige un texto legible", () => {
    expect(readableTextColor("#FFFFFF")).toBe("#272029");
    expect(readableTextColor("#000000")).toBe("#ffffff");
  });

  it("resume la paleta con porcentajes y usos", () => {
    const text = formatPaletteText(["#111111", "#222222", "#333333"]);
    expect(text).toContain("Dominante 60 % (fondo y ambiente): #111111");
    expect(text).toContain("Acento 10 % (lo que destaca): #333333");
  });
});
