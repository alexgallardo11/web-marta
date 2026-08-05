import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthSessionRedirect } from "@/components/auth-session-redirect";
import "./globals.css";

const bodyFont = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://martamoreno.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aprender a dibujar e ilustración infantil · Marta Moreno",
    template: "%s · Marta Moreno",
  },
  description:
    "Aprende a dibujar, encuentra tu estilo y crea ilustraciones con emoción junto a Marta Moreno, ilustradora infantil y maestra.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Marta Moreno",
    title: "Aprender a dibujar e ilustración infantil · Marta Moreno",
    description:
      "Ideas, retos y acompañamiento para aprender a dibujar y encontrar tu propia voz.",
    images: [
      {
        url: "/images/web-2026/photos/marta-portada.jpg",
        width: 1000,
        height: 1401,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aprender a dibujar e ilustración infantil · Marta Moreno",
    description:
      "Ideas, retos y acompañamiento para aprender a dibujar y encontrar tu propia voz.",
    images: ["/images/web-2026/photos/marta-portada.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fffdf7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${displayFont.variable}`}
    >
      <body>
        <AuthSessionRedirect />
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
