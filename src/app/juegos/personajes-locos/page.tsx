import type { Metadata } from "next";
import { CupsGame } from "@/components/games/cups-game";
import { GameShell } from "@/components/games/game-shell";

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
    <GameShell game="vasos">
      <main id="contenido" className="paper-grain">
        <section
          className="game-hero game-hero--cups site-container"
          aria-labelledby="game-title"
        >
          <div className="game-hero__copy">
            <h1
              id="game-title"
              className="display-title"
              aria-label="Crea personajes locos"
            >
              <strong>Crea personajes</strong>{" "}
              <span>locos</span>
            </h1>
            <p className="game-hero__statement">
              Mezcla pistas <span>y déjate sorprender</span>
            </p>
            <p className="game-hero__lead">
              Cuatro pistas inesperadas para desbloquear una idea y empezar a
              dibujar sin pensarlo demasiado.
            </p>
          </div>
        </section>
        <CupsGame />
      </main>
    </GameShell>
  );
}
