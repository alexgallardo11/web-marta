"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { ReferenceDialog } from "@/components/reference-dialog";
import { getBookSpreads } from "@/lib/books-data";
import type { Book } from "@/lib/books-data";

export function ReferenceBookDialog({
  book,
  open,
  onClose,
}: {
  book: Book | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ReferenceDialog
      open={open}
      onClose={onClose}
      labelledBy="reference-book-dialog-title"
      closeLabel="Cerrar imágenes del libro"
      className="reference-book-dialog"
    >
      {book && open ? <ReferenceBookDialogContent book={book} /> : null}
    </ReferenceDialog>
  );
}

function ReferenceBookDialogContent({ book }: { book: Book }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImages = [book.cover, ...getBookSpreads(book)];

  function moveImage(direction: -1 | 1) {
    setSelectedImageIndex((current) => {
      const next = current + direction;
      return Math.max(0, Math.min(next, selectedImages.length - 1));
    });
  }

  return (
    <div className="reference-book-dialog__content">
      <header className="reference-book-dialog__header">
        <h2 id="reference-book-dialog-title">{book.title}</h2>
        {book.publication ? (
          <p className="reference-book-dialog__publication">{book.publication}</p>
        ) : null}
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
            alt={`${selectedImageIndex === 0 ? "Portada" : `Imagen interior ${selectedImageIndex}`} de ${book.title}`}
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

      <div
        className="reference-book-dialog__thumbnails"
        aria-label="Imágenes del libro"
      >
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
  );
}
