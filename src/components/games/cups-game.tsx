"use client";

import { useEffect, useRef, useState } from "react";
import { Dices, RotateCcw } from "lucide-react";
import { CUP_CATEGORIES } from "@/lib/games-data";
import { pickRandom } from "@/lib/game-utils";
import { useHydrated } from "@/lib/use-hydrated";

const emptyValues = CUP_CATEGORIES.map(() => "Toca para mezclar");

export function CupsGame() {
  const hydrated = useHydrated();
  const [values, setValues] = useState<string[]>(emptyValues);
  const [spinning, setSpinning] = useState<boolean[]>(
    CUP_CATEGORIES.map(() => false),
  );
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearInterval);
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

    window.setTimeout(() => {
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
  }

  function spinAll() {
    CUP_CATEGORIES.forEach((_, index) => {
      window.setTimeout(() => spin(index, 650 + index * 120), index * 90);
    });
  }

  function reset() {
    timers.current.forEach(clearInterval);
    timers.current = [];
    setValues(emptyValues);
    setSpinning(CUP_CATEGORIES.map(() => false));
  }

  const hasResult = values.some((value) => value !== "Toca para mezclar");

  return (
    <div className="site-container flex flex-col gap-10 pb-20">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {CUP_CATEGORIES.map((category, index) => (
          <button
            key={category.id}
            type="button"
            onClick={() => spin(index)}
            disabled={!hydrated || spinning[index]}
            className="group flex min-h-[23rem] flex-col items-stretch text-left disabled:cursor-wait"
            aria-label={`Mezclar ${category.label.toLowerCase()}`}
          >
            <span
              className="relative flex flex-1 flex-col justify-between overflow-hidden border-2 border-foreground p-5 transition-transform duration-300 group-hover:-translate-y-1"
              style={{
                background: category.color,
                borderRadius: "1.5rem 1.5rem 3.8rem 3.8rem",
              }}
            >
              <span className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.15em]">
                  {category.number} · {category.label}
                </span>
                <span
                  className={`font-display text-3xl ${spinning[index] ? "animate-spin" : ""}`}
                  aria-hidden="true"
                >
                  ✦
                </span>
              </span>
              <span
                aria-live="polite"
                className={`font-display text-4xl leading-none sm:text-5xl ${
                  values[index] === "Toca para mezclar"
                    ? "text-foreground/55"
                    : ""
                }`}
              >
                {values[index]}
              </span>
              <span className="text-sm font-bold underline decoration-2 underline-offset-4">
                {spinning[index] ? "Mezclando…" : "Toca el vaso"}
              </span>
            </span>
            <span
              className="mx-auto -mt-1 block h-7 w-3/4 border-x-2 border-b-2 border-foreground"
              style={{
                background: category.color,
                clipPath: "polygon(8% 0, 92% 0, 100% 100%, 0 100%)",
              }}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={spinAll}
          disabled={!hydrated}
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
      </div>

      {hasResult && (
        <div
          className="mx-auto max-w-4xl border-y-2 border-foreground py-8 text-center"
          aria-live="polite"
        >
          <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--pink)]">
            Tu reto de dibujo
          </p>
          <p className="font-display text-3xl leading-tight sm:text-5xl">
            {values.join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
