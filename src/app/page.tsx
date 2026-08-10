import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  Heart,
  Mail,
} from "lucide-react";
import { CharacterGuide } from "@/components/character-guide";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { books } from "@/lib/books-data";
import { CLUB_URL, NEWSLETTER_URL } from "@/lib/site-links";

const testimonials = [
  {
    name: "Santi",
    text: "He estado practicando el dibujo para coger ritmo sin miedo, con la mente despejada y dejando que la imaginación fluya al crear personajes.",
  },
  {
    name: "Mayuki",
    text: "Gracias a ti volví a dibujar. Estoy aprendiendo a confiar en mí y a gustarme lo que hago.",
  },
  {
    name: "Ana",
    text: "Acabo de hacer los personajes del último directo y estoy encantada. No sabía que era capaz de hacer algo así. Gracias por hacerlo tan fácil.",
  },
  {
    name: "Noe",
    text: "Me he tomado los retos como un momento de desconexión. Me sorprende ver que cada vez voy cogiendo más soltura en el trazo.",
  },
  {
    name: "Ania",
    text: "Ahora que soy abuela, mi nieta me tiene tremendamente motivada con esto de dibujar. Gracias por compartir y por motivarme.",
  },
  {
    name: "Sara",
    text: "Me siento súper orgullosa. El desafío era terapéutico: llegaba de un día ajetreado y solo me apetecía ponerme a pintar.",
  },
  {
    name: "Isabel",
    text: "Gracias, Marta, por el reto, tus mails, tu trabajo y los vídeos. Qué bonito sienta dibujar.",
  },
  {
    name: "Sonia",
    text: "Hacía mucho que no dibujaba porque no tenía inspiración ni ganas. Cuando lo vi me animé y he vuelto a reconectar con el dibujo.",
  },
  {
    name: "Cristina",
    text: "Te he descubierto hace poco y me has aportado muchísima inspiración en mis proyectos. Gracias por la divulgación que haces.",
  },
  {
    name: "Julita",
    text: "Con esta clase me lo he pasado muy bien. ¡Qué emoción comenzar la semana con tu curso!",
  },
];

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
      "Álbum ilustrado",
      "Diseño de personajes",
      "Formación creativa",
      "Aprender a dibujar",
      "Dibujo para principiantes",
      "Comunidad de ilustración",
    ],
  };

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="brand-2026">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="brand-hero paper-grain">
          <div className="brand-orbit brand-orbit--cyan" aria-hidden="true" />
          <div className="brand-orbit brand-orbit--lime" aria-hidden="true" />
          <div className="site-container brand-hero__grid">
            <div className="brand-hero__copy">
              <p className="brand-kicker">Ilustración infantil · Creatividad · Comunidad</p>
              <h1>
                Aprende a dibujar y <span>encuentra tu propia voz.</span>
              </h1>
              <p className="brand-hero__lead">
                Soy Marta Moreno, ilustradora infantil y maestra. Creo libros y
                acompaño a personas que quieren disfrutar dibujando, encontrar
                su estilo y contar historias con emoción.
              </p>
              <div className="brand-actions">
                <a
                  className="brand-button brand-button--primary"
                  href={NEWSLETTER_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Mail aria-hidden="true" />
                  Recibir ideas cada martes
                </a>
                <a
                  className="brand-button brand-button--secondary"
                  href={CLUB_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Conocer mi Club
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>
              <ul className="brand-proof" aria-label="Trayectoria de Marta">
                <li>
                  <BookOpen aria-hidden="true" /> Más de 25 libros ilustrados
                </li>
                <li>
                  <Heart aria-hidden="true" /> Más de 20 años enseñando
                </li>
              </ul>
            </div>

            <div className="brand-hero__visual">
              <div className="brand-hero__photo">
                <Image
                  src="/images/web-2026/photos/marta-portada.jpg"
                  alt="Marta Moreno tumbada y sonriendo entre algunos de sus libros"
                  width={1000}
                  height={1401}
                  preload
                  sizes="(max-width: 900px) 86vw, 42vw"
                />
              </div>
              <CharacterGuide character="mono" className="brand-hero__guide">
                Aquí las ideas no tienen que salir perfectas.
              </CharacterGuide>
            </div>
          </div>
        </section>

        <section className="brand-paths" aria-labelledby="elige-camino">
          <div className="site-container">
            <header className="brand-section-heading brand-section-heading--center">
              <p className="brand-kicker">Dos formas de empezar</p>
              <h2 id="elige-camino">Un ratito para crear puede cambiarte el día.</h2>
              <p>
                Elige si hoy necesitas una pequeña chispa en tu correo o un
                espacio donde dibujar acompañada.
              </p>
            </header>

            <div className="brand-paths__grid">
              <article className="brand-path-card brand-path-card--mail">
                <p className="brand-kicker">Gratuito · Cada martes</p>
                <h3>Recibe ideas creativas en tu mail cada semana.</h3>
                <p>
                  Propuestas prácticas, trucos y pequeños retos para volver al
                  papel, jugar con tus personajes y mantener viva la creatividad.
                </p>
                <a
                  href={NEWSLETTER_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Quiero recibirlas <ArrowRight aria-hidden="true" />
                </a>
                <CharacterGuide character="leon">
                  Yo ya estoy pensando qué dibujar el martes.
                </CharacterGuide>
              </article>

              <article className="brand-path-card brand-path-card--club">
                <p className="brand-kicker">Formación · Comunidad</p>
                <h3>Mi Club de Ilustración.</h3>
                <p>
                  Un espacio para disfrutar dibujando, despertar tu creatividad
                  y crear ilustraciones con emoción. Encontrarás retos,
                  formación, clases en directo y acompañamiento para avanzar a
                  tu ritmo, tanto si sueñas con dedicarte a la ilustración como
                  si simplemente quieres regalarte tiempo para crear.
                </p>
                <Link href="/mi-club-de-ilustracion">
                  Quiero saber más <ArrowRight aria-hidden="true" />
                </Link>
                <CharacterGuide character="gatita">
                  Aquí dibujamos juntas, cada una con su propia voz.
                </CharacterGuide>
              </article>
            </div>
          </div>
        </section>

        <section id="club" className="brand-club paper-grain" aria-labelledby="club-title">
          <div className="site-container brand-club__grid">
            <div className="brand-club__photo">
              <Image
                src="/images/web-2026/photos/marta-club.jpg"
                alt="Marta en su estudio junto al título Mi Club de Ilustración"
                width={1600}
                height={850}
                sizes="(max-width: 900px) 92vw, 51vw"
              />
            </div>
            <div className="brand-club__copy">
              <p className="brand-kicker">Mi Club de Ilustración</p>
              <h2 id="club-title">Tu espacio para probar, aprender y disfrutar.</h2>
              <div
                className="brand-club__voices"
                aria-label="Los personajes explican cómo es el Club"
              >
                <div className="brand-club-voice">
                  <Image
                    src="/images/web-2026/characters/mono.png"
                    alt=""
                    width={709}
                    height={709}
                    sizes="80px"
                  />
                  <p>
                    Marta prepara retos para que nunca te quedes demasiado
                    tiempo mirando el papel en blanco.
                  </p>
                </div>
                <div className="brand-club-voice brand-club-voice--reverse">
                  <Image
                    src="/images/web-2026/characters/gatita.png"
                    alt=""
                    width={709}
                    height={709}
                    sizes="80px"
                  />
                  <p>
                    En las clases en directo puedes verla trabajar, preguntar
                    y probar nuevas formas de dibujar a tu ritmo.
                  </p>
                </div>
                <div className="brand-club-voice">
                  <Image
                    src="/images/web-2026/characters/perro-cocinero.png"
                    alt=""
                    width={709}
                    height={709}
                    sizes="80px"
                  />
                  <p>
                    Y no dibujas sola: compartimos procesos, dudas y esos
                    pequeños avances que merece la pena celebrar.
                  </p>
                </div>
              </div>
              <Link
                className="brand-button brand-button--light"
                href="/mi-club-de-ilustracion"
              >
                Cuéntame sobre el Club <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="libros" className="brand-books" aria-labelledby="books-title">
          <div className="site-container">
            <div className="brand-books__grid">
              <div className="brand-books__copy">
                <p className="brand-kicker">Mis libros</p>
                <h2 id="books-title">Historias para mirar, sentir y volver a abrir.</h2>
                <p>
                  Marta es autora e ilustradora de álbumes infantiles que han
                  emocionado a miles de lectores, entre ellos <em>El hilo invisible</em>,
                  la colección <em>Antón Piñón</em>, <em>Martina Futbolista</em>,
                  <em> Gracias, Profe</em> y <em>¿Dónde está mi escoba?</em>.
                </p>
                <div className="brand-books__actions">
                  <Link className="brand-button brand-button--primary" href="/mis-libros">
                    <BookOpen aria-hidden="true" />
                    Entrar en la biblioteca
                    <ArrowRight aria-hidden="true" />
                  </Link>
                  <span>{books.length} historias ilustradas para curiosear</span>
                </div>
              </div>
              <div className="brand-books__visual">
                <Image
                  src="/images/web-2026/photos/marta-trabajando.jpg"
                  alt="Marta trabajando en una ilustración en su mesa de estudio"
                  width={1200}
                  height={1200}
                  sizes="(max-width: 900px) 90vw, 41vw"
                />
                <CharacterGuide character="anton-pinon">
                  Yo ya estoy dentro. ¿Vienes a curiosear nuestras historias?
                </CharacterGuide>
              </div>
            </div>

          </div>
        </section>

        <section className="brand-testimonials" aria-labelledby="testimonials-title">
          <div className="site-container">
            <header className="brand-section-heading">
              <div>
                <p className="brand-kicker">Mensajes bonitos que recibo</p>
                <h2 id="testimonials-title">Cuando dibujar vuelve a ser tu momento.</h2>
              </div>
              <CharacterGuide character="girafa" className="brand-guide--compact">
                Sigue hacia la derecha, hay muchas historias.
              </CharacterGuide>
            </header>
          </div>
          <div
            className="brand-testimonials__rail"
            aria-label="Testimonios de alumnas"
            tabIndex={0}
          >
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className="brand-testimonial">
                <span aria-hidden="true">“</span>
                <blockquote>{testimonial.text}</blockquote>
                <figcaption>
                  <strong>{testimonial.name}</strong>
                  <small>Comunidad de Marta</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="sobre-mi" className="brand-about paper-grain" aria-labelledby="about-title">
          <div className="site-container brand-about__grid">
            <div className="brand-about__photo">
              <Image
                src="/images/web-2026/photos/marta-bio.jpg"
                alt="Retrato de Marta Moreno sonriendo en su estudio"
                width={1600}
                height={900}
                sizes="(max-width: 900px) 92vw, 48vw"
              />
            </div>
            <div className="brand-about__copy">
              <p className="brand-kicker">Hola, soy Marta</p>
              <h2 id="about-title">Dibujo desde la emoción. Enseño desde la experiencia.</h2>
              <div
                className="brand-about__story"
                aria-label="Los personajes de Marta cuentan su biografía"
              >
                <div className="brand-bio-beat brand-bio-beat--start">
                  <Image
                    src="/images/web-2026/characters/mono.png"
                    alt=""
                    width={709}
                    height={709}
                    sizes="96px"
                  />
                  <p>
                    Marta nació en Barcelona y estudió Ilustración en Tarragona
                    y Magisterio en la Universidad de Barcelona.
                  </p>
                </div>
                <div className="brand-bio-beat brand-bio-beat--reverse">
                  <Image
                    src="/images/web-2026/characters/cocodrilo.png"
                    alt=""
                    width={709}
                    height={709}
                    sizes="96px"
                  />
                  <p>
                    Ha dado vida a más de 25 libros, como <em>El hilo invisible</em>,
                    <em> Antón Piñón</em>, <em>Martina Futbolista</em> y
                    <em> Gracias, Profe</em>.
                  </p>
                </div>
                <div className="brand-bio-beat brand-bio-beat--middle">
                  <Image
                    src="/images/web-2026/characters/girafa.png"
                    alt=""
                    width={531}
                    height={531}
                    sizes="96px"
                  />
                  <p>
                    Durante más de 20 años fue maestra en escuelas rurales. Allí
                    aprendió cómo sienten, imaginan y cuentan los niños.
                  </p>
                </div>
                <div className="brand-bio-beat brand-bio-beat--reverse brand-bio-beat--finish">
                  <Image
                    src="/images/web-2026/characters/leon.png"
                    alt=""
                    width={709}
                    height={709}
                    sizes="96px"
                  />
                  <p>
                    Hoy acompaña a quien quiere hacer de la ilustración su oficio
                    y a quien dibuja por placer, para encontrar voz, estilo y
                    comunidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-play" aria-labelledby="play-title">
          <div className="site-container brand-play__inner">
            <div>
              <p className="brand-kicker">Un recreo creativo</p>
              <h2 id="play-title">¿Jugamos antes de seguir?</h2>
              <p>
                Mezcla ideas al azar y deja que un personaje inesperado te dé
                la excusa perfecta para empezar a dibujar.
              </p>
              <div className="brand-actions">
                <Link className="brand-button brand-button--primary" href="/juegos/personajes-locos">
                  <Gamepad2 aria-hidden="true" /> Personajes locos
                </Link>
                <Link className="brand-button brand-button--secondary" href="/juegos/caldero-magico">
                  Caldero mágico <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
            <CharacterGuide character="martina-futbolista">
              Si una idea se escapa, corremos detrás de ella.
            </CharacterGuide>
          </div>
        </section>

        <section className="brand-final" aria-labelledby="final-title">
          <div className="brand-final__shape" aria-hidden="true" />
          <div className="site-container brand-final__grid">
            <Image
              src="/images/web-2026/marta-illustration.png"
              alt="Ilustración de Marta con sus materiales de dibujo"
              width={1525}
              height={1576}
              sizes="(max-width: 768px) 180px, 280px"
            />
            <div>
              <p className="brand-kicker">Mi Club de Ilustración</p>
              <h2 id="final-title">Tu manera de dibujar también merece un lugar.</h2>
              <p>
                Ven a crear acompañada, compartir el proceso y descubrir todo
                lo que aparece cuando te das permiso para jugar.
              </p>
              <Link
                className="brand-button brand-button--dark"
                href="/mi-club-de-ilustracion"
              >
                Quiero conocer el Club <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
