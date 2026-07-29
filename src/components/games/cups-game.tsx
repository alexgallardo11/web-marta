"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Dices, Download, RotateCcw } from "lucide-react";
import { CUP_CATEGORIES } from "@/lib/games-data";
import {
  agreeAdjectiveWithCharacter,
  pickRandom,
  wrapCanvasText,
} from "@/lib/game-utils";
import { useHydrated } from "@/lib/use-hydrated";

const emptyValues = CUP_CATEGORIES.map(() => "Toca para mezclar");
const storyColors = ["#f2d45f", "#efbfd0", "#70c3bc", "#72b8e8"];

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function drawStoryNote({
  context,
  x,
  y,
  width,
  height,
  color,
  label,
  value,
  rotation,
  bodyFont,
  displayFont,
}: {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
  value: string;
  rotation: number;
  bodyFont: string;
  displayFont: string;
}) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate(rotation);

  context.fillStyle = "#302530";
  context.beginPath();
  context.roundRect(
    -width / 2 + 12,
    -height / 2 + 14,
    width,
    height,
    28,
  );
  context.fill();

  context.fillStyle = color;
  context.strokeStyle = "#302530";
  context.lineWidth = 4;
  context.beginPath();
  context.roundRect(-width / 2, -height / 2, width, height, 28);
  context.fill();
  context.stroke();

  context.fillStyle = "rgba(251, 245, 233, 0.72)";
  context.fillRect(-58, -height / 2 - 12, 116, 30);

  context.fillStyle = "#302530";
  context.textAlign = "center";
  context.font = `800 22px ${bodyFont}`;
  context.fillText(label.toUpperCase(), 0, -height / 2 + 68);

  const valueSize = value.length > 22 ? 48 : 58;
  context.font = `400 ${valueSize}px ${displayFont}`;
  const lines = wrapCanvasText(context, value, width - 70).slice(0, 3);
  const lineHeight = valueSize * 0.9;
  const startY = 22 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, lineIndex) => {
    context.fillText(line, 0, startY + lineIndex * lineHeight);
  });

  context.restore();
}

