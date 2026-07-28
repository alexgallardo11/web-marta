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
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b-2 border-foreground bg-[var(--paper)]">
        <div className="site-container flex min-h-20 flex-wrap items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-3">
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
            className="flex items-center gap-2 text-sm font-black"
          >
            <Link
              href="/juegos/personajes-locos"
              aria-current={active === "vasos" ? "page" : undefined}
              className={`min-h-11 content-center border-2 border-foreground px-3 ${
                active === "vasos"
                  ? "bg-[var(--yellow)]"
                  : "bg-transparent hover:bg-muted"
              }`}
            >
              Los vasos
            </Link>
            <Link
              href="/juegos/caldero-magico"
              aria-current={active === "caldero" ? "page" : undefined}
              className={`min-h-11 content-center border-2 border-foreground px-3 ${
                active === "caldero"
                  ? "bg-[var(--pink)] text-[var(--paper)]"
                  : "bg-transparent hover:bg-muted"
              }`}
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
