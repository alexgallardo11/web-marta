import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { CurrentYear } from "@/components/current-year";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CLUB_URL } from "@/lib/site-links";

export function SiteFooter({
  variant = "default",
  showGames = true,
}: {
  variant?: "default" | "reference";
  showGames?: boolean;
}) {
  const currentYear = new Date().getFullYear();

  if (variant === "reference") {
    return (
      <>
        <ScrollToTop />
        <footer id="contacto" className="site-footer site-footer--reference">
          <div className="site-container reference-footer__line" aria-hidden="true" />
          <div className="site-container reference-footer__main">
            <Link href="/aviso-legal">Aviso legal</Link>
            <a
              href="https://www.instagram.com/martamoreno.art/"
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon aria-hidden="true" className="size-4" />
              Instagram
            </a>
            <a href="mailto:mm@martamoreno.com">Contacto</a>
          </div>
          <div className="reference-footer__bottom">
            © <CurrentYear initialYear={currentYear} /> Marta Moreno
          </div>
        </footer>
      </>
    );
  }

  return (
    <footer
      id="contacto"
      className={`site-footer${showGames ? "" : " site-footer--legal"}`}
    >
      <div className="site-container site-footer__main">
        <div className="site-footer__brand">
          <div className="site-footer__brand-lockup">
            <Image
              src="/images/web-2026/marta-illustration.png"
              alt=""
              width={1525}
              height={1576}
              sizes="88px"
            />
            <div>
              <strong>Marta Moreno</strong>
              <span>Ilustradora infantil y maestra</span>
            </div>
          </div>
          <p>
            Historias, personajes y espacios para volver a disfrutar dibujando
            con emoción y a tu manera.
          </p>
        </div>

        <div className="site-footer__contact">
          <p className="eyebrow">¿Hablamos?</p>
          <a href="mailto:mm@martamoreno.com" className="site-footer__email">
            <Mail aria-hidden="true" />
            mm@martamoreno.com
          </a>
          <a
            href="https://www.instagram.com/martamoreno.art/"
            target="_blank"
            rel="noreferrer"
            className="site-footer__instagram"
          >
            <InstagramIcon className="size-5" aria-hidden="true" />
            @martamoreno.art
          </a>
        </div>

        <div className="site-footer__links">
          <Link href="/">Inicio</Link>
          <Link href="/mis-libros">Mis libros</Link>
          <a href={CLUB_URL} target="_blank" rel="noreferrer">
            Mi Club de Ilustración
          </a>
          {showGames ? <Link href="/juegos/personajes-locos">Juegos creativos</Link> : null}
          <Link href="/aviso-legal">Aviso legal</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/admin/login">Acceso</Link>
        </div>
      </div>
      <div className="site-footer__bottom">
        © <CurrentYear initialYear={currentYear} /> Marta Moreno. Ilustración infantil y
        formación creativa.
      </div>
    </footer>
  );
}
