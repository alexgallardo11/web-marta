import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { books, getBookSpreads } from "@/lib/books-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://martamoreno.com";

type BookPageProps = { params: Promise<{ slug: string }> };

function getBook(slug: string) {
  return books.find((book) => book.slug === slug);
}

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};

  return {
    title: book.title + " · Álbum ilustrado",
    description: book.description,
    alternates: { canonical: "/mis-libros/" + book.slug },
    openGraph: {
      type: "website",
      title: book.title + " · Marta Moreno",
      description: book.description,
      url: "/mis-libros/" + book.slug,
      images: [
        {
          url: book.cover,
          alt: "Portada de " + book.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title + " · Marta Moreno",
      description: book.description,
      images: [book.cover],
    },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const spreads = getBookSpreads(book);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.description,
    image: siteUrl + book.cover,
    url: siteUrl + "/mis-libros/" + book.slug,
    inLanguage: "es",
    genre: "Álbum ilustrado",
    author: {
      "@type": "Person",
      name: "Marta Moreno",
      url: siteUrl,
    },
    isPartOf: {
      "@type": "CollectionPage",
      name: "Mis libros · Marta Moreno",
      url: siteUrl + "/mis-libros",
    },
  };

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="brand-2026 seo-page seo-book-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="seo-book-hero paper-grain">
          <div className="site-container seo-book-hero__grid">
            <div className="seo-book-hero__copy">
              <p className="brand-kicker">Álbum ilustrado · {book.numberLabel}</p>
              <h1>{book.title}</h1>
              <p className="seo-book-hero__eyebrow">{book.eyebrow}</p>
              <p className="seo-page__lead">{book.description}</p>
              <Link className="brand-button brand-button--secondary" href="/mis-libros">
                <ArrowLeft aria-hidden="true" /> Volver a la biblioteca
              </Link>
            </div>
            <div className="seo-book-hero__cover">
              <Image
                src={book.cover}
                alt={"Portada de " + book.title}
                width={1200}
                height={1200}
                sizes="(max-width: 832px) 78vw, 30rem"
                priority
              />
            </div>
          </div>
        </section>

        {spreads.length > 0 ? (
          <section className="seo-book-spreads">
            <div className="site-container">
              <div className="seo-page__section-heading">
                <div>
                  <p className="brand-kicker">Muestra interior</p>
                  <h2>Una pequeña ventana a la historia.</h2>
                </div>
                <Link className="seo-text-link" href="/mis-libros">
                  Ver todos los libros <ArrowRight aria-hidden="true" />
                </Link>
              </div>
              <div className="seo-book-spreads__grid">
                {spreads.map((spread, index) => (
                  <figure key={spread}>
                    <Image
                      src={spread}
                      alt={"Interior de " + book.title + ", página " + (index + 1)}
                      width={1200}
                      height={900}
                      sizes="(max-width: 832px) 92vw, 42vw"
                    />
                    <figcaption>{book.title} · página {index + 1}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="seo-book-next seo-page__section--tinted">
          <div className="site-container seo-book-next__inner">
            <div>
              <p className="brand-kicker">La biblioteca continúa</p>
              <h2>Hay más historias esperando en la estantería.</h2>
            </div>
            <Link className="brand-button brand-button--dark" href="/mis-libros">
              Explorar Mis libros <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
