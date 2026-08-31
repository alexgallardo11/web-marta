import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export function GameShell({
  children,
  game,
}: {
  children: React.ReactNode;
  game: "vasos" | "caldero";
}) {
  return (
    <div className={`game-world game-page-shell game-world--${game}`}>
      <SiteHeader variant="reference" />
      <nav
        className="game-route-nav site-container"
        aria-label="Volver a la web de Marta Moreno"
      >
        <Link href="/" className="game-route-nav__back">
          <ArrowLeft aria-hidden="true" /> Volver a Marta
        </Link>
      </nav>
      {children}
    </div>
  );
}
