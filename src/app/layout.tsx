import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Outfit } from "next/font/google";
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
    default: "Marta Moreno · Ilustradora infantil",
    template: "%s · Marta Moreno",
  },
  description:
    "Ilustración infantil y acompañamiento creativo para disfrutar dibujando, encontrar tu estilo y crear con emoción.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Marta Moreno",
    title: "Marta Moreno · Ilustradora infantil",
    description:
      "Ideas, retos y acompañamiento para disfrutar dibujando y encontrar tu propia voz.",
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
    title: "Marta Moreno · Ilustradora infantil",
    description:
      "Ideas, retos y acompañamiento para disfrutar dibujando y encontrar tu propia voz.",
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
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
