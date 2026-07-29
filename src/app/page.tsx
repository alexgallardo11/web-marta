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
    title: "Una idea nueva cada martes",
    label: "Newsletter gratuita",
    description:
      "Recibe ideas, retos de dibujo y trucos de ilustradora para seguir practicando y potenciar tu creatividad.",
    image: "/images/newsletter.jpg",
    href: "https://marta-moreno.systeme.io/guiacreativa",
    linkLabel: "Quiero apuntarme",
    tone: "sun",
    character: "lion",
    quote: "Yo te traigo una idea para empezar a dibujar.",
  },
  {
    title: "Crea y dibuja personajes memorables",
    label: "Curso online",
    description:
      "Aprende a crear personajes desde cero, paso a paso, a tu ritmo y con ejercicios prácticos.",
    image: "/images/curso.jpg",
    href: "https://marta-moreno.systeme.io/personajesmemorables",
    linkLabel: "Ver el curso",
    tone: "rose",
    character: "ghost",
    quote: "Marta te enseña todo el proceso, de la primera idea al personaje.",
  },
  {
    title: "De la mente al corazón",
    label: "Formación intensiva",
    description:
      "Te acompaño a crear ilustraciones que emocionen, cuenten una historia y tengan tu propia voz.",
    image: "/images/mentorias.jpg",
    href: "https://marta-moreno.systeme.io/delamentealcorazonenero",
    linkLabel: "Ver la formación",
    tone: "mint",
    character: "friends",
    quote: "Aquí trabajas acompañada para encontrar tu manera de contar.",
  },
];

const reviews = [
  { src: "/images/resena-1.jpg", width: 500, height: 224 },
  { src: "/images/resena-2.jpg", width: 576, height: 261 },
  { src: "/images/resena-3.jpg", width: 585, height: 303 },
  { src: "/images/resena-4.jpg", width: 585, height: 556 },
];

