import { describe, expect, it } from "vitest";
import {
  formatPaletteText,
  generatePalette,
  hexToHue,
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

  it("calcula el tono de un color", () => {
    expect(hexToHue("#FF0000")).toBe(0);
    expect(hexToHue("#00FF00")).toBe(120);
    expect(hexToHue("#0000FF")).toBe(240);
    expect(hexToHue("#808080")).toBe(0);
    expect(hexToHue("nope")).toBeNull();
  });

  it("mantiene los colores bloqueados al generar", () => {
    for (let i = 0; i < 30; i++) {
      const [dominant, secondary, accent] = generatePalette(
        Math.random,
        undefined,
        ["#4E8F4A", null, "#C8502E"],
      );
      expect(dominant).toBe("#4E8F4A");
      expect(accent).toBe("#C8502E");
      expect(normalizeHex(secondary)).toBe(secondary);
    }
  });

  it("genera a partir del tono del color bloqueado", () => {
    // Triádica con el dominante bloqueado en azul (240°): secundario ≈ 0°, acento ≈ 120°.
    const [, secondary, accent] = generatePalette(Math.random, "triádica", [
      "#0000FF",
      null,
      null,
    ]);
    expect(hexToHue(secondary)).toBeCloseTo(0, -1);
    expect(hexToHue(accent)).toBeCloseTo(120, -1);
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
