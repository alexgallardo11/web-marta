import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReferenceBookCarousel } from "@/components/reference-book-carousel";
import { ReferenceTestimonialsCarousel } from "@/components/reference-testimonials-carousel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { books } from "@/lib/books-data";
import { CLUB_URL, CLUB_WAITLIST_URL, NEWSLETTER_URL } from "@/lib/site-links";

export const metadata: Metadata = {
  title: "Marta Moreno · Ilustradora infantil",
  description:
    "Ilustración infantil, personajes memorables y un espacio para aprender a dibujar con emoción.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Marta Moreno · Ilustradora infantil",
    description:
      "Crea ilustraciones memorables y encuentra tu propia voz junto a Marta Moreno.",
    url: "/",
    images: ["/images/marta-2026/marta-portada.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marta Moreno · Ilustradora infantil",
    description:
      "Crea ilustraciones memorables y encuentra tu propia voz junto a Marta Moreno.",
    images: ["/images/marta-2026/marta-portada.jpg"],
  },
};

const supportPaths = [
  {
    image: "/images/newsletter.jpg",
    alt: "Personaje ilustrado que acompaña la newsletter de Marta",
    title: "Recibe ideas creativas en tu mail cada semana",
    text: "Recibe cada martes en tu mail ideas, retos de dibujo y trucos para ilustrar personajes que emocionen.",
    href: NEWSLETTER_URL,
    label: "Quiero recibirla",
    external: true,
  },
  {
    image: "/images/marta-2026/marta-bio.jpg",
    alt: "Marta Moreno dibujando en su estudio",
    title: "Mi Club de Ilustración",
    text: "Te acompaño a crear ilustraciones memorables y transformar tus ideas en historias con emoción.",
    href: CLUB_URL,
    label: "Conocer el Club",
    external: true,
  },
] as const;

