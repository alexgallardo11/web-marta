import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { ReferenceBooksFilter } from "@/components/reference-books-filter";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { books } from "@/lib/books-data";
import { NEWSLETTER_URL } from "@/lib/site-links";

export const metadata: Metadata = {
  title: "Mis libros",
  description:
    "Descubre los álbumes ilustrados, personajes y muestras interiores de Marta Moreno.",
  alternates: { canonical: "/mis-libros" },
  openGraph: {
    title: "Mis libros · Marta Moreno",
    description:
      "Una biblioteca ilustrada con las historias y personajes de Marta Moreno.",
    url: "/mis-libros",
    images: [
      {
        url: "/images/library-2026/como-estas-hoy-cover.jpg",
        width: 2000,
        height: 2010,
        alt: "Portada de ¿Cómo estás hoy?",
      },
    ],
  },
};

export default function BooksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mis libros · Marta Moreno",
    description:
      "Biblioteca de álbumes ilustrados y personajes creados por Marta Moreno.",
    url: "https://martamoreno.com/mis-libros",
    isPartOf: {
      "@type": "WebSite",
      name: "Marta Moreno",
      url: "https://martamoreno.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: books.length,
      itemListElement: books.map((book, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: book.title,
        image: `https://martamoreno.com${book.cover}`,
      })),
    },
  };

  return (
    <>
      <SiteHeader variant="reference" />
      <main id="contenido" className="reference-home reference-library-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="reference-library-index" aria-labelledby="library-title">
          <div className="site-container">
            <Link href="/" className="reference-library-index__back">
              <ArrowLeft aria-hidden="true" /> Volver atrás
            </Link>

            <header className="reference-library-index__heading">
              <p>Álbumes e historias ilustradas</p>
              <h1 id="library-title">Mis libros</h1>
              <span aria-hidden="true" />
              <p>
                Una selección de personajes, emociones y aventuras para leer,
                imaginar y volver a mirar sin prisa.
              </p>
            </header>

            <ReferenceBooksFilter books={books} />
          </div>
        </section>

        <section className="reference-club reference-library-cta" aria-labelledby="library-cta-title">
          <div className="site-container reference-club__grid">
            <div>
              <h2 id="library-cta-title">¿Quieres crear ilustraciones memorables?</h2>
              <p>
                Recibe cada martes ideas, ejercicios y trucos para dar vida a
                personajes que emocionen y conecten.
              </p>
              <div className="reference-club__actions">
                <a
                  className="reference-button reference-button--dark"
                  href={NEWSLETTER_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Mail aria-hidden="true" /> Apuntarme a la newsletter
                </a>
              </div>
            </div>
            <Image
              src="/images/newsletter.jpg"
              alt="Personaje ilustrado de Marta Moreno"
              width={400}
              height={400}
              sizes="(max-width: 720px) 42vw, 13rem"
            />
          </div>
        </section>
      </main>
      <SiteFooter variant="reference" />
    </>
  );
}
