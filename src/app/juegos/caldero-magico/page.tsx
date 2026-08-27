import type { Metadata } from "next";
import Image from "next/image";
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
        <section
          className="game-hero game-hero--cauldron site-container"
          aria-labelledby="game-title"
        >
          <div className="game-hero__copy">
            <h1
              id="game-title"
              className="display-title"
              aria-label="Caldero mágico"
            >
              <strong>Caldero</strong>
              <span>mágico</span>
            </h1>
            <p className="game-hero__statement">
              Mezcla ingredientes <span>y crea historias</span>
            </p>
            <p className="game-hero__lead">
              Mezcla un personaje, una forma de ser y una situación imposible.
              El resto lo pone tu imaginación.
            </p>
          </div>
          <div className="game-hero__image">
            <Image
              src="/images/web-2026/characters/perro-cocinero.png"
              alt="Personaje ilustrado junto a su caldero mágico"
              width={531}
              height={531}
              priority
              sizes="(max-width: 767px) 76vw, 30rem"
            />
          </div>
        </section>
        <CauldronGame />
      </main>
    </GameShell>
  );
}
