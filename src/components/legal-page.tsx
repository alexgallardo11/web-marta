import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="paper-grain">
        <header className="border-b-2 border-foreground">
          <div className="site-container py-14 sm:py-20">
            <p className="eyebrow text-[var(--pink)]">{eyebrow}</p>
            <h1 className="mt-4 max-w-[14ch] font-display text-6xl leading-none sm:text-8xl">
              {title}
            </h1>
            <p className="mt-5 text-sm text-foreground/60">
              Última actualización: {updatedAt}
            </p>
          </div>
        </header>
        <article className="legal-copy site-container max-w-4xl py-14 sm:py-20">
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
