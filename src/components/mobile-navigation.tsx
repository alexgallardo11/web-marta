"use client";

import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

type NavigationItem = {
  href: string;
  label: string;
  external?: boolean;
};

type MobileNavigationProps = {
  items: NavigationItem[];
  newsletterUrl: string;
  showNewsletter: boolean;
};

export function MobileNavigation({
  items,
  newsletterUrl,
  showNewsletter,
}: MobileNavigationProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeMenu = () => {
      if (detailsRef.current) detailsRef.current.open = false;
    };

    const handlePointerDown = (event: PointerEvent) => {
      const details = detailsRef.current;
      if (
        details?.open &&
        event.target instanceof Node &&
        !details.contains(event.target)
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !detailsRef.current?.open) return;

      closeMenu();
      detailsRef.current.querySelector<HTMLElement>("summary")?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.open = false;
  };

  return (
    <details ref={detailsRef} className="site-header__mobile group">
      <summary className="[&::-webkit-details-marker]:hidden">
        <Menu aria-hidden="true" className="size-5" />
        <span className="sr-only">Abrir menú</span>
      </summary>
      <nav aria-label="Navegación móvil">
        {items.map((item) =>
          item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ) : (
            <Link key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ),
        )}
        {showNewsletter && (
          <a
            href={newsletterUrl}
            target="_blank"
            rel="noreferrer"
            className="site-header__mobile-cta"
            onClick={closeMenu}
          >
            <Sparkles aria-hidden="true" className="size-5" />
            Recibir ideas cada martes
          </a>
        )}
      </nav>
    </details>
  );
}
