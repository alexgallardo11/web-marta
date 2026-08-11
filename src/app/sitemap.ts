import type { MetadataRoute } from "next";

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
