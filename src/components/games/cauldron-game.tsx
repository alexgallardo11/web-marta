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
import { DrawingCameraShare } from "@/components/games/drawing-camera-share";
import { BRAND_COLORS } from "@/lib/brand-colors";

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

function ensureConsistentBio(selection: CompleteSelection, bio: string) {
  const normalizedBio = bio.toLocaleLowerCase("es");
  const mentionsCurrentSelection = [
    selection.character.name,
    selection.personality.name,
    selection.context.name,
  ].every((value) =>
    normalizedBio.includes(value.toLocaleLowerCase("es")),
  );

  return mentionsCurrentSelection
    ? bio
    : BIO_TEMPLATES[0](
        selection.character.name,
        selection.personality.name,
        selection.context.name,
      );
}

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function drawStoryCauldron(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
) {
  context.save();

  context.strokeStyle = BRAND_COLORS.ink;
  context.lineWidth = 16;
  context.beginPath();
  context.ellipse(centerX - 205, centerY + 28, 58, 72, 0, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.ellipse(centerX + 205, centerY + 28, 58, 72, 0, 0, Math.PI * 2);
  context.stroke();

  const bodyGradient = context.createLinearGradient(
    centerX - 210,
    centerY,
    centerX + 210,
    centerY,
  );
  bodyGradient.addColorStop(0, BRAND_COLORS.red);
  bodyGradient.addColorStop(0.45, BRAND_COLORS.orange);
  bodyGradient.addColorStop(0.72, BRAND_COLORS.red);
  bodyGradient.addColorStop(1, BRAND_COLORS.ink);

  context.fillStyle = bodyGradient;
  context.beginPath();
  context.roundRect(centerX - 215, centerY - 20, 430, 230, [32, 32, 110, 110]);
  context.fill();
  context.strokeStyle = BRAND_COLORS.ink;
  context.lineWidth = 7;
  context.stroke();

  context.fillStyle = "rgba(255, 253, 247, 0.28)";
  context.beginPath();
  context.ellipse(centerX - 112, centerY + 64, 27, 78, 0.15, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = BRAND_COLORS.red;
  context.strokeStyle = BRAND_COLORS.ink;
  context.lineWidth = 7;
  context.beginPath();
  context.ellipse(centerX, centerY - 24, 245, 60, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.fillStyle = BRAND_COLORS.ink;
  context.beginPath();
  context.ellipse(centerX, centerY - 24, 205, 38, 0, 0, Math.PI * 2);
  context.fill();

  [
    { x: -115, y: -95, radius: 14, color: BRAND_COLORS.orange },
    { x: -28, y: -132, radius: 18, color: BRAND_COLORS.cyan },
    { x: 72, y: -105, radius: 12, color: BRAND_COLORS.red },
    { x: 142, y: -154, radius: 10, color: BRAND_COLORS.lime },
  ].forEach((bubble) => {
    context.fillStyle = bubble.color;
    context.strokeStyle = BRAND_COLORS.ink;
    context.lineWidth = 4;
    context.beginPath();
    context.arc(
      centerX + bubble.x,
      centerY + bubble.y,
      bubble.radius,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.stroke();
  });

  const flames = [
    { x: -72, height: 104, color: BRAND_COLORS.orange, tilt: -0.1 },
    { x: 0, height: 132, color: BRAND_COLORS.red, tilt: 0 },
    { x: 72, height: 96, color: BRAND_COLORS.orange, tilt: 0.12 },
  ];
  flames.forEach((flame) => {
    context.save();
    context.translate(centerX + flame.x, centerY + 245);
    context.rotate(flame.tilt);
    context.fillStyle = flame.color;
    context.strokeStyle = BRAND_COLORS.ink;
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(0, -flame.height);
    context.bezierCurveTo(52, -56, 42, -4, 0, 8);
    context.bezierCurveTo(-42, -4, -52, -56, 0, -flame.height);
    context.fill();
    context.stroke();
    context.restore();
  });

  context.restore();
}

function drawStoryIngredient({
  context,
  y,
  color,
  number,
  label,
  value,
  emoji,
  bodyFont,
  displayFont,
}: {
  context: CanvasRenderingContext2D;
  y: number;
  color: string;
  number: string;
  label: string;
  value: string;
  emoji: string;
  bodyFont: string;
  displayFont: string;
}) {
  context.fillStyle = color;
  context.strokeStyle = BRAND_COLORS.ink;
  context.lineWidth = 4;
  context.beginPath();
  context.roundRect(70, y, 940, 108, 30);
  context.fill();
  context.stroke();

  context.fillStyle = BRAND_COLORS.ink;
  context.textAlign = "left";
  context.font = `900 20px ${bodyFont}`;
  context.fillText(`${number} · ${label.toUpperCase()}`, 100, y + 36);

  context.font = `400 ${value.length > 28 ? 34 : 42}px ${displayFont}`;
  context.fillText(`${emoji}  ${value}`, 100, y + 83);
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
    return {
      ...cauldron.selection,
      bio: ensureConsistentBio(cauldron.selection, cauldron.bio),
    };
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
    const storyResult: Result = {
      character: result.character,
      personality: result.personality,
      context: result.context,
      bio: result.bio,
    };
    setExporting(true);

    try {
      await document.fonts.ready;
      const [brandMark, narrator] = await Promise.all([
        loadCanvasImage("/images/web-2026/marta-illustration.png"),
        loadCanvasImage("/images/web-2026/characters/perro-cocinero.png"),
      ]);
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const context = canvas.getContext("2d");
      if (!context) return;
      const rootStyle = getComputedStyle(document.documentElement);
      const bodyFont =
        rootStyle.getPropertyValue("--font-body").trim() || "sans-serif";
      const displayFont =
        rootStyle.getPropertyValue("--font-display").trim() || "sans-serif";

      context.fillStyle = BRAND_COLORS.paper;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "rgba(39, 32, 41, 0.08)";
      for (let index = 0; index < 180; index += 1) {
        const x = (index * 83) % canvas.width;
        const y = (index * 137) % canvas.height;
        context.beginPath();
        context.arc(x, y, index % 3 === 0 ? 1.4 : 0.8, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = BRAND_COLORS.cyan;
      context.beginPath();
      context.ellipse(1010, 190, 255, 330, -0.18, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = BRAND_COLORS.orange;
      context.beginPath();
      context.arc(-35, 830, 185, 0, Math.PI * 2);
      context.fill();

      if (brandMark) {
        context.drawImage(brandMark, 70, 52, 78, 78);
      }

      context.fillStyle = BRAND_COLORS.ink;
      context.textAlign = "left";
      context.font = `800 31px ${displayFont}`;
      context.fillText("Marta Moreno", 165, 88);
      context.font = `900 17px ${bodyFont}`;
      context.letterSpacing = "2px";
      context.fillText("ILUSTRADORA INFANTIL", 166, 116);
      context.letterSpacing = "0px";

      context.fillStyle = BRAND_COLORS.red;
      context.font = `900 21px ${bodyFont}`;
      context.fillText("CALDERO MÁGICO · RETO CREATIVO", 70, 205);

      context.fillStyle = BRAND_COLORS.ink;
      context.font = `400 82px ${displayFont}`;
      context.fillText("Tu próxima historia", 70, 300);
      context.fillStyle = BRAND_COLORS.red;
      context.fillText("ya está hirviendo.", 70, 382);

      drawStoryCauldron(context, 540, 610);

      context.fillStyle = BRAND_COLORS.ink;
      context.textAlign = "center";
      const resultTitle = `${storyResult.character.name} ${storyResult.personality.name}`;
      const resultTitleSize = resultTitle.length > 30 ? 53 : 64;
      context.font = `400 ${resultTitleSize}px ${displayFont}`;
      const titleLines = wrapCanvasText(context, resultTitle, 870).slice(0, 2);
      titleLines.forEach((line, lineIndex) => {
        context.fillText(line, 540, 930 + lineIndex * resultTitleSize * 0.94);
      });

      drawStoryIngredient({
        context,
        y: 1040,
        color: BRAND_COLORS.orange,
        number: "01",
        label: "Ingrediente base",
        value: storyResult.character.name,
        emoji: storyResult.character.emoji,
        bodyFont,
        displayFont,
      });
      drawStoryIngredient({
        context,
        y: 1165,
        color: BRAND_COLORS.lime,
        number: "02",
        label: "Especia secreta",
        value: storyResult.personality.name,
        emoji: storyResult.personality.emoji,
        bodyFont,
        displayFont,
      });
      drawStoryIngredient({
        context,
        y: 1290,
        color: BRAND_COLORS.cyan,
        number: "03",
        label: "Poción transformadora",
        value: storyResult.context.name,
        emoji: storyResult.context.emoji,
        bodyFont,
        displayFont,
      });

      context.fillStyle = BRAND_COLORS.paper;
      context.strokeStyle = BRAND_COLORS.ink;
      context.lineWidth = 5;
      context.beginPath();
      context.roundRect(70, 1440, 735, 265, 36);
      context.fill();
      context.stroke();
      context.beginPath();
      context.moveTo(800, 1580);
      context.lineTo(850, 1610);
      context.lineTo(800, 1632);
      context.closePath();
      context.fill();
      context.stroke();

      context.fillStyle = BRAND_COLORS.red;
      context.textAlign = "left";
      context.font = `900 19px ${bodyFont}`;
      context.fillText("EL PERRO COCINERO TE CUENTA…", 105, 1488);
      context.fillStyle = BRAND_COLORS.ink;
      const bioSize = storyResult.bio.length > 175 ? 27 : 31;
      context.font = `700 ${bioSize}px ${bodyFont}`;
      const bioLines = wrapCanvasText(context, storyResult.bio, 650).slice(0, 5);
      bioLines.forEach((line, lineIndex) => {
        context.fillText(line, 105, 1540 + lineIndex * bioSize * 1.35);
      });

      if (narrator) {
        context.drawImage(narrator, 810, 1465, 235, 235);
      }

      context.fillStyle = BRAND_COLORS.orange;
      context.fillRect(0, 1750, 1080, 170);
      context.fillStyle = BRAND_COLORS.ink;
      context.textAlign = "center";
      context.font = `400 46px ${displayFont}`;
      context.fillText("Ahora dibújalo a tu manera", 540, 1820);
      context.font = `900 24px ${bodyFont}`;
      context.fillText("Compártelo con @martamoreno.art", 540, 1872);

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
        <DrawingCameraShare
          enabled={hydrated && Boolean(result)}
          game="cauldron"
          challengeTitle={
            result ? `${result.character.name} ${result.personality.name}` : ""
          }
          details={
            result
              ? [
                  { label: "Ingrediente base", value: result.character.name },
                  { label: "Especia secreta", value: result.personality.name },
                  {
                    label: "Poción transformadora",
                    value: result.context.name,
                  },
                ]
              : []
          }
        />
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
