import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLockup } from "@/components/brand-lockup";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { MobileNavigation } from "@/components/mobile-navigation";
import { CLUB_URL, NEWSLETTER_URL } from "@/lib/site-links";

const navItems: Array<{ href: string; label: string; external?: boolean }> = [
  { href: "/", label: "Inicio" },
  { href: "/mis-libros", label: "Mis libros" },
  { href: CLUB_URL, label: "Mi Club de Ilustración", external: true },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteHeader({ variant = "default" }: { variant?: "default" | "reference" }) {
  const isReference = variant === "reference";
  const visibleNavItems = isReference
    ? [
        { href: "/", label: "Inicio" },
        { href: "/#sobre-mi", label: "Sobre mí" },
        { href: "/#libros", label: "Mis libros" },
        { href: "/#resenas", label: "Reseñas" },
        { href: "/#contacto", label: "Contacto" },
      ]
    : navItems;

  return (
    <header className={`site-header${isReference ? " site-header--reference" : ""}`}>
      <div className="site-container site-header__inner">
        <Link
          href="/"
          aria-label="Marta Moreno, inicio"
          className="site-header__brand"
        >
          <BrandLockup preload />
        </Link>

        <nav aria-label="Navegación principal" className="site-header__nav">
          {visibleNavItems.map((item) =>
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
          {!isReference && (
            <>
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
                href={NEWSLETTER_URL}
                target="_blank"
                rel="noreferrer"
                className="site-header__cta"
              >
                Ideas cada martes
                <ArrowUpRight aria-hidden="true" />
              </a>
            </>
          )}
        </nav>

        <MobileNavigation
          items={visibleNavItems}
          newsletterUrl={NEWSLETTER_URL}
          showNewsletter={!isReference}
        />
      </div>
    </header>
  );
}
