import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { CauldronGame } from "@/components/games/cauldron-game";
import { GameShell } from "@/components/games/game-shell";

export const metadata: Metadata = {
  title: "Caldero mágico",
  description:
    "Combina personaje, personalidad y contexto para invocar una nueva idea y descargarla para Stories.",
  alternates: { canonical: "/juegos/caldero-magico" },
};

export default function MagicCauldronPage() {
  return (
    <GameShell active="caldero">
      <main id="contenido" className="paper-grain">
        <section className="game-hero site-container">
          <span className="game-hero__doodle game-hero__doodle--one" aria-hidden="true">
            ☾
          </span>
          <span className="game-hero__doodle game-hero__doodle--two" aria-hidden="true">
            ✦
          </span>
          <p className="eyebrow text-[var(--pink)]">
            <Sparkles className="size-4" aria-hidden="true" />
            Tres ingredientes, miles de historias
          </p>
          <h1 className="display-title max-w-[11ch]">Caldero mágico</h1>
          <p className="max-w-[48rem] text-lg text-foreground/70 sm:text-xl">
            Toca cada ingrediente para cambiarlo o deja que el azar cocine una
            combinación completa. Después, llévatela a Stories y dibújala.
          </p>
        </section>
        <CauldronGame />
      </main>
    </GameShell>
  );
}
