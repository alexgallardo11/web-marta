"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Minus,
  MousePointerClick,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { SHAPE_CHALLENGES } from "@/lib/games-data";
import { formatCountdown, pickDifferentIndex } from "@/lib/game-utils";
import { useHydrated } from "@/lib/use-hydrated";

const ROUND_DURATION = 3 * 60 * 1000;
const FLIP_DURATION = 900;

type Phase = "idle" | "ready" | "flipping" | "running" | "paused" | "finished";

function playEndChime() {
  try {
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const audio = new AudioContextClass();
    [660, 880, 1320].forEach((frequency, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const start = audio.currentTime + index * 0.18;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.55);
    });
    window.setTimeout(() => void audio.close(), 1400);
  } catch {
    // El aviso sonoro es opcional.
  }
}

const GLASS_PATH =
  "M58 38 C54 96 94 122 96 150 C94 178 54 204 58 262 L142 262 C146 204 106 178 104 150 C106 122 146 96 142 38 Z";

/**
 * Reloj de arena dibujado en SVG. Es simétrico respecto a su centro, así que
 * tras girarlo 180° se puede volver a pintar "derecho" con la arena arriba sin
 * que se note el salto.
 */
function Hourglass({ progress, flowing }: { progress: number; flowing: boolean }) {
  const p = Math.min(1, Math.max(0, progress));
  const topSurface = 42 + 106 * Math.pow(p, 1.5);
  const dip = flowing ? 8 : 0;
  const pile = 108 * Math.pow(p, 1.25);

  return (
    <svg className="shape-hourglass__svg" viewBox="0 0 200 300" aria-hidden="true">
      <defs>
        <linearGradient id="hg-wood" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c98a4b" />
          <stop offset="0.45" stopColor="#a8652f" />
          <stop offset="1" stopColor="#7a4520" />
        </linearGradient>
        <linearGradient id="hg-wood-side" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7a4520" />
          <stop offset="0.4" stopColor="#c98a4b" />
          <stop offset="1" stopColor="#6b3b1a" />
        </linearGradient>
        <linearGradient id="hg-glass" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#dff4fb" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#cfe9f3" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="hg-sand" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#e3832a" />
          <stop offset="0.5" stopColor="#ffbd5d" />
          <stop offset="1" stopColor="#d9771f" />
        </linearGradient>
        <clipPath id="hg-clip">
          <path d={GLASS_PATH} />
        </clipPath>
      </defs>

      {/* Cristal y arena */}
      <path d={GLASS_PATH} fill="url(#hg-glass)" />
      <g clipPath="url(#hg-clip)">
        {p < 1 ? (
          <path
            d={`M0 ${topSurface} L86 ${topSurface} Q100 ${topSurface + dip * 2} 114 ${topSurface} L200 ${topSurface} L200 152 L0 152 Z`}
            fill="url(#hg-sand)"
          />
        ) : null}
        {pile > 0.5 ? (
          <path
            d={`M0 262 L0 ${262 - pile * 0.72} Q100 ${262 - pile * 1.28} 200 ${262 - pile * 0.72} L200 262 Z`}
            fill="url(#hg-sand)"
          />
        ) : null}
        {flowing && p < 1 ? (
          <line
            className="shape-hourglass__stream"
            x1="100"
            y1="146"
            x2="100"
            y2={262 - pile}
          />
        ) : null}
      </g>
      <path
        d="M66 52 C64 86 80 106 88 124"
        className="shape-hourglass__shine"
      />
      <path
        d="M134 248 C136 214 120 194 112 176"
        className="shape-hourglass__shine"
      />
      <path d={GLASS_PATH} className="shape-hourglass__glass" />

      {/* Postes delanteros torneados */}
      {[31, 169].map((x) => (
        <g key={x} fill="url(#hg-wood-side)">
          <rect x={x - 5} y="34" width="10" height="232" rx="5" />
          <ellipse cx={x} cy="62" rx="8" ry="7" />
          <ellipse cx={x} cy="150" rx="7.5" ry="10" />
          <ellipse cx={x} cy="238" rx="8" ry="7" />
        </g>
      ))}

      {/* Bases */}
      <rect x="18" y="28" width="164" height="9" rx="3" fill="#6b3b1a" />
      <rect x="6" y="6" width="188" height="24" rx="7" fill="url(#hg-wood)" />
      <rect x="14" y="10" width="172" height="3" rx="1.5" fill="#fff" opacity="0.22" />
      <rect x="18" y="263" width="164" height="9" rx="3" fill="#6b3b1a" />
      <rect x="6" y="270" width="188" height="24" rx="7" fill="url(#hg-wood)" />
      <rect x="14" y="274" width="172" height="3" rx="1.5" fill="#fff" opacity="0.22" />
    </svg>
  );
}

