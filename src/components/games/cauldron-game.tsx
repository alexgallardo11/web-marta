"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Dices, RefreshCw, Sparkles } from "lucide-react";
import {
  BIO_TEMPLATES,
  CHARACTERS,
  CONTEXTS,
  PERSONALITIES,
  type CauldronOption,
} from "@/lib/games-data";
import { pickRandom, wrapCanvasText } from "@/lib/game-utils";
import { useHydrated } from "@/lib/use-hydrated";

type Result = {
  character: CauldronOption;
  personality: CauldronOption;
  context: CauldronOption;
  bio: string;
};

const quickIdeas = [
  [0, 3, 14],
  [5, 11, 7],
  [12, 8, 4],
  [16, 18, 1],
  [9, 6, 10],
  [14, 15, 18],
] as const;

function createResult(
  character = pickRandom(CHARACTERS),
  personality = pickRandom(PERSONALITIES),
  context = pickRandom(CONTEXTS),
): Result {
  const template = pickRandom(BIO_TEMPLATES);
  return {
    character,
    personality,
    context,
    bio: template(character.name, personality.name, context.name),
  };
}

export function CauldronGame() {
  const hydrated = useHydrated();
  const [result, setResult] = useState<Result | null>(null);
  const [exporting, setExporting] = useState(false);
  const [brewing, setBrewing] = useState(false);
  const brewTimer = useRef<number | null>(null);
  const ideas = useMemo(
    () =>
      quickIdeas.map(([character, personality, context]) => ({
        character: CHARACTERS[character]!,
        personality: PERSONALITIES[personality]!,
        context: CONTEXTS[context]!,
      })),
    [],
  );

  useEffect(() => {
    return () => {
      if (brewTimer.current) clearTimeout(brewTimer.current);
    };
  }, []);

  function invokeResult(nextResult = createResult()) {
    if (brewing) return;
    setBrewing(true);
    brewTimer.current = window.setTimeout(() => {
      setResult(nextResult);
      setBrewing(false);
    }, 480);
  }

  function cycleSlot(
    slot: "character" | "personality" | "context",
  ) {
    const current = result ?? createResult();
    setResult({
      ...current,
      [slot]:
        slot === "character"
          ? pickRandom(CHARACTERS)
          : slot === "personality"
            ? pickRandom(PERSONALITIES)
            : pickRandom(CONTEXTS),
    });
  }

  async function exportStory() {
    if (!result) return;
    setExporting(true);

    try {
      await document.fonts.ready;
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const context = canvas.getContext("2d");
      if (!context) return;

      context.fillStyle = "#f8f0e3";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "#f1cd43";
      context.beginPath();
      context.arc(920, 170, 250, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#dd3f74";
      context.beginPath();
      context.arc(100, 1740, 290, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "#2f2630";
      context.lineWidth = 6;
      context.strokeRect(62, 62, 956, 1796);

      context.fillStyle = "#2f2630";
      context.font = "700 34px sans-serif";
      context.textAlign = "center";
      context.fillText("MARTA MORENO · RETO CREATIVO", 540, 150);

      context.font = "160px sans-serif";
      context.fillText(result.character.emoji, 540, 410);

      context.font = "700 80px sans-serif";
      const titleLines = wrapCanvasText(
        context,
        `${result.character.name} ${result.personality.name}`,
        820,
      );
      titleLines.slice(0, 2).forEach((line, index) => {
        context.fillText(line, 540, 590 + index * 90);
      });

      const badgeValues = [
        result.character.name,
        result.personality.name,
        result.context.name,
      ];
      let badgeY = 820;
      context.font = "700 35px sans-serif";
      badgeValues.forEach((value, index) => {
        context.fillStyle = ["#f1cd43", "#e8b3c7", "#8dcfc9"][index]!;
        context.fillRect(130, badgeY - 50, 820, 78);
        context.fillStyle = "#2f2630";
        context.fillText(value, 540, badgeY);
        badgeY += 105;
      });

      context.font = "42px sans-serif";
      const bioLines = wrapCanvasText(context, result.bio, 760);
      context.fillStyle = "#2f2630";
      bioLines.slice(0, 7).forEach((line, index) => {
        context.fillText(line, 540, 1230 + index * 58);
      });

      context.font = "700 34px sans-serif";
      context.fillText("¿Y si lo dibujas a tu manera?", 540, 1755);
      context.font = "28px sans-serif";
      context.fillText("@martamoreno.art", 540, 1810);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "caldero-magico-marta-moreno.png";
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  const slots = [
    {
      key: "character" as const,
      number: "01",
      label: "Ingrediente base",
      value: result?.character,
      color: "var(--yellow)",
    },
    {
      key: "personality" as const,
      number: "02",
      label: "Especia secreta",
      value: result?.personality,
      color: "var(--pink-soft)",
    },
    {
      key: "context" as const,
      number: "03",
      label: "Poción transformadora",
      value: result?.context,
      color: "var(--turquoise)",
    },
  ];

  return (
    <div className="magic-lab site-container">
      <div className="magic-ingredients">
        {slots.map((slot) => (
          <button
            type="button"
            key={slot.key}
            onClick={() => cycleSlot(slot.key)}
            disabled={!hydrated || brewing}
            className="magic-ingredient group"
            style={{ background: slot.color }}
            aria-label={`Cambiar ${slot.label.toLowerCase()}`}
          >
            <span className="magic-ingredient__topline">
              <span>
                {slot.number} · {slot.label}
              </span>
              <RefreshCw
                className="size-4 transition-transform group-hover:rotate-90"
                aria-hidden="true"
              />
            </span>
            <span className="magic-ingredient__value">
              <span className="magic-ingredient__emoji" aria-hidden="true">
                {slot.value?.emoji ?? "?"}
              </span>
              <span>{slot.value?.name ?? "Toca para elegir"}</span>
            </span>
          </button>
        ))}
      </div>

      <div
        className={`magic-workbench ${brewing ? "is-brewing" : ""}`}
        aria-hidden="true"
      >
        <span className="magic-workbench__scribble">mezcla · imagina · dibuja</span>
        <div className="magic-cauldron">
          <div className="magic-cauldron__steam">
            <span />
            <span />
            <span />
          </div>
          <div className="magic-cauldron__bubbles">
            <span>✦</span>
            <span>●</span>
            <span>✦</span>
            <span>●</span>
          </div>
          <div className="magic-cauldron__rim">
            <span />
          </div>
          <div className="magic-cauldron__handle magic-cauldron__handle--left" />
          <div className="magic-cauldron__handle magic-cauldron__handle--right" />
          <div className="magic-cauldron__body">
            <span className="magic-cauldron__glint" />
          </div>
        </div>
        <div className="magic-fire">
          <span />
          <span />
          <span />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="magic-workbench__shadow" />
      </div>

      <div className="magic-lab__controls">
        <button
          type="button"
          onClick={() => invokeResult()}
          disabled={!hydrated || brewing}
          className="btn-primary w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          <Dices className="size-5" aria-hidden="true" />
          {brewing ? "Mezclando ingredientes…" : "Invocar personaje"}
        </button>
        <button
          type="button"
          onClick={exportStory}
          disabled={!hydrated || !result || exporting}
          className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <Download className="size-5" aria-hidden="true" />
          {exporting ? "Preparando imagen…" : "Descargar para Stories"}
        </button>
        <span className="sr-only" aria-live="polite">
          {brewing ? "El caldero está mezclando los ingredientes" : ""}
        </span>
      </div>

      {result ? (
        <section
          aria-live="polite"
          className="magic-result"
        >
          <span className="magic-result__emoji" aria-hidden="true">
            {result.character.emoji}
          </span>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--pink)]">
            Personaje invocado
          </p>
          <h2 className="mt-4 max-w-[15ch] font-display text-5xl leading-none sm:text-7xl">
            {result.character.name} {result.personality.name}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
            {[result.character, result.personality, result.context].map(
              (item) => (
                <span
                  key={`${item.name}-${item.emoji}`}
                  className="border-2 border-foreground px-3 py-1.5"
                  style={{ background: `${item.color}22` }}
                >
                  {item.emoji} {item.name}
                </span>
              ),
            )}
          </div>
          <p className="mt-7 max-w-[58ch] text-xl leading-relaxed text-foreground/75">
            {result.bio}
          </p>
        </section>
      ) : (
        <div className="magic-empty">
          <Sparkles className="mx-auto size-9 text-[var(--pink)]" aria-hidden="true" />
          <p className="mt-4 font-display text-3xl">
            El caldero está esperando sus ingredientes.
          </p>
          <p className="mt-2 text-foreground/65">
            Invoca una combinación completa o toca cada casilla para elegirla.
          </p>
        </div>
      )}

      <section className="mt-4">
        <div className="mb-6 flex items-center gap-3">
          <span className="font-display text-3xl">Ideas rápidas</span>
          <span className="h-0.5 flex-1 bg-foreground" aria-hidden="true" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <button
              key={`${idea.character.name}-${idea.context.name}`}
              type="button"
              disabled={!hydrated || brewing}
              onClick={() =>
                invokeResult(
                  createResult(
                    idea.character,
                    idea.personality,
                    idea.context,
                  ),
                )
              }
              className="flex min-h-24 items-center gap-3 border-2 border-foreground bg-[var(--paper)] p-4 text-left font-bold transition-colors hover:bg-[var(--yellow)] disabled:cursor-wait disabled:opacity-70"
            >
              <span className="text-3xl" aria-hidden="true">
                {idea.character.emoji}
              </span>
              <span>
                {idea.character.name} {idea.personality.name}
                <small className="mt-1 block font-normal text-foreground/60">
                  {idea.context.name}
                </small>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
