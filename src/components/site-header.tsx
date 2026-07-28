import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Menu } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";

const navItems = [
  { href: "/#formacion", label: "Formación" },
  { href: "/#sobre-mi", label: "Sobre mí" },
  { href: "/juegos/personajes-locos", label: "Juegos" },
];

export function SiteHeader() {
  return (
    <header className="relative z-40 border-b border-foreground/10 bg-[var(--paper)]">
      <div className="site-container flex min-h-20 items-center justify-between gap-6 py-3">
        <Link href="/" aria-label="Marta Moreno, inicio" className="shrink-0">
          <Image
            src="/images/marta-moreno-logo.png"
            alt="Marta Moreno"
            width={226}
            height={60}
            priority
            className="h-auto w-[10.5rem] sm:w-[12.5rem]"
          />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-bold underline-offset-8 transition-colors hover:text-[var(--pink)] hover:underline"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.instagram.com/martamoreno.art/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram de Marta Moreno"
            className="grid size-11 place-items-center rounded-full border-2 border-foreground transition-transform hover:-rotate-6"
          >
            <InstagramIcon aria-hidden="true" className="size-5" />
          </a>
        </nav>

        <details className="group relative md:hidden">
          <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-full border-2 border-foreground [&::-webkit-details-marker]:hidden">
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Abrir menú</span>
          </summary>
          <nav
            aria-label="Navegación móvil"
            className="absolute right-0 top-14 flex w-64 flex-col gap-1 border-2 border-foreground bg-[var(--paper)] p-3 shadow-[0.35rem_0.35rem_0_var(--ink)]"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center rounded-md px-3 font-bold hover:bg-[var(--yellow)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/juegos/caldero-magico"
              className="mt-1 flex min-h-11 items-center gap-2 rounded-md bg-[var(--pink)] px-3 font-bold text-[var(--paper)]"
            >
              <Gamepad2 aria-hidden="true" className="size-5" />
              Caldero mágico
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
