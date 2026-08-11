"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { ReferenceDialog } from "@/components/reference-dialog";
import { getBookSpreads } from "@/lib/books-data";
import type { Book } from "@/lib/books-data";

export function ReferenceBookCarousel({
  books,
}: {
  books: readonly Book[];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeBookIndex, setActiveBookIndex] = useState(0);
  const selectedImages = selectedBook
    ? [selectedBook.cover, ...getBookSpreads(selectedBook)]
    : [];

  function moveRail(direction: number) {
    railRef.current?.scrollBy({
      left: direction * railRef.current.clientWidth * 0.82,
      top: 0,
      behavior: "smooth",
    });
  }

  function updateActiveBook() {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(
      rail.querySelectorAll<HTMLElement>(".reference-book-card"),
    );
    const step = cards[1]
      ? cards[1].offsetLeft - cards[0].offsetLeft
      : cards[0]?.offsetWidth;

    if (step) {
      setActiveBookIndex(
        Math.min(books.length - 1, Math.max(0, Math.round(rail.scrollLeft / step))),
      );
    }
  }

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
      <button
        type="button"
        className="reference-books__arrow reference-books__arrow--previous"
        onClick={() => moveRail(-1)}
        aria-label="Ver libros anteriores"
      >
        <ArrowLeft aria-hidden="true" />
      </button>

      <div
        ref={railRef}
        className="reference-books__rail"
        role="region"
        aria-label="Carrusel de libros ilustrados"
        tabIndex={0}
        onScroll={updateActiveBook}
      >
        {books.map((book) => (
          <button
            type="button"
            className="reference-book-card"
            onClick={() => openBook(book)}
            aria-label={`Abrir imágenes de ${book.title}`}
            key={book.slug}
          >
            <figure>
              <Image
                src={book.displayCover ?? book.cover}
                alt={`Portada de ${book.title}`}
                width={900}
                height={900}
                sizes="(max-width: 720px) 42vw, (max-width: 1100px) 28vw, 18rem"
                unoptimized
              />
            </figure>
            <span className="reference-book-card__title">{book.title}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="reference-books__arrow reference-books__arrow--next"
        onClick={() => moveRail(1)}
        aria-label="Ver más libros"
      >
        <ArrowRight aria-hidden="true" />
      </button>

      <div className="reference-books__pagination" aria-hidden="true">
        {books.map((book, index) => (
          <span
            className={index === activeBookIndex ? "is-active" : ""}
            key={book.slug}
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
