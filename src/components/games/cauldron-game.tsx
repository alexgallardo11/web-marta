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

type CauldronSelection = {
  character: CauldronOption | null;
  personality: CauldronOption | null;
  context: CauldronOption | null;
};

type CompleteSelection = Omit<Result, "bio">;

type CauldronState = {
  selection: CauldronSelection;
  bio: string | null;
};

const emptySelection: CauldronSelection = {
  character: null,
  personality: null,
  context: null,
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

function isCompleteSelection(
  selection: CauldronSelection,
): selection is CompleteSelection {
  return Boolean(
    selection.character && selection.personality && selection.context,
  );
}

export function CauldronGame() {
  const hydrated = useHydrated();
  const [cauldron, setCauldron] = useState<CauldronState>({
    selection: emptySelection,
    bio: null,
  });
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
  const result = useMemo<Result | null>(() => {
    if (!isCompleteSelection(cauldron.selection) || !cauldron.bio) return null;
    return { ...cauldron.selection, bio: cauldron.bio };
  }, [cauldron]);
  const selectedCount = Object.values(cauldron.selection).filter(Boolean).length;

  useEffect(() => {
    return () => {
      if (brewTimer.current) clearTimeout(brewTimer.current);
    };
  }, []);

  function invokeResult(nextResult = createResult()) {
    if (brewing) return;
    setBrewing(true);
    brewTimer.current = window.setTimeout(() => {
      setCauldron({
        selection: {
          character: nextResult.character,
          personality: nextResult.personality,
          context: nextResult.context,
        },
        bio: nextResult.bio,
      });
      setBrewing(false);
    }, 480);
  }

  function cycleSlot(
    slot: "character" | "personality" | "context",
  ) {
    setCauldron((current) => {
      const selection = {
        ...current.selection,
        [slot]:
        slot === "character"
          ? pickRandom(CHARACTERS)
          : slot === "personality"
            ? pickRandom(PERSONALITIES)
            : pickRandom(CONTEXTS),
      };

      return {
        selection,
        bio: isCompleteSelection(selection)
          ? createResult(
              selection.character,
              selection.personality,
              selection.context,
            ).bio
          : null,
      };
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
      value: cauldron.selection.character,
      color: "var(--yellow)",
    },
    {
      key: "personality" as const,
      number: "02",
      label: "Especia secreta",
      value: cauldron.selection.personality,
      color: "var(--pink-soft)",
    },
    {
      key: "context" as const,
      number: "03",
      label: "Poción transformadora",
      value: cauldron.selection.context,
      color: "var(--turquoise)",
    },
  ];

  return (
    <div className="magic-lab site-container">
      <header className="game-section-intro game-section-intro--magic">
        <span aria-hidden="true">01</span>
        <div>
          <p>Prepara la receta</p>
          <h2>Elige tres ingredientes para tu historia.</h2>
        </div>
      </header>

      <div className="magic-ingredients">
        {slots.map((slot) => (
          <button
            type="button"
            key={slot.key}
            onClick={() => cycleSlot(slot.key)}
            disabled={!hydrated || brewing}
            className={`magic-ingredient group ${slot.value ? "is-selected" : ""}`}
            style={{ background: slot.color }}
            aria-label={`Cambiar ${slot.label.toLowerCase()}`}
            aria-pressed={Boolean(slot.value)}
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
            <span className="magic-ingredient__status">
              {slot.value ? "Elegido · toca para cambiar" : "Aún vacío"}
            </span>
          </button>
        ))}
      </div>

      <p className="magic-progress" aria-live="polite">
        <span>{selectedCount}/3</span>
        {selectedCount === 0
          ? "El caldero espera tus ingredientes."
          : selectedCount < 3
            ? "Ya huele a historia. Sigue eligiendo."
            : "¡La mezcla está lista!"}
      </p>

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
          className="game-action game-action--primary"
        >
          <Dices className="size-5" aria-hidden="true" />
          {brewing ? "Mezclando ingredientes…" : "Invocar personaje"}
        </button>
        <button
          type="button"
          onClick={exportStory}
          disabled={!hydrated || !result || exporting}
          className="game-action game-action--secondary"
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
          <p className="magic-result__eyebrow">
            Personaje invocado
          </p>
          <h2 className="magic-result__title">
            {result.character.name} {result.personality.name}
          </h2>
          <div className="magic-result__ingredients">
            {[result.character, result.personality, result.context].map(
              (item) => (
                <span
                  key={`${item.name}-${item.emoji}`}
                  className="magic-result__ingredient"
                  style={{ background: `${item.color}22` }}
                >
                  {item.emoji} {item.name}
                </span>
              ),
            )}
          </div>
          <p className="magic-result__bio">
            {result.bio}
          </p>
        </section>
      ) : (
        <div className="magic-empty">
          <Sparkles aria-hidden="true" />
          <p>
            {selectedCount === 0
              ? "Empieza tu receta."
              : `Te faltan ${3 - selectedCount} ${3 - selectedCount === 1 ? "ingrediente" : "ingredientes"}.`}
          </p>
          <p>
            Toca las tarjetas que quieras elegir o deja que el botón «Invocar
            personaje» complete la mezcla.
          </p>
        </div>
      )}

      <section className="magic-quick" aria-labelledby="ideas-rapidas-title">
        <div className="magic-quick__heading">
          <span id="ideas-rapidas-title">Recetas rápidas</span>
          <span aria-hidden="true" />
        </div>
        <div className="magic-quick__grid">
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
              className="magic-quick__idea"
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
