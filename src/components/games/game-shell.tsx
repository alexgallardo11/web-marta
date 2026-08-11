import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export function GameShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: "vasos" | "caldero";
}) {
  return (
    <div className={`game-world game-page-shell game-world--${active}`}>
      <SiteHeader variant="reference" />
      <nav className="game-route-nav site-container" aria-label="Juegos creativos">
        <Link href="/" className="game-route-nav__back">
          <ArrowLeft aria-hidden="true" /> Volver a Marta
        </Link>
        <div className="game-route-nav__links">
          <Link
            href="/juegos/personajes-locos"
            aria-current={active === "vasos" ? "page" : undefined}
            className={active === "vasos" ? "is-active" : ""}
          >
            Personajes locos
          </Link>
          <Link
            href="/juegos/caldero-magico"
            aria-current={active === "caldero" ? "page" : undefined}
            className={active === "caldero" ? "is-active" : ""}
          >
            Caldero mágico
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
