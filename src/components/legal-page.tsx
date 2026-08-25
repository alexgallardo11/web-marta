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
      <SiteHeader variant="reference" />
      <main id="contenido" className="reference-home legal-page">
        <header className="legal-page__hero" aria-labelledby="legal-page-title">
          <div className="site-container legal-page__hero-inner">
            <p className="legal-page__eyebrow">{eyebrow}</p>
            <div className="legal-page__title-row">
              <h1 id="legal-page-title">{title}</h1>
              <p className="legal-page__updated">
                Última actualización: <time>{updatedAt}</time>
              </p>
            </div>
          </div>
        </header>
        <article className="legal-copy site-container">
          {children}
        </article>
      </main>
      <SiteFooter variant="reference" />
    </>
  );
}