export function CupsGame() {
  const hydrated = useHydrated();
  const [values, setValues] = useState<string[]>(emptyValues);
  const [spinning, setSpinning] = useState<boolean[]>(
    CUP_CATEGORIES.map(() => false),
  );
  const [exporting, setExporting] = useState(false);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  const finishTimers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearInterval);
      finishTimers.current.forEach(clearTimeout);
    };
  }, []);

  function spin(index: number, duration = 720) {
    if (spinning[index]) return;
    const category = CUP_CATEGORIES[index]!;
    setSpinning((current) =>
      current.map((value, itemIndex) => (itemIndex === index ? true : value)),
    );

    const interval = setInterval(() => {
      setValues((current) =>
        current.map((value, itemIndex) =>
          itemIndex === index ? pickRandom(category.items) : value,
        ),
      );
    }, 70);
    timers.current.push(interval);

    const finishTimer = window.setTimeout(() => {
      clearInterval(interval);
      setValues((current) =>
        current.map((value, itemIndex) =>
          itemIndex === index ? pickRandom(category.items) : value,
        ),
      );
      setSpinning((current) =>
        current.map((value, itemIndex) =>
          itemIndex === index ? false : value,
        ),
      );
    }, duration);
    finishTimers.current.push(finishTimer);
  }

  function spinAll() {
    CUP_CATEGORIES.forEach((_, index) => {
      window.setTimeout(() => spin(index, 650 + index * 120), index * 90);
    });
  }

  function reset() {
    timers.current.forEach(clearInterval);
    finishTimers.current.forEach(clearTimeout);
    timers.current = [];
    finishTimers.current = [];
    setValues(emptyValues);
    setSpinning(CUP_CATEGORIES.map(() => false));
  }

  const hasResult = values.some((value) => value !== "Toca para mezclar");
  const hasCompleteResult = values.every(
    (value) => value !== "Toca para mezclar",
  );
  const displayValues = values.map((value, index) =>
    index === 1 ? agreeAdjectiveWithCharacter(values[0]!, value) : value,
  );

  async function exportStory() {
    if (!hasCompleteResult) return;
    setExporting(true);

    try {
      await document.fonts.ready;
      const [logo, characters] = await Promise.all([
        loadCanvasImage("/images/marta-moreno-logo.png"),
        loadCanvasImage("/images/fondo-resenas.jpg"),
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

      context.fillStyle = "#fbf5e9";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "rgba(48, 37, 48, 0.08)";
      for (let index = 0; index < 180; index += 1) {
        const x = (index * 83) % canvas.width;
        const y = (index * 137) % canvas.height;
        context.beginPath();
        context.arc(x, y, index % 3 === 0 ? 1.4 : 0.8, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = "#f2d45f";
      context.beginPath();
      context.arc(1010, 90, 205, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#efbfd0";
      context.beginPath();
      context.arc(-15, 720, 170, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#70c3bc";
      context.beginPath();
      context.arc(1070, 1110, 145, 0, Math.PI * 2);
      context.fill();

      if (logo) {
        context.drawImage(logo, 390, 62, 300, 80);
      } else {
        context.fillStyle = "#302530";
        context.textAlign = "center";
        context.font = `800 31px ${bodyFont}`;
        context.fillText("MARTA MORENO", 540, 115);
      }

      context.fillStyle = "#302530";
      context.textAlign = "center";
      context.font = `800 23px ${bodyFont}`;
      context.fillText("PERSONAJES LOCOS · RETO CREATIVO", 540, 210);

      context.font = `400 100px ${displayFont}`;
      context.fillText("¿A quién vas", 540, 315);
      context.fillText("a dibujar?", 540, 405);
      context.font = `400 32px ${bodyFont}`;
      context.fillText("El azar ha elegido estas cuatro pistas para ti", 540, 468);

      displayValues.forEach((value, index) => {
        const positions = [
          { x: 80, y: 610, rotation: -0.025 },
          { x: 555, y: 625, rotation: 0.02 },
          { x: 95, y: 910, rotation: 0.018 },
          { x: 545, y: 925, rotation: -0.022 },
        ] as const;
        const position = positions[index]!;

        drawStoryNote({
          context,
          x: position.x,
          y: position.y,
          width: 445,
          height: 255,
          color: storyColors[index]!,
          label: `${CUP_CATEGORIES[index]!.number} · ${CUP_CATEGORIES[index]!.label}`,
          value,
          rotation: position.rotation,
          bodyFont,
          displayFont,
        });
      });

      if (characters) {
        context.save();
        context.beginPath();
        context.roundRect(70, 1190, 940, 420, 60);
        context.clip();
        context.fillStyle = "#fffdf8";
        context.fillRect(70, 1190, 940, 420);
        context.drawImage(characters, 70, 1190, 940, 443);
        context.restore();
      }

      context.fillStyle = "#302530";
      context.strokeStyle = "#302530";
      context.lineWidth = 4;
      context.beginPath();
      context.roundRect(680, 1218, 285, 108, 28);
      context.fillStyle = "#fbf5e9";
      context.fill();
      context.stroke();
      context.font = `800 27px ${bodyFont}`;
      context.textAlign = "center";
      context.fillStyle = "#302530";
      context.fillText("¡Ahora te toca a ti!", 822, 1280);

      context.fillStyle = "#c52e65";
      context.fillRect(0, 1615, 1080, 305);
      context.fillStyle = "#fbf5e9";
      context.font = `400 78px ${displayFont}`;
      context.fillText("Dibújalo a tu manera", 540, 1730);
      context.font = `800 27px ${bodyFont}`;
      context.fillText("Compártelo y etiqueta a @martamoreno.art", 540, 1800);

      context.strokeStyle = "#f2d45f";
      context.lineWidth = 9;
      context.beginPath();
      context.moveTo(365, 1762);
      context.quadraticCurveTo(540, 1780, 715, 1758);
      context.stroke();

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "personaje-loco-marta-moreno.png";
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="cups-lab site-container">
      <div className="cups-lab__instructions">
        <span aria-hidden="true">↙</span>
        Toca un vaso para agitarlo
      </div>

      <div className="cups-grid">
        {CUP_CATEGORIES.map((category, index) => (
          <button
            key={category.id}
            type="button"
            onClick={() => spin(index)}
            disabled={!hydrated || spinning[index]}
            className="idea-cup"
            aria-label={`Mezclar ${category.label.toLowerCase()}`}
            style={
              {
                "--cup-color": category.color,
                "--cup-index": index,
              } as CSSProperties
            }
          >
            <span className="idea-cup__stage" aria-hidden="true">
              <span
                className={`idea-cup__shadow ${
                  spinning[index] ? "is-mixing" : ""
                }`}
              />
              <span
                className={`idea-cup__object ${
                  spinning[index] ? "is-mixing" : ""
                }`}
              >
                <span className="idea-cup__body">
                  <span className="idea-cup__shine" />
                  <span className="idea-cup__number">
                    {category.number}
                  </span>
                  <span className="idea-cup__label">{category.label}</span>
                  <span
                    className={`idea-cup__spark ${
                      spinning[index] ? "is-mixing" : ""
                    }`}
                  >
                    ✦
                  </span>
                  <span
                    className={`idea-cup__value ${
                      displayValues[index] === "Toca para mezclar"
                        ? "is-empty"
                        : ""
                    }`}
                  >
                    {displayValues[index]}
                  </span>
                  <span className="idea-cup__action">
                    {spinning[index] ? "Mezclando…" : "Toca el vaso"}
                  </span>
                </span>
                <span className="idea-cup__rim">
                  <span className="idea-cup__rim-inner" />
                </span>
                <span className="idea-cup__base" />
              </span>
            </span>
            <span className="sr-only" aria-live="polite">
              {spinning[index]
                ? `Mezclando ${category.label.toLowerCase()}`
                : `${category.label}: ${displayValues[index]}`}
            </span>
          </button>
        ))}
      </div>

      <div className="cups-lab__controls">
        <button
          type="button"
          onClick={spinAll}
          disabled={!hydrated || spinning.some(Boolean)}
          className="btn-primary w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          <Dices className="size-5" aria-hidden="true" />
          Mezclar los cuatro
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={!hydrated || !hasResult}
          className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <RotateCcw className="size-5" aria-hidden="true" />
          Empezar de nuevo
        </button>
        <button
          type="button"
          onClick={exportStory}
          disabled={!hydrated || !hasCompleteResult || exporting}
          className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <Download className="size-5" aria-hidden="true" />
          {exporting ? "Preparando imagen…" : "Descargar para Stories"}
        </button>
      </div>

      {hasResult && (
        <div
          className="cups-result"
          aria-live="polite"
        >
          <span className="cups-result__pin" aria-hidden="true" />
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--pink)]">
            Tu reto de dibujo
          </p>
          <p className="mt-2 font-display text-3xl leading-tight sm:text-5xl">
            {displayValues.join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
