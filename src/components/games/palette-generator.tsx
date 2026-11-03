"use client";

import { useState } from "react";
import { ArrowLeftRight, Check, Copy, Shuffle } from "lucide-react";
import {
  HARMONIES,
  PALETTE_ROLES,
  formatPaletteText,
  generatePalette,
  normalizeHex,
  readableTextColor,
  swapDominantAndAccent,
  type Harmony,
  type Palette,
} from "@/lib/palette-utils";

type Mode = "auto" | "manual";

const INITIAL_PALETTE: Palette = ["#4E8F4A", "#E3D27A", "#C8502E"];

export function PaletteGenerator() {
  const [mode, setMode] = useState<Mode>("auto");
  const [harmony, setHarmony] = useState<Harmony | "al-azar">("al-azar");
  const [palette, setPalette] = useState<Palette>(INITIAL_PALETTE);
  const [drafts, setDrafts] = useState<(string | null)[]>([null, null, null]);
  const [copied, setCopied] = useState(false);

  function regenerate(nextHarmony = harmony) {
    setPalette(
      generatePalette(
        Math.random,
        nextHarmony === "al-azar" ? undefined : nextHarmony,
      ),
    );
    setDrafts([null, null, null]);
  }

  function setColor(index: number, value: string) {
    setPalette((current) => {
      const next = [...current] as Palette;
      next[index] = value;
      return next;
    });
  }

  function handleHexInput(index: number, value: string) {
    setDrafts((current) => current.map((d, i) => (i === index ? value : d)));
    const hex = normalizeHex(value);
    if (hex) setColor(index, hex);
  }

  function commitHexInput(index: number) {
    setDrafts((current) => current.map((d, i) => (i === index ? null : d)));
  }

  async function copyPalette() {
    try {
      await navigator.clipboard.writeText(formatPaletteText(palette));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="palette-game" aria-label="Generador de paletas 60/30/10">
      <div className="palette-controls">
        <div className="palette-mode" role="group" aria-label="Cómo quieres crear la paleta">
          <button
            type="button"
            aria-pressed={mode === "auto"}
            onClick={() => setMode("auto")}
          >
            Automática
          </button>
          <button
            type="button"
            aria-pressed={mode === "manual"}
            onClick={() => setMode("manual")}
          >
            La elijo yo
          </button>
        </div>

        {mode === "auto" ? (
          <div className="palette-auto">
            <label className="palette-harmony">
              <span>Combinación</span>
              <select
                value={harmony}
                onChange={(event) => {
                  const value = event.target.value as Harmony | "al-azar";
                  setHarmony(value);
                  regenerate(value);
                }}
              >
                <option value="al-azar">Sorpréndeme</option>
                {HARMONIES.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="palette-button palette-button--primary"
              onClick={() => regenerate()}
            >
              <Shuffle aria-hidden="true" /> Generar paleta
            </button>
          </div>
        ) : (
          <p className="palette-hint">
            Elige cada color con el selector o escribe su código hexadecimal.
          </p>
        )}
      </div>

      <div className="palette-board">
        <div
          className="palette-bar"
          role="img"
          aria-label={PALETTE_ROLES.map(
            (role, index) => `${role.label} ${role.percent} %, ${palette[index]}`,
          ).join(". ")}
        >
          {PALETTE_ROLES.map((role, index) => (
            <div
              key={role.id}
              className={`palette-bar__part palette-bar__part--${role.id}`}
              style={{
                flexGrow: role.percent,
                backgroundColor: palette[index],
                color: readableTextColor(palette[index]),
              }}
            >
              <span>{role.percent}%</span>
            </div>
          ))}
        </div>

        <ul className="palette-cards">
          {PALETTE_ROLES.map((role, index) => {
            const draft = drafts[index];
            const invalid = draft !== null && normalizeHex(draft) === null;
            return (
              <li key={role.id} className="palette-card">
                {mode === "manual" ? (
                  <label className="palette-card__swatch palette-card__swatch--picker">
                    <span className="sr-only">Color {role.label.toLowerCase()}</span>
                    <input
                      type="color"
                      value={palette[index].toLowerCase()}
                      onChange={(event) =>
                        setColor(index, event.target.value.toUpperCase())
                      }
                    />
                    <span style={{ backgroundColor: palette[index] }} />
                  </label>
                ) : (
                  <span
                    className="palette-card__swatch"
                    aria-hidden="true"
                  >
                    <span style={{ backgroundColor: palette[index] }} />
                  </span>
                )}
                <div className="palette-card__text">
                  <h2>{role.label}</h2>
                  <p>
                    {role.percent} % · {role.purpose}
                  </p>
                  {mode === "manual" ? (
                    <input
                      className="palette-card__hex"
                      type="text"
                      inputMode="text"
                      spellCheck={false}
                      maxLength={7}
                      aria-label={`Código hexadecimal de ${role.label.toLowerCase()}`}
                      aria-invalid={invalid}
                      value={draft ?? palette[index]}
                      onChange={(event) =>
                        handleHexInput(index, event.target.value)
                      }
                      onBlur={() => commitHexInput(index)}
                    />
                  ) : (
                    <code>{palette[index]}</code>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="palette-actions">
          <button
            type="button"
            className="palette-button"
            onClick={() => setPalette(swapDominantAndAccent(palette))}
          >
            <ArrowLeftRight aria-hidden="true" /> Intercambiar 60 y 10
          </button>
          <button
            type="button"
            className="palette-button palette-button--primary"
            onClick={copyPalette}
          >
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copied ? "Paleta copiada" : "Copiar mi paleta"}
          </button>
        </div>
        <p className="sr-only" role="status">
          {copied ? "Paleta copiada al portapapeles" : ""}
        </p>
      </div>
    </section>
  );
}
