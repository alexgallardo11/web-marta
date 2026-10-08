export function pickRandom<T>(items: readonly T[], random = Math.random): T {
  if (items.length === 0) {
    throw new Error("No se puede elegir de una colección vacía");
  }
  return items[Math.floor(random() * items.length)]!;
}

export function agreeAdjectiveWithCharacter(
  character: string,
  adjective: string,
): string {
  const isFeminine = character.trim().toLocaleLowerCase("es").startsWith("una ");

  if (!isFeminine) return adjective;
  return adjective.replace(/o$/u, "a");
}

export function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || current === "") {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

export function pickDifferentIndex(
  length: number,
  previous: number | null,
  random = Math.random,
): number {
  if (length <= 0) {
    throw new Error("No se puede elegir de una colección vacía");
  }
  if (length === 1 || previous === null) {
    return Math.floor(random() * length);
  }
  const candidate = Math.floor(random() * (length - 1));
  return candidate >= previous ? candidate + 1 : candidate;
}

export function formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
