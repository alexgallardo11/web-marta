import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PaletteGenerator } from "@/components/games/palette-generator";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./palette-game.css";

const description =
  "Crea una paleta con la regla 60/30/10: genérala al azar o elige tus propios colores.";

// Página de acceso por enlace directo: no aparece en la landing ni en el
// sitemap, y se pide a los buscadores que no la indexen.
export const metadata: Metadata = {
  title: "Generador de paletas 60/30/10",
  description,
  alternates: { canonical: "/juegos/generador-paletas" },
  robots: { index: false, follow: false },
};

export default function PaletteGeneratorPage() {
  return (
    <div className="palette-page">
      <SiteHeader variant="reference" />
      <main id="contenido" className="palette-scene">
        <div className="site-container palette-scene__inner">
          <nav
            className="palette-scene__nav"
            aria-label="Volver a la web de Marta Moreno"
          >
            <Link href="/">
              <ArrowLeft aria-hidden="true" /> Volver a Marta
            </Link>
          </nav>

          <h1 className="palette-scene__title">Generador de paletas</h1>
          <p className="palette-scene__lead">
            La regla 60/30/10: un color domina, otro acompaña y un tercero
            destaca. Genera una paleta al azar o elige tus colores.
          </p>

          <PaletteGenerator />
        </div>
      </main>
      <SiteFooter variant="reference" />
    </div>
  );
}
