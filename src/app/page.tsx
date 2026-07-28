import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Gamepad2,
  Heart,
  Mail,
  PencilLine,
  Sparkles,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const services = [
  {
    title: "Una carta creativa cada martes",
    label: "Newsletter",
    description:
      "Ideas, retos de dibujo y trucos de ilustradora para que tu creatividad no se quede esperando.",
    image: "/images/newsletter.jpg",
    href: "https://marta-moreno.systeme.io/guiacreativa",
    linkLabel: "Quiero recibirla",
    color: "var(--yellow)",
  },
  {
    title: "Crea y dibuja personajes memorables",
    label: "Curso online",
    description:
      "Un paso a paso para convertir una idea en un personaje con alma, a tu ritmo y desde cero.",
    image: "/images/curso.jpg",
    href: "https://marta-moreno.systeme.io/personajesmemorables",
    linkLabel: "Descubrir el curso",
    color: "var(--pink-soft)",
  },
  {
    title: "De la mente al corazón",
    label: "Formación intensiva",
    description:
      "Acompañamiento para construir ilustraciones narrativas únicas y encontrar tu manera de contar.",
    image: "/images/mentorias.jpg",
    href: "https://marta-moreno.systeme.io/delamentealcorazonenero",
    linkLabel: "Conocer la formación",
    color: "var(--turquoise)",
  },
];

