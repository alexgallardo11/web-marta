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
        <section className="site-container flex flex-col items-center gap-5 py-14 text-center sm:py-20">
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
