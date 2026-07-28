import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Barriecito } from "next/font/google";
import "./globals.css";

const bodyFont = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Barriecito({
  weight: "400",
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
    "Ilustración infantil, formación y juegos creativos para aprender a crear personajes que emocionan.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Marta Moreno",
    title: "Marta Moreno · Ilustradora infantil",
    description:
      "Ideas, herramientas y formación para convertir tus dibujos en personajes que conectan.",
    images: [{ url: "/images/marta-portada.jpg", width: 548, height: 700 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marta Moreno · Ilustradora infantil",
    description:
      "Ideas, herramientas y formación para crear personajes que emocionan.",
    images: ["/images/marta-portada.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f0e4",
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
