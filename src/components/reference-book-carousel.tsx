"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReferenceBookDialog } from "@/components/reference-book-dialog";
import { referenceCarouselSlides } from "@/lib/books-data";
import type { Book } from "@/lib/books-data";

export function ReferenceBookCarousel({
  books,
}: {
  books: readonly Book[];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeBookIndex, setActiveBookIndex] = useState(0);
  const booksBySlug = new Map(books.map((book) => [book.slug, book]));
  const carouselSlides = referenceCarouselSlides.flatMap((slide) => {
    const book = booksBySlug.get(slide.bookSlug);

    return book ? [{ ...slide, book }] : [];
  });

  function scrollToBook(index: number) {
    const rail = railRef.current;
    if (!rail) return;

    const card = rail.querySelectorAll<HTMLElement>(".reference-book-card")[
      index
    ];
    if (!card) return;

    rail.scrollTo({
      left: card.offsetLeft,
      top: 0,
      behavior: "smooth",
    });
  }

  const updateActiveBook = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(
      rail.querySelectorAll<HTMLElement>(".reference-book-card"),
    );
    const firstCard = cards[0];
    if (!firstCard) return;

    const gap = parseFloat(getComputedStyle(rail).columnGap || "0");
    const step = firstCard.offsetWidth + gap;
    setActiveBookIndex(
      Math.min(cards.length - 1, Math.round(rail.scrollLeft / step)),
    );
  }, []);

  function handleRailScroll() {
    if (scrollFrameRef.current !== null) return;

    scrollFrameRef.current = requestAnimationFrame(() => {
      updateActiveBook();
      scrollFrameRef.current = null;
    });
  }

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const frame = requestAnimationFrame(updateActiveBook);
    const resizeObserver = new ResizeObserver(updateActiveBook);
    resizeObserver.observe(rail);

    return () => {
      cancelAnimationFrame(frame);
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [updateActiveBook]);

  function openBook(book: Book) {
    setSelectedBook(book);
  }

  return (
    <div className="reference-books__carousel">
      <div
        ref={railRef}
        className="reference-books__rail"
        role="region"
        aria-label="Carrusel de libros ilustrados"
        tabIndex={0}
        onScroll={handleRailScroll}
      >
        {carouselSlides.map(({ book, image }, index) => (
          <button
            type="button"
            className={`reference-book-card${index === activeBookIndex ? " is-active" : ""}`}
            onClick={() => openBook(book)}
            aria-label={`Abrir imágenes de ${book.title}`}
            key={image}
          >
            <figure className="reference-book-card__cover">
              <Image
                src={image}
                alt={`Portada de ${book.title}`}
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1023px) 32vw, 24rem"
                unoptimized
              />
            </figure>
          </button>
        ))}
      </div>

      <div className="reference-books__pagination" aria-label="Navegación de libros">
        {carouselSlides.map(({ book, image }, index) => (
          <button
            type="button"
            className={index === activeBookIndex ? "is-active" : ""}
            key={image}
            onClick={() => scrollToBook(index)}
            aria-label={`Ver ${book.title}`}
            aria-current={index === activeBookIndex ? "true" : undefined}
          />
        ))}
      </div>

      <ReferenceBookDialog
        book={selectedBook}
        open={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
