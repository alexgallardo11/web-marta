import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, Sparkles } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";

const navItems = [
  { href: "/#formacion", label: "Cómo puedo ayudarte" },
  { href: "/juegos/personajes-locos", label: "Juegos" },
  { href: "/#sobre-mi", label: "Sobre mí" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <Link
          href="/"
          aria-label="Marta Moreno, inicio"
          className="site-header__brand"
        >
          <Image
            src="/images/marta-moreno-logo.png"
            alt="Marta Moreno"
            width={226}
            height={60}
            priority
            className="h-auto w-[10rem] sm:w-[11.5rem]"
          />
          <span>Ilustradora infantil</span>
        </Link>

        <nav aria-label="Navegación principal" className="site-header__nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="site-header__link"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.instagram.com/martamoreno.art/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram de Marta Moreno"
            className="site-header__instagram"
          >
            <InstagramIcon aria-hidden="true" className="size-5" />
          </a>
          <a
            href="https://marta-moreno.systeme.io/guiacreativa"
            target="_blank"
            rel="noreferrer"
            className="site-header__cta"
          >
            Newsletter
            <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>

        <details className="site-header__mobile group">
          <summary className="[&::-webkit-details-marker]:hidden">
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Abrir menú</span>
          </summary>
          <nav aria-label="Navegación móvil">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://marta-moreno.systeme.io/guiacreativa"
              target="_blank"
              rel="noreferrer"
              className="site-header__mobile-cta"
            >
              <Sparkles aria-hidden="true" className="size-5" />
              Newsletter
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
