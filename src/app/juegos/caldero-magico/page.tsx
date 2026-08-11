import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { CauldronGame } from "@/components/games/cauldron-game";
import { GameShell } from "@/components/games/game-shell";

export const metadata: Metadata = {
  title: "Caldero mágico",
  description:
    "Combina personaje, personalidad y contexto para invocar una nueva idea y descargarla para Stories.",
  alternates: { canonical: "/juegos/caldero-magico" },
  openGraph: {
    type: "website",
    title: "Caldero mágico · Marta Moreno",
    description:
      "Mezcla personajes, personalidades y situaciones para invocar una idea nueva y convertirla en un dibujo.",
    url: "/juegos/caldero-magico",
    images: ["/images/web-2026/characters/perro-cocinero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caldero mágico · Marta Moreno",
    description:
      "Mezcla personajes, personalidades y situaciones para invocar una idea nueva y convertirla en un dibujo.",
    images: ["/images/web-2026/characters/perro-cocinero.png"],
  },
};

export default function MagicCauldronPage() {
  return (
    <GameShell active="caldero">
      <main id="contenido" className="paper-grain">
        <section className="game-hero game-hero--cauldron site-container">
          <span className="game-hero__doodle game-hero__doodle--one" aria-hidden="true">
            ☾
          </span>
          <span className="game-hero__doodle game-hero__doodle--two" aria-hidden="true">
            ✦
          </span>
          <div className="game-hero__copy">
            <p className="eyebrow text-[var(--pink)]">
              <Sparkles className="size-4" aria-hidden="true" />
              Tres ingredientes, miles de historias
            </p>
            <h1 className="display-title">Caldero <em>mágico</em></h1>
          <p className="game-hero__lead">
            Mezcla un personaje, una forma de ser y una situación imposible.
            El resto lo pone tu imaginación.
          </p>
        </div>
        </section>
        <CauldronGame />
      </main>
    </GameShell>
  );
}