const testimonials = [
  {
    name: "Santi",
    paragraphs: [
      "He estado practicando muchas veces el dibujo para coger el ritmo sin miedo, con la mente despejada y dejando que la imaginación fluya al crear personajes.",
      "Incluso he preparado mi propio cuadernillo con todas las prácticas que he realizado contigo a partir del tuyo.",
      "Es como tener un apunte completo, una guía que realmente ayuda.",
    ],
  },
  {
    name: "@Mayuki76",
    paragraphs: [
      "Gracias a ti volví a dibujar. Gracias a tu curso estoy aprendiendo a confiar en mí y a gustarme lo que hago. Gracias por cruzarte en mi camino justo en el momento más oportuno.",
    ],
  },
  {
    name: "Maria Jesús",
    paragraphs: [
      "Siempre he pensado que dibujo fatal pero tus publicaciones y newsletters me están ayudando mucho. Ahora cuando mis hijos me dicen «¿me dibujas esto o lo otro?», yo lo intento y busco mi manera de hacerlo ❤️",
    ],
  },
  {
    name: "Ana",
    paragraphs: [
      "Acabo de hacer los personajes del último directo y estoy encantada. No sabía que era capaz de hacer algo así.",
      "Gracias por hacerlo tan fácil ❤️.",
      "Estoy deseando hacer tu curso porque, además, llega justo en el momento adecuado: he escrito una historia sobre el primer diente que se le ha caído a mi hija y me encantaría dibujarlo yo misma.",
      "Así que nada, muchas gracias por lo que compartes.",
    ],
  },
  {
    name: "Noe",
    paragraphs: [
      "Me encantan los retos que haces y este año me lo he tomado como un momento de desconexión.",
      "Los dibujos que hago cada día los utilizo para el calendario de adviento de mi peque y le encanta.",
      "Me he sorprendido que voy cogiendo más soltura en el trazo y la verdad es que me gusta.",
      "Esto me da la vida, en un momento de mucho estrés y complicado que estoy viviendo.",
    ],
  },
  {
    name: "Ania",
    paragraphs: [
      "Ahora que soy abuela, mi nieta me tiene tremendamente motivada con esto de dibujar.",
      "Hacemos algunas historias de nuestras conversaciones y me he atrevido a realizar los dibujos, son cosas muy empíricas y las disfruto.",
      "Gracias por compartir.",
      "Gracias por motivarme.",
    ],
  },
  {
    name: "Sara",
    paragraphs: [
      "TERMINÉ los 20 dibujos!!!!!!!",
      "Qué gran idea. Me siento súper orgullosa porque aunque en general ha sido disfrute, también ha habido momentos de frustración, y esos momentos, me ha gustado superarlos.",
      "Creo que voy a echar de menos el desafío porque era terapéutico, llegaba de un día ajetreado y sólo me apetecía ponerme a pintar…",
      "Bueno, que gracias mil.",
    ],
  },
  {
    name: "Isabel",
    paragraphs: [
      "Gracias Marta por el reto, tus mails, tu trabajo, los vídeos donde seguir la estela de tus creaciones… qué bonito sienta dibujar.",
      "Aquí te envío mi pequeño vídeo del reto de octubre, estoy muy contenta de haberlo hecho!!",
      "Me ha costado un montón, por no saber nada de nada pero LO HE DISFRUTADO TANTOOO!! Aunque es cierto que cuesta uno al día jijiji. Gracias de verdad!! UN ABRAZO ENORME!! 🤗",
    ],
  },
  {
    name: "Sonia",
    paragraphs: [
      "Hacía mucho que no dibujaba porque no tenía inspiración, ni ganas y cuando lo vi me animé y he vuelto a reconectar con el dibujo!",
      "Me cuestan mucho las caras y las manos pero ahora he vuelto a coger «soltura»; voy a practicar más para mejorar.",
      "Muchas gracias 😊❤️",
    ],
  },
  {
    name: "Cristina",
    paragraphs: [
      "Te he descubierto hace poco y me has aportado muchísima inspiración en mis proyectos, gracias por la divulgación que haces!!!",
    ],
  },
  {
    name: "Judith",
    paragraphs: [
      "La verdad es que me encanta porque todos los días me pongo a dibujar un ratito, y eso lejos de estresarme ¡me salva el día! Así que gracias por la inspiración y la propuesta! ¡¡Eres genial haciendo estas cosas!!",
    ],
  },
  {
    name: "Julita",
    paragraphs: [
      "A mis dibujos intento darles a cada personaje un estilo y personalidad, pero a veces me salen parecidos y con esta clase me lo he pasado muy bien.",
      "¡Qué emoción comenzar la semana con tu curso!",
    ],
  },
  {
    name: "Sabrina",
    paragraphs: [
      "Lo bueno de los retos de dibujo es que además de hacer cosas divertidas, pruebo técnicas y soportes. Y esto me ayuda a darme cuenta de qué me gusta, qué no… en qué me siento cómoda y con qué pienso que hago desastres.",
    ],
  },
] as const;

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Marta Moreno",
    jobTitle: "Ilustradora infantil y maestra",
    url: "https://martamoreno.com",
    sameAs: ["https://www.instagram.com/martamoreno.art/"],
    knowsAbout: [
      "Ilustración infantil",
      "Diseño de personajes",
      "Formación creativa",
      "Aprender a dibujar",
    ],
  };

  return (
    <>
      <SiteHeader variant="reference" />
      <main id="contenido" className="reference-home">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="reference-waitlist" aria-labelledby="waitlist-title">
          <div className="site-container reference-waitlist__inner">
            <div className="reference-waitlist__copy">
              <h2 id="waitlist-title">Lista de espera de Mi Club de ilustración</h2>
              <p className="reference-waitlist__description">
                Entra en mi grupo privado y descarga la guía de 5 pasos para crear
                personajes
              </p>
            </div>
            <a
              className="reference-button reference-button--dark reference-waitlist__button"
              href={CLUB_WAITLIST_URL}
              target="_blank"
              rel="noreferrer"
            >
              Quiero la guía <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="reference-hero" aria-labelledby="hero-title">
          <div className="site-container reference-hero__grid">
            <div className="reference-hero__copy">
              <h1 id="hero-title">
                <strong className="reference-hero__accent">
                  La ilustración infantil
                </strong>
                <span>No es solo dibujar bonito</span>
              </h1>
              <p className="reference-hero__statement">
                Es crear <span>emoción</span> y <span>conectar</span>
              </p>
              <p className="reference-hero__lead">
                Eso es lo que hago, y quiero acompañarte en el camino para que tú
                lo logres también.
              </p>
              <a
                className="reference-button"
                href="#libros"
              >
                Conoce mi trabajo <ArrowRight aria-hidden="true" />
              </a>
            </div>

            <div className="reference-hero__image">
              <Image
                src="/images/marta-2026/marta-portada.jpg"
                alt="Marta Moreno rodeada de algunos de sus libros ilustrados"
                width={919}
                height={1288}
                priority
                sizes="(max-width: 720px) 86vw, 34rem"
                unoptimized
              />
            </div>
          </div>
        </section>

        <section id="libros" className="reference-books" aria-labelledby="books-title">
          <div className="site-container">
            <h2 id="books-title" className="sr-only">
              Mis libros ilustrados
            </h2>
            <ReferenceBookCarousel books={books} />
            <Link className="reference-button reference-button--books" href="/mis-libros">
              Ver todos mis libros <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="reference-support" aria-labelledby="support-title">
          <div className="site-container">
            <h2 id="support-title">¿Cómo te puedo ayudar?</h2>
            <div className="reference-support__grid">
              {supportPaths.map((path) => {
                const content = (
                  <>
                    <Image
                      src={path.image}
                      alt={path.alt}
                      width={400}
                      height={400}
                      sizes="(max-width: 720px) 55vw, 12rem"
                    />
                    <h3>{path.title}</h3>
                    <span className="reference-support__scribble" aria-hidden="true" />
                    <p>{path.text}</p>
                    <span className="reference-support__link">
                      {path.label} <ArrowRight aria-hidden="true" />
                    </span>
                  </>
                );

                return path.external ? (
                  <a
                    className="reference-support__card"
                    href={path.href}
                    target="_blank"
                    rel="noreferrer"
                    key={path.title}
                  >
                    {content}
                  </a>
                ) : (
                  <Link className="reference-support__card" href={path.href} key={path.title}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section id="resenas" className="reference-testimonials" aria-labelledby="testimonials-title">
          <div className="site-container">
            <h2 id="testimonials-title">Mensajes bonitos que recibo</h2>
            <ReferenceTestimonialsCarousel testimonials={testimonials} />
            <figure className="reference-testimonials__illustration">
              <Image
                src="/images/resenas-personajes.webp"
                alt="Desfile de personajes infantiles ilustrados por Marta Moreno"
                width={2534}
                height={1198}
                sizes="(max-width: 767px) 100vw, (max-width: 1439px) 96vw, 88rem"
                quality={95}
              />
            </figure>
          </div>
        </section>

        <section id="sobre-mi" className="reference-bio" aria-labelledby="bio-title">
          <div className="site-container reference-bio__inner">
            <figure className="reference-bio__portrait">
              <Image
                src="/images/marta-2026/marta-bio.jpg"
                alt="Marta Moreno dibujando en su estudio"
                width={1657}
                height={1657}
                sizes="(max-width: 767px) 82vw, 28rem"
              />
            </figure>
            <div className="reference-bio__copy">
              <h2 id="bio-title">Soy Marta Moreno</h2>
              <span className="reference-bio__quote" aria-hidden="true">
                “
              </span>
              <p>
                Nací en Barcelona y me formé en Ilustración en l&apos;Escola d&apos;Art i
                Disseny de Tarragona y en Magisterio en la Universidad de Barcelona.
              </p>
              <p>
                Soy autora e ilustradora de álbumes infantiles que han emocionado a
                miles de lectores, entre ellos <em>El hilo invisible</em>, la colección
                <em> Antón Piñón</em>, <em>Martina Futbolista</em>, <em>Gracias, Profe</em> y
                <em> ¿Dónde está mi escoba?</em>.
              </p>
              <p>
                Durante más de 20 años he compaginado la creación artística con mi
                vocación como maestra de primaria en escuelas rurales. Ese contacto
                diario con la infancia me ha permitido comprender cómo sienten,
                imaginan y se relacionan los niños con las historias, convirtiéndose
                en la mayor fuente de inspiración para mi trabajo.
              </p>
              <p>
                Hoy combino la creación de libros con la formación de personas que
                desean crecer a través de la ilustración infantil. Acompaño tanto a
                quienes sueñan con dedicarse profesionalmente a este oficio como a
                quienes encuentran en el dibujo un espacio de disfrute, creatividad y
                bienestar.
              </p>
              <p className="reference-bio__signature">Marta Moreno</p>
            </div>
          </div>
        </section>

        <section className="reference-club" aria-labelledby="club-title">
          <div className="site-container reference-club__grid">
            <div>
              <h2 id="club-title">¿Quieres crear ilustraciones memorables?</h2>
              <p>
                Mi Club de Ilustración es un espacio para quienes quieren disfrutar
                dibujando, despertar su creatividad y crear ilustraciones con emoción.
                Aquí encontrarás retos creativos, formación, clases en directo y
                acompañamiento para avanzar a tu ritmo.
              </p>
              <div className="reference-club__actions">
                <a
                  className="reference-button reference-button--dark"
                  href={CLUB_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Conocer Mi Club <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>
            <Image
              src="/images/newsletter.jpg"
              alt="Personaje ilustrado de Marta Moreno"
              width={400}
              height={400}
              sizes="(max-width: 720px) 40vw, 13rem"
            />
          </div>
        </section>
      </main>
      <SiteFooter variant="reference" />
    </>
  );
}
