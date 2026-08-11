"use client";

import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Book } from "@/lib/books-data";

type BookFilter = "all" | "author" | "anton" | "parenting";

const filterOptions: readonly { value: BookFilter; label: string }[] = [
  { value: "all", label: "Todos los libros" },
  { value: "author", label: "Autoría integral" },
  { value: "anton", label: "Colección Antón Piñón" },
  { value: "parenting", label: "Crianza consciente" },
];

const authorBooks = new Set([
  "sant-jordi",
  "kai-y-emma",
  "don-croqueto",
  "el-monstruo-comepueblos",
  "vera-astronauta",
]);

function getBookFilter(book: Book): Exclude<BookFilter, "all"> {
  if (book.slug.startsWith("anton-pinon")) return "anton";
  if (authorBooks.has(book.slug)) return "author";
  return "parenting";
}

export function ReferenceBooksFilter({ books }: { books: readonly Book[] }) {
  const [activeFilter, setActiveFilter] = useState<BookFilter>("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const activeOption = filterOptions.find(
    (option) => option.value === activeFilter,
  );
  const visibleBooks =
    activeFilter === "all"
      ? books
      : books.filter((book) => getBookFilter(book) === activeFilter);

  useEffect(() => {
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (
        isMenuOpen &&
        event.target instanceof Node &&
        !filterMenuRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !isMenuOpen) return;

      setIsMenuOpen(false);
      filterTriggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  function chooseFilter(filter: BookFilter) {
    setActiveFilter(filter);
    setIsMenuOpen(false);
    filterTriggerRef.current?.focus();
  }

  function focusSelectedOption() {
    window.requestAnimationFrame(() => {
      filterMenuRef.current
        ?.querySelector<HTMLButtonElement>(`[data-filter="${activeFilter}"]`)
        ?.focus();
    });
  }

  function handleListboxKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    const options = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='option']"),
    );
    const currentIndex = options.indexOf(document.activeElement as HTMLButtonElement);
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex =
      currentIndex < 0
        ? 0
        : (currentIndex + direction + options.length) % options.length;
    options[nextIndex]?.focus();
  }

  return (
    <>
      <div className="reference-library-filters">
        <div
          className="reference-library-filters__buttons"
          role="group"
          aria-label="Filtrar libros por categoría"
        >
          {filterOptions.map((option) => (
            <button
              type="button"
              className={activeFilter === option.value ? "is-active" : ""}
              aria-pressed={activeFilter === option.value}
              onClick={() => setActiveFilter(option.value)}
              key={option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="reference-library-filter-menu" ref={filterMenuRef}>
          <span className="reference-library-filter-menu__label">Filtrar libros</span>
          <button
            ref={filterTriggerRef}
            type="button"
            className="reference-library-filter-menu__trigger"
            aria-expanded={isMenuOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            onClick={() => {
              setIsMenuOpen((open) => !open);
              if (!isMenuOpen) focusSelectedOption();
            }}
          >
            <span>{activeOption?.label}</span>
            <ChevronDown aria-hidden="true" />
          </button>
          {isMenuOpen ? (
            <div
              id={listboxId}
              className="reference-library-filter-menu__options"
              role="listbox"
              aria-label="Filtrar libros por categoría"
              onKeyDown={handleListboxKeyDown}
            >
              {filterOptions.map((option) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={activeFilter === option.value}
                  data-filter={option.value}
                  onClick={() => chooseFilter(option.value)}
                  key={option.value}
                >
                  <span>{option.label}</span>
                  {activeFilter === option.value ? (
                    <Check aria-hidden="true" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Se muestran {visibleBooks.length} libros.
      </p>

      <div className="reference-library-grid" role="list">
        {visibleBooks.map((book) => (
          <article className="reference-library-card" role="listitem" key={book.slug}>
            <figure>
              <Image
                src={book.displayCover ?? book.cover}
                alt={`Portada de ${book.title}`}
                width={900}
                height={900}
                sizes="(max-width: 639px) 76vw, (max-width: 1023px) 38vw, 20rem"
                unoptimized
              />
            </figure>
            <h2>{book.title}</h2>
          </article>
        ))}
      </div>
    </>
  );
}
