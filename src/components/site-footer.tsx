import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/icons/instagram-icon";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-foreground bg-[var(--ink)] text-[var(--paper)]">
      <div className="site-container grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex max-w-xl flex-col gap-5">
          <Image
            src="/images/marta-moreno-logo.png"
            alt="Marta Moreno"
            width={226}
            height={60}
            className="h-auto w-44 brightness-0 invert"
          />
          <p className="max-w-md text-[var(--paper)]/80">
            Ilustradora infantil y profesora. Ideas y herramientas para crear
            personajes que emocionan y conectan.
          </p>
          <a
            href="https://www.instagram.com/martamoreno.art/"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 w-fit items-center gap-2 font-bold underline decoration-[var(--yellow)] decoration-2 underline-offset-8"
          >
            <InstagramIcon className="size-5" aria-hidden="true" />
            @martamoreno.art
          </a>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link href="/aviso-legal" className="underline-offset-4 hover:underline">
            Aviso legal
          </Link>
          <Link href="/privacidad" className="underline-offset-4 hover:underline">
            Privacidad
          </Link>
          <Link href="/cookies" className="underline-offset-4 hover:underline">
            Cookies
          </Link>
          <Link href="/admin/login" className="underline-offset-4 hover:underline">
            Acceso
          </Link>
        </div>
      </div>
      <div className="border-t border-[var(--paper)]/20 py-5 text-center text-xs text-[var(--paper)]/60">
        © {new Date().getFullYear()} Marta Moreno. Hecho con lápiz, papel y un
        poquito de código.
      </div>
    </footer>
  );
}
