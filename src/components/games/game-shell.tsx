import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function GameShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: "vasos" | "caldero";
}) {
  return (
    <div className={`game-world game-world--${active}`}>
      <header className="game-header">
        <div className="site-container game-header__inner">
          <Link href="/" className="game-header__home">
            <ArrowLeft className="size-5" aria-hidden="true" />
            <Image
              src="/images/marta-moreno-logo.png"
              alt="Marta Moreno"
              width={226}
              height={60}
              priority
              className="h-auto w-36 sm:w-44"
            />
          </Link>
          <nav
            aria-label="Cambiar de juego"
            className="game-switcher"
          >
            <Link
              href="/juegos/personajes-locos"
              aria-current={active === "vasos" ? "page" : undefined}
              className={active === "vasos" ? "is-active" : ""}
            >
              Los vasos
            </Link>
            <Link
              href="/juegos/caldero-magico"
              aria-current={active === "caldero" ? "page" : undefined}
              className={active === "caldero" ? "is-active" : ""}
            >
              El caldero
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
