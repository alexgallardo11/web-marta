import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, Mail } from "lucide-react";
import { ReferenceBooksFilter } from "@/components/reference-books-filter";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { books, referenceLibraryItems } from "@/lib/books-data";
import { NEWSLETTER_URL } from "@/lib/site-links";

const booksBySlug = new Map(books.map((book) => [book.slug, book]));
const libraryBooks = referenceLibraryItems.flatMap((item) => {
  const book = booksBySlug.get(item.bookSlug);

  return book ? [{ ...item, book }] : [];
});

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
      numberOfItems: libraryBooks.length,
      itemListElement: libraryBooks.map(({ book, image }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: book.title,
        image: `https://martamoreno.com${image}`,
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

        <section className="reference-library-hero" aria-labelledby="library-title">
          <div className="site-container reference-library-hero__grid">
            <header className="reference-library-hero__copy">
              <h1 id="library-title">Mis libros</h1>
              <p className="reference-library-hero__statement">
                Historias para mirar, sentir y compartir.
              </p>
              <p className="reference-library-hero__lead">
                Álbumes ilustrados para descubrir mundos, conversar y guardar
                muy cerca.
              </p>
              <Link
                href="#galeria-libros"
                className="reference-button reference-library-hero__action"
              >
                Explorar los libros <ArrowDown aria-hidden="true" />
              </Link>
            </header>
            <figure className="reference-library-hero__image">
              <Image
                src="/images/marta-2026/marta-portada.jpg"
                alt="Marta Moreno rodeada de los libros que ha ilustrado"
                fill
                priority
                sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1200px) 42vw, 29rem"
              />
            </figure>
          </div>
        </section>

        <section
          id="galeria-libros"
          className="reference-library-index"
          aria-label="Galería de libros"
        >
          <div className="site-container">
            <ReferenceBooksFilter books={books} />

            <Link href="/" className="reference-library-index__return">
              Volver a la página de inicio <ArrowLeft aria-hidden="true" />
            </Link>
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