function CharacterCrop({
  character,
  className = "",
}: {
  character: string;
  className?: string;
}) {
  return (
    <div
      className={`character-crop character-crop--${character} ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/images/fondo-resenas.jpg"
        alt=""
        width={1200}
        height={566}
        className="character-sheet"
        sizes="360px"
      />
    </div>
  );
}

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
      <main id="contenido" className="storybook">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="story-hero paper-grain">
          <div className="story-blob story-blob--sun" aria-hidden="true" />
          <div className="story-blob story-blob--blue" aria-hidden="true" />

          <div className="site-container story-hero__grid">
            <div className="story-hero__copy">
              <p
                className="eyebrow animate-in text-[var(--pink)]"
                style={{ "--i": 0 } as CSSProperties}
              >
                Ilustración infantil y formación creativa
              </p>
              <h1
                className="display-title animate-in max-w-[10ch]"
                style={{ "--i": 1 } as CSSProperties}
              >
                Crea personajes que emocionen y{" "}
                <span className="story-circle">conecten.</span>
              </h1>
              <p
                className="animate-in max-w-[35rem] text-xl leading-relaxed text-foreground/78 sm:text-2xl"
                style={{ "--i": 2 } as CSSProperties}
              >
                Soy Marta, ilustradora infantil y maestra. Te acompaño paso a
                paso para que conviertas tus ideas en personajes y aprendas a
                contar con imágenes.
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
                  Recibir la newsletter
                </a>
                <a className="btn-secondary" href="#formacion">
                  Ver cómo puedo ayudarte
                  <ArrowDown className="size-5" aria-hidden="true" />
                </a>
              </div>
              <div
                className="animate-in story-credentials"
                style={{ "--i": 4 } as CSSProperties}
              >
                <span>
                  <BookOpen aria-hidden="true" />
                  Más de 25 libros ilustrados
                </span>
                <span>
                  <Heart aria-hidden="true" />
                  Más de 20 años enseñando
                </span>
              </div>
            </div>

            <div
              className="story-hero__portrait animate-in"
              style={{ "--i": 2 } as CSSProperties}
            >
              <div className="portrait-halo" aria-hidden="true" />
              <div className="portrait-frame">
                <Image
                  src="/images/marta-portada.jpg"
                  alt="Marta Moreno rodeada de algunos de los libros que ha ilustrado"
                  width={548}
                  height={700}
                  priority
                  sizes="(max-width: 1024px) 88vw, 34vw"
                  className="h-auto w-full"
                />
              </div>
              <p className="speech-bubble speech-bubble--marta">
                ¡Hola! Soy Marta. ¿Dibujamos?
              </p>
            </div>

            <div
              className="story-cast animate-in"
              style={{ "--i": 5 } as CSSProperties}
            >
              <Image
                src="/images/fondo-resenas.jpg"
                alt="Personajes infantiles ilustrados por Marta celebrando juntos"
                width={1200}
                height={566}
                priority
                sizes="(max-width: 768px) 120vw, 80vw"
                className="story-cast__image"
              />
              <p className="speech-bubble story-cast__bubble story-cast__bubble--ghost">
                Yo te enseño el paso a paso.
              </p>
              <p className="speech-bubble story-cast__bubble story-cast__bubble--lion">
                ¡Y yo me dejo dibujar!
              </p>
            </div>
          </div>

          <a className="story-scroll" href="#formacion">
            <span>Ver cómo puedo ayudarte</span>
            <ArrowDown aria-hidden="true" />
          </a>
        </section>

        <section id="formacion" className="story-services">
          <div className="site-container">
            <header className="story-section-heading">
              <div>
                <p className="eyebrow text-[var(--blue-pencil)]">
                  Cómo te puedo ayudar
                </p>
                <h2 className="section-title max-w-[12ch]">
                  Elige por dónde quieres empezar.
                </h2>
              </div>
              <div className="section-guide section-guide--ghost">
                <CharacterCrop character="ghost" />
                <p className="speech-bubble">
                  Puedes empezar con una idea, un curso o una formación
                  conmigo.
                </p>
              </div>
            </header>

            <div className="service-journey">
              {services.map((service, index) => (
                <article
                  key={service.title}
                  className={`service-scene service-scene--${service.tone}`}
                  style={{ "--scene": index } as CSSProperties}
                >
                  <div className="service-scene__number" aria-hidden="true">
                    0{index + 1}
                  </div>
                  <div className="service-scene__visual">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 86vw, 34vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="service-scene__copy">
                    <p className="service-scene__label">{service.label}</p>
                    <h3>{service.title}</h3>
                    <p className="service-scene__description">
                      {service.description}
                    </p>
                    <a
                      href={service.href}
                      target="_blank"
                      rel="noreferrer"
                      className="story-link"
                    >
                      {service.linkLabel}
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </div>
                  <div
                    className={`service-scene__guide service-scene__guide--${service.character}`}
                  >
                    <CharacterCrop character={service.character} />
                    <p className="speech-bubble">{service.quote}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="playroom paper-grain">
          <div className="site-container playroom__grid">
            <div className="playroom__intro">
              <p className="eyebrow">Juegos creativos gratuitos</p>
              <h2 className="section-title max-w-[9ch]">
                ¿Te has quedado sin ideas? Vamos a jugar.
              </h2>
              <p>
                Prueba dos juegos para combinar ideas, dibujar sin presión y
                crear personajes que no habías imaginado.
              </p>
            </div>

            <div className="playroom__links">
              <Link href="/juegos/personajes-locos" className="game-door">
                <span className="game-door__icon" aria-hidden="true">
                  <Gamepad2 />
                </span>
                <span>
                  <small>Mezcla cuatro pistas</small>
                  Personajes locos
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                href="/juegos/caldero-magico"
                className="game-door game-door--magic"
              >
                <span className="game-door__icon" aria-hidden="true">
                  <Sparkles />
                </span>
                <span>
                  <small>Invoca una combinación</small>
                  Caldero mágico
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="playroom__cast">
              <Image
                src="/images/fondo-resenas.jpg"
                alt=""
                width={1200}
                height={566}
                sizes="(max-width: 768px) 130vw, 70vw"
              />
              <p className="speech-bubble">
                Elige una combinación y empieza por el primer trazo.
              </p>
            </div>
          </div>
        </section>

        <section className="kind-words">
          <div className="site-container">
            <header className="kind-words__heading">
              <div>
                <p className="eyebrow text-[var(--pink)]">
                  Mensajes bonitos que recibo
                </p>
                <h2 className="section-title max-w-[11ch]">
                  Esto cuentan mis alumnas.
                </h2>
              </div>
              <div className="kind-words__aside" aria-hidden="true">
                <PencilLine />
                <span>Palabras de alumnas reales</span>
              </div>
            </header>

            <div className="review-wall">
              {reviews.map((review, index) => (
                <figure
                  key={review.src}
                  className="review-note"
                  style={{ "--note": index } as CSSProperties}
                >
                  <span className="review-note__tape" aria-hidden="true" />
                  <Image
                    src={review.src}
                    alt={`Testimonio de una alumna de Marta, ${index + 1}`}
                    width={review.width}
                    height={review.height}
                    sizes="(max-width: 640px) 90vw, 42vw"
                    className="h-auto w-full"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre-mi" className="about-story">
          <div className="site-container about-story__grid">
            <div className="about-story__book">
              <div className="book-aura" aria-hidden="true" />
              <Image
                src="/images/marta-retrato.jpeg"
                alt="Libro infantil No quiero compartir, ilustrado por Marta Moreno"
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 90vw, 48vw"
                className="h-auto w-full"
              />
              <p className="speech-bubble">
                Marta ha ilustrado más de 25 libros. Y sigue aprendiendo con
                cada uno.
              </p>
            </div>

            <div className="about-story__copy">
              <p className="eyebrow">Hola, soy Marta Moreno</p>
              <h2 className="section-title max-w-[10ch]">
                Ilustradora infantil y maestra desde hace más de 20 años.
              </h2>
              <div>
                <p>
                  Durante más de 20 años he vivido entre la enseñanza y la
                  ilustración. Ver la cara de mis alumnos cuando les leía un
                  cuento me hizo querer crear esos mundos yo también.
                </p>
                <p>
                  Desde entonces he ilustrado más de 25 libros. Hoy comparto
                  todo lo aprendido con ilustradoras que quieren ganar
                  confianza y crear sus propios álbumes.
                </p>
              </div>
              <span className="about-story__signature">— Marta</span>
            </div>
          </div>
        </section>

        <section className="newsletter-stage paper-grain">
          <div className="site-container newsletter-stage__grid">
            <div className="newsletter-stage__character">
              <Image
                src="/images/newsletter.jpg"
                alt="Personaje león ilustrado por Marta Moreno"
                width={400}
                height={400}
                sizes="(max-width: 768px) 70vw, 28vw"
                className="h-auto w-full"
              />
              <p className="speech-bubble">¿Nos vemos el martes?</p>
            </div>
            <div className="newsletter-stage__copy">
              <p className="eyebrow text-[var(--yellow)]">
                Newsletter gratuita
              </p>
              <h2 className="section-title max-w-[12ch]">
                Recibe una idea para dibujar cada martes.
              </h2>
              <p>
                Te envío ideas prácticas, trucos de ilustración y mini-retos
                para que sigas creando personajes a tu ritmo.
              </p>
              <a
                className="newsletter-stage__button"
                href="https://marta-moreno.systeme.io/guiacreativa"
                target="_blank"
                rel="noreferrer"
              >
                <Mail className="size-5" aria-hidden="true" />
                Apuntarme a la newsletter
                <ArrowRight className="size-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