const reviews = [
  { src: "/images/resena-1.jpg", width: 500, height: 224 },
  { src: "/images/resena-2.jpg", width: 576, height: 261 },
  { src: "/images/resena-3.jpg", width: 585, height: 303 },
  { src: "/images/resena-4.jpg", width: 585, height: 556 },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Marta Moreno",
    jobTitle: "Ilustradora infantil y profesora",
    url: "https://martamoreno.com",
    sameAs: ["https://www.instagram.com/martamoreno.art/"],
    knowsAbout: [
      "Ilustración infantil",
      "Diseño de personajes",
      "Álbum ilustrado",
    ],
  };

  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="paper-grain overflow-hidden border-b-2 border-foreground">
          <div className="site-container grid min-h-[calc(100svh-5rem)] items-center gap-12 py-12 lg:grid-cols-[1.08fr_.92fr] lg:py-16">
            <div className="relative z-10 flex flex-col items-start gap-7">
              <p className="eyebrow animate-in text-[var(--pink)]" style={{ "--i": 0 } as CSSProperties}>
                Ilustradora infantil y profesora
              </p>
              <h1 className="display-title animate-in max-w-[12ch]" style={{ "--i": 1 } as CSSProperties}>
                Dibujar bonito es solo el{" "}
                <span className="scribble-underline">principio.</span>
              </h1>
              <p
                className="animate-in max-w-[38rem] text-xl leading-relaxed text-foreground/80 sm:text-2xl"
                style={{ "--i": 2 } as CSSProperties}
              >
                La ilustración infantil crea emoción y conexión. Eso es lo que
                hago, y quiero acompañarte para que tú también lo consigas.
              </p>
              <div
                className="animate-in flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
                style={{ "--i": 3 } as CSSProperties}
              >
                <a
                  className="btn-primary"
                  href="https://marta-moreno.systeme.io/guiacreativa"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Mail className="size-5" aria-hidden="true" />
                  Recibir ideas cada martes
                </a>
                <a className="btn-secondary" href="#formacion">
                  Ver cómo puedo ayudarte
                  <ArrowDown className="size-5" aria-hidden="true" />
                </a>
              </div>
              <div
                className="animate-in flex flex-wrap items-center gap-x-8 gap-y-3 pt-2 text-sm font-bold"
                style={{ "--i": 4 } as CSSProperties}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="size-5 text-[var(--pink)]" aria-hidden="true" />
                  Más de 25 libros ilustrados
                </span>
                <span className="flex items-center gap-2">
                  <Heart className="size-5 text-[var(--pink)]" aria-hidden="true" />
                  Más de 20 años enseñando
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0 lg:justify-self-end">
              <div className="tape -left-4 top-2 z-20 -rotate-12" aria-hidden="true" />
              <div className="tape -right-5 bottom-10 z-20 rotate-12" aria-hidden="true" />
              <div className="relative rotate-[1.5deg] border-2 border-foreground bg-[var(--paper)] p-3 shadow-[0.75rem_0.75rem_0_var(--yellow)]">
                <Image
                  src="/images/marta-portada.jpg"
                  alt="Marta Moreno rodeada de algunos de los libros que ha ilustrado"
                  width={548}
                  height={700}
                  priority
                  sizes="(max-width: 1024px) 90vw, 42vw"
                  className="h-auto w-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-3 rotate-[-5deg] border-2 border-foreground bg-[var(--turquoise)] px-5 py-3 font-bold shadow-[0.25rem_0.25rem_0_var(--ink)] sm:-left-10">
                Dibujar también se aprende ✏️
              </div>
            </div>
          </div>
        </section>

        <section id="formacion" className="section-space bg-[var(--paper)]">
          <div className="site-container flex flex-col gap-14">
            <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <p className="eyebrow text-[var(--blue-pencil)]">Elige tu siguiente paso</p>
              <h2 className="section-title max-w-[13ch]">
                ¿Cómo te puedo ayudar a{" "}
                <span className="text-[var(--pink)]">crear?</span>
              </h2>
            </div>

            <div className="divide-y-2 divide-foreground border-y-2 border-foreground">
              {services.map((service, index) => (
                <article
                  key={service.title}
                  className="group grid gap-6 py-8 md:grid-cols-[8rem_1fr_auto] md:items-center md:gap-10 lg:grid-cols-[11rem_1fr_auto]"
                >
                  <div
                    className="relative aspect-square w-28 overflow-hidden rounded-[45%_55%_52%_48%/42%_48%_52%_58%] border-2 border-foreground md:w-full"
                    style={{ background: service.color }}
                  >
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="176px"
                      className="object-cover mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="max-w-2xl">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--pink)]">
                      0{index + 1} · {service.label}
                    </p>
                    <h3 className="font-display text-3xl leading-none sm:text-4xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-[54ch] text-lg text-foreground/70">
                      {service.description}
                    </p>
                  </div>
                  <a
                    href={service.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 w-fit items-center gap-2 font-black underline decoration-2 underline-offset-8 transition-colors hover:text-[var(--pink)]"
                  >
                    {service.linkLabel}
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space paper-grain overflow-hidden border-y-2 border-foreground bg-[var(--yellow)]">
          <div className="site-container grid items-center gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div className="flex flex-col items-start gap-6">
              <p className="eyebrow">Jugar también es practicar</p>
              <h2 className="section-title max-w-[10ch]">Cuando no sepas qué dibujar… juega.</h2>
              <p className="max-w-[34rem] text-xl text-foreground/75">
                Dos herramientas gratuitas para mezclar ideas imposibles,
                desbloquear la mano y conocer mejor a tus personajes.
              </p>
              <Link className="btn-primary" href="/juegos/personajes-locos">
                <Gamepad2 className="size-5" aria-hidden="true" />
                Abrir los juegos
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Link
                href="/juegos/personajes-locos"
                className="group relative min-h-80 rotate-[-1.5deg] border-2 border-foreground bg-[var(--paper)] p-7 shadow-[0.55rem_0.55rem_0_var(--ink)] transition-transform hover:rotate-0"
              >
                <span className="font-display text-7xl text-[var(--turquoise)]">4</span>
                <h3 className="mt-10 font-display text-4xl leading-none">Personajes locos</h3>
                <p className="mt-3 text-foreground/70">
                  Personaje + adjetivo + acción + complemento.
                </p>
                <ArrowRight className="absolute bottom-6 right-6 size-7 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/juegos/caldero-magico"
                className="group relative min-h-80 rotate-[1.5deg] border-2 border-foreground bg-[var(--pink-soft)] p-7 shadow-[0.55rem_0.55rem_0_var(--ink)] transition-transform hover:rotate-0"
              >
                <Sparkles className="size-14 text-[var(--pink)]" aria-hidden="true" />
                <h3 className="mt-16 font-display text-4xl leading-none">Caldero mágico</h3>
                <p className="mt-3 text-foreground/70">
                  Invoca una combinación y llévatela a Stories.
                </p>
                <ArrowRight className="absolute bottom-6 right-6 size-7 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-space bg-[var(--paper)]">
          <div className="site-container flex flex-col gap-12">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="eyebrow text-[var(--pink)]">Mensajes bonitos que recibo</p>
                <h2 className="section-title mt-5 max-w-[11ch]">Crear acompañadas cambia el camino.</h2>
              </div>
              <PencilLine className="hidden size-20 rotate-12 text-[var(--turquoise)] md:block" aria-hidden="true" />
            </div>
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {reviews.map((review, index) => (
                <figure
                  key={review.src}
                  className="mb-5 break-inside-avoid border-2 border-foreground bg-background p-3 shadow-[0.3rem_0.3rem_0_var(--yellow)]"
                  style={{ transform: `rotate(${index % 2 ? 0.6 : -0.6}deg)` }}
                >
                  <Image
                    src={review.src}
                    alt={`Testimonio de una alumna de Marta, ${index + 1}`}
                    width={review.width}
                    height={review.height}
                    sizes="(max-width: 640px) 90vw, 30vw"
                    className="h-auto w-full"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre-mi" className="section-space border-y-2 border-foreground bg-[var(--turquoise)]">
          <div className="site-container grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div className="relative">
              <div className="tape left-1/2 top-[-0.65rem] z-20 -translate-x-1/2 rotate-2" aria-hidden="true" />
              <div className="rotate-[-1.5deg] border-2 border-foreground bg-[var(--paper)] p-3 shadow-[0.65rem_0.65rem_0_var(--ink)]">
                <Image
                  src="/images/marta-retrato.jpeg"
                  alt="Libro infantil No quiero compartir, ilustrado por Marta Moreno"
                  width={1536}
                  height={1024}
                  sizes="(max-width: 1024px) 90vw, 44vw"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <p className="eyebrow">Soy Marta Moreno</p>
              <h2 className="section-title max-w-[10ch]">Maestra, ilustradora y narradora de mundos.</h2>
              <div className="flex max-w-[62ch] flex-col gap-4 text-lg leading-relaxed text-foreground/80">
                <p>
                  Durante más de 20 años he vivido entre dos pasiones: la enseñanza
                  y la ilustración. Ver el asombro de mis alumnos al abrir un cuento
                  me hizo querer ser quien creara esos mundos.
                </p>
                <p>
                  Desde entonces he ilustrado más de 25 libros. Mi experiencia como
                  maestra y dibujante me ayuda a acompañar a ilustradoras que están
                  empezando para que encuentren herramientas, oficio y su propia
                  forma de contar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-space paper-grain bg-[var(--pink)] text-[var(--paper)]">
          <div className="site-container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow text-[var(--yellow)]">Una idea nueva cada martes</p>
              <h2 className="section-title mt-5 max-w-[13ch]">
                Tu próxima ilustración puede empezar en tu bandeja de entrada.
              </h2>
              <p className="mt-6 max-w-[54ch] text-xl text-[var(--paper)]/80">
                Suscríbete gratis y recibe ideas prácticas, trucos y mini-retos
                para crear personajes que emocionan y conectan.
              </p>
            </div>
            <a
              className="inline-flex min-h-14 items-center justify-center gap-2 border-2 border-[var(--paper)] bg-[var(--yellow)] px-6 font-black text-[var(--ink)] shadow-[0.4rem_0.4rem_0_var(--ink)] transition-transform hover:-translate-y-1"
              href="https://marta-moreno.systeme.io/guiacreativa"
              target="_blank"
              rel="noreferrer"
            >
              <Mail className="size-5" aria-hidden="true" />
              Apuntarme a la newsletter
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
