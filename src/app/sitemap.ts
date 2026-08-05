import type { MetadataRoute } from "next";
import { books } from "@/lib/books-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://martamoreno.com";

  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    {
      url: `${baseUrl}/mi-club-de-ilustracion`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mis-libros`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...books.map((book) => ({
      url: `${baseUrl}/mis-libros/${book.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/juegos/personajes-locos`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/juegos/caldero-magico`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
