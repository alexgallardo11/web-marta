import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { CupsGame } from "@/components/games/cups-game";
import { GameNarrator, GameShell } from "@/components/games/game-shell";

export const metadata: Metadata = {
  title: "Crea personajes locos",
  description:
    "Mezcla un personaje, un adjetivo, una acción y un complemento para desbloquear tu próximo dibujo.",
  alternates: { canonical: "/juegos/personajes-locos" },
  openGraph: {
    type: "website",
    title: "Crea personajes locos · Marta Moreno",
    description:
      "Un juego creativo para desbloquear ideas y empezar a dibujar sin miedo al papel en blanco.",
    url: "/juegos/personajes-locos",
    images: ["/images/web-2026/characters/martina-futbolista.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crea personajes locos · Marta Moreno",
    description:
      "Un juego creativo para desbloquear ideas y empezar a dibujar sin miedo al papel en blanco.",
    images: ["/images/web-2026/characters/martina-futbolista.png"],
  },
};

export default function CrazyCharactersPage() {
  return (
    <GameShell active="vasos">
      <main id="contenido" className="paper-grain">
        <section className="game-hero game-hero--cups site-container">
          <span className="game-hero__doodle game-hero__doodle--one" aria-hidden="true">
            ✦
          </span>
          <span className="game-hero__doodle game-hero__doodle--two" aria-hidden="true">
            ↝
          </span>
          <div className="game-hero__copy">
            <p className="eyebrow text-[var(--pink)]">
              <Sparkles className="size-4" aria-hidden="true" />
              Cuatro vasos, miles de combinaciones
            </p>
            <h1 className="display-title">Crea personajes <em>locos</em></h1>
            <p className="game-hero__lead">
              Cuatro pistas inesperadas para desbloquear una idea y empezar a
              dibujar sin pensarlo demasiado.
            </p>
          </div>
          <GameNarrator
            image="/images/web-2026/characters/martina-futbolista.png"
            name="Martina Futbolista"
          >
            Toca un vaso para agitar solo esa pista. Si quieres la sorpresa
            completa, pulsa «Mezclar los cuatro».
          </GameNarrator>
        </section>
        <CupsGame />
      </main>
    </GameShell>
  );
}
