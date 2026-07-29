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
        <section className="game-hero site-container">
          <span className="game-hero__doodle game-hero__doodle--one" aria-hidden="true">
            ✦
          </span>
          <span className="game-hero__doodle game-hero__doodle--two" aria-hidden="true">
            ↝
          </span>
          <p className="eyebrow text-[var(--pink)]">
            <Sparkles className="size-4" aria-hidden="true" />
            Cuatro vasos, miles de combinaciones
          </p>
          <h1 className="display-title max-w-[12ch]">Crea personajes locos</h1>
          <p className="max-w-[48rem] text-lg text-foreground/70 sm:text-xl">
            Agita cada vaso y deja que el azar te proponga un personaje. Junta
            las cuatro pistas y dibuja lo primero que se te ocurra.
          </p>
        </section>
        <CupsGame />
      </main>
    </GameShell>
  );
}
