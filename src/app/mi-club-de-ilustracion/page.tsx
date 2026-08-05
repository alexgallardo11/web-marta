import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CharacterGuide } from "@/components/character-guide";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CLUB_URL } from "@/lib/site-links";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://martamoreno.com";

export const metadata: Metadata = {
  title: "Comunidad de ilustración para aprender a dibujar",
  description:
    "Conoce Mi Club de Ilustración: una comunidad con retos, formación, clases en directo y acompañamiento para dibujar a tu ritmo.",
  alternates: { canonical: "/mi-club-de-ilustracion" },
  openGraph: {
    type: "website",
    title: "Mi Club de Ilustración · Marta Moreno",
    description:
      "Una comunidad para aprender a dibujar, compartir procesos y encontrar tu propia voz creativa.",
    url: "/mi-club-de-ilustracion",
    images: ["/images/web-2026/photos/marta-club.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Club de Ilustración · Marta Moreno",
    description:
      "Una comunidad para aprender a dibujar, compartir procesos y encontrar tu propia voz creativa.",
    images: ["/images/web-2026/photos/marta-club.jpg"],
  },
};

export default function IllustrationClubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Mi Club de Ilustración",
    description: metadata.description,
    url: siteUrl + "/mi-club-de-ilustracion",
    inLanguage: "es",
    about: ["Comunidad de ilustración", "Aprender a dibujar", "Formación creativa"],
    author: {
      "@type": "Person",
      name: "Marta Moreno",
      url: siteUrl,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Mi Club de Ilustración",
          item: siteUrl + "/mi-club-de-ilustracion",
        },
      ],
    },
  };

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="brand-2026 seo-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="seo-club-hero paper-grain">
          <div className="site-container seo-club-hero__grid">
            <div className="seo-club-hero__copy">
              <p className="brand-kicker">Mi Club de Ilustración · Comunidad</p>
              <h1>Aprende a dibujar acompañada y encuentra tu propia voz.</h1>
              <p className="seo-page__lead">
                Un espacio para disfrutar dibujando, probar nuevas formas de
                crear y compartir el proceso con personas que también quieren
                avanzar a su ritmo.
              </p>
              <div className="brand-actions">
                <a
                  className="brand-button brand-button--primary"
                  href={CLUB_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Entrar en Mi Club <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="seo-club-hero__visual">
              <Image
                src="/images/web-2026/photos/marta-club.jpg"
                alt="Marta en su estudio preparando una propuesta para su comunidad de ilustración"
                width={1600}
                height={850}
                sizes="(max-width: 832px) 92vw, 48vw"
                priority
              />
              <CharacterGuide character="mono" className="seo-club-hero__guide">
                Aquí caben los bocetos, las dudas y las ganas de probar.
              </CharacterGuide>
            </div>
          </div>
        </section>

        <section className="seo-page__section seo-club-benefits-section">
          <div className="site-container">
            <div className="seo-page__section-heading">
              <div>
                <p className="brand-kicker">Lo que encontrarás</p>
                <h2>Un lugar para practicar sin exigirte una versión perfecta.</h2>
              </div>
            </div>
            <div className="seo-club-benefits">
              <article>
                <CharacterGuide character="leon" className="brand-guide--compact seo-club-benefit-guide">
                  Yo te doy una excusa para volver al papel.
                </CharacterGuide>
                <div className="seo-club-benefit-copy">
                  <h3>Retos que ponen la mano en movimiento</h3>
                  <p>Propuestas concretas para vencer el papel en blanco y volver a crear con curiosidad.</p>
                </div>
              </article>
              <article>
                <CharacterGuide character="gatita" className="brand-guide--compact seo-club-benefit-guide">
                  Pregunta, mira cómo lo hace Marta y prueba otra vez.
                </CharacterGuide>
                <div className="seo-club-benefit-copy">
                  <h3>Clases y acompañamiento</h3>
                  <p>Formación y clases en directo para ver procesos, hacer preguntas y probar nuevas maneras de dibujar.</p>
                </div>
              </article>
              <article>
                <CharacterGuide character="cocodrilo" className="brand-guide--compact seo-club-benefit-guide">
                  Tus avances también merecen una pequeña celebración.
                </CharacterGuide>
                <div className="seo-club-benefit-copy">
                  <h3>Una comunidad que comparte el camino</h3>
                  <p>Un espacio donde enseñar avances, conversar sobre dudas y celebrar lo que cada persona va encontrando.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="seo-page__section seo-page__section--tinted seo-club-audience">
          <div className="site-container seo-page__split-copy">
            <div>
              <p className="brand-kicker">Para quién es</p>
              <h2>Para quien quiere dibujar por placer o convertir la ilustración en su oficio.</h2>
            </div>
            <div className="seo-page__prose">
              <p>
                Puedes llegar con experiencia o con muchas ganas y poca
                práctica. El Club está pensado para descubrir herramientas,
                encontrar referencias y construir una relación más amable con
                tu propio dibujo.
              </p>
              <p>
                No se trata de copiar una única manera de ilustrar. Se trata de
                darte tiempo, acompañamiento y pequeñas ocasiones para probar
                hasta que tu voz empiece a reconocerse.
              </p>
            </div>
          </div>
        </section>

        <section className="seo-page__section">
          <div className="site-container seo-faq">
            <p className="brand-kicker">Preguntas para empezar</p>
            <h2>Antes de entrar, quizá te preguntas...</h2>
            <div className="seo-faq__list">
              <details>
                <summary>¿Tengo que saber dibujar?</summary>
                <p>No. Puedes empezar desde tu punto de partida y avanzar con propuestas que te ayuden a practicar sin compararte.</p>
              </details>
              <details>
                <summary>¿El Club es solo para profesionales?</summary>
                <p>No. Es para quien quiere aprender, recuperar el hábito de dibujar o profundizar en su camino dentro de la ilustración.</p>
              </details>
              <details>
                <summary>¿Dónde puedo conocer todos los detalles?</summary>
                <p>La información actualizada y el acceso están en la página de Mi Club.</p>
              </details>
            </div>
            <a
              className="brand-button brand-button--dark"
              href={CLUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              Ver Mi Club de Ilustración <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
