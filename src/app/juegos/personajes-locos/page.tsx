import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { CupsGame } from "@/components/games/cups-game";
import { GameShell } from "@/components/games/game-shell";

export const metadata: Metadata = {
  title: "Crea personajes locos",
  description:
    "Mezcla un personaje, un adjetivo, una acción y un complemento para desbloquear tu próximo dibujo.",
  alternates: { canonical: "/juegos/personajes-locos" },
};

export default function CrazyCharactersPage() {
  return (
    <GameShell active="vasos">
      <main id="contenido" className="paper-grain">
        <section className="site-container flex flex-col items-center gap-5 py-14 text-center sm:py-20">
          <p className="eyebrow text-[var(--pink)]">
            <Sparkles className="size-4" aria-hidden="true" />
            Laboratorio de ideas
          </p>
          <h1 className="display-title max-w-[12ch]">Crea personajes locos</h1>
          <p className="max-w-[48rem] text-lg text-foreground/70 sm:text-xl">
            Toca cada vaso, dibuja la combinación que aparezca y vuelve a
            intentarlo tantas veces como quieras. Aquí no hay respuestas
            incorrectas.
          </p>
        </section>
        <CupsGame />
      </main>
    </GameShell>
  );
}
