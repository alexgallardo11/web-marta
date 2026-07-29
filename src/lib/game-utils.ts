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
