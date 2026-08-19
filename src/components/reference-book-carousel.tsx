"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReferenceDialog } from "@/components/reference-dialog";
import { getBookSpreads, referenceCarouselSlides } from "@/lib/books-data";
import type { Book } from "@/lib/books-data";

export function ReferenceBookCarousel({
  books,
}: {
  books: readonly Book[];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeBookIndex, setActiveBookIndex] = useState(0);
  const selectedImages = selectedBook
    ? [selectedBook.cover, ...getBookSpreads(selectedBook)]
    : [];
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
    setSelectedImageIndex(0);
    setSelectedBook(book);
  }

  function moveImage(direction: number) {
    setSelectedImageIndex((current) => {
      const next = current + direction;
      return Math.max(0, Math.min(next, selectedImages.length - 1));
    });
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

      <ReferenceDialog
        open={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
        labelledBy="reference-book-dialog-title"
        closeLabel="Cerrar imágenes del libro"
        className="reference-book-dialog"
      >
        {selectedBook ? (
          <div className="reference-book-dialog__content">
            <header className="reference-book-dialog__header">
              <p>{selectedBook.eyebrow}</p>
              <h2 id="reference-book-dialog-title">{selectedBook.title}</h2>
            </header>

            <div className="reference-book-dialog__viewer">
              <button
                type="button"
                className="reference-book-dialog__arrow reference-book-dialog__arrow--previous"
                onClick={() => moveImage(-1)}
                disabled={selectedImageIndex === 0}
                aria-label="Imagen anterior"
              >
                <ArrowLeft aria-hidden="true" />
              </button>
              <figure className="reference-book-dialog__stage">
                <Image
                  src={selectedImages[selectedImageIndex]}
                  alt={`${selectedImageIndex === 0 ? "Portada" : `Imagen interior ${selectedImageIndex}`} de ${selectedBook.title}`}
                  fill
                  sizes="(max-width: 767px) 92vw, 72vw"
                  quality={92}
                />
              </figure>
              <button
                type="button"
                className="reference-book-dialog__arrow reference-book-dialog__arrow--next"
                onClick={() => moveImage(1)}
                disabled={selectedImageIndex === selectedImages.length - 1}
                aria-label="Imagen siguiente"
              >
                <ArrowRight aria-hidden="true" />
              </button>
            </div>

            <div className="reference-book-dialog__meta" aria-live="polite">
              Imagen {selectedImageIndex + 1} de {selectedImages.length}
            </div>

            <div className="reference-book-dialog__thumbnails" aria-label="Imágenes del libro">
              {selectedImages.map((image, index) => (
                <button
                  type="button"
                  className={index === selectedImageIndex ? "is-active" : ""}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                  aria-pressed={index === selectedImageIndex}
                  key={`${image}-${index}`}
                >
                  <Image src={image} alt="" fill sizes="5rem" quality={88} />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </ReferenceDialog>
    </div>
  );
}
