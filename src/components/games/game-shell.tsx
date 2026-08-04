import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function GameNarrator({
  image,
  name,
  children,
}: {
  image: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="game-narrator" aria-label={`${name} explica cómo jugar`}>
      <div className="game-narrator__bubble">
        <span className="game-narrator__name">Te lo cuenta {name}</span>
        <p>{children}</p>
      </div>
      <Image
        src={image}
        alt={name}
        width={720}
        height={720}
        className="game-narrator__character"
        sizes="(max-width: 640px) 120px, 180px"
      />
    </aside>
  );
}

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
              src="/images/web-2026/marta-illustration.png"
              alt=""
              width={1525}
              height={1576}
              priority
              className="game-header__mark"
            />
            <span className="game-header__wordmark">
              <strong>Marta Moreno</strong>
              <small>Ilustradora infantil</small>
            </span>
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