export function ShapeGame() {
  const hydrated = useHydrated();
  const [shapeIndex, setShapeIndex] = useState<number | null>(null);
  const [revealKey, setRevealKey] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [remaining, setRemaining] = useState(ROUND_DURATION);
  const [drawings, setDrawings] = useState(0);
  const endAt = useRef<number | null>(null);
  const tick = useRef<number | null>(null);
  const flipTimer = useRef<number | null>(null);

  const shape = shapeIndex === null ? null : SHAPE_CHALLENGES[shapeIndex]!;
  const timerActive = phase === "running" || phase === "paused";
  const sandProgress = timerActive ? 1 - remaining / ROUND_DURATION : 1;

  const stopTimers = useCallback(() => {
    if (tick.current !== null) window.clearInterval(tick.current);
    if (flipTimer.current !== null) window.clearTimeout(flipTimer.current);
    tick.current = null;
    flipTimer.current = null;
  }, []);

  useEffect(() => stopTimers, [stopTimers]);

  function runClock(duration: number) {
    endAt.current = Date.now() + duration;
    setPhase("running");
    tick.current = window.setInterval(() => {
      const left = Math.max(0, (endAt.current ?? 0) - Date.now());
      setRemaining(left);
      if (left === 0) {
        stopTimers();
        endAt.current = null;
        setPhase("finished");
        playEndChime();
        navigator.vibrate?.([180, 80, 180]);
      }
    }, 200);
  }

  function drawShape() {
    if (phase === "flipping" || timerActive) return;
    setShapeIndex((current) =>
      pickDifferentIndex(SHAPE_CHALLENGES.length, current),
    );
    setRevealKey((key) => key + 1);
    setRemaining(ROUND_DURATION);
    setDrawings(0);
    setPhase("ready");
  }

  function handleHourglass() {
    if (phase === "ready") {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setPhase("flipping");
      flipTimer.current = window.setTimeout(
        () => {
          flipTimer.current = null;
          runClock(ROUND_DURATION);
        },
        reducedMotion ? 0 : FLIP_DURATION,
      );
    } else if (phase === "running") {
      stopTimers();
      endAt.current = null;
      setPhase("paused");
    } else if (phase === "paused") {
      runClock(remaining);
    }
  }

  function reset() {
    stopTimers();
    endAt.current = null;
    setShapeIndex(null);
    setRemaining(ROUND_DURATION);
    setDrawings(0);
    setPhase("idle");
  }

  const hourglassLabel = {
    idle: "Primero toca la hoja para descubrir tu forma",
    ready: "Dar la vuelta al reloj de arena y empezar los 3 minutos",
    flipping: "Dando la vuelta al reloj",
    running: "Pausar el reloj",
    paused: "Reanudar el reloj",
    finished: "Se acabó el tiempo",
  }[phase];

  const hourglassHint =
    phase === "idle"
      ? "Primero, la hoja"
      : phase === "flipping"
        ? "¡Allá vamos!"
        : "¡Tiempo!";

  const step = phase === "idle" ? 1 : phase === "ready" ? 2 : 3;

  return (
    <div className="shape-game">
      <div className="shape-desk">
        <Image
          className="shape-desk__photo"
          src="/images/games/crea-multiples-dibujos/a-partir-de-esta-forma.webp"
          alt="Hoja de papel rodeada de lápices de colores, pinceles, acuarelas y una planta. En la hoja, escrito a mano: «a partir de esta forma»."
          width={1240}
          height={1754}
          priority
          sizes="(max-width: 860px) 92vw, 34rem"
        />
        <button
          type="button"
          className={`shape-desk__page ${shape ? "has-shape" : ""}`}
          onClick={drawShape}
          disabled={!hydrated || phase === "flipping" || timerActive}
          aria-label={
            shape
              ? `Tu forma es ${shape.name}. Toca la hoja para cambiarla`
              : "Toca la hoja para descubrir una forma"
          }
        >
          {shape ? (
            <Image
              key={revealKey}
              className="shape-desk__shape"
              src={shape.src}
              alt=""
              width={480}
              height={480}
            />
          ) : (
            <span className="shape-desk__hint">
              <span className="shape-desk__tap" aria-hidden="true">
                <MousePointerClick />
              </span>
              Haz click aquí
            </span>
          )}
        </button>
        {shape && !timerActive && phase !== "flipping" ? (
          <p className="shape-desk__swap">
            <Shuffle aria-hidden="true" /> Toca la hoja para cambiar de forma
          </p>
        ) : null}
      </div>

      <div className="shape-panel">
        <p className={`shape-panel__step ${step === 1 ? "is-current" : "is-done"}`}>
          <span aria-hidden="true">1</span>
          Haz click en la hoja y te saldrá una forma simple.
        </p>
        <p className={`shape-panel__step ${step === 2 ? "is-current" : step > 2 ? "is-done" : ""}`}>
          <span aria-hidden="true">2</span>
          Después haz click en el reloj de arena porque empezarán los{" "}
          <strong>3 minutos</strong> que tienes para crear el máximo de dibujos
          que incluyan esta forma.
        </p>

        <div className="shape-panel__timer-row">
          <p className={`shape-panel__step ${step === 3 ? "is-current" : ""}`}>
            <span aria-hidden="true">3</span>
            Esta forma la puedes dibujar grande, pequeña o incluso duplicarla.{" "}
            <strong>¡Reta a un amigo/a a ver a quién se le ocurren más dibujos!</strong>
          </p>

          <div className={`shape-hourglass is-${phase}`}>
            {phase === "ready" ? (
              <p className="shape-hourglass__callout" aria-hidden="true">
                ¡Tócame!
              </p>
            ) : null}
            <button
              type="button"
              className={`shape-hourglass__button is-${phase}`}
              onClick={handleHourglass}
              disabled={
                !hydrated ||
                phase === "idle" ||
                phase === "flipping" ||
                phase === "finished"
              }
              aria-label={hourglassLabel}
            >
              <span className="shape-hourglass__halo" aria-hidden="true" />
              <span className="shape-hourglass__body">
                <Hourglass progress={sandProgress} flowing={phase === "running"} />
              </span>
              <span className="shape-hourglass__shadow" aria-hidden="true" />
            </button>
            <p className="shape-hourglass__time" role="timer" aria-live="off">
              {formatCountdown(remaining)}
            </p>
            {phase === "ready" || phase === "running" || phase === "paused" ? (
              <button
                type="button"
                className={`reference-button ${phase === "running" ? "reference-button--dark" : ""} shape-hourglass__action`}
                onClick={handleHourglass}
                disabled={!hydrated}
              >
                {phase === "running" ? (
                  <>
                    <Pause aria-hidden="true" /> Pausar
                  </>
                ) : phase === "paused" ? (
                  <>
                    <Play aria-hidden="true" /> Seguir
                  </>
                ) : (
                  <>
                    <RefreshCw aria-hidden="true" /> Dar la vuelta
                  </>
                )}
              </button>
            ) : (
              <p className="shape-hourglass__hint">{hourglassHint}</p>
            )}
          </div>
        </div>

        <div className={`shape-score ${phase === "finished" ? "is-finished" : ""}`}>
          <div className="shape-score__copy">
            <p className="shape-score__title">
              {phase === "finished" ? "¡Se acabó el tiempo!" : "¿Cuántos dibujos llevas?"}
            </p>
            <p className="shape-score__text">
              {phase === "finished"
                ? `Has creado ${drawings} ${drawings === 1 ? "dibujo" : "dibujos"} a partir de ${shape?.name ?? "una forma"}.`
                : "Suma uno cada vez que termines un dibujo."}
            </p>
          </div>
          <div className="shape-counter" role="group" aria-label="Contador de dibujos">
            <button
              type="button"
              onClick={() => setDrawings((value) => Math.max(0, value - 1))}
              disabled={!hydrated || drawings === 0}
              aria-label="Restar un dibujo"
            >
              <Minus aria-hidden="true" />
            </button>
            <output aria-live="polite" aria-label={`${drawings} dibujos`}>
              {drawings}
            </output>
            <button
              type="button"
              onClick={() => setDrawings((value) => value + 1)}
              disabled={!hydrated || phase === "idle"}
              aria-label="Sumar un dibujo"
            >
              <Plus aria-hidden="true" />
            </button>
          </div>
          <div className="shape-score__actions">
            {phase === "finished" ? (
              <button type="button" className="reference-button reference-button--dark" onClick={drawShape}>
                <Shuffle aria-hidden="true" /> Otra forma
              </button>
            ) : null}
            <button
              type="button"
              className="shape-score__reset"
              onClick={reset}
              disabled={!hydrated || phase === "idle"}
            >
              <RotateCcw aria-hidden="true" /> Empezar de nuevo
            </button>
          </div>
        </div>
      </div>

      <span className="sr-only" aria-live="assertive">
        {phase === "finished" ? "Se acabó el tiempo" : ""}
      </span>
    </div>
  );
}
