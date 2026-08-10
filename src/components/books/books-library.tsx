"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { CharacterGuide } from "@/components/character-guide";
import { getBookSpreads } from "@/lib/books-data";
import type { Book } from "@/lib/books-data";
import type { LibraryMode } from "./books-scene";

const BooksScene = dynamic(
  () => import("./books-scene").then((module) => module.BooksScene),
  { ssr: false },
);

type BooksLibraryProps = {
  books: readonly Book[];
  initialBookSlug?: string;
};

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

function getInitialBookIndex(books: readonly Book[], slug?: string) {
  const initialIndex = books.findIndex((book) => book.slug === slug);
  return initialIndex >= 0 ? initialIndex : 0;
}

function getCoverCropStyle(book: Book): CSSProperties | undefined {
  const crop = book.coverCrop;
  if (!crop) return undefined;

  return {
    width: `${100 / crop.width}%`,
    height: `${100 / crop.height}%`,
    maxWidth: "none",
    left: `${(-100 * crop.x) / crop.width}%`,
    top: `${(-100 * crop.y) / crop.height}%`,
    objectFit: "fill",
  };
}

export function BooksLibrary({ books, initialBookSlug }: BooksLibraryProps) {
  const stageRef = useRef<HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(() =>
    getInitialBookIndex(books, initialBookSlug),
  );
  const [mode, setMode] = useState<LibraryMode>(initialBookSlug ? "inspect" : "shelf");
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [turn, setTurn] = useState<{ id: number; direction: -1 | 1 }>({ id: 0, direction: 1 });
  const [webglFallback, setWebglFallback] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const selectedBook = books[selectedIndex] ?? books[0];
  const spreads = useMemo(
    () => (selectedBook ? getBookSpreads(selectedBook) : []),
    [selectedBook],
  );
  const hasInterior = spreads.length > 0;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const selectBook = useCallback(
    (index: number) => {
      const nextBook = books[index];
      if (!nextBook) return;
      setSelectedIndex(index);
      setSpreadIndex(0);
      setIsClosing(false);
      setMode("inspect");
      stageRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      window.history.replaceState(null, "", `/mis-libros?libro=${nextBook.slug}`);
    },
    [books],
  );

  const moveSelection = useCallback(
    (direction: -1 | 1) => {
      selectBook(wrapIndex(selectedIndex + direction, books.length));
    },
    [books.length, selectBook, selectedIndex],
  );

  const turnPage = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = spreadIndex + direction;
      if (nextIndex < 0 || nextIndex >= spreads.length) return;
      setSpreadIndex(nextIndex);
      setTurn((current) => ({ id: current.id + 1, direction }));
    },
    [spreadIndex, spreads.length],
  );

  const closeBook = useCallback(() => {
    setSpreadIndex(0);
    setIsClosing(true);
    setMode("inspect");
  }, []);

  const returnToShelf = useCallback(() => {
    setIsClosing(false);
    setMode("shelf");
  }, []);

  const openBook = useCallback(() => {
    if (!hasInterior || isClosing) return;
    stageRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    setMode("reading");
  }, [hasInterior, isClosing]);

  useEffect(() => {
    if (!isClosing) return;
    const timeout = window.setTimeout(() => setIsClosing(false), reducedMotion ? 0 : 1250);
    return () => window.clearTimeout(timeout);
  }, [isClosing, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      if (event.key === "Escape") {
        if (mode === "reading") closeBook();
        else if (mode === "inspect") returnToShelf();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (mode === "reading") turnPage(1);
        else moveSelection(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (mode === "reading") turnPage(-1);
        else moveSelection(-1);
      }
      if (event.key === "Enter" && mode === "inspect") {
        event.preventDefault();
        openBook();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeBook, mode, moveSelection, openBook, returnToShelf, turnPage]);

  const stageStyle = {
    "--book-accent": selectedBook?.accent,
    "--book-accent-soft": selectedBook?.accentSoft,
  } as CSSProperties;
  const realSpread = spreads[spreadIndex];

  return (
    <div className={`library-experience is-${mode}`} style={stageStyle}>
      <section className="library-intro paper-grain" aria-labelledby="library-title">
        <div className="brand-orbit brand-orbit--cyan library-intro__orbit-cyan" aria-hidden="true" />
        <div className="brand-orbit brand-orbit--lime library-intro__orbit-lime" aria-hidden="true" />
        <div className="site-container library-intro__inner">
          <div className="library-intro__copy-block">
            <p className="brand-kicker">Mis libros · Biblioteca ilustrada</p>
            <h1 id="library-title">Escoge un libro.<br /><span>Ábrelo.</span> Quédate.</h1>
            <p className="library-intro__copy">
              Esta es mi estantería: un lugar para curiosear portadas,
              reencontrarte con personajes y asomarte a algunas páginas.
            </p>
          </div>
          <div className="library-intro__visual">
            <div className="library-intro__conversation">
              <CharacterGuide character="anton-pinon">
                Yo salgo en uno de esos libros. Y no paro quieto.
              </CharacterGuide>
              <CharacterGuide character="gatita" className="brand-guide--reverse">
                Toca una portada y te la acercamos.
              </CharacterGuide>
              <CharacterGuide character="mono">
                Algunos libros también dejan mirar sus páginas.
              </CharacterGuide>
            </div>
          </div>
        </div>
      </section>

      <section id="biblioteca-3d" ref={stageRef} className="library-stage" aria-label="Biblioteca tridimensional">
        <div className="library-stage__frame">
          {!webglFallback ? (
            <BooksScene
              books={books}
              mode={mode}
              selectedIndex={selectedIndex}
              spreadIndex={spreadIndex}
              spreads={spreads}
              turn={turn}
              reducedMotion={reducedMotion}
              canOpen={hasInterior}
              onSelect={selectBook}
              onOpen={openBook}
              onClose={closeBook}
              onReturnToShelf={returnToShelf}
              onTurnPage={turnPage}
              onFallback={() => setWebglFallback(true)}
            />
          ) : (
            <div className="library-fallback" role="img" aria-label={`Libro abierto: ${selectedBook?.title}`}>
              <div className={`library-fallback__book ${mode === "reading" ? "is-open" : ""}`}>
                <Image src={selectedBook?.cover ?? ""} alt="" fill sizes="22rem" />
                {mode === "reading" && realSpread ? (
                  <Image src={realSpread} alt="" fill sizes="70vw" className="library-fallback__spread" />
                ) : null}
              </div>
            </div>
          )}

          {mode === "inspect" ? (
            hasInterior && !isClosing ? (
              <button
                type="button"
                className="library-selected-book-hit"
                onClick={openBook}
                aria-label={`Abrir ${selectedBook?.title} tocando la portada`}
              >
                <span aria-hidden="true">Abrir</span>
              </button>
            ) : null
          ) : mode === "reading" ? (
            <div className="library-reader-ui">
              <div className="library-reader-ui__heading">
                <div>
                  <p>{selectedBook?.numberLabel}</p>
                  <h2>{selectedBook?.title}</h2>
                </div>
                <button type="button" className="library-close-action" onClick={closeBook} aria-label="Cerrar libro">
                  <X aria-hidden="true" />
                  <span>Cerrar libro</span>
                </button>
              </div>
              <div className="library-reader-ui__controls" aria-label="Controles de lectura">
                {spreads.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className="library-page-button"
                      onClick={() => turnPage(-1)}
                      disabled={spreadIndex === 0}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft aria-hidden="true" /><span className="library-page-button__label">Anterior</span>
                    </button>
                    <p aria-live="polite">
                      <strong>{String(spreadIndex + 1).padStart(2, "0")}</strong>
                      <span> / {String(spreads.length).padStart(2, "0")}</span>
                    </p>
                    <button
                      type="button"
                      className="library-page-button library-page-button--next"
                      onClick={() => turnPage(1)}
                      disabled={spreadIndex === spreads.length - 1}
                      aria-label="Página siguiente"
                    >
                      <span className="library-page-button__label">Siguiente</span><ChevronRight aria-hidden="true" />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}

        </div>
      </section>

      <section className="library-index paper-grain" aria-labelledby="library-index-title">
        <div className="site-container">
          <header className="library-index__heading">
            <div>
              <p className="brand-kicker">Biblioteca completa</p>
              <h2 id="library-index-title">Diecinueve historias para volver a mirar.</h2>
              <p>Elige la portada que te llame y tócala para acercarla.</p>
            </div>
            <CharacterGuide character="girafa" className="brand-guide--compact">
              Yo siempre empiezo por la que más me hace cosquillas.
            </CharacterGuide>
          </header>
          <div className="library-index__rail" role="tablist" aria-label="Libros de Marta">
          {books.map((book, index) => (
            <div key={book.slug} className="library-index__entry">
              <button
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Seleccionar ${book.title}`}
                className="library-index__book"
                onClick={() => selectBook(index)}
              >
                <span
                  className={`library-index__cover${book.coverTreatment ? " is-artwork" : ""}`}
                  style={{
                    "--cover-aspect": book.coverAspect,
                    "--cover-color": book.accent,
                  } as CSSProperties}
                >
                  <span className="library-index__image" style={getCoverCropStyle(book)}>
                    <Image src={book.cover} alt="" fill sizes="8rem" />
                  </span>
                  {book.coverTreatment ? <span aria-hidden="true">{book.title}</span> : null}
                </span>
                <span className="library-index__meta"><b>{book.numberLabel}</b>{book.title}</span>
              </button>
              <Link className="library-index__book-link" href={`/mis-libros/${book.slug}`}>
                Ver ficha
              </Link>
            </div>
          ))}
          </div>
        </div>
      </section>

      <p className="sr-only" aria-live="polite">
        {mode === "reading"
          ? `${selectedBook?.title}, doble página ${spreadIndex + 1} de ${spreads.length}`
          : `${selectedBook?.title}, libro ${selectedIndex + 1} de ${books.length}`}
      </p>
    </div>
  );
}
