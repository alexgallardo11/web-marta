import type { Metadata } from "next";
import { BooksLibrary } from "@/components/books/books-library";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { books } from "@/lib/books-data";

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
        url: "/images/books/como-estas-hoy-cover.webp",
        width: 1600,
        height: 1600,
        alt: "Portada de ¿Cómo estás hoy?",
      },
    ],
  },
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialBookSlug =
    typeof params.libro === "string" ? params.libro : undefined;
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
        url: `https://martamoreno.com/mis-libros/${book.slug}`,
        image: `https://martamoreno.com${book.cover}`,
      })),
    },
  };

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="brand-2026">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BooksLibrary books={books} initialBookSlug={initialBookSlug} />
      </main>
      <SiteFooter />
    </>
  );
}
