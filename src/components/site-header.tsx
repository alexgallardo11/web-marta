import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, Sparkles } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { CLUB_URL } from "@/lib/site-links";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/#libros", label: "Mis libros" },
  { href: CLUB_URL, label: "Mi Club de Ilustración", external: true },
  { href: "/#contacto", label: "Contacto" },
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
            src="/images/web-2026/marta-illustration.png"
            alt=""
            width={1525}
            height={1576}
            preload
            className="site-header__mark"
            sizes="48px"
          />
          <span className="site-header__wordmark">
            <strong>Marta Moreno</strong>
            <small>Ilustradora infantil</small>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="site-header__nav">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="site-header__link"
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className="site-header__link">
                {item.label}
              </Link>
            ),
          )}
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
            Ideas cada martes
            <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>

        <details className="site-header__mobile group">
          <summary className="[&::-webkit-details-marker]:hidden">
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Abrir menú</span>
          </summary>
          <nav aria-label="Navegación móvil">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ),
            )}
            <a
              href="https://marta-moreno.systeme.io/guiacreativa"
              target="_blank"
              rel="noreferrer"
              className="site-header__mobile-cta"
            >
              <Sparkles aria-hidden="true" className="size-5" />
              Recibir ideas cada martes
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
