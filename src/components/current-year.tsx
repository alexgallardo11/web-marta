"use client";

import { useEffect, useState } from "react";

export function CurrentYear({ initialYear }: { initialYear: number }) {
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    const updateYear = () => setYear(new Date().getFullYear());

    updateYear();
    const interval = window.setInterval(updateYear, 60 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  return <time dateTime={String(year)}>{year}</time>;
}
