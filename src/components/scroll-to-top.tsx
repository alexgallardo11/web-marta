"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 200;

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > SHOW_AFTER_PX);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function returnToTop() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pageContent = document.querySelector<HTMLElement>("#contenido");

    pageContent?.setAttribute("tabindex", "-1");
    pageContent?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      className={`reference-scroll-top${isVisible ? " is-visible" : ""}`}
      aria-label="Volver arriba"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={returnToTop}
    >
      <ArrowUp aria-hidden="true" />
    </button>
  );
}
