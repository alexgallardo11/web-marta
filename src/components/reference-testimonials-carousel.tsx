"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { ReferenceDialog } from "@/components/reference-dialog";

type Testimonial = {
  name: string;
  paragraphs: readonly string[];
};

const TESTIMONIAL_PREVIEW_LENGTH = 310;

function getPreview(testimonial: Testimonial) {
  const fullText = testimonial.paragraphs.join(" ");
  if (fullText.length <= TESTIMONIAL_PREVIEW_LENGTH) {
    return { text: fullText, truncated: false };
  }

  const roughPreview = fullText.slice(0, TESTIMONIAL_PREVIEW_LENGTH);
  const lastSpace = roughPreview.lastIndexOf(" ");
  return {
    text: `${roughPreview.slice(0, lastSpace > 0 ? lastSpace : TESTIMONIAL_PREVIEW_LENGTH)}…`,
    truncated: true,
  };
}

export function ReferenceTestimonialsCarousel({
  testimonials,
}: {
  testimonials: readonly Testimonial[];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);

  function moveRail(direction: number) {
    const rail = railRef.current;

    if (!rail) return;

    rail.scrollBy({
      left: direction * rail.clientWidth * 0.84,
      behavior: "smooth",
    });
  }

  return (
    <div className="reference-testimonials__carousel">
      <button
        type="button"
        className="reference-testimonials__arrow reference-testimonials__arrow--previous"
        onClick={() => moveRail(-1)}
        aria-label="Ver reseñas anteriores"
      >
        <ArrowLeft aria-hidden="true" />
      </button>

      <div
        ref={railRef}
        className="reference-testimonials__rail"
        role="region"
        aria-label="Carrusel de reseñas"
        tabIndex={0}
      >
        {testimonials.map((testimonial) => {
          const preview = getPreview(testimonial);

          return (
            <figure className="reference-testimonial-card" key={testimonial.name}>
              <blockquote>
                <p>{preview.text}</p>
              </blockquote>
              {preview.truncated ? (
                <button
                  type="button"
                  className="reference-testimonial-card__more"
                  onClick={() => setSelectedTestimonial(testimonial)}
                >
                  Ver más
                </button>
              ) : null}
              <figcaption>{testimonial.name}</figcaption>
            </figure>
          );
        })}
      </div>

      <button
        type="button"
        className="reference-testimonials__arrow reference-testimonials__arrow--next"
        onClick={() => moveRail(1)}
        aria-label="Ver más reseñas"
      >
        <ArrowRight aria-hidden="true" />
      </button>

      <ReferenceDialog
        open={selectedTestimonial !== null}
        onClose={() => setSelectedTestimonial(null)}
        labelledBy="reference-review-dialog-title"
        closeLabel="Cerrar reseña completa"
        className="reference-review-dialog"
      >
        {selectedTestimonial ? (
          <article className="reference-review-dialog__content">
            <p className="reference-review-dialog__eyebrow">Mensaje de</p>
            <h2 id="reference-review-dialog-title">{selectedTestimonial.name}</h2>
            <blockquote>
              {selectedTestimonial.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
          </article>
        ) : null}
      </ReferenceDialog>
    </div>
  );
}
