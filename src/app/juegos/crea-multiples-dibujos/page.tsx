import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ShapeGame } from "@/components/games/shape-game";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./shape-game.css";

const description =
  "Descubre una forma simple y crea el máximo de dibujos a partir de ella en 3 minutos.";

export const metadata: Metadata = {
  title: "Crea múltiples dibujos",
  description,
  alternates: { canonical: "/juegos/crea-multiples-dibujos" },
  openGraph: {
    type: "website",
    title: "Crea múltiples dibujos · Marta Moreno",
    description,
    url: "/juegos/crea-multiples-dibujos",
  },
  twitter: {
    card: "summary",
    title: "Crea múltiples dibujos · Marta Moreno",
    description,
  },
};

export default function ShapeGamePage() {
  return (
    <div className="shape-page">
      <SiteHeader variant="reference" />
      <main id="contenido" className="shape-scene">
        <div className="site-container shape-scene__inner">
          <nav className="shape-scene__nav" aria-label="Volver a la web de Marta Moreno">
            <Link href="/">
              <ArrowLeft aria-hidden="true" /> Volver a Marta
            </Link>
          </nav>

          <h1 className="shape-scene__title">Crea múltiples dibujos</h1>

          <ShapeGame />
        </div>
      </main>
      <SiteFooter variant="reference" />
    </div>
  );
}
