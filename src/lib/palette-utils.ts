export const PALETTE_ROLES = [
  {
    id: "dominant",
    label: "Dominante",
    percent: 60,
    purpose: "Fondo y ambiente",
  },
  {
    id: "secondary",
    label: "Secundario",
    percent: 30,
    purpose: "Lo que acompaña",
  },
  {
    id: "accent",
    label: "Acento",
    percent: 10,
    purpose: "Lo que destaca",
  },
] as const;

export type PaletteRole = (typeof PALETTE_ROLES)[number]["id"];
export type Palette = [string, string, string];

export const HARMONIES = ["análoga", "complementaria", "triádica"] as const;
export type Harmony = (typeof HARMONIES)[number];

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

export function normalizeHex(value: string): string | null {
  let hex = value.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    hex = [...hex].map((char) => char + char).join("");
  }
  const result = `#${hex}`;
  return HEX_PATTERN.test(result) ? result.toUpperCase() : null;
}

export function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.min(100, Math.max(0, s)) / 100;
  const light = Math.min(100, Math.max(0, l)) / 100;
  const chroma = sat * Math.min(light, 1 - light);
  const channel = (n: number) => {
    const k = (n + hue / 30) % 12;
    const value = light - chroma * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
}

/** Tono (0–360°) de un color hexadecimal, o null si no es válido. */
export function hexToHue(hex: string): number | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const [r, g, b] = [1, 3, 5].map(
    (index) => parseInt(normalized.slice(index, index + 2), 16) / 255,
  );
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  if (delta === 0) return 0;
  const hue =
    max === r
      ? ((g - b) / delta) % 6
      : max === g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4;
  return (hue * 60 + 360) % 360;
}

function between(random: () => number, min: number, max: number) {
  return min + random() * (max - min);
}

export type LockedColors = readonly [
  string | null,
  string | null,
  string | null,
];

/**
 * Crea una paleta 60/30/10: el dominante es un tono sereno, el secundario
 * acompaña (más claro o más apagado) y el acento es el más vivo.
 *
 * Los colores bloqueados se mantienen tal cual y el resto se genera a partir
 * de su tono, de modo que la paleta nueva siga combinando con ellos.
 */
export function generatePalette(
  random: () => number = Math.random,
  harmony: Harmony = HARMONIES[Math.floor(random() * HARMONIES.length)],
  locked: LockedColors = [null, null, null],
): Palette {
  const offsets: Record<Harmony, [number, number]> = {
    análoga: [between(random, 25, 40), between(random, -150, -120)],
    complementaria: [between(random, -20, 20), 180],
    triádica: [120, 240],
  };
  const [secondaryShift, accentShift] = offsets[harmony];
  const roleShifts = [0, secondaryShift, accentShift];

  const anchor = locked.findIndex((color) => color && hexToHue(color) !== null);
  const base =
    anchor >= 0
      ? hexToHue(locked[anchor]!)! - roleShifts[anchor]
      : Math.floor(random() * 360);
  const darkBase = random() < 0.5;

  const dominant = hslToHex(
    base,
    between(random, 35, 60),
    darkBase ? between(random, 22, 34) : between(random, 38, 50),
  );
  const secondary = hslToHex(
    base + secondaryShift,
    between(random, 40, 70),
    darkBase ? between(random, 68, 80) : between(random, 72, 84),
  );
  const accent = hslToHex(
    base + accentShift,
    between(random, 65, 85),
    between(random, 42, 55),
  );

  const generated = [dominant, secondary, accent];
  return generated.map((color, index) =>
    locked[index] && normalizeHex(locked[index]!) ? locked[index]! : color,
  ) as Palette;
}

/** Intercambia el dominante (60 %) con el acento (10 %). */
export function swapDominantAndAccent<T>(items: [T, T, T]): [T, T, T] {
  return [items[2], items[1], items[0]];
}

/** Elige texto oscuro o claro según la luminosidad del fondo. */
export function readableTextColor(hex: string): "#272029" | "#ffffff" {
  const normalized = normalizeHex(hex);
  if (!normalized) return "#272029";
  const [r, g, b] = [1, 3, 5].map((index) => {
    const value = parseInt(normalized.slice(index, index + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.4 ? "#272029" : "#ffffff";
}

export function formatPaletteText(palette: Palette): string {
  return PALETTE_ROLES.map(
    (role, index) =>
      `${role.label} ${role.percent} % (${role.purpose.toLowerCase()}): ${palette[index]}`,
  ).join("\n");
}
